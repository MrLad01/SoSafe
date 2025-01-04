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
            $table->string('sno')->unique();
            $table->string('code')->unique();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('othername');
            $table->string('address');
            $table->string('phone_no');
            $table->date('dob');
            $table->string('sex');
            $table->string('community');
            $table->string('za_command');
            $table->string('division_command');
            $table->string('service_code')->unique();
            $table->string('position');
            $table->string('date_engage');
            $table->string('rank');
            $table->string('nok');
            $table->string('relationship');
            $table->string('nok_phone');
            $table->string('photo');
            $table->string('qualification');
            // $table->string();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biodatas');
    }
};
