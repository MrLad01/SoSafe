<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Division;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sango  = Area::where('name', 'SANGO')->first();
        $adoOdo = Area::where('name', 'ADO-ODO')->first();
        $remo   = Area::where('name', 'REMO')->first();

        foreach (['ALIMO', 'AKUTE', 'RABORO'] as $d)
            Division::firstOrCreate(['name' => $d, 'area_id' => $sango->id]);

        foreach (['ODAN', 'EKUTE', 'EBUTE'] as $d)
            Division::firstOrCreate(['name' => $d, 'area_id' => $adoOdo->id]);

        foreach (['TIMINO', 'TANIMO'] as $d)
            Division::firstOrCreate(['name' => $d, 'area_id' => $remo->id]);
    }
}
