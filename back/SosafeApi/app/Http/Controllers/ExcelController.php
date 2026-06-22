<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
<<<<<<< HEAD
use App\Jobs\ProcessExcelChunk;
use Illuminate\Support\Facades\Queue;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\NewBiodata;
use App\Models\Biodata;  
use Illuminate\Support\Facades\DB;

class ExcelController extends Controller 
=======
use App\Jobs\ImportExcelFile;
use App\Models\NewBiodata;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ExcelController extends Controller
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
{
    public function import(Request $request)
    {
        $request->validate([
<<<<<<< HEAD
            'raw_data' => 'required|file|mimes:xlsx,xls|max:10240' // 10MB max
        ]);

        $file = $request->file('raw_data');
        $path = $file->store('temp');

        try {
            DB::beginTransaction();

            // Clear existing data FIRST (in transaction)
            NewBiodata::truncate();
            Biodata::truncate();

            $collection = (new FastExcel)->import(storage_path("app/{$path}"));
            
            if ($collection->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'message' => 'The uploaded file is empty.'
                ], 422);
            }

            $chunks = $collection->chunk(1000);
            $totalRecords = $collection->count();

            foreach ($chunks as $index => $chunk) {
                // Dispatch job with delay to prevent overwhelming the queue
                Queue::later(
                    $index * 10, // Reduced delay (10 seconds)
                    new ProcessExcelChunk($chunk->toArray())
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'File uploaded successfully. Data replacement has started.',
                'total_records' => $totalRecords,
                'chunks' => $chunks->count()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Excel Import Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to process file.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
=======
            'raw_data' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        // Generate a unique import ID so the client can poll progress
        $importId = (string) Str::uuid();

        $path = $request->file('raw_data')->store('temp');

        // Initialise progress in cache before dispatching so the first poll
        // never returns 404
        Cache::put("import:{$importId}", [
            'status'    => 'queued',
            'total'     => 0,
            'processed' => 0,
            'chunks'    => 0,
            'done'      => 0,
            'errors'    => [],
            'started_at' => now()->toDateTimeString(),
            'finished_at' => null,
        ], now()->addHours(2));

        // FIX #3  — truncate happens inside the job, just before inserts start,
        //           so it targets the correct model (NewBiodata) at the right time.
        // FIX #4  — pass a plain string, not a Carbon instance, to avoid
        //           serialising a Carbon object into every job payload.
        ImportExcelFile::dispatch($path, now()->toDateTimeString(), $importId)
            ->onQueue('imports'); // FIX #6 — dedicated queue

        return response()->json([
            'message'   => 'File received. Processing has started in the background.',
            'import_id' => $importId,
        ]);
    }

    /**
     * SSE endpoint — the browser calls this once and receives a stream of
     * progress events until the import finishes or the connection drops.
     *
     * GET /import/progress/{importId}
     */
    public function progress(string $importId)
    {
        if (!Cache::has("import:{$importId}")) {
            return response()->json(['error' => 'Import not found'], 404);
        }

        return response()->stream(function () use ($importId) {
            $lastProcessed = -1;

            while (true) {
                $data = Cache::get("import:{$importId}");

                if (!$data) {
                    $this->sendSseEvent('error', ['message' => 'Import data expired']);
                    break;
                }

                // Only send if there's actual progress change
                if ($data['processed'] !== $lastProcessed || in_array($data['status'], ['completed', 'failed'])) {
                    $this->sendSseEvent('progress', $data);
                    $lastProcessed = $data['processed'];
                }

                if (in_array($data['status'], ['completed', 'failed'])) {
                    break;
                }

                ob_flush();
                flush();

                usleep(400_000); // 400ms — much more responsive than 2 seconds
            }
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache',
            'X-Accel-Buffering' => 'no',
            'Connection'        => 'keep-alive',
        ]);
    }

    private function sendSseEvent(string $event, array $data): void
    {
        echo "event: {$event}\n";
        echo 'data: ' . json_encode($data) . "\n\n";
    }

    public function status(string $importId)
    {
        $data = Cache::get("import:{$importId}");

        if (!$data) {
            return response()->json(['error' => 'Import not found'], 404);
        }

        return response()->json([
            'status'      => $data['status']      ?? 'queued',
            'total'       => $data['total']        ?? 0,
            'processed'   => $data['processed']    ?? 0,
            'chunks'      => $data['chunks']       ?? 0,
            'done'        => $data['done']         ?? 0,
            'errors'      => $data['errors']       ?? [],
            'started_at'  => $data['started_at']   ?? null,
            'finished_at' => $data['finished_at']  ?? null,
        ]);
    }

>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
}