<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewBiodata extends Model
{
    use HasFactory;

    // PostgreSQL columns are lowercase (unquoted at migration time).
    // Laravel quotes insert keys exactly as written — these must match
    // the real column names character-for-character.
    protected $fillable = [
        'sno',
        'fno',
        'sname',
        'fname',
        'oname',
        'address',
        'phone',
        'nin',
        'dob',
        'sex',
        'city',
        'zone',
        'area',
        'servno',
        'position',
        'enlisted',
        'rank',
        'nok',
        'relation',
        'nokno',
        'captured',
        'qualification',
    ];

    protected $casts = [
        'dob'      => 'date',
        'enlisted' => 'date',
    ];

    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area');
    }

    public function division()
    {
        return $this->belongsTo(Division::class, 'city');
    }
}