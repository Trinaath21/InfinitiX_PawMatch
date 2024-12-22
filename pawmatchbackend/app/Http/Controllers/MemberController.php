<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class MemberController extends Controller
{
    use HasApiTokens;

    /**
     * Register a new member and create a default profile.
     */
    public function register(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'detailed_address' => 'required|string|max:255',
            'NoOfPets' => 'required|integer',
            'phone_number' => 'required|string|max:15',
            'email' => 'required|email|unique:member,email',
            'password' => 'required|string|min:6',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'username' => 'nullable|string|max:255',
            'Age' => 'nullable|integer',
            'bio' => 'nullable|string|max:255',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }
    
        // Handle image upload if it exists
        $imagePath = null;
        if ($request->hasFile('profile_picture')) {
            try {
                // Custom file name based on user's name
                $imageName = preg_replace('/\s+/', '_', strtolower($request->name)) . '_profile_picture.' . $request->file('profile_picture')->getClientOriginalExtension();
    
                // Store image in 'images' folder within public storage
                $imagePath = $request->file('profile_picture')->storeAs('images', $imageName, 'public');
                Storage::url($imagePath);
                // Log the path to verify if it's being stored correctly
                Log::info("Image stored at: " . $imagePath);
            } catch (\Exception $e) {
                Log::error("Error uploading image: " . $e->getMessage());
                return response()->json(['error' => 'Image upload failed'], 500);
            }
        }
    
        // Create member data
        $member = Member::create([
            'name' => $request->name,
            'state' => $request->state,
            'district' => $request->district,
            'detailed_address' => $request->detailed_address,
            'NoOfPets' => $request->NoOfPets,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => $request->password, // Ensure password is encrypted
            'profile_picture' => $imagePath ? Storage::url($imagePath) : null, // Use the URL of the image if it exists
            'username' => $request->username,
        ]);
    
        // Create profile data
        $member->profile()->create([
            'bio' => $request->bio ?? 'Default bio', // Default bio if not provided
            'username' => $request->username,
            'Age' => $request->Age,
        ]);
    
        return response()->json([
            'message' => 'Member registered successfully!',
            'data' => $member,
        ], 201);
    }
    
    

    /**
     * Member Login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // find member by email and load associated profile data
        $member = Member::with('profile') // load associated MemberProfile data
            ->where('email', $request->email)
            ->first();

        if (!$member) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // validate password
        if ($request->password !== $member->password) {
            return response()->json(['message' => 'Invalid password'], 401);
        }

        // create login token
        $token = $member->createToken('login-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'data' => [
                'user_id' => $member->user_id,  // return member's user_id
                'member_name' => $member->name,
                'email' => $member->email,
                'token' => $token,
            ],
        ], 200);
    }
    public function changeMemberPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|different:current_password',
            'confirm_password' => 'required|same:new_password'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 400);
        }

        $member = Member::find(auth('sanctum')->user()->user_id);

        if (!Hash::check($request->current_password, $member->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 401);
        }

        $member->password = Hash::make($request->new_password);
        $member->save();

        return response()->json([
            'message' => 'Password changed successfully'
        ], 200);
    }
}
