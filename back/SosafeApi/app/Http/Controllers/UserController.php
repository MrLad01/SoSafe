<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\UserAdmin;
use App\Models\AuditTrail;
use Illuminate\Support\Facades\Cache;
class UserController extends Controller
{
    public function ResetLoginAttempt(){
        $users = UserAdmin::query();
        
        $users->update([
            'login_attempt' => 0
        ]);

        return response()->json('Login Attempt reset successful');
    }

    public function addAdmin(Request $request){
        
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'area' => 'required|integer|max:255',
            'email' => 'required|string|email|max:255|unique:user_admins',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
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

    public function getAdmins(){
        $admins = UserAdmin::all();
        // $status= $admins->UserOnline();
        return response()->json($admins, 200,);
    }

    public function editAdmin(Request $request){
        $data = $this->validate($request);
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'area' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:user_admins',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $user = UserAdmin::whereId($request->id)->update([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'role' => $request->get('role'),
            'area' => $request->get('area'),
        ]);

        return response()->json('Record created successfully', 201);

    }

    public function auditTrail(){
        $trails = AuditTrail::all();
        // $status= $admins->UserOnline();
        return response()->json($trails, 200,);

    }

    }
