<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\NewBiodata;
use Carbon\Carbon;

class ProcessExcelChunk implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries   = 3;
    public int $timeout = 120;

    public function __construct(
        private readonly array  $records,
        private readonly string $now,
        private readonly string $importId,
        private readonly array  $meta,
    ) {}

    public function handle(): void
    {
        try {
            $zones     = $this->meta['zones'];
            $areas     = $this->meta['areas'];
            $divisions = $this->meta['divisions'];

            $dataToInsert = [];

            foreach ($this->records as $line) {
                // Keys are already CASE_UPPER from ImportExcelFile's callback
                $zoneId     = $zones[strtoupper(trim((string)($line['ZONE'] ?? '')))]     ?? null;
                $areaId     = $areas[strtoupper(trim((string)($line['AREA'] ?? '')))]     ?? null;
                $divisionId = $divisions[strtoupper(trim((string)($line['CITY'] ?? '')))] ?? null;

                // ── All keys lowercase to match the actual PostgreSQL column names ──
                $dataToInsert[] = [
                    'sno'           => $line['SNO']           ?? null,
                    'fno'           => $line['FNO']           ?? null,
                    'sname'         => $line['SNAME']         ?? null,
                    'fname'         => $line['FNAME']         ?? null,
                    'oname'         => $line['ONAME']         ?? null,
                    'address'       => $line['ADDRESS']       ?? null,
                    'phone'         => $line['PHONE']         ?? null,
                    'nin'           => $line['NIN']           ?? null,
                    'dob'           => $this->safeDate($line['DOB']      ?? null),
                    'sex'           => $line['SEX']           ?? null,
                    'city'          => $divisionId,
                    'zone'          => $zoneId,
                    'area'          => $areaId,
                    'servno'        => $line['SERVNO']        ?? null,
                    'position'      => $line['POSITION']      ?? null,
                    'enlisted'      => $this->safeDate($line['ENLISTED'] ?? null),
                    'rank'          => $line['RANK']          ?? null,
                    'nok'           => $line['NOK']           ?? null,
                    'relation'      => $line['RELATION']      ?? null,
                    'nokno'         => $line['NOKNO']         ?? null,
                    'captured'      => $line['CAPTURED']      ?? null,
                    'qualification' => $line['QUALIFICATION'] ?? null,
                    'created_at'    => $this->now,
                    'updated_at'    => $this->now,
                ];
            }

            NewBiodata::insert($dataToInsert);

            $this->updateProgressIncremental(count($dataToInsert));
            $this->markChunkDone(count($dataToInsert));

        } catch (\Throwable $e) {
            Log::error('ProcessExcelChunk failed', [
                'import_id'     => $this->importId,
                'error'         => $e->getMessage(),
                'line'          => $e->getLine(),
                'records_count' => count($this->records),
            ]);

            $this->recordError($e->getMessage());
            throw $e;
        }
    }

    /**
     * Safely coerce a spreadsheet date cell to a Y-m-d string.
     *
     * FastExcel may hand us a Carbon instance, a date string, a numeric
     * Excel serial, or an empty value. The 1899-12-31 epoch artifact that
     * appeared in earlier error logs is rejected here.
     */
    private function safeDate(mixed $value): ?string
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }

        // FastExcel already parsed it into a Carbon / DateTime
        if ($value instanceof \DateTimeInterface) {
            $year = (int) $value->format('Y');
            if ($year < 1900 || $year > 2100) return null;
            return $value->format('Y-m-d');
        }

        // Numeric Excel serial date (e.g. 44927.0)
        if (is_numeric($value)) {
            try {
                $date = Carbon::createFromDate(1899, 12, 30)->addDays((int) $value);
                if ($date->year < 1900 || $date->year > 2100) return null;
                return $date->format('Y-m-d');
            } catch (\Throwable) {
                return null;
            }
        }

        // Plain string date
        try {
            $date = Carbon::parse((string) $value);
            if ($date->year < 1900 || $date->year > 2100) return null;
            return $date->format('Y-m-d');
        } catch (\Throwable) {
            return null;
        }
    }

    private function updateProgressIncremental(int $count): void
    {
        $key  = "import:{$this->importId}";
        $lock = Cache::lock("lock:progress:{$this->importId}", 10);

        if ($lock->get()) {
            try {
                $data              = Cache::get($key, []);
                $data['processed'] = ($data['processed'] ?? 0) + $count;
                Cache::put($key, $data, now()->addHours(2));
            } finally {
                $lock->release();
            }
        }
    }

    private function markChunkDone(int $count): void
    {
        $key  = "import:{$this->importId}";
        $lock = Cache::lock("lock:chunk:{$this->importId}", 10);

        if ($lock->get()) {
            try {
                $data         = Cache::get($key, []);
                $data['done'] = ($data['done'] ?? 0) + 1;

                // // Final partial chunk is smaller than chunkSize
                // if ($count < 50 && $count > 0) {
                //     $data['processed'] = ($data['processed'] ?? 0) + $count;
                // }

                if (
                    ($data['done'] >= ($data['chunks'] ?? 1)) &&
                    in_array($data['status'] ?? '', ['dispatched', 'processing'])
                ) {
                    $data['status']      = 'completed';
                    $data['finished_at'] = now()->toDateTimeString();
                }

                Cache::put($key, $data, now()->addHours(2));
            } finally {
                $lock->release();
            }
        }
    }

    private function recordError(string $errorMsg): void
    {
        $key  = "import:{$this->importId}";
        $lock = Cache::lock("lock:error:{$this->importId}", 10);

        if ($lock->get()) {
            try {
                $data                = Cache::get($key, []);
                $data['status']      = 'failed';
                $data['finished_at'] = now()->toDateTimeString();
                $errors              = $data['errors'] ?? [];
                $errors[]            = 'Worker error: ' . $errorMsg;
                $data['errors']      = $errors;
                Cache::put($key, $data, now()->addHours(2));
            } finally {
                $lock->release();
            }
        }
    }
}