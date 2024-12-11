<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Member extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'member';

    protected $fillable = [
        'name',
        'state',
        'district',
        'detailed_address',
        'NoOfPets',
        'phone_number',
        'email',
        'profile_picture',
        'password',
    ];

    // 定义与 MemberProfile 模型的关系
    public function profile()
    {
        return $this->hasOne(MemberProfile::class, 'member_id', 'id');  // 外键是 member_id，主键是 id
    }
}
