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
    public function handle(Request $request, Closure $next, ...$roles): Response
    {

        $guard = $request->attributes->get('jwt_guard', 'api');

        $user = auth()->guard('admin')->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        if ($user->role === 'superadmin') {
            return $next($request);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json([
                'error' => 'Access denied. Required role: ' . implode(' or ', $roles)
            ], 403);
        }

        return $next($request);
    }
}