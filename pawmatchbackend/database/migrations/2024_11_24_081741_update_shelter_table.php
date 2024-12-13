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
        //
        Schema::table('shelter', function (Blueprint $table)
         { 
            $table->dropColumn('address'); 
            $table->string('state');
            $table->string('district');
            $table->string('detailed_address'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('shelter', function (Blueprint $table)
         { 
         $table->string('address');
         $table->dropColumn(['state', 'district', 'detailed_address']);
         });
    }
};
