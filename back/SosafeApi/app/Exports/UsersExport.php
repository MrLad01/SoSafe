<?php

namespace App\Exports;

use App\Models\sobiodata;
use Maatwebsite\Excel\Concerns\FromCollection;

class UsersExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return sobiodata::chunk('sno', '61')->get();
    }
}
