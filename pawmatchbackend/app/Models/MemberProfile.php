<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberProfile extends Model
{
    use HasFactory;

    protected $table = 'member_profiles'; // 确保表名正确
    protected $primaryKey = 'id'; // 如果这是该表的主键
    public $timestamps = false; // 如果没有时间戳字段

    protected $fillable = [
        'user_id',  // 外键字段
        'bio',
        'username',
        'Age',
    ];

    // 定义与 Member 模型的关系
    public function member()
    {   return $this->belongsTo(Member::class);
        //return $this->belongsTo(Member::class, 'member_id', 'user_id'); // 使用 member_id 和 user_id 来建立关联
    }
}
