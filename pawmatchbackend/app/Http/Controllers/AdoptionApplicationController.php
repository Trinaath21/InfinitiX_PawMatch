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
