<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberProfile extends Model
{
    use HasFactory;

    protected $table = 'member_profile'; 
    protected $primaryKey = 'id'; 
    public $timestamps = false; 

    protected $fillable = [
        'user_id',  
        'bio',
        'username',
        'Age',
    ];

   
    public function member()
    {  // return $this->belongsTo(Member::class);
        return $this->belongsTo(Member::class, 'member_id', 'user_id'); 
    }
}
