<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShelterProfile;
use App\Models\Shelter;
use Illuminate\Support\Facades\Storage;

class ShelterProfileController extends Controller
{
    // 查看 Shelter Profile
    public function showShelterProfile(Request $request)
    {
        $shelter = $request->user(); 

        if (!$shelter) {
            return response()->json(['message' => 'Shelter not found'], 404);
        }

        $profile = $shelter->profile; // 获取 shelter 关联的 profile

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
                //新加入
                 'representative_name' => $shelter->profile->representative_name,
                 'username' => $shelter->profile->username,
                 'contact_number' => $shelter->profile->contact_number,
              //
            ]
        ], 200);
    }


    // 更新 Shelter Profile
    public function updateShelterProfile(Request $request)
    {
        $shelter = $request->user(); // 获取当前认证用户

        if (!$shelter) {
            return response()->json(['message' => 'Shelter not found'], 404);
        }

        // 验证请求数据
        
        $validated = $request->validate([
            //'shelter_name' => 'required|string|max:255',
            //'email' => 'required|email|unique:shelters,email,' . $shelter->id,
            'state' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'detailed_address' => 'required|string|max:255',
            'NoOfPets' => 'required|integer',
            'phone_number' => 'required|string|max:15',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'website_url' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',

          'representative_name' => 'nullable|string|max:255',
          'username' => 'nullable|string|max:255',
          'contact_number' => 'nullable|string|max:15',
        ]);
        
        if ($request->hasFile('profile_picture')) {
      
            if ($shelter->profile_picture) {
                Storage::delete('public/' . $shelter->profile_picture);
            }
   
            $validated['profile_picture'] = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $shelter->update($validated);

        $profile = $shelter->profile; 
        if ($profile) {
            $profile->update([
                'profile_picture' => $validated['profile_picture'] ?? $profile->profile_picture,
                'website_url' => $shelter->website_url,
                'description' => $shelter->description,
                'state' => $shelter->state,
                'district' => $shelter->district,
                'detailed_address' => $shelter->detailed_address,
                'phone_number' => $shelter->phone_number,
                'NoOfPets' => $shelter->NoOfPets, 
              'representative_name' => $request->representative_name,
              'username' => $request->username,
              'contact_number' => $request->contact_number,
            ]);
        } else {
            ShelterProfile::create([
                'shelter_id' => $shelter->id,
                'profile_picture' => $validated['profile_picture'] ?? null,
                'website_url' => $request->website_url,
                'description' => $request->description,
                'representative_name' => $request->shelter_profiles->representative_name, 
                'username' => $request->shelter_profiles->username,
                'contact_number' => $request->shelter_profiles->contact_number,
            ]);
        }

        return response()->json([
            'message' => 'Shelter profile updated successfully',
            'data' => $shelter,
        
        ], 200);
    }
}




