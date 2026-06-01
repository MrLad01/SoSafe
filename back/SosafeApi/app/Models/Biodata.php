<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biodata extends Model
{
    use HasFactory;

    protected $fillable = [
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
}