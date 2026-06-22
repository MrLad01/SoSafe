<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('new_biodatas');

        Schema::create('new_biodatas', function (Blueprint $table) {
            $table->id();
            $table->string('SNO')->nullable();
            $table->string('FNO')->nullable();
            $table->string('SNAME');
            $table->string('FNAME');
            $table->string('ONAME')->nullable();
            $table->string('ADDRESS')->nullable();
            $table->string('PHONE')->nullable();
            $table->string('NIN')->unique();
            $table->date('DOB')->nullable();
            $table->string('SEX')->nullable();
            $table->foreignId('CITY')->nullable()->constrained('divisions')->nullOnDelete();
            $table->foreignId('ZONE')->nullable()->constrained('zones')->nullOnDelete();
            $table->foreignId('AREA')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('SERVNO')->nullable();
            $table->string('POSITION')->nullable();
            $table->date('ENLISTED')->nullable();
            $table->string('RANK')->nullable();
            $table->string('NOK')->nullable();
            $table->string('RELATION')->nullable();
            $table->string('NOKNO')->nullable();
            $table->string('CAPTURED')->nullable();
            $table->string('QUALIFICATION')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('new_biodatas');
    }
};