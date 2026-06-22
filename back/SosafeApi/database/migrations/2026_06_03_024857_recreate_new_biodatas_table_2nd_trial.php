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
            $table->string('sno')->nullable();
            $table->string('fno')->nullable();
            $table->string('sname')->nullable();
            $table->string('fname')->nullable();
            $table->string('oname')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('nin')->nullable();       // removed unique() — bulk imports will choke on duplicates
            $table->date('dob')->nullable();
            $table->string('sex')->nullable();
            $table->foreignId('city')->nullable()->constrained('divisions')->nullOnDelete();
            $table->foreignId('zone')->nullable()->constrained('zones')->nullOnDelete();
            $table->foreignId('area')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('servno')->nullable();
            $table->string('position')->nullable();
            $table->date('enlisted')->nullable();
            $table->string('rank')->nullable();
            $table->string('nok')->nullable();
            $table->string('relation')->nullable();
            $table->string('nokno')->nullable();
            $table->string('captured')->nullable();
            $table->string('qualification')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('new_biodatas');
    }
};