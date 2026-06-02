<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\NewBiodata;
use App\Models\Zone;
use App\Models\Area;
use App\Models\Division;

class ImportExcelFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $timeout = 600; // 10 minutes

    public function __construct(
        private readonly string $storedPath,
        private readonly string $now,       // FIX #4 — plain string, not Carbon
        private readonly string $importId,
    ) {}

    public function handle(): void
    {
        $fullPath  = storage_path("app/{$this->storedPath}");
        $chunkSize = 1000;
        $chunk     = [];
        $rowCount  = 0;
        $chunkNo   = 0;

        // FIX #3 — truncate here, inside the job, targeting the correct model,
        //           right before we start inserting new data.
        NewBiodata::truncate();

        // FIX #2 — build normalised (uppercase-trimmed) lookup maps ONCE here,
        //           then pass them to every chunk job so they don't re-query the DB.
        // FIX #5 — lookups loaded once per import, not once per chunk.
        $meta = $this->buildNormalisedLookups();

        $this->updateProgress(['status' => 'processing']);

        try {
            (new FastExcel)->import($fullPath, function ($row) use (
                &$chunk, &$rowCount, &$chunkNo, $chunkSize, $meta
            ) {
                // FIX #7 — normalise keys once at parse time, not inside every chunk job
                $row = array_change_key_case($row, CASE_UPPER);

                $chunk[] = $row;
                $rowCount++;

                if (count($chunk) >= $chunkSize) {
                    $chunkNo++;
                    ProcessExcelChunk::dispatch($chunk, $this->now, $this->importId, $meta)
                        ->onQueue('imports'); // FIX #6 — dedicated queue

                    $this->updateProgress([
                        'status' => 'processing',
                        'total'  => $rowCount, // updated progressively
                        'chunks' => $chunkNo,
                    ]);

                    $chunk = [];
                }
            });

            // Dispatch any remaining rows in the last partial chunk
            if (!empty($chunk)) {
                $chunkNo++;
                ProcessExcelChunk::dispatch($chunk, $this->now, $this->importId, $meta)
                    ->onQueue('imports');
            }

            $this->updateProgress([
                'status' => 'dispatched', // all chunks queued, waiting for them to finish
                'total'  => $rowCount,
                'chunks' => $chunkNo,
            ]);

        } catch (\Throwable $e) {
            Log::error('ImportExcelFile failed', [
                'import_id' => $this->importId,
                'error'     => $e->getMessage(),
            ]);

            $this->updateProgress([
                'status' => 'failed',
                'errors' => [$e->getMessage()],
            ]);

            throw $e;
        } finally {
            // FIX #8 — always clean up the temp file, even on failure
            Storage::delete($this->storedPath);
        }
    }

    /**
     * FIX #2 — Build lookup arrays with uppercase-trimmed keys so they match
     * the CASE_UPPER row values from the spreadsheet.
     */
    private function buildNormalisedLookups(): array
    {
        $normalise = fn ($collection) => $collection
            ->mapWithKeys(fn ($id, $name) => [strtoupper(trim($name)) => $id])
            ->toArray();

        return [
            'zones'     => $normalise(Zone::pluck('id', 'name')),
            'areas'     => $normalise(Area::pluck('id', 'name')),
            'divisions' => $normalise(Division::pluck('id', 'name')),
        ];
    }

    private function updateProgress(array $fields): void
    {
        $key      = "import:{$this->importId}";
        $existing = Cache::get($key, []);

        Cache::put($key, array_merge($existing, $fields), now()->addHours(2));
    }
}