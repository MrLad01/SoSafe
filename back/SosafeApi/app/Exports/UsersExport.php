<?php

namespace App\Exports;

use App\Models\sobiodata;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Queue;

class UsersExport implements FromQuery,ShouldAutoSize,WithHeadings
{
    use exportable;
    /**
    * @return \Illuminate\Support\Queue
    */
    // public function chunkSize(): int { 
        
    //     return 2000; // Adjust the chunk size as needed 
    //     }
    public function query()
    {
        return sobiodata::query()->take(5);
    }

    public function headings(): array
    {
        return [
            'id',
            'code',
            'firstname',
            'lastname',
            'othername',
            'address',
            'phone_no',
            
        ];
    }
    // public function map($sobiodata): array
    // {
    //     return [
    //         $sobiodata->fname,
    //         $sobiodata->surnama,
    //         Date::dateTimeToExcel($sobiodata->created_at),
    //         $sobiodata->created_at->diffForHumans(),
    //     ];
    // }
}
