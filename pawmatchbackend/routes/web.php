<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ForumPostController;
use App\Http\Controllers\CommentController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/posts', [ForumPostController::class, 'store'])->withoutMiddleware([VerifyCsrfToken::class]);
Route::get('/posts', [ForumPostController::class, 'index']);
Route::get('/posts/{post_id}', [ForumPostController::class, 'show']);
Route::post('/posts/{post_id}', [ForumPostController::class, 'update']);
Route::get('/user/posts/{user_id}', [ForumPostController::class, 'getUserPosts']);
Route::delete('/posts/{post_id}', [ForumPostController::class, 'destroy']);
Route::get('/posts/{post_id}/comments', [ForumPostController::class,'getComments']);
Route::get('posts/{post_id}/comments', [CommentController::class, 'index']);
Route::post('comments', [CommentController::class, 'store']);


