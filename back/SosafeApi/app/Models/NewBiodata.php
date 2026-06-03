<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class NewBiodata extends Model
{
    use HasFactory;

    // ── Tell Laravel the table uses uppercase quoted column names ─────────────
    // PostgreSQL created these columns with quotes so they are case-sensitive.
    // We must use the exact same casing everywhere — uppercase, matching Biodata.

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
        'CITY',       // FK → divisions.id
        'ZONE',       // FK → zones.id
        'AREA',       // FK → areas.id
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

    // Mass-assignment guard is irrelevant for ::insert() but set it correctly
    // anyway so ::create() / ::fill() also work.
    protected $guarded = [];

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