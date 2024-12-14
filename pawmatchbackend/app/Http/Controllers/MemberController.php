<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 400);
        }

        $imagePath = null;
        if ($request->hasFile('profile_picture') && $request->file('profile_picture')->isValid()) {
            $image = $request->file('profile_picture');
            $imagePath = $image->store('profile_pictures', 'public');
        }

        // 创建用户
        $member = Member::create([
            'name' => $request->name,
            'state' => $request->state,
            'district' => $request->district,
            'detailed_address' => $request->detailed_address,
            'NoOfPets' => $request->NoOfPets,
            'phone_number' => $request->phone_number,
            'email' => $request->email,
            'password' => $request->password,
            'profile_picture' => $request->profile_picture
        ]);

        // 创建默认的 profile 数据
        $member->profile()->create([
            'bio' => 'Default bio', // 默认的 bio
            'dob' => '1900-01-01',   // 默认的出生日期
            // 可以添加其他默认字段
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

        // 获取 Member 数据
        $member = Member::where('email', $request->email)->first();

        if (!$member) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // 验证密码
        if ($request->password !== $member->password) {
            return response()->json(['message' => 'Invalid password'], 401);
        }
        

        // 创建登录 token
        $token = $member->createToken('login-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'data' => [
                'user_id' => $member->id,  // 添加 member_id
                'member_name' => $member->name,
                'email' => $member->email,
                'token' => $token,
            ],
        ], 200);
    }
}
