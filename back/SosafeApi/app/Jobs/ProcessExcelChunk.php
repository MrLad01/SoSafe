<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\NewBiodata;

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
                $zoneId     = $zones[strtoupper(trim((string)($line['ZONE'] ?? '')))]     ?? null;
                $areaId     = $areas[strtoupper(trim((string)($line['AREA'] ?? '')))]     ?? null;
                $divisionId = $divisions[strtoupper(trim((string)($line['CITY'] ?? '')))] ?? null;

                $dataToInsert[] = [
                    'SNO'           => $line['SNO']           ?? null,
                    'FNO'           => $line['FNO']           ?? null,
                    'SNAME'         => $line['SNAME']         ?? null,
                    'FNAME'         => $line['FNAME']         ?? null,
                    'ONAME'         => $line['ONAME']         ?? null,
                    'ADDRESS'       => $line['ADDRESS']       ?? null,
                    'PHONE'         => $line['PHONE']         ?? null,
                    'NIN'           => $line['NIN']           ?? null,
                    'DOB'           => $line['DOB']           ?? null,
                    'SEX'           => $line['SEX']           ?? null,
                    'CITY'          => $divisionId,
                    'ZONE'          => $zoneId,
                    'AREA'          => $areaId,
                    'SERVNO'        => $line['SERVNO']        ?? null,
                    'POSITION'      => $line['POSITION']      ?? null,
                    'ENLISTED'      => $line['ENLISTED']      ?? null,
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

            if (count($dataToInsert) >= 50) {
                $this->updateProgressIncremental(count($dataToInsert));
            }

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

    private function markChunkDone(int $count): void
    {
        $key = "import:{$this->importId}";
        $data = Cache::get($key, []);

        $data['done']      = ($data['done'] ?? 0) + 1;
        $data['processed'] = ($data['processed'] ?? 0) + $count;

        $totalChunks = $data['chunks'] ?? 0;

        // Calculate percentage
        $data['percentage'] = $totalChunks > 0 
            ? round(($data['processed'] / max($data['total'], 1)) * 100, 2)
            : 0;

        if ($totalChunks > 0 && $data['done'] >= $totalChunks) {
            $data['status']      = 'completed';
            $data['percentage']  = 100;
            $data['finished_at'] = now()->toDateTimeString();
        }

        Cache::put($key, $data, now()->addHours(2));
    }

    private function recordError(string $message): void
    {
        $key  = "import:{$this->importId}";
        $data = Cache::get($key, []);

        $data['status']      = 'failed';
        $data['finished_at'] = now()->toDateTimeString();
        $data['errors'][]    = $message;

        Cache::put($key, $data, now()->addHours(2));
    }

    private function updateProgressIncremental(int $count): void
    {
        $key = "import:{$this->importId}";
        $data = Cache::get($key, []);

        $data['processed'] = ($data['processed'] ?? 0) + $count;
        $data['percentage'] = round(($data['processed'] / max($data['total'], 1)) * 100, 2);

        Cache::put($key, $data, now()->addHours(2));
    }
}