<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureAdmin::class,
            'api-observability' => \App\Http\Middleware\ApiObservability::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $requestId = (string) ($request->attributes->get('request_id') ?: $request->header('X-Request-Id'));

            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'validation_failed',
                    'message' => 'Validation failed.',
                    'errors' => $e->errors(),
                    'request_id' => $requestId,
                ], 422)->header('X-Request-Id', $requestId);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'unauthenticated',
                    'message' => 'Unauthenticated.',
                    'request_id' => $requestId,
                ], 401)->header('X-Request-Id', $requestId);
            }

            if ($e instanceof AuthorizationException) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'forbidden',
                    'message' => 'Forbidden.',
                    'request_id' => $requestId,
                ], 403)->header('X-Request-Id', $requestId);
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'resource_not_found',
                    'message' => 'Resource not found.',
                    'request_id' => $requestId,
                ], 404)->header('X-Request-Id', $requestId);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'success' => false,
                    'error_code' => 'method_not_allowed',
                    'message' => 'Method not allowed.',
                    'request_id' => $requestId,
                ], 405)->header('X-Request-Id', $requestId);
            }

            $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;

            return response()->json([
                'success' => false,
                'error_code' => $status >= 500 ? 'internal_error' : 'http_error',
                'message' => $status >= 500 ? 'Internal server error.' : $e->getMessage(),
                'request_id' => $requestId,
            ], $status)->header('X-Request-Id', $requestId);
        });
    })->create();
