<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\NewBiodata; // FIX #1 — was incorrectly Biodata

class ProcessExcelChunk implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries   = 3;
    public int $timeout = 120;

    public function __construct(
        private readonly array  $records,
        private readonly string $now,      // FIX #4 — plain string, not Carbon
        private readonly string $importId,
        private readonly array  $meta,     // FIX #5 — lookups passed in, not re-queried
    ) {}

    public function handle(): void
    {
        try {
            // FIX #2 — keys already normalised (CASE_UPPER) in ImportExcelFile
            //           and lookup maps already have uppercase-trimmed keys,
            //           so lookups now reliably match.
            $zones     = $this->meta['zones'];
            $areas     = $this->meta['areas'];
            $divisions = $this->meta['divisions'];

            $dataToInsert = [];

            foreach ($this->records as $line) {
                // FIX #7 — array_change_key_case removed; already done at parse time
                $zoneId     = $zones[strtoupper(trim($line['ZONE'] ?? ''))]     ?? null;
                $areaId     = $areas[strtoupper(trim($line['AREA'] ?? ''))]     ?? null;
                $divisionId = $divisions[strtoupper(trim($line['CITY'] ?? ''))] ?? null;

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

            // FIX #1 — insert into NewBiodata, not Biodata
            NewBiodata::insert($dataToInsert);

            $this->markChunkDone(count($dataToInsert));

        } catch (\Throwable $e) {
            Log::error('ProcessExcelChunk failed', [
                'import_id'     => $this->importId,
                'error'         => $e->getMessage(),
                'line'          => $e->getLine(),
                'records_count' => count($this->records),
            ]);

            $this->recordChunkError($e->getMessage());

            throw $e; // Let the queue retry according to $tries
        }
    }

    /**
     * Increment the "done" chunk counter and flip status to "completed"
     * once every dispatched chunk has reported back.
     */
    private function markChunkDone(int $insertedCount): void
    {
        $key = "import:{$this->importId}";

        // Atomic-ish update: read → modify → write
        // (For true atomicity use Redis HINCRBY or a DB row instead of Cache)
        $data = Cache::get($key, []);

        $data['done']      = ($data['done']      ?? 0) + 1;
        $data['processed'] = ($data['processed'] ?? 0) + $insertedCount;

        // If every dispatched chunk is now done, mark the import completed
        if (
            isset($data['chunks']) &&
            $data['chunks'] > 0 &&
            $data['done'] >= $data['chunks']
        ) {
            $data['status']      = 'completed';
            $data['finished_at'] = now()->toDateTimeString();
        }

        Cache::put($key, $data, now()->addHours(2));
    }

    private function recordChunkError(string $message): void
    {
        $key  = "import:{$this->importId}";
        $data = Cache::get($key, []);

        $data['errors'][] = $message;
        $data['status']   = 'failed';

        Cache::put($key, $data, now()->addHours(2));
    }
}