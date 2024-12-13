<?php

use App\Http\Controllers\LostFoundController;
use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AdoptionPostController;
use App\Http\Controllers\AdoptionApplicationController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\StrayReportController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\MemberProfileController;
use App\Http\Controllers\ShelterProfileController;
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


Route::post('/posts', [ForumPostController::class, 'store'])->withoutMiddleware([VerifyCsrfToken::class]);
Route::get('/posts', [ForumPostController::class, 'index']);
Route::get('/posts/{post_id}', [ForumPostController::class, 'show']);
Route::post('/posts/{post_id}', [ForumPostController::class, 'update']);
Route::get('/user/posts/{user_id}', [ForumPostController::class, 'getUserPosts']);
Route::delete('/posts/{post_id}', [ForumPostController::class, 'destroy']);
Route::get('/posts/{post_id}/comments', [ForumPostController::class,'getComments']);
Route::get('posts/{post_id}/comments', [CommentController::class, 'index']);
Route::post('comments', [CommentController::class, 'store']);

//donation module 
Route::post('/donations', [DonationController::class, 'store']);
Route::get('/donations/{shelter_id}', [DonationController::class, 'show']);
Route::post('/donations/{shelter_id}', [DonationController::class, 'update']);
Route::get('/shelter', [DonationController::class, 'fetchShelters']);
Route::get('/shelter/{shelter_id}/donations', [DonationController::class, 'fetchShelterDonations']);
    
//stray module
Route::post('/add-stray-report', [StrayReportController::class, 'store']);
Route::post('/getAllStrayReports', [StrayReportController::class, 'getAllStrayReports']);
Route::post('/deleteStrayReport', [StrayReportController::class, 'deleteStrayReport']);
Route::post('/getAllStrayReportsByUserID', [StrayReportController::class, 'getAllStrayReportsByUserID']);
Route::post('/editStrayReport', [StrayReportController::class, 'updateStrayReport']);
Route::post('/getSpecificStrayReport', [StrayReportController::class, 'getSpecificStrayReport']);

//adoption module
Route::post('/add-adoption-posts', [AdoptionPostController::class, 'store']);
Route::get('/adoption-posts/{adoption_post_id}', [AdoptionPostController::class, 'show']);
Route::post('/adoption-posts/{adoption_post_id}', [AdoptionPostController::class, 'update']);
Route::get('/adoption-posts', [AdoptionPostController::class, 'getPostsByUser']);
Route::get('/get-public-adoption-posts', [AdoptionPostController::class, 'getPostsByUserPublic']);
Route::get('/get-posts-and-applications', [AdoptionPostController::class, 'getPostsAndApplications']);
Route::post('/getSpecificPost', [AdoptionPostController::class, 'viewMore']);
Route::post('/deleteAdoptionPost', [AdoptionPostController::class, 'deleteAdoptionPost']);
Route::get('/member-address', [AdoptionApplicationController::class, 'getAddressByUserId']);
Route::post('/apply-adoption', [AdoptionApplicationController::class, 'store']);

//login register module
Route::post('/member/register', [MemberController::class, 'register']);
Route::post('/shelter/register', [ShelterController::class, 'shelterregister']);
Route::post('/member/login', [MemberController::class, 'login']);
Route::post('/shelter/login', [ShelterController::class, 'shelterlogin']);

//Profile module
Route::middleware('auth:sanctum')->group(function () {
    Route::get('show', [MemberProfileController::class, 'show']);
    Route::put('updateProfile', [MemberProfileController::class, 'updateProfile']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('showShelterProfile', [ShelterProfileController::class, 'showShelterProfile']);
    Route::put('updateShelterProfile', [ShelterProfileController::class, 'updateShelterProfile']);
});

