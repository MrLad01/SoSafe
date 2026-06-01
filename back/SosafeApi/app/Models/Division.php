<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model {
    protected $fillable = ['name', 'area_id'];
    public function area() { return $this->belongsTo(Area::class); }
    public function zone() { return $this->hasOneThrough(Zone::class, Area::class); }
}
