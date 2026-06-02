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
        $file = $request->file('raw_data');
        
        $request->validate([
            'raw_data' => 'required|file|mimes:xlsx,xls'
        ]);

        $path = $file->store('temp');
        
        NewBiodata::truncate();

        $collection = (new FastExcel)->import(storage_path("app/{$path}"));
        $chunks = $collection->chunk(3000); // bigger chunks = fewer jobs
        
        $now = now(); // compute once

        foreach ($chunks as $index => $chunk) {
            Queue::push( // push immediately, no delay
                new ProcessExcelChunk($chunk->toArray(), $now)
            );
        }
        
        return response()->json([
            'message'       => 'File upload successful. Processing has begun.',
            'total_records' => $collection->count(),
            'chunks'        => $chunks->count()
        ]);
    }
}