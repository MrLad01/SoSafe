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
        Schema::table('division_commands', function (Blueprint $table) {
            $table->bigInteger('ZA_command_id')->unSigned()->index()->after('name');
            $table->foreign('ZA_command_id')->references('id')->on('za_commands')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('division_commands', function (Blueprint $table) {
            //
        });
    }
};
