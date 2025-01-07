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
        Schema::create('new_biodatas', function (Blueprint $table) {
            $table->id();
            $table->string('form_no')->unique();
            $table->string('code')->unique();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('othername');
            $table->string('address');
            $table->string('phone_no')->unique();
            $table->date('dob');
            $table->string('sex');
            $table->string('community_id');
            $table->string('za_command_id');
            $table->string('division_command_id');
            $table->string('service_code')->unique();
            $table->string('position');
            $table->string('date_engage');
            $table->string('rank');
            $table->string('nok');
            $table->string('relationship');
            $table->string('nok_phone');
            $table->string('qualification');
            $table->foreign('community_id')->references('id')->on('communities')->onDelete('cascade');
            $table->foreign('za_command_id')->references('id')->on('za_commands')->onDelete('cascade');
            $table->foreign('division_command_id')->references('id')->on('division_commands')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('new_biodatas');
    }
};
