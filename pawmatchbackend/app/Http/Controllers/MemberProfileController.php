<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Member;
use App\Models\MemberProfile;

class MemberProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     */
    public function show(Request $request)
    {
        $member = $request->user(); // get the user
        
        // if the user is not found
        if (!$member) {
            return response()->json(['message' => 'Member not found'], 404);
        }

        // fetch the profile data, if not found, return default data
        $profile = $member->profile;

        // return the profile data
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
                'username' => $member->profile->username,
                'Age' => $member->profile->Age,
                'bio' => $member->profile->bio,  

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
             //'name' => 'nullable|string|max:100',
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
            // delete the old avatar
            if ($member->profile_picture && $member->profile_picture !== 'profile-cover.jpg') {
                Storage::delete('public/' . $member->profile_picture);
            }

            // save the new avatar
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $member->profile_picture = $path;
            
            // update the avatar in the profile table
            if ($member->profile) {
                $member->profile->update([
                    'profile_picture' => $path
                ]);
            }
        }
    
        // update the member data
        $member->update($validated);

        $profile = $member->profile; 
        if ($profile) {
            $profile->fill([
                'profile_picture' => $validated['profile_picture'] ?? $profile->profile_picture,
                'state' => $member->state,
                'district' => $member->district,
                'detailed_address' => $member->detailed_address,
                'phone_number' => $member->phone_number,
                'NoOfPets' => $member->NoOfPets, 
              'username' => $request->username,
              'Age' => $request->Age,
              'bio' => $request->bio,
            ])->save();
        } else {
            MemberProfile::create([
                'member_id' => $member->id,
                'profile_picture' => $validated['profile_picture'] ?? null,
                'username' => $request->member_profiles->username,
                'Age' => $request->member_profiles->Age,
                'bio' => $request->member_profiles->bio,
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
                'username' => $member->profile->username,
                'Age' => $member->profile->Age,
                'bio' => $member->profile->bio, 


            ]
        ], 200);
    }
    
}
