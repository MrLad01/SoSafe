<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Authenticate using the 'admin' guard so RoleMiddleware
            // can retrieve the same user via auth()->guard('admin')
            $user = auth()->guard('admin')->user();

            if (!$user) {
                // Guard didn't resolve — try parsing the JWT manually
                $user = JWTAuth::parseToken()->authenticate();

                if (!$user) {
                    return response()->json(['error' => 'User not found'], 401);
                }

                // Explicitly set the user on the admin guard
                auth()->guard('admin')->setUser($user);
            }

        } catch (JWTException $e) {
            return response()->json(['error' => 'Token not valid: ' . $e->getMessage()], 401);
        }

        return $next($request);
    }
}