<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\CvItemController;
use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\HighlightController;
use App\Http\Controllers\Api\Admin\LeadController;
use App\Http\Controllers\Api\Admin\ServiceController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\TagController;
use App\Http\Controllers\Api\Admin\TestimonialController;
use App\Http\Controllers\Api\Admin\WorkController;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\PublicLeadController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->middleware('throttle:auth-api')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::prefix('public')->middleware('throttle:public-api')->group(function (): void {
    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'message' => 'API is healthy.',
            'data' => [
                'service' => config('app.name'),
                'env' => config('app.env'),
                'timestamp' => now()->toISOString(),
            ],
        ]);
    });
    Route::get('/works', [PublicContentController::class, 'works']);
    Route::get('/works/{slug}', [PublicContentController::class, 'workDetail']);
    Route::get('/categories', [PublicContentController::class, 'categories']);
    Route::get('/tags', [PublicContentController::class, 'tags']);
    Route::get('/settings', [PublicContentController::class, 'settings']);
    Route::get('/services', [PublicContentController::class, 'services']);
    Route::get('/testimonials', [PublicContentController::class, 'testimonials']);
    Route::get('/cv-items', [PublicContentController::class, 'cvItems']);
    Route::get('/highlights', [PublicContentController::class, 'highlights']);
    Route::get('/banners', [PublicContentController::class, 'banners']);
    Route::post('/leads', [PublicLeadController::class, 'store']);
});

Route::prefix('admin')->middleware(['auth:sanctum', 'admin', 'throttle:admin-api'])->group(function (): void {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('works', WorkController::class);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('testimonials', TestimonialController::class);
    Route::apiResource('cv-items', CvItemController::class);
    Route::apiResource('highlights', HighlightController::class);
    Route::apiResource('banners', BannerController::class);
    Route::apiResource('leads', LeadController::class)->except(['store']);
    Route::apiResource('settings', SettingController::class);
});
