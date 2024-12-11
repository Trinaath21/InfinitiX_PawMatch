<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MemberProfileController extends Controller
{
    /**
     * Show the authenticated user's profile.
     */
    public function show(Request $request)
    {
        $member = $request->user(); // 获取当前认证用户
        
        // 如果没有找到用户
        if (!$member) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // 获取用户的 profile 数据，若没有则返回默认数据
        $profile = $member->profile;

        // 返回用户资料
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

        $profile = $member->profile ?? $member->profile()->create([]);

        $validated = $request->validate([
             'name' => 'nullable|string|max:100',
             'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
             'state' => 'nullable|string|max:100',
             'district' => 'nullable|string|max:100',
             'detailed_address' => 'nullable|string|max:255',
             'phone_number' => 'nullable|string|max:15',
             'NoOfPets' => 'nullable|integer|min:0'
        ]);

      
        $member->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $profile,
        ], 200);
    }
}
