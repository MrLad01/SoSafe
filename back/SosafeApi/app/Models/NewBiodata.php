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


    public function scopeVisibleTo($query, $user)
    {
        if (!$user) {
            return $query->whereRaw('1 = 0');
        }
        if (in_array($user->role, ['superadmin', 'admin'], true)) {
            return $query;                       // full access, as today
        }

        $id = match ($user->role) {
            'zonal_admin'      => $user->zone_id,
            'area_admin'       => $user->area_id,
            'divisional_admin' => $user->division_id,
            default            => null,
        };

        // Never use where('zone', null): Laravel turns it into IS NULL
        // and would expose everyone who has no zone yet.
        if (!$id) {
            return $query->whereRaw('1 = 0');
        }

        return match ($user->role) {
            'zonal_admin' => $query->where(fn ($q) => $q
                ->where('zone', $id)
                ->orWhereIn('area', Area::where('zone_id', $id)->pluck('id'))),
            'area_admin'       => $query->where('area', $id),
            'divisional_admin' => $query->where('city', $id),
        };
    }
}
