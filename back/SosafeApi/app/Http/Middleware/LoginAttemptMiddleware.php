<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
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
            auditTrail('login attempt exceeded','success');
            return response()->json('Access Denied, Maximum Number of login reached');
        }
        if ($user->role =='division_command' || $user->role =='zonal_command') {
            $expireTime = Carbon::now()->addSeconds(30);
            Cache::put('user-is-online' . $user->id, true,$expireTime);
            UserAdmin::where('id',$user->id)->update(['last_seen' => Carbon::now()]);
         }
        return $next($request);
    }
}
