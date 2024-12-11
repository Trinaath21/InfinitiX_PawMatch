<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberProfile extends Model
{
    use HasFactory;

    protected $table = 'member_profiles';

    protected $fillable = [
        'member_id',
        'profile_picture',
        'bio',
        'Age'
    ];

    // 与 Member 模型的关系
    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
