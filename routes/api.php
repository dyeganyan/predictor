<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HoroscopeController;
use App\Http\Controllers\PalmController;
use App\Http\Controllers\CoffeeController;
use App\Http\Controllers\WalletController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Services
    Route::post('/horoscope', [HoroscopeController::class, 'predict']);
    Route::post('/palm', [PalmController::class, 'predict']);
    Route::post('/coffee', [CoffeeController::class, 'predict']);

    // Wallet
    Route::get('/wallet/balance', [WalletController::class, 'getBalance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
});
