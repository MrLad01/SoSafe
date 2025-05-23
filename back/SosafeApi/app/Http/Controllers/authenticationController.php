<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ZA_command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;

class authenticationController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth.jwt', ['except' => ['login', 'registration','check']]);
    // }
    // User registration
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'role'=>'admin',
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user','token'), 201);
    }

    // User login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Get the authenticated user.
            $user = auth()->user();
            
            // (optional) Attach the role to the token.
            // $token = JWTAuth::claims(['role' => $user->role])->fromUser($user);
            auditTrail('admin login','success');
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

        return response()->json(['message' => 'Successfully logged out']);
    }
    public function check(){
        if(User::count()<1){
            return response()->json(True,200);
        }else{
            return response()->json(FALSE,403);
        }
    }
    public function upload(Request $request){
        $file = $request->file('data');
			$fileContents = file_get_contents($file->path());
			$lines = explode("\n", $fileContents);
			$lines = array_filter($lines);
	
			foreach($lines as $line){
				$details = new ZA_command();
				$details->name = $line;
				$details->save();
			}
            return response()->json($request->path(), 200);
    }

}
