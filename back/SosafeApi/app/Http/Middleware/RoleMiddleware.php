<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Cache;
// use Carbon\Carbon;
use App\Models\UserAdmin;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,$role): Response
    {
        $user = auth()->guard('admin')->user() ? auth()->guard('admin')->user() : Auth::user() ;
        if($user->role !==$role  ){
            $role = $user->role;
            return response()->json($role."  Not Allowed");
        }
       
        return $next($request);
        // return $next($request);
    }
}
