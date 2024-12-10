<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumPost extends Model
{
    use HasFactory;

    // Specify the table name
    //protected $table = 'forum_posts';
    protected $table = 'forum_post';
    protected $primaryKey = 'post_id';

    // Specify fillable fields, including user_id
    protected $fillable = ['title', 'content', 'images', 'user_id'];

    protected $casts = [
        'images' => 'array', // Cast images as an array
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    // Define the relationship to User
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}

?>