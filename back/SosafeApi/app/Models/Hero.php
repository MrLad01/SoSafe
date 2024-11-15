<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    use HasFactory;
    protected $guarded = [
        'created_at',
        'updated_at',
        'id',
        'status'
    ];
}
