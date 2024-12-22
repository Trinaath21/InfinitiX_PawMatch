<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MemberProfile;
use Illuminate\Support\Facades\Storage;

class MemberProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     */
    public function show(Request $request)
    {
        $member = $request->user(); // Get the user
        
        if (!$member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        // Fetch profile data
        $profile = $member->profile;

        // Return the profile data
        return response()->json([
            'profile' => [
                'name' => $member->name,
                'email' => $member->email,
                'phone_number' => $member->phone_number,
                'state' => $member->state,
                'district' => $member->district,
                'detailed_address' => $member->detailed_address,
                'NoOfPets' => $member->NoOfPets,
                'profile_picture' => $member->profile_picture, 
                'username' => $member->profile->username ?? null,
                'Age' => $member->profile->Age ?? null,
                'bio' => $member->profile->bio ?? null,
            ]
        ], 200);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $member = $request->user(); 
      
        
        if (!$member) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:100',
            'username' => 'nullable|string|max:255',
            'Age' => 'nullable|integer',
            'bio' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
            'state' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'detailed_address' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:15',
            'NoOfPets' => 'nullable|integer|min:0'
        ]);

     
        if ($request->hasFile('profile_picture')) {
        
            if ($member->profile_picture) {
                Storage::delete('public/' . $member->profile_picture);
            }

            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        // Update member data
        $member->update($validated);

        // Update profile data
        $profile = $member->profile;
        if ($profile) {
            $profile->update([
                'profile_picture' => $member->profile_picture,
                'state' => $member->state,
                'district' => $member->district,
                'detailed_address' => $member->detailed_address,
                'phone_number' => $member->phone_number,
                'NoOfPets' => $member->NoOfPets,
                'username' => $request->username,
                'Age' => $request->Age,
                'bio' => $request->bio,
            ]);
        } else {
            // Create new profile if it doesn't exist
            MemberProfile::create([
                'member_id' => $member->id,
                'profile_picture' => $validated['profile_picture'] ?? null,
                'username' => $request->username,
                'Age' => $request->Age,
                'bio' => $request->bio,
            ]);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => [
                'name' => $member->name,
                'email' => $member->email,
                'phone_number' => $member->phone_number,
                'state' => $member->state,
                'district' => $member->district,
                'detailed_address' => $member->detailed_address,
                'NoOfPets' => $member->NoOfPets,
                'profile_picture' => $member->profile_picture,
                'username' => $member->profile->username ?? null,
                'Age' => $member->profile->Age ?? null,
                'bio' => $member->profile->bio ?? null,
            ]
        ], 200);
    }
}
