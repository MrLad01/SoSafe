<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BiodataController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\authenticationController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\MissingWantedController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ZonalCommandController;
use App\Http\Controllers\AdminZonalCommandController;
use App\Http\Controllers\AdminDivisionCommandController;
use App\Http\Controllers\DivisionCommandController;
use App\Http\Controllers\SoSafeCorpsBiodataController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\NewBiodataController;



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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('register', [authenticationController::class, 'register']);
Route::post('login', [authenticationController::class, 'login']);
// Route::get('user', [authenticationController::class, 'getUser']);
Route::get('Missing', [MissingWantedController::class, 'getMissing']);
Route::get('Hero', [HeroController::class, 'getHero']);
Route::get('division', [DivisionCommandController::class, 'getDivision']);
Route::get('Zonal_command', [ZonalCommandController::class, 'getZonalCommands']);
Route::get('community', [CommunityController::class, 'getCommunities']);
Route::get('news', [NewsController::class, 'getNews']);


Route::post('/get',[BiodataController::class, 'record']);
Route::middleware([JwtMiddleware::class,'role:admin'])->group(function () {
    
    Route::post('/import',[ExcelController::class, 'import'])->withoutMiddleware([JwtMiddleware::class,'role:admin']);
    Route::post('/new/data',[NewBiodataController::class, 'storeBiodata'])->withoutMiddleware([JwtMiddleware::class,'role:admin']);;

    Route::get('/check/{name?}',[ExcelController::class, 'check'])->withoutMiddleware([JwtMiddleware::class]);

    Route::get('raw/data',[BiodataController::class, 'getdata'])->withoutMiddleware([JwtMiddleware::class,'role:admin']);
    Route::get('user', [authenticationController::class, 'getUser']);
    Route::post('logout', [authenticationController::class, 'logout']);
    // news controller
    Route::post('news', [NewsController::class, 'storeNews']);
    Route::put('news/{id}', [NewsController::class, 'editNews']);
    Route::delete('news/{id}',[NewsController::class,'deleteNews']);
    
    // missing/wanted controller
    Route::post('missing', [MissingWantedController::class, 'storeNews']);
    Route::put('Missing/{id}', [MissingWantedController::class, 'editMissing']);
    Route::delete('Missing/{id}',[MissingWantedController::class,'deleteMissing']);
    
    // hero controller
    Route::post('hero', [HeroController::class, 'storeNews']);
    Route::put('Hero/{id}', [HeroController::class, 'editHero']);
    Route::delete('Hero/{id}',[HeroController::class,'deleteHero']);
    
    //community controller
    
    Route::post('community', [CommunityController::class, 'storeCommunity']);
    Route::put('community/{id}', [CommunityController::class, 'editCommunity']);
    Route::delete('community/{id}',[CommunityController::class,'deleteCommunity']);

    // division command

    Route::post('division', [DivisionCommandController::class, 'storeDivision']);
    Route::put('division/{id}', [DivisionCommandController::class, 'editDivision']);
    Route::delete('division/{id}',[DivisionCommandController::class,'deleteDivision']);

    // zonal area controller

    Route::post('Zonal_command', [ZonalCommandController::class, 'storeZonalCommand']);
    Route::put('Zonal_command/{id}', [ZonalCommandController::class, 'editZonalCommand']);
    Route::delete('Zonal_command/{id}',[ZonalCommandController::class,'deleteZonalCommand']);

    // biodata controller

    Route::post('biodata', [SoSafeCorpsBiodataController::class, 'storeBiodata']);
    Route::put('biodata/{id}', [SosafeCorpsBiodataController::class, 'editSosafe']);
    Route::get('biodata', [SosafeCorpsBiodataController::class, 'getBiodatas']);

});
//Admin Zonal Area Controller
Route::middleware([JwtMiddleware::class,'role:zonal_command'])->group(function(){
    Route::get('/z/records',[AdminZonalCommandController::class, 'getSoSafeCorpsBiodata']);
    Route::get('/z/record', [AdminZonalCommandController::class, 'getNewRecords']);
});

// Admin Division Controller

Route::middleware([JwtMiddleware::class,'role:division_command'])->group(function(){
    Route::get('/d/records',[AdminDivisionCommandController::class, 'getSoSafeCorpsBiodata']);
    Route::get('/d/record', [AdminDivisionCommandController::class, 'getNewRecords']);
});
Route::post('/export', [ExcelController::class, 'export']);



Route::get('/test',[biodataController::class, 'test']);
Route::get('/',[ExcelController::class, 'export']);
Route::get('/d',[ExcelController::class, 'download']);