<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\ForumPost;

class CommentController extends Controller
{

    public function store(Request $request)
{
    $validated = $request->validate([
        'post_id' => 'required|exists:forum_post,post_id',
        'comment' => 'required|string|max:500',
    ]);
    if($request->input("role")== "member"){
        $comment = Comment::create([
            'post_id' => $validated['post_id'],
            'member_id' => $request->input(key: "member_id"),
            'comment' => $validated['comment'],
        ]);
    }else{
        $comment = Comment::create([
            'post_id' => $validated['post_id'],
            'shelter_id' => $request->input(key: "shelter_id"),
            'comment' => $validated['comment'],
        ]);
    }

    return response()->json($comment, 201);

    }

    public function index($post_id)
    {
       /* $post = ForumPost::with(['comments.user'])->findOrFail($post_id);
        return response()->json($post->comments->sortBy('created_at'));  */

        $post = ForumPost::findOrFail($post_id);

    $comments = $post->comments()
        ->with('shelter','member') // Load the associated user
        ->orderBy('created_at', 'asc') // Sort by creation time in ascending order
        ->get();

    return response()->json($comments);
    }
}

?>
