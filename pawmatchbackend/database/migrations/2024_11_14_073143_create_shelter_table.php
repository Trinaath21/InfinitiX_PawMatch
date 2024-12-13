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
        Schema::create('shelter', function (Blueprint $table) {
            $table->id();
            $table->string('shelter_name')->unique();
            $table->string('address')->nullable();
            $table->integer('NoOfPets')->default(0);
            $table->string('phone_number')->default(0);
            $table->string('email')->unique();
            $table->string('website_url')->nullable();
            $table->text('description')->nullable()->nullable();
            $table->string('password');
            $table->string('profile_picture')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shelter');
    }
};
