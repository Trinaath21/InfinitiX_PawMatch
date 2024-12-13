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
        Schema::create('shelter_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shelter_id')->constrained('shelter')->onDelete('cascade');
            $table->string('representative_name')->nullable();  // 新增代表人姓名
            $table->string('username')->nullable();   // 新增用户名
            $table->string('profile_picture')->nullable();
            $table->string('website_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shelter_profiles');
    }
};
