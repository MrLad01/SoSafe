<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class soSafeCorpsBiodata extends Model
{
    use HasFactory;

    // protected $table = 'so_safe_corps_biodatas';

    /**
     * Get the user associated with the soSafeCorpsBiodata
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
        public function zonalArea(): HasOne{
       
            return $this->hasOne(ZA_command::class, 'id', 'za_command_id');
        
    }

    /**
     * Get the user associated with the soSafeCorpsBiodata
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function divisionArea(): HasOne{
       
        return $this->hasOne(divCommand::class, 'id', 'division_command_id');
    
}

/**
     * Get the user associated with the soSafeCorpsBiodata
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function community(): HasOne{
       
        return $this->hasOne(community::class, 'id', 'community_id');
    
}
}
