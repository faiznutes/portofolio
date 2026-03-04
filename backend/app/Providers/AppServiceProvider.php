<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth-login', function (Request $request) {
            $email = (string) $request->input('email', '');
            $identifier = mb_strtolower(trim($email)).'|'.$request->ip();

            return [
                Limit::perMinute(8)->by($identifier),
                Limit::perMinute(20)->by($request->ip()),
            ];
        });

        RateLimiter::for('auth-user', function (Request $request) {
            $identifier = $request->user()?->id ? 'user:'.$request->user()->id : $request->ip();

            return [
                Limit::perMinute(60)->by($identifier),
            ];
        });

        RateLimiter::for('public-api', function (Request $request) {
            return [
                Limit::perMinute(120)->by($request->ip()),
            ];
        });

        RateLimiter::for('lead-submit', function (Request $request) {
            $email = mb_strtolower(trim((string) $request->input('email', '')));
            $identifier = ($email !== '' ? $email : 'anonymous').'|'.$request->ip();

            return [
                Limit::perMinute(6)->by($identifier),
                Limit::perMinute(15)->by($request->ip()),
            ];
        });

        RateLimiter::for('admin-api', function (Request $request) {
            $identifier = $request->user()?->id ? 'user:'.$request->user()->id : $request->ip();

            return [
                Limit::perMinute(240)->by($identifier),
            ];
        });
    }
}
