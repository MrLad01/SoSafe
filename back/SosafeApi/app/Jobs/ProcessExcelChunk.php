<?php

namespace App\Jobs;

use App\Models\Biodata;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessExcelChunk implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $records;
    public $timeout = 600; // 10 minutes
    
    public function __construct(array $records)
    {
        $this->records = $records;
    }

    public function handle()
    {
        foreach ($this->records as $record) {
            Biodata::create([
                'code'=>$line['sno'],
                'form_no' => $line['code'],
                'firstname' => $line['surnama'],
                'lastname' => $line['fname'],
                'othername' => $line['onames'],
                'address' => $line['addres'],
                'phone_no' => $line['phone'],
                'dob' => $line['dob'],
                'sex' => $line['sex'],
                'community' => $line['comunity'],
                'za_command' => $line['zacomand'],
                'division_command' => $line['divcomand'],
                'service_code' => $line['servcode'],
                'position' => $line['positn'],
                'date_engage' => $line['datengage'],
                'rank' => $line['rankk'],
                'nok' => $line['nofkin'],
                'relationship' => $line['relat'],
                'nok_phone' => $line['kinphone'],
                'qualification' => $line['qualif'],
                
            ]);
        }
    }
}