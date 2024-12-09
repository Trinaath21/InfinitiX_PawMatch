<?php

use App\Http\Controllers\LostFoundController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {

});
Route::post('/addlost-pets', [LostFoundController::class, 'store']);
Route::post('/deleteLostReport', [LostFoundController::class, 'deleteLostReport']);
Route::post('/getAllReportsByUserID', [LostFoundController::class, 'getAllReportsByUserID']);
Route::post('/editLostReport', [LostFoundController::class, 'updateReport']);
Route::post('/getSpecificReport', [LostFoundController::class, 'getSpecificReport']);
Route::post('/getAllReports', [LostFoundController::class, 'getAllReports']);
Route::post('/notify-users', [LostFoundController::class, 'notifyUsers']);
Route::post('/notify-reportOwner', [LostFoundController::class, 'notifyReportOwner']);
Route::post('/getSpecificUser', [LostFoundController::class, 'getSpecificUser']);
Route::post('/addReplyReport', [LostFoundController::class, 'addReplyReport']);
Route::post('/getReplyReportsByReportID', [LostFoundController::class, 'getReplyReportsByReportID']);
Route::post('/approveReplyReport', [LostFoundController::class, 'approveReplyReport']);
Route::post('/rejectReplyReport', [LostFoundController::class, 'rejectReplyReport']);