<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class sobiodata extends Model
{
    use HasFactory;
    protected $table = 'sobiodata';
    protected $hidden = ['id'];
    protected $primaryKey = 'sno';
}
