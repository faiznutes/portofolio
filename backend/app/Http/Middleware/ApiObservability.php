<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ApiObservability
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->is('api/*')) {
            return $next($request);
        }

        $requestId = trim((string) $request->header('X-Request-Id'));
        if ($requestId === '') {
            $requestId = (string) Str::uuid();
        }

        $request->attributes->set('request_id', $requestId);
        $startedAt = microtime(true);

        $response = $next($request);
        $durationMs = (int) round((microtime(true) - $startedAt) * 1000);
        $status = $response->getStatusCode();

        $payload = [
            'event' => 'api.request',
            'request_id' => $requestId,
            'method' => $request->method(),
            'path' => '/'.ltrim($request->path(), '/'),
            'status' => $status,
            'duration_ms' => $durationMs,
            'user_id' => $request->user()?->id,
            'ip' => (string) $request->ip(),
        ];

        if ($status >= 500) {
            Log::error('API request completed with server error', $payload);
        } elseif ($status >= 400) {
            Log::warning('API request completed with client error', $payload);
        } else {
            Log::info('API request completed', $payload);
        }

        $response->headers->set('X-Request-Id', $requestId);

        return $response;
    }
}
