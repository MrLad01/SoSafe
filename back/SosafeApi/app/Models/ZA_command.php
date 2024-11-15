<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ZA_command extends Model
{
    use HasFactory;

    /**
     * Get the user that owns the community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'za_command_id', 'id');
    }
    protected $fillable =['name'];
    protected $table = 'za_commands';
}
