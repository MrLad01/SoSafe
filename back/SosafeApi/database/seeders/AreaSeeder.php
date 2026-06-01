<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Zone;
use App\Models\Area;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ota = Zone::where('name', 'OTA')->first();
        Area::firstOrCreate(['name' => 'SANGO',   'zone_id' => $ota->id]);
        Area::firstOrCreate(['name' => 'ADO-ODO', 'zone_id' => $ota->id]);
        Area::firstOrCreate(['name' => 'REMO',    'zone_id' => $ota->id]);
    }
}
