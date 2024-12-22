<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comment';
    protected $primaryKey = 'comment_id';
    protected $fillable = ['post_id', 'comment'];

    // Define relationships
    public function post()
    {
        return $this->belongsTo(ForumPost::class, 'post_id');
    }

   /* public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }*/

    public function shelter()
    {
        return $this->belongsTo(Shelter::class, 'shelter_id');
    }

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}

?>
