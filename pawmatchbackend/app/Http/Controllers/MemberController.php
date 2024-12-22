<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class MemberController extends Controller
{
    use HasApiTokens;

    /**
     * Register a new member and create a default profile.
     */
    public function register(Request $request)
    {
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
            if ($validator->errors()->has('email')) {
                return response()->json([
                    'errors' => 'The email has already been taken',
                ], 409); // 409  error means 
            }
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        // handle image upload
        $imagePath = null;
        if ($request->hasFile('profile_picture')) {
            $imagePath = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        // create member data
        $member = Member::create([
            'name' => $request->name,
            'state' => $request->state,
            'district' => $request->district,
            'detailed_address' => $request->detailed_address,
            'NoOfPets' => $request->NoOfPets,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => bcrypt($request->password), // password encryption
            'profile_picture' => $imagePath,
            'username' => $request->username,
            'Age' => $request->Age,
            'bio' => $request->bio,
        ]);

        // create default profile data and associate it with member
        $member->profile()->create([
            'bio' => $request->bio ?? 'Default bio', // default bio
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
        if (!Hash::check($request->password, $member->password)) {
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
}
