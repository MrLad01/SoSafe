<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\UserAdmin;
class UserController extends Controller
{
    public function ResetLoginAttempt(){
        $users = UserAdmin::query();
        
        $users->update([
            'login_attempt' => 0
        ]);

        return response()->json('Login Attempt reset successful');
    }

    public function createAdmin(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:user_admins',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = UserAdmin::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'role' => $request->get('role'),
            'area' => $request->get('area'),
            'password' => Hash::make($request->get('password')),
        ]);

        
        return response()->json('Record created successfully', 201);

    }
}
