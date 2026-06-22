<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    use HasFactory;

    protected $fillable = [
<<<<<<< HEAD
        'code',
        'form_no',
        'firstname',
        'lastname',
        'othername',
        'address',
        'phone_no',
        'dob',
        'sex',
        'community',
        'za_command',
        'division_command',
        'service_code',
        'position',
        'date_engage',
        'rank',
        'nok',
        'relationship',
        'nok_phone',
        'photo',
        'qualification',
    ];

    // Optional: If you want to control timestamps
    // public $timestamps = true;

    // Cast dates properly
    protected $casts = [
        'dob'         => 'date',
        'date_engage' => 'date',
    ];
=======
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
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
}