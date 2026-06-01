<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model {
    protected $fillable = ['name'];
    public function areas() { return $this->hasMany(Area::class); }
    public function divisions() { return $this->hasManyThrough(Division::class, Area::class); }
}

