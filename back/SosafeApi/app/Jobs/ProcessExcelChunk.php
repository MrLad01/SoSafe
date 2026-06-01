<?php

namespace App\Jobs;

use App\Models\Biodata;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessExcelChunk implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $records;

    public $timeout = 600;   // 10 minutes
    public $tries = 3;
    public $backoff = 30;    // Wait 30 seconds before retrying

    public function __construct(array $records)
    {
        $this->records = $records;
    }

    public function handle()
    {
        try {
            $dataToInsert = [];

            foreach ($this->records as $line) {
                $dataToInsert[] = [
                    'code'              => $line['sno'] ?? null,
                    'form_no'           => $line['code'] ?? null,
                    'firstname'         => $line['surnama'] ?? null,
                    'lastname'          => $line['fname'] ?? null,
                    'othername'         => $line['onames'] ?? null,
                    'address'           => $line['addres'] ?? null,
                    'phone_no'          => $line['phone'] ?? null,
                    'dob'               => $line['dob'] ?? null,
                    'sex'               => $line['sex'] ?? null,
                    'community'         => $line['comunity'] ?? null,
                    'za_command'        => $line['zacomand'] ?? null,
                    'division_command'  => $line['divcomand'] ?? null,
                    'service_code'      => $line['servcode'] ?? null,
                    'position'          => $line['positn'] ?? null,
                    'date_engage'       => $line['datengage'] ?? null,
                    'rank'              => $line['rankk'] ?? null,
                    'nok'               => $line['nofkin'] ?? null,
                    'relationship'      => $line['relat'] ?? null,
                    'nok_phone'         => $line['kinphone'] ?? null,
                    'qualification'     => $line['qualif'] ?? null,
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ];
            }

            // Bulk insert - Much faster than looping create()
            Biodata::insert($dataToInsert);

            Log::info('Excel chunk processed successfully', [
                'records_count' => count($this->records),
                'chunk_size'    => count($dataToInsert)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process Excel chunk', [
                'error'         => $e->getMessage(),
                'line'          => $e->getLine(),
                'records_count' => count($this->records ?? []),
            ]);
            
            throw $e; // Let Laravel retry the job
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::error('Excel chunk job failed permanently', [
            'error'         => $exception->getMessage(),
            'records_count' => count($this->records ?? [])
        ]);
    }
}