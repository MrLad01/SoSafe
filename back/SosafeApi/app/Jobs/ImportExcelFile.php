<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;
use App\Models\NewBiodata;

class ImportExcelFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public $timeout = 600; // 10 minutes

    private $storedPath;
    private $now;

    public function __construct(string $storedPath, $now)
    {
        $this->storedPath = $storedPath;
        $this->now        = $now;
    }

    public function handle()
    {
        $fullPath = storage_path("app/{$this->storedPath}");
        $chunk    = [];
        $chunkSize = 1000;

        // FastExcel row-by-row callback — low memory, no timeout pressure
        (new FastExcel)->import($fullPath, function ($row) use (&$chunk, $chunkSize) {
            $chunk[] = $row;

            if (count($chunk) >= $chunkSize) {
                Queue::push(new ProcessExcelChunk($chunk, $this->now));
                $chunk = [];
            }
        });

        // Dispatch remaining rows
        if (!empty($chunk)) {
            Queue::push(new ProcessExcelChunk($chunk, $this->now));
        }
    }
}