<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ForumPost;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ForumPostController extends Controller
{
    
    public function store(Request $request)
    {
        // Check incoming data for debugging
        Log::info($request->all());
        // Validate the incoming request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // Validate each image file
        ]); 

        // Determine user type and assign ownership
     $user_id = $request->input("user_id");
     $userRole = $request->input("role");
     if ($userRole == "shelter"){
        $shelter_id = $request->input("shelter_id");
      }
      else if ($userRole == "member"){
        $member_id = $request->input("member_id");
      }        
    //  $member_id = $request->input("member_id");
    //  $shelter_id = $request->input("shelter_id");
     // Initialize ownership variables
     //$role = null;
     //$shelter_id = null;
     //$member_id = null;

     
     if (isset($shelter_id)) {
        //$role = 'shelter';
       // $shelter_id = $shelter_id;
        $member_id = null;
    } else if (isset($member_id)) {
        //$role = 'member';
        $shelter_id = null;
        //$member_id = $id;
    } else {
        return response()->json(['error' => 'Invalid user type'], 403);
    }

        // Store images and collect paths
        $imagePaths = [];
        if ($request->hasFile('images')) {
            Log::info('Images detected in request.');
            foreach ($request->file('images') as $image) {
            
                $path = $image->store('images','public');
                $imagePaths[] = Storage::url($path);
            } 
        
        // Log image paths for debugging
        Log::info('Image paths:', $imagePaths);
    } else {
        Log::warning('No images found in request.');
    }

        // Create the forum post
        $post = ForumPost::create([
            'title' => $validatedData['title'],
            'content' => $validatedData['content'],
            'images' => $imagePaths, // Save array of image paths
            'user_id' => 1, // Temporarily set a user ID
            'shelter_id' => null,
            'member_id' => null,
           // 'role' => $role,
        ]);

        Log::info('Post created with images:', $post->toArray());

        // Return success response
        return response()->json(['message' => 'Post created successfully!', 'post' => $post], 201);
    }

    public function getUserPosts($user_id)
{
    $posts = ForumPost::where('user_id', $user_id)->select('post_id', 'title', 'content', 'images', 'created_at','updated_at')->orderBy('updated_at', 'desc')->withCount('comments')->get();
   // $posts 
    
    if ($posts->isEmpty()) {
        return response()->json(['message' => 'No posts available'], 200);
    }
    return response()->json($posts, 200);
}
    // Fetch all posts
    public function index()
    {
       // $posts = ForumPost::all();
       $posts = ForumPost::withCount('comments')
       ->orderBy('updated_at', 'desc') // Sort by latest
       ->get();
       
        return response()->json($posts);
    }

    // Fetch a specific post
    public function show($post_id)
    {
       // $post = ForumPost::find($post_id);
       $post = ForumPost::with('user')->find($post_id);
       Log::info($post);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($post);
    }

    // Update a specific post
    public function update(Request $request, $post_id)
    {
        $post = ForumPost::with('user')->findOrFail($post_id);
        $post = ForumPost::find($post_id);
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'images' => 'array',  // Validation for new images array
            'existingImages' => 'nullable|array', // Array of remaining image URLs
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

         // Update post title and content
        $post->title = $validatedData['title'];
        $post->content = $validatedData['content'];
        // Keep existing images and add new ones if uploaded
        $existingImages = $request->input('existingImages', []);
        $normalizedExistingImages = array_map(function ($imagePath) {
        return str_replace('http://localhost:8000', '', $imagePath); // Remove escaped slashes
        }, $existingImages);
        
        $updatedImages = $normalizedExistingImages; // Start with the remaining images

        // Handle image uploads, if any
    if ($request->hasFile('images')) {
        Log::info('Images received:', $request->file('images'));

       /* // Remove old images from storage, if needed
        if (!empty($post->images)) {
            foreach ($post->images as $imagePath) {
                $imagePath = str_replace('/storage', 'public', $imagePath);
                Storage::delete($imagePath);
            }
        }
*/
        //$imagePaths = [];
        foreach ($request->file('images') as $image) {
            $path = $image->store('images','public');
            //$imagePaths[] = $path;
            $updatedImages[] = Storage::url($path); // Store public URL paths
        }
        //$post->images = ($imagePaths);
        $post->images = $updatedImages;
    }  else {
        Log::warning('No images received in the request');
    }

    $post->save();

        return response()->json(['message' => 'Post updated successfully', 'post' => $post]);
    }

    public function destroy($post_id)
{
    $post = ForumPost::find($post_id);

    if (!$post) {
        return response()->json(['message' => 'Post not found'], 404);
    }

    // Optional: Delete associated images from storage if needed
    $images = ($post->images);
    if ($images) {
        foreach ($images as $imagePath) {
            $imagePath = str_replace('/storage', 'public', $imagePath);
            Storage::delete($imagePath);
        }
    }

    $post->delete();
    return response()->json(['message' => 'Post deleted successfully']);
}


public function getComments($post_id)
{
    $comments = Comment::where('post_id', $post_id)->orderBy('created_at')->with('user')->get();
    return response()->json($comments);
}

}



?>