<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ProcessExcelChunk;
use Illuminate\Support\Facades\Queue;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\NewBiodata;
use App\Models\Biodata;  
use Illuminate\Support\Facades\DB;

class ExcelController extends Controller 
{
    public function import(Request $request)
    {
        $request->validate([
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
}