<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\ProcessExcelChunk;
use Illuminate\Support\Facades\Queue;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\NewBiodata;
use App\Models\Biodata;  
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\BiodataImport;


class ExcelController extends Controller 
{
    public function import(Request $request)
    {
        $file = $request->file('raw_data');

        $request->validate([
            'raw_data' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        $path = $file->store('temp');
        $fullPath = storage_path("app/{$path}");

        NewBiodata::truncate();

        // Use FastExcel for xlsx, Maatwebsite for xls
        if ($file->getClientOriginalExtension() === 'xlsx') {
            $collection = (new FastExcel)->import($fullPath);
        } else {
            $collection = collect(Excel::toArray([], $fullPath)[0])->skip(1)->map(function($row) {
                // map array index to keys using first row as headers
                return $row;
            });
        }

        $chunks = $collection->chunk(1000);
        $now    = now();

        foreach ($chunks as $chunk) {
            Queue::push(new ProcessExcelChunk($chunk->toArray(), $now));
        }

        return response()->json([
            'message'       => 'File upload successful. Processing has begun.',
            'total_records' => $collection->count(),
            'chunks'        => $chunks->count()
        ]);
    }
}