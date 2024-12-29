<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdoptionApplication;
use App\Models\Member;
use App\Models\PetAdoptionPost;
use Illuminate\Support\Facades\Mail;

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
        $member = Member::select('name', 'phone_number', 'NoOfPets', 'detailed_address', 'district', 'state')
            ->where('user_id', $id)
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
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'phone_number' => 'required|string|max:20',
            'NoOfPets' => 'required|integer|min:0',
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
        $application->applicant_name = $validatedData['name'];
        $application->applicant_age = $validatedData['age'];
        $application->phone_number = $validatedData['phone_number'];
        $application->current_pets_count = $validatedData['NoOfPets'];
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

    public function acceptApplication(Request $request)
    {
        $applicationId = $request->input('application_id');
        $adoptionPostId = $request->input('adoption_post_id');

        try {
            // Accept the selected application
            $acceptedApplication = AdoptionApplication::where('application_id', $applicationId)
                ->where('adoption_post_id', $adoptionPostId)
                ->first();

            if (!$acceptedApplication) {
                return response()->json(['error' => 'Application not found'], 404);
            }

            $acceptedApplication->status = 'approved';
            $acceptedApplication->save();

            // Update the status of the adoption post to "adopted"
            $adoptionPost = PetAdoptionPost::where('adoption_post_id', $adoptionPostId)->first();
            if ($adoptionPost) {
                $adoptionPost->status = 'adopted';
                $adoptionPost->save();
            }

            // Fetch the pet name
            $petName = $adoptionPost ? $adoptionPost->name : 'the pet';

            // Notify the accepted applicant
            $acceptedMemberEmail = Member::where('user_id', $acceptedApplication->user_id)->value('email');
            if ($acceptedMemberEmail) {
                Mail::send('application_status', [
                    'status' => 'accepted',
                    'petName' => $petName,
                ], function ($message) use ($acceptedMemberEmail) {
                    $message->to($acceptedMemberEmail)
                        ->subject('Adoption Application Status');
                });
            }

            // Reject all other applications for the same adoption post and notify them
            $rejectedApplications = AdoptionApplication::where('adoption_post_id', $adoptionPostId)
                ->where('application_id', '!=', $applicationId)
                ->where('status', 'pending')
                ->get();

            foreach ($rejectedApplications as $rejectedApplication) {
                // Update status to "rejected"
                $rejectedApplication->status = 'rejected';
                $rejectedApplication->save();

                // Notify the rejected applicant
                $rejectedMemberEmail = Member::where('user_id', $rejectedApplication->user_id)->value('email');
                if ($rejectedMemberEmail) {
                    Mail::send('application_status', [
                        'status' => 'rejected',
                        'petName' => $petName,
                    ], function ($message) use ($rejectedMemberEmail) {
                        $message->to($rejectedMemberEmail)
                            ->subject('Adoption Application Status');
                    });
                }
            }

            return response()->json([
                'message' => 'Application accepted, post marked as adopted, and other applications rejected with notifications sent.',
                'accepted_application' => $acceptedApplication,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process the application', 'details' => $e->getMessage()], 500);
        }
    }


    public function rejectApplication(Request $request)
    {
        $applicationId = $request->input('application_id');
        $adoptionPostId = $request->input('adoption_post_id');

        try {
            // Find the specific application
            $application = AdoptionApplication::where('application_id', $applicationId)
                ->where('adoption_post_id', $adoptionPostId)
                ->first();

            if (!$application) {
                return response()->json(['error' => 'Application not found'], 404);
            }

            // Update the status to "rejected"
            $application->status = 'rejected';
            $application->save();

            // Fetch member email and pet name
            $memberEmail = Member::where('user_id', $application->user_id)->value('email');
            $petName = PetAdoptionPost::where('adoption_post_id', $adoptionPostId)->value('name');

            // Send rejection email
            if ($memberEmail) {
                Mail::send('application_status', [
                    'status' => 'rejected',
                    'petName' => $petName,
                ], function ($message) use ($memberEmail) {
                    $message->to($memberEmail)
                        ->subject('Adoption Application Status');
                });
            }

            return response()->json([
                'message' => 'Application rejected successfully.',
                'rejected_application' => $application,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to reject the application', 'details' => $e->getMessage()], 500);
        }
    }

}
