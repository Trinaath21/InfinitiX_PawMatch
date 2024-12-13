<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMemberProfilesTable extends Migration
{
    public function up()
    {
        Schema::create('member_profiles', function (Blueprint $table) {
            $table->id(); // 主键 ID
            $table->unsignedBigInteger('member_id'); // 外键关联到 member 表
            $table->string('bio')->nullable(); 
            $table->string('profile_picture')->nullable(); // 头像图片路径
            $table->integer('Age')->nullable();
            $table->timestamps(); 

            $table->foreign('member_id')->references('id')->on('member')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('member_profiles');
    }
}
