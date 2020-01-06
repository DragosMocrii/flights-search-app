<?php

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

// Authenticate user by email/password and return access token
Route::get( '/auth', 'API\AuthController@show' );
// Create new user
Route::post( '/users', 'API\UserController@store' );

Route::middleware( [ 'auth:api' ] )->group( function () {
    Route::get( '/airports', 'API\AirportController@index' );
    Route::get( '/airlines', 'API\AirlineController@index' );
    Route::apiResource( 'trips', 'API\TripController' )->except( [ 'update' ] );

    Route::get( '/search/{hash_id}', 'API\SearchController@show' );
    Route::post( '/search', 'API\SearchController@store' );
} );
