<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserAdmin;

class LoginAttemptMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $email = $request->email;
        $user = UserAdmin::where('email',$email)->firstOrFail();
        if($user->login_attempt >=2  ){
            
            return response()->json('Access Denied, Maximum Number of login reached');
        }
        return $next($request);
    }
}
