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

    public int $timeout   = 600;
    public int $tries     = 1;    // Don't retry — truncate already ran
    public int $maxExceptions = 1;

    public function __construct(
        private readonly string $storedPath,
        private readonly string $now,
        private readonly string $importId,
    ) {}

    public function handle(): void
    {
        $fullPath  = storage_path("app/{$this->storedPath}");
        $chunkSize = 1000;   // Smaller chunks = more granular progress + less memory per job
        $chunk     = [];
        $rowCount  = 0;
        $chunkNo   = 0;

        // ── Step 1: mark as processing immediately so the UI stops spinning ──
        $this->updateProgress([
            'status'     => 'processing',
            'started_at' => now()->toDateTimeString(),
        ]);

        // ── Step 2: truncate BEFORE building lookups (correct model) ──
        NewBiodata::truncate();

        // ── Step 3: build normalised lookups ONCE ──
        $meta = $this->buildNormalisedLookups();

        try {
            (new FastExcel)->import($fullPath, function ($row) use (
                &$chunk, &$rowCount, &$chunkNo, $chunkSize, $meta
            ) {
                $row = array_change_key_case($row, CASE_UPPER);

                // Skip completely empty rows
                if (empty(array_filter($row))) {
                    return;
                }

                $chunk[] = $row;
                $rowCount++;

                if (count($chunk) >= $chunkSize) {
                    $chunkNo++;
                    ProcessExcelChunk::dispatch($chunk, $this->now, $this->importId, $meta)
                        ->onQueue('imports');

                    // ── Update progress after EVERY dispatched chunk ──
                    // This is what makes the UI move from "queued" to a real number
                    $this->updateProgress([
                        'status' => 'processing',
                        'total'  => $rowCount,
                        'chunks' => $chunkNo,
                    ]);

                    $chunk = [];
                }
            });

            // ── Dispatch the final partial chunk ──
            if (!empty($chunk)) {
                $chunkNo++;
                ProcessExcelChunk::dispatch($chunk, $this->now, $this->importId, $meta)
                    ->onQueue('imports');
            }

            // ── All chunks dispatched — mark as "dispatched" with final totals ──
            $this->updateProgress([
                'status' => 'dispatched',
                'total'  => $rowCount,
                'chunks' => $chunkNo,
            ]);

            Log::info('ImportExcelFile complete', [
                'import_id' => $this->importId,
                'rows'      => $rowCount,
                'chunks'    => $chunkNo,
            ]);

        } catch (\Throwable $e) {
            Log::error('ImportExcelFile failed', [
                'import_id' => $this->importId,
                'error'     => $e->getMessage(),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
            ]);

            $this->updateProgress([
                'status'      => 'failed',
                'finished_at' => now()->toDateTimeString(),
                'errors'      => [$e->getMessage()],
            ]);

            throw $e;

        } finally {
            Storage::delete($this->storedPath);
        }
    }

    private function buildNormalisedLookups(): array
    {
        $normalise = fn ($collection) => $collection
            ->mapWithKeys(fn ($id, $name) => [strtoupper(trim((string) $name)) => $id])
            ->toArray();

        return [
            'zones'     => $normalise(Zone::pluck('id', 'name')),
            'areas'     => $normalise(Area::pluck('id', 'name')),
            'divisions' => $normalise(Division::pluck('id', 'name')),
        ];
    }

    private function updateProgress(array $fields): void
    {
        $key  = "import:{$this->importId}";
        $lock = Cache::lock("lock:progress:{$this->importId}", 10); // add a lock

        if ($lock->get()) {
            try {
                $existing = Cache::get($key, []);
                Cache::put($key, array_merge($existing, $fields), now()->addHours(2));
            } finally {
                $lock->release();
            }
        }
    }
}