<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post("login", [AuthController::class, 'doLogin']);
Route::post("signup", [AuthController::class, 'doSignUp']);


Route::middleware('auth:api')->group( function () {
    Route::post('/send-email-verification', [AuthController::class, 'reSendVerificationEmail'])
        ->middleware('throttle:1,1');
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);

    Route::group(['middleware' => 'verified-user'], function () {
        Route::post('/get-expenses', [AuthController::class, 'getExpenses']);
    });
});
