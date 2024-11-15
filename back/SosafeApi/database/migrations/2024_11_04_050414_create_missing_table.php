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
        Schema::create('missing', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image');
            $table->string('description');
            $table->string('location');
            $table->string('age');
            $table->string('height');
            $table->string('weight');
            $table->string('complextion');
            $table->string('distinguishing_features:');
            $table->string('status');
            $table->string('case_number');
            $table->string('contact');
            $table->integer('stat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('missing');
    }
};
