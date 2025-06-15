<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\HistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
});
Route::apiResource('/equipments', EquipmentController::class);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('equipments/{equipmentId}/history')->group(function () {
    Route::get('/', [HistoryController::class, 'index']);
    Route::post('/', [HistoryController::class, 'store']);
});

Route::prefix('history')->group(function () {
    Route::get('{id}', [HistoryController::class, 'show']);
    Route::put('{id}', [HistoryController::class, 'update']);
    Route::delete('{id}', [HistoryController::class, 'destroy']);
});

Route::get('/report/equipments-with-history', [EquipmentController::class, 'exportWithHistories']);