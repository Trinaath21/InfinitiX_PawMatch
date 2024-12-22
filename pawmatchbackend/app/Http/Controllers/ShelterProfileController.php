<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShelterProfile;
use App\Models\Shelter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ShelterProfileController extends Controller
{
    // check Shelter Profile
    public function showShelterProfile(Request $request)
    {
        $shelter = $request->user(); 

        if (!$shelter) {
            return response()->json(['message' => 'Shelter not found'], 404);
        }

        $profile = $shelter->profile; 

        return response()->json([
            'profile' => [
                'shelter_name' => $shelter->shelter_name,
                'email' => $shelter->email,
                'phone_number' => $shelter->phone_number,
                'state' => $shelter->state,
                'district' => $shelter->district,
                'detailed_address' => $shelter->detailed_address,
                'NoOfPets' => $shelter->NoOfPets,
                'profile_picture' => $shelter->profile_picture, 
                'website_url' => $shelter->website_url,
                'description' => $shelter->description,
 
                 'representative_name' => $shelter->profile->representative_name,
                 'username' => $shelter->profile->username,
                 'contact_number' => $shelter->profile->contact_number,
              //
            ]
        ], 200);
    }


    // update Shelter Profile
    public function updateShelterProfile(Request $request)
    {
        $shelter = $request->user();

        if (!$shelter) {
            return response()->json(['message' => 'Shelter not found'], 404);
        }

        $validated = $request->validate([
            'shelter_name' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'detailed_address' => 'nullable|string|max:255',
            'NoOfPets' => 'nullable|integer',
            'phone_number' => 'nullable|string|max:15',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'website_url' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'representative_name' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:15',
        ]);

        // handle with image upload
        if ($request->hasFile('profile_picture')) {
            if ($shelter->profile_picture) {
                Storage::delete('public/' . $shelter->profile_picture);
            }
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }
// update profile data
        $shelter->update($validated);

        // update profile data
        if ($shelter->profile) {
            $shelter->profile->update([
                'representative_name' => $request->representative_name,
                'username' => $request->username,
                'contact_number' => $request->contact_number,
            ]);
        }

        return response()->json([
            'message' => 'Shelter profile updated successfully',
            'data' => $shelter->load('profile'),
        ], 200);
    }

}
