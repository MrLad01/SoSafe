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
                // Resolve FK IDs — keys are already UPPER from ImportExcelFile
                $zoneId     = $zones[strtoupper(trim((string)($line['ZONE'] ?? '')))]     ?? null;
                $areaId     = $areas[strtoupper(trim((string)($line['AREA'] ?? '')))]     ?? null;
                $divisionId = $divisions[strtoupper(trim((string)($line['CITY'] ?? '')))] ?? null;

                // ── Column keys MUST be uppercase to match PostgreSQL quoted columns ──
                // The new_biodatas table was created with quoted uppercase identifiers
                // (matching Biodata). PostgreSQL treats "AREA" and "area" as different
                // columns — using lowercase caused the "column does not exist" error.
                $dataToInsert[] = [
                    'SNO'           => $line['SNO']           ?? null,
                    'FNO'           => $line['FNO']           ?? null,
                    'SNAME'         => $line['SNAME']         ?? null,
                    'FNAME'         => $line['FNAME']         ?? null,
                    'ONAME'         => $line['ONAME']         ?? null,
                    'ADDRESS'       => $line['ADDRESS']       ?? null,
                    'PHONE'         => $line['PHONE']         ?? null,
                    'NIN'           => $line['NIN']           ?? null,
                    'DOB'           => $this->safeDate($line['DOB']      ?? null),
                    'SEX'           => $line['SEX']           ?? null,
                    'CITY'          => $divisionId,   // FK id stored in "CITY" column
                    'ZONE'          => $zoneId,       // FK id stored in "ZONE" column
                    'AREA'          => $areaId,       // FK id stored in "AREA" column
                    'SERVNO'        => $line['SERVNO']        ?? null,
                    'POSITION'      => $line['POSITION']      ?? null,
                    'ENLISTED'      => $this->safeDate($line['ENLISTED'] ?? null),
                    'RANK'          => $line['RANK']          ?? null,
                    'NOK'           => $line['NOK']           ?? null,
                    'RELATION'      => $line['RELATION']      ?? null,
                    'NOKNO'         => $line['NOKNO']         ?? null,
                    'CAPTURED'      => $line['CAPTURED']      ?? null,
                    'QUALIFICATION' => $line['QUALIFICATION'] ?? null,
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
     * Safely parse a date from the spreadsheet.
     *
     * FastExcel sometimes returns a Carbon instance, a date string, an Excel
     * serial float, or an empty string. This normalises all of them and rejects
     * the 1899-12-31 Excel epoch artifact that appeared in the error log.
     */
    private function safeDate(mixed $value): ?string
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }

        // FastExcel already parsed it to a Carbon/DateTime
        if ($value instanceof \DateTimeInterface) {
            $year = (int) $value->format('Y');
            if ($year < 1900 || $year > 2100) return null;
            return $value->format('Y-m-d');
        }

        // Numeric Excel serial date (e.g. 44927.0)
        if (is_numeric($value)) {
            try {
                // Excel serial: days since 1900-01-01 (with the off-by-two bug)
                $date = Carbon::createFromDate(1899, 12, 30)->addDays((int) $value);
                if ($date->year < 1900 || $date->year > 2100) return null;
                return $date->format('Y-m-d');
            } catch (\Throwable) {
                return null;
            }
        }

        // String date
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

                // Handle the final partial chunk (smaller than chunkSize)
                if ($count < 50 && $count > 0) {
                    $data['processed'] = ($data['processed'] ?? 0) + $count;
                }

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
                $data            = Cache::get($key, []);
                $data['status']  = 'failed';
                $data['finished_at'] = now()->toDateTimeString();
                $errors          = $data['errors'] ?? [];
                $errors[]        = 'Worker error: ' . $errorMsg;
                $data['errors']  = $errors;
                Cache::put($key, $data, now()->addHours(2));
            } finally {
                $lock->release();
            }
        }
    }
}