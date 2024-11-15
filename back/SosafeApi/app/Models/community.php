<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class community extends Model
{
    use HasFactory;
protected $fillable = ['name'];
    /**
     * Get the user that owns the community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'community_id', 'id');
    }
}
