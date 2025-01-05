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
        Schema::create('biodatas', function (Blueprint $table) {
            $table->id();
            $table->string('form_no')->nullable()->unique();
            $table->string('code')->nullable()->unique();
            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('othername')->nullable();
            $table->string('address')->nullable();
            $table->string('phone_no')->nullable();
            $table->date('dob')->nullable();
            $table->string('sex')->nullable();
            $table->string('community')->nullable();
            $table->string('za_command')->nullable();
            $table->string('division_command')->nullable();
            $table->string('service_code')->unique()->nullable();
            $table->string('position')->nullable();
            $table->string('date_engage')->nullable();
            $table->string('rank')->nullable();
            $table->string('nok')->nullable();
            $table->string('relationship')->nullable();
            $table->string('nok_phone')->nullable();
            $table->string('photo')->nullable();
            $table->string('qualification')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raw_biodata');
    }
};
