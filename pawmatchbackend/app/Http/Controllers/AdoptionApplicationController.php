<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AdoptionApplication;

class AdoptionApplicationController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'applicant_name' => 'required|string|max:255',
            'applicant_age' => 'required|integer|min:0',
            'phone_number' => 'required|string|max:20',
            'current_pets_count' => 'required|integer|min:0',
            'address' => 'required|string',
            'previous_pet_experience' => 'required|string',
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
        $application->address = $validatedData['address'];
        $application->previous_pet_experience = $validatedData['previous_pet_experience'];
        $application->application_date = $validatedData['application_date'];
        $application->status = $validatedData['status'];

        $application->save();

        return response()->json([
            'message' => 'Adoption application submitted successfully!',
            'data' => $application,
        ], 201);
    }
}
