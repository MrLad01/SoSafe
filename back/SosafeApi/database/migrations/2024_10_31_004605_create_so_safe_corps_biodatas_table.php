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
        Schema::create('so_safe_corps_biodatas', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('othername');
            $table->string('address');
            $table->string('phone_no');
            $table->date('dob');
            $table->string('sex');
            $table->bigInteger('community_id')->unsigned()->index();
            $table->bigInteger('za_command_id')->unsigned()->index();
            $table->bigInteger('division_command_id')->unsigned()->index();
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
            $table->foreign('community_id')->references('id')->on('communities')->onDelete('cascade');
            $table->foreign('za_command_id')->references('id')->on('za_commands')->onDelete('cascade');
            $table->foreign('division_command_id')->references('id')->on('division_commands')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('so_safe_corps_biodatas');
    }
};
