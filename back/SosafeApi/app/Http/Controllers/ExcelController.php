<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ProcessExcelChunk;
use Illuminate\Support\Facades\Queue;
use Rap2hpoutre\FastExcel\FastExcel;

class ExcelController extends Controller 
{
    public function import(Request $request)
    {
        $file = $request->file('raw_data');
        
        // Validate file
        $request->validate([
            'raw_data' => 'required|file|mimes:xlsx,xls'
        ]);

        // Store the file temporarily
        $path = $file->store('temp');
        
        // Process in chunks of 1000 records
        $collection = (new FastExcel)->import(storage_path("app/{$path}"));
        $chunks = $collection->chunk(1000);
        
        foreach ($chunks as $index => $chunk) {
            Queue::later(
                $index * 30, // Delay each job by 30 seconds * chunk index
                new ProcessExcelChunk($chunk->toArray())
            );
        }
        
        return response()->json([
            'message' => 'File upload successful. Processing has begun.',
            'total_records' => $collection->count(),
            'chunks' => $chunks->count()
        ]);
    }
}