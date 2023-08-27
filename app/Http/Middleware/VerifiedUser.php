<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifiedUser
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->user()->email_verified_at) {
            return \response()->json([
                'message' => "You are not authorised for this action",
                'redirect' => 'otp'
            ], 419);
        }
        return $next($request);
    }
}
