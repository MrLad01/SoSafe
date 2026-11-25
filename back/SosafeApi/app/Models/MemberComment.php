<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberComment extends Model
{
    protected $fillable = ['fno', 'status', 'body', 'author'];
}