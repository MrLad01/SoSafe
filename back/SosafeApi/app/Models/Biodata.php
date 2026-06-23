<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    use HasFactory;

    protected $fillable = [
        'SNO',
        'FNO',
        'SNAME',
        'FNAME',
        'ONAME',
        'ADDRESS',
        'PHONE',
        'NIN',
        'DOB',
        'SEX',
        'CITY',
        'ZONE',
        'AREA',
        'SERVNO',
        'POSITION',
        'ENLISTED',
        'RANK',
        'NOK',
        'RELATION',
        'NOKNO',
        'CAPTURED',
        'QUALIFICATION',
    ];

    protected $casts = [
        'DOB'      => 'date',
        'ENLISTED' => 'date',
    ];

    public function zone()
    {
        return $this->belongsTo(Zone::class, 'ZONE');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'AREA');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'CITY');
    }
}