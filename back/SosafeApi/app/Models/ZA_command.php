<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ZA_command extends Model
{
    use HasFactory;

    /**
     * Get the user that owns the community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    protected $table = 'za_commands';
    public function user(): BelongsTo
    {
        return $this->belongsTo(soSafeCorpsBiodata::class,'za_command_id');
    }
    protected $fillable =['name'];
}
