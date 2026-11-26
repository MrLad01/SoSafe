<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::table('user_admins', function (Blueprint $t) {
            $t->string('fno')->nullable()->index();
            $t->unsignedBigInteger('zone_id')->nullable();
            $t->unsignedBigInteger('area_id')->nullable();
            $t->unsignedBigInteger('division_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_admins', function (Blueprint $t) {
            $t->dropColumn(['fno', 'zone_id', 'area_id', 'division_id']);
        });
    }
};
