<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAdmin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
class UserAdminController extends Controller
{
   
    // User registration
    // public function register(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:user_admins',
    //         'password' => 'required|string|min:6|confirmed',
    //     ]);

    //     if($validator->fails()){
    //         return response()->json($validator->errors()->toJson(), 400);
    //     }

    //     $user = UserAdmin::create([
    //         'name' => $request->get('name'),
    //         'email' => $request->get('email'),
    //         'password' => Hash::make($request->get('password')),
    //     ]);

    //     $token = JWTAuth::fromUser($user);

    //     return response()->json(compact('user','token'), 201);
    // }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = auth()->guard('admin')->attempt($credentials)) {
                // auditTrail('login','invalid credential');
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Get the authenticated user.
            $user = auth()->guard('admin')->user();
            $user->login_attempt +=1;
            $user->save();
            // (optional) Attach the role to the token.
            $token = JWTAuth::claims(['role' => $user->role])->fromUser($user);
            auditTrail('login','success');
            return response()->json(compact('token','user'));
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }

    // Get authenticated user
    public function getUser(Request $request)
    {
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid token'], 400);
        }

        // return response()->json(compact('user'));
        // return response()->json(JWTAuth::user()->email);
        return response()->json($request->user());
    }

    // User logout
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        auditTrail('logout','success');
        return response()->json(['message' => 'Successfully logged out']);
    }
    public function imageUpload(Request $request){
        $file = $request->file('image');
        // Validate file
        $validator = Validator::make($request->all(), [
            
            'image' => 'required|file|mimes:jpg,png'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        // return 'hi';
        $extension = $file->getClientOriginalExtension();
        $fileName = str_replace('.'.$extension, '', $file->getClientOriginalName()); //file name without extenstion
        $fileName .= '_' . md5(time()) . '.' . $extension; // a unique file name

        $path = $file->store('images');
        // $path = $disk->putFileAs('videos', $file, $fileName);
            return [
            'path' => asset('storage/' . $path),
            'filename' => $fileName
        ];
    
    }
}


