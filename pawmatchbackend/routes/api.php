<?php

use App\Http\Controllers\LostFoundController;
use App\Http\Controllers\AdoptionPostController;
use App\Http\Controllers\AdoptionApplicationController;
use App\Http\Controllers\DonationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {

});

//lost-found
Route::post('/addlost-pets', [LostFoundController::class, 'store']);
Route::post('/deleteLostReport', [LostFoundController::class, 'deleteLostReport']);
Route::post('/getAllReportsByUserID', [LostFoundController::class, 'getAllReportsByUserID']);
Route::post('/editLostReport', [LostFoundController::class, 'updateReport']);
Route::post('/getSpecificReport', [LostFoundController::class, 'getSpecificReport']);
Route::post('/getAllReports', [LostFoundController::class, 'getAllReports']);

//adoption
Route::post('/adoption-posts', [AdoptionPostController::class, 'store']);
Route::get('/adoption-posts/{id}', [AdoptionPostController::class, 'show']);
Route::post('/adoption-posts/{id}', [AdoptionPostController::class, 'update']);
Route::get('/adoption-posts', [AdoptionPostController::class, 'getPostsByUser']);
Route::post('/deleteAdoptionPost', [AdoptionPostController::class, 'deleteAdoptionPost']);
Route::post('/apply-adoption', [AdoptionApplicationController::class, 'store']);

//donation
Route::post('/donations', [DonationController::class, 'store']);
Route::get('/donations/{shelter_id}', [DonationController::class, 'show']);
Route::post('/donations/{shelter_id}', [DonationController::class, 'update']);
Route::get('/shelter', [DonationController::class, 'fetchShelters']);
Route::get('/shelter/{shelter_id}/donations', [DonationController::class, 'fetchShelterDonations']);

//
