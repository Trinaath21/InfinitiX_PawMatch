<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdoptionApplication;
use App\Models\Member;

class AdoptionApplicationController extends Controller
{
    public function getAddressByUserId(Request $request)
    {
        $id = $request->query('id');

        if (!$id) {
            return response()->json([
                'error' => 'id query parameter is required.'
            ], 400);
        }

        // Fetch the user's address details from the `member` table
        $member = Member::select('detailed_address', 'district', 'state')
            ->where('id', $id)
            ->first();

        if (!$member) {
            return response()->json([
                'error' => 'No member found with the provided id.'
            ], 404);
        }

        return response()->json($member, 200);
    }

    public function getApplicationsByPostID(Request $request)
    {
        $adoption_post_id = $request->query('adoption_post_id');

        if (!$adoption_post_id) {
            return response()->json([
                'error' => 'adoption_post_id query parameter is required.'
            ], 400);
        }

        // Fetch posts based on the provided user ID
        $applications = AdoptionApplication::where('adoption_post_id', $adoption_post_id)->get();

        if ($applications->isEmpty()) {
            return response()->json(['error' => 'No posts found for this user'], 404);
        }

        // Process each post to handle the pet image
        // $applications = $applications->map(function ($post) {
        //     if ($post->petImage) {
        //         // Determine MIME type for the image data
        //         $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);

        //         // Encode the image as Base64 and attach it with the MIME type
        //         $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
        //     }
        //     return $post;
        // });

        return response()->json($applications, 200);
    }

    public function getApplicationByApplicationID(Request $request)
    {
        $application_id = $request->query('application_id');

        if (!$application_id) {
            return response()->json([
                'error' => 'application_id query parameter is required.'
            ], 400);
        }

        // Fetch posts based on the provided user ID
        $application = AdoptionApplication::where('application_id', $application_id)->get();

        if ($application->isEmpty()) {
            return response()->json(['error' => 'No application found for this application id'], 404);
        }

        // Process each post to handle the pet image
        // $applications = $applications->map(function ($post) {
        //     if ($post->petImage) {
        //         // Determine MIME type for the image data
        //         $mimeType = finfo_buffer(finfo_open(), $post->petImage, FILEINFO_MIME_TYPE);

        //         // Encode the image as Base64 and attach it with the MIME type
        //         $post->petImage = 'data:' . $mimeType . ';base64,' . base64_encode($post->petImage);
        //     }
        //     return $post;
        // });

        return response()->json($application, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'applicant_name' => 'required|string|max:255',
            'applicant_age' => 'required|integer|min:0',
            'phone_number' => 'required|string|max:20',
            'current_pets_count' => 'required|integer|min:0',
            'previous_pet_experience' => 'required|string',
            'living_condition' => 'required|string',
            'landlord_requirement' => 'string',
            'lifestyle' => 'required|string',
            'detailed_address' => 'required|string',
            'district' => 'required|string',
            'state' => 'required|string',
            'adoption_post_id' => 'required',
            'user_id' => 'required',
        ]);

        // Automatically set status and application_date
        $validatedData['application_date'] = now()->format('Y-m-d');
        $validatedData['status'] = 'Pending';

        // Create a new adoption application
        $application = new AdoptionApplication();
        $application->adoption_post_id = $validatedData['adoption_post_id'];
        $application->user_id = $validatedData['user_id'];
        //$application->user_id = 21;
        $application->applicant_name = $validatedData['applicant_name'];
        $application->applicant_age = $validatedData['applicant_age'];
        $application->phone_number = $validatedData['phone_number'];
        $application->current_pets_count = $validatedData['current_pets_count'];
        $application->previous_pet_experience = $validatedData['previous_pet_experience'];
        $application->detailed_address = $validatedData['detailed_address'];
        $application->district = $validatedData['district'];
        $application->state = $validatedData['state'];
        $application->living_condition = $validatedData['living_condition'];
        $application->landlord_requirement = $validatedData['landlord_requirement'];
        $application->lifestyle = $validatedData['lifestyle'];
        $application->application_date = $validatedData['application_date'];
        $application->status = $validatedData['status'];

        $application->save();

        return response()->json([
            'message' => 'Adoption application submitted successfully!',
            'data' => $application,
        ], 201);
    }

}
