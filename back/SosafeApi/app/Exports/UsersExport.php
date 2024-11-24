<?php

namespace App\Exports;

use App\Models\sobiodata;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;

class UsersExport implements FromQuery
{
    use exportable;
    /**
    * @return \Illuminate\Support\Collection
    */
    public function query()
    {
        return User::query();
    }
}
