<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class divCommand extends Model
{
    use HasFactory;

    /**
     * Get the user that owns the community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'division_command_id', 'id');
    }

    protected $table = 'division_commands';
}
