<?php

namespace App\Http\Controllers;

use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Password;
class ShelterController extends Controller
{
    use HasApiTokens;

    public function shelterregister(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'shelter_name' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'detailed_address' => 'required|string|max:255',
            'NoOfPets' => 'required|integer',
            'phone_number' => 'required|string|max:15',
            'email' => 'required|email|unique:shelter,email',
            'password' => 'required|string|min:6',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            //'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'website_url' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
          //  'representative_name' => 'nullable|string|max:255',
          //  'username' => 'nullable|string|max:255',
          //  'contact_number' => 'nullable|string|max:15',
        ]);

        if ($validator->fails()) {
            if ($validator->errors()->has('email')) {
                return response()->json([
                    'errors' => 'The email has already been taken',
                ], 409);
            }
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        $imagePath = null;
        if ($request->hasFile('profile_picture')) {
            $imagePath = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        $shelter = Shelter::create([
            'shelter_name' => $request->shelter_name,
            'state' => $request->state,
            'district' => $request->district,
            'detailed_address' => $request->detailed_address,
            'NoOfPets' => $request->NoOfPets,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'profile_picture' => $imagePath,
            'website_url' => $request->website_url,
            'description' => $request->description,
            'representative_name' => $request->representative_name,
            'username' => $request->username,
            'contact_number' => $request->contact_number,
        ]);
        $shelter->profile()->create([
             'representative_name' => $request->representative_name,
              'username' => $request->username,
              'contact_number' => $request->contact_number,
        
        ]);

        return response()->json([
            'message' => 'Shelter registered successfully!',
            'data' => $shelter,
        ], 201);
    }


    public function shelterlogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        $shelter = Shelter::with('profile') // load associated ShelterProfile data
        ->where('email', $request->email)
        ->first();

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $shelter = Shelter::where('email', $request->email)->first();
        if (!$shelter) {
            return response()->json(['message' => 'Shelter not found'], 404);
        }
        if (!Hash::check($request->password, $shelter->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $shelter->createToken('ShelterLoginToken')->plainTextToken;

        return response()->json([
            'message' => 'Shelter login successful',
            'data' => [
            'shelter_id' => $shelter->shelter_id,  // add shelter_id
            'shelter_name' => $shelter->shelter_name,
            'email' => $shelter->email,
            'token' => $token,
        ],
        ], 200);
    }
}
