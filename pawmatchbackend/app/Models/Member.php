<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Member extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'member'; // 确保表名正确
    protected $primaryKey = 'user_id'; // 主键是 user_id
    public $incrementing = true;
    protected $keyType = 'int';

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
        'username',
        'Age',
        'bio',
    ];

    // 定义与 MemberProfile 模型的关系，使用 member_id 作为外键
    public function profile()
    {
        return $this->hasOne(MemberProfile::class, 'user_id', 'user_id'); // 外键是 member_id，关联主键是 user_id
    }
}
