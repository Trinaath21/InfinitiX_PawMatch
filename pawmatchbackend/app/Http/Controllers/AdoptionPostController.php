<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PetAdoptionPost;
use App\Models\AdoptionApplication;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AdoptionPostController extends Controller
{
    public function store(Request $request)
    {
        $id = $request->input("id");

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:50',
            'breed' => 'required|string|max:100',
            'age' => 'required|string|max:50',
            'gender' => 'required',
            'size' => 'required',
            'weight' => 'required|numeric|min:0',
            'behavioralTraits' => 'nullable|string',
            'vaccinationStatus' => 'required',
            'spayedNeuteredStatus' => 'required',
            'healthIssues' => 'nullable|string',
            'district' => 'required|string',
            'state' => 'required|string',
            'currentLocation' => 'required|string',
            'extra_info' => 'nullable|string',
            'adoptionFee' => 'nullable|numeric|min:0',
            'isFromShelter' => 'required|boolean',
            'petImage' => 'required|image|mimes:jpeg,png,jpg,gif|max:1000000',
        ]);

        $post = new PetAdoptionPost();
        $post->name = $validatedData['name'];
        $post->species = $validatedData['species'];
        $post->breed = $validatedData['breed'];
        $post->age = $validatedData['age'];
        $post->gender = $validatedData['gender'];
        $post->size = $validatedData['size'];
        $post->weight = $validatedData['weight'];
        $post->behavioral_traits = $validatedData['behavioralTraits'];
        $post->vaccination_status = $validatedData['vaccinationStatus'];
        $post->spayed_neutered_status = $validatedData['spayedNeuteredStatus'];
        $post->health_issues = $validatedData['healthIssues'];
        $post->district = $validatedData['district'];
        $post->state = $validatedData['state'];
        $post->current_location = $validatedData['currentLocation'];
        $post->extra_info = $validatedData['extra_info'];
        $post->adoption_fee = $validatedData['adoptionFee'];
        $post->id = $id;  // Temporary user ID
        $post->status = 'available';
        $post->isFromShelter = $validatedData['isFromShelter'];
        ;

        if ($request->hasFile('petImage')) {
            Log::info("Image file exists.");
            $file = $request->file('petImage');
            $post->petImage = file_get_contents($file->getPathname());
        } else {
            Log::warning("No image file found in the request.");
        }

        $post->save();

        // Exclude the binary data from the response
        return response()->json([
            'message' => 'Pet adoption post created successfully'
        ]);
    }

    public function show($id)
    {
        $post = PetAdoptionPost::find($id);
        if ($post) {
            if ($post->petImage) {
                // Get the MIME type of the image (e.g., image/jpeg, image/png)
                $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);

                // Convert binary image to a base64-encoded string with MIME type
                $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
            }
            return response()->json($post, 200);
            // header('Access-Control-Allow-Origin', '*')
            // header('Access-Control-Allow-Methods', 'POST');
        } else {
            return response()->json(['error' => 'Post not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {

        Log::info('Request Data:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'species' => 'required|string|max:50',
            'breed' => 'required|string|max:100',
            'age' => 'required|string|max:50',
            'gender' => 'required',
            'size' => 'required',
            'weight' => 'required|numeric|min:0',
            'behavioral_traits' => 'nullable|string',
            'vaccination_status' => 'required',
            'spayed_neutered_status' => 'required',
            'health_issues' => 'nullable|string',
            'district' => 'required|string',
            'state' => 'required|string',
            'current_location' => 'required|string',
            'extra_info' => 'nullable|string',
            'adoption_fee' => 'nullable|numeric|min:0',
            'status' => 'required',
            'petImage' => 'required|file|mimes:jpeg,png,jpg,gif|max:1000000',
        ]);

        $adoptionPost = PetAdoptionPost::findOrFail($id);
        $adoptionPost->fill($request->except('petImage'));

        // If an image is uploaded, store it as binary
        if ($request->hasFile('petImage')) {
            $adoptionPost->petImage = file_get_contents($request->file('petImage')->getRealPath());
        }
        //Log::info($adoptionPost);
        $adoptionPost->save();
        
        return response()->json(['message' => 'Adoption post updated successfully']);
    }

    // public function getPostsByUser(Request $request)
    // {
    //     $id = $request->query('id');

    //     // Validate that `user_id` is provided
    //     if (!$id) {
    //         return response()->json([
    //             'error' => 'id query parameter is required.'
    //         ], 400);
    //     }

    //     // Fetch posts based on the provided user ID
    //     $posts = PetAdoptionPost::where('id', $id)->get();

    //     // Return the filtered data
    //     return response()->json($posts);
    // }

    // public function getPostsByUser(Request $request)
    // {
    //     $id = $request->query('id');

    //     if (!$id) {
    //         return response()->json([
    //             'error' => 'id query parameter is required.'
    //         ], 400);
    //     }

    //     // Fetch posts based on the provided user ID
    //     $posts = PetAdoptionPost::where('id', $id)->get();

    //     if ($posts->isEmpty()) {
    //         return response()->json(['error' => 'No posts found for this user'], 404);
    //     }

    //     // Process each post to handle the pet image
    //     $posts = $posts->map(function ($post) {
    //         if ($post->petImage) {
    //             // Determine MIME type for the image data
    //             $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);

    //             // Encode the image as Base64 and attach it with the MIME type
    //             $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
    //         }
    //         return $post;
    //     });

    //     return response()->json($posts, 200);
    // }

    public function getPostsByUser(Request $request)
    {
        $id = $request->query('id');
        $role = $request->query('role');

        if (!$id || !$role) {
            return response()->json([
                'error' => 'Both id and role query parameters are required.'
            ], 400);
        }

        // Fetch posts based on user ID and role
        $query = PetAdoptionPost::where('id', $id);

        if ($role === 'member') {
            $query->where('isFromShelter', 0);
        } elseif ($role === 'shelter') {
            $query->where('isFromShelter', 1);
        } else {
            return response()->json([
                'error' => 'Invalid role specified. Valid roles are "member" or "shelter".'
            ], 400);
        }

        $posts = $query->get();

        if ($posts->isEmpty()) {
            return response()->json(['error' => 'No posts found for this user'], 404);
        }

        // Process each post to handle the pet image
        $posts = $posts->map(function ($post) {
            if ($post->petImage) {
                // Determine MIME type for the image data
                $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);

                // Encode the image as Base64 and attach it with the MIME type
                $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
            }
            return $post;
        });

        return response()->json($posts, 200);
    }

    public function getPostsByUserPublic(Request $request)
    {
        $id = $request->query('id');

        if (!$id) {
            return response()->json([
                'error' => 'id query parameter is required.'
            ], 400);
        }

        // Fetch posts based on the provided user ID
        $posts = PetAdoptionPost::where('id', $id)->get();

        if ($posts->isEmpty()) {
            return response()->json(['error' => 'No posts found for this user'], 404);
        }

        // Process each post to handle the pet image
        $posts = $posts->map(function ($post) {
            if ($post->petImage) {
                // Determine MIME type for the image data
                $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);

                // Encode the image as Base64 and attach it with the MIME type
                $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
            }
            return $post;
        });

        return response()->json($posts, 200);
    }

    // public function getPostsAndApplications(Request $request)
    // {
    //     $id = $request->query('id');

    //     if (!$id) {
    //         return response()->json([
    //             'error' => 'id query parameter is required.'
    //         ], 400);
    //     }

    //     // Fetch posts based on user ID
    //     $posts = PetAdoptionPost::where('id', $id)->get();

    //     // Process each post to handle the pet image
    //     $posts = $posts->map(function ($post) {
    //         if ($post->petImage) {
    //             $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);
    //             $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
    //         }
    //         return $post;
    //     });

    //     // Fetch adoption applications based on user ID
    //     $applications = AdoptionApplication::where('user_id', $id)->get();

    //     // Combine both datasets and send as a single response
    //     return response()->json([
    //         'posts' => $posts,
    //         'applications' => $applications,
    //     ], 200);
    // }

    public function getPostsAndApplications(Request $request)
    {
        $id = $request->query('id');

        if (!$id) {
            return response()->json([
                'error' => 'id query parameter is required.'
            ], 400);
        }

        // Fetch posts excluding rows where both user_id = $id AND isFromShelter = 0
        $posts = PetAdoptionPost::where(function ($query) use ($id) {
            // Exclude rows where user_id matches and isFromShelter is 0
            $query->where(function ($query) use ($id) {
                $query->where('id', '!=', $id) // Exclude matching user_id
                    ->orWhere('isFromShelter', '=', 1); // Include shelter posts
            });
        })->get();

        // Process each post to handle the pet image
        $posts = $posts->map(function ($post) {
            if ($post->petImage) {
                $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);
                $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
            }
            return $post;
        });

        // Fetch adoption applications based on user ID
        $applications = AdoptionApplication::where('user_id', $id)->get();

        // Combine both datasets and send as a single response
        return response()->json([
            'posts' => $posts,
            'applications' => $applications,
        ], 200);
    }

    public function deleteAdoptionPost(Request $request)
    {
        $adoption_post_id = $request->input('adoption_post_id');

        // Use the Eloquent model to delete the record
        $deleted = PetAdoptionPost::where('adoption_post_id', $adoption_post_id)->delete();
        Log::info($adoption_post_id);


        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Adoption post deleted successfully']);
        } else {
            return response()->json(['success' => false, 'message' => 'Adoption post not found or could not be deleted'], 404);
        }
    }

}