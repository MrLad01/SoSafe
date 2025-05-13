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
use App\Http\Controllers\UserController;
use App\Http\Controllers\Biodata2Controller;
use App\Http\Controllers\UserAdminController;



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
Route::get('admin/check', [authenticationController::class, 'check']);
Route::post('upload', [authenticationController::class, 'upload']);
Route::post('register', [authenticationController::class, 'register']);
Route::post('login', [authenticationController::class, 'login']);
Route::middleware(['login_attempt'])->post('user/login', [UserAdminController::class, 'login']);
// Route::get('user', [authenticationController::class, 'getUser']);
Route::get('missing', [MissingWantedController::class, 'getMissing']);
Route::get('hero', [HeroController::class, 'getHero']);
Route::get('division', [DivisionCommandController::class, 'getDivision']);
Route::get('zonal_command', [ZonalCommandController::class, 'getZonalCommands']);
Route::get('community', [CommunityController::class, 'getCommunities']);
Route::get('news', [NewsController::class, 'getNews']);
Route::post('logout', [authenticationController::class, 'logout']);


Route::post('/get',[BiodataController::class, 'record']);
Route::get('/biodata2/form/{formNo}', [Biodata2Controller::class, 'findByFormNo']);
Route::post('/upload/image', [UserAdminController::class, 'imageUpload']);
Route::get('/biodata2/form/phone/{phoneNo}', [Biodata2Controller::class, 'findByPhoneNo']);

Route::middleware([JwtMiddleware::class,'role:admin'])->group(function () {
    
    // Route::post('user/register', [UserController::class, 'createAdmin']);
    
    Route::post('/edit/admin', [UserController::class, 'editAdmin']);
    Route::post('/create/admin', [UserController::class, 'addAdmin']);
    Route::post('/reset', [UserController::class, 'ResetLoginAttempt']);
    Route::get('/reset-all', [UserController::class, 'ResetAllLoginAttempt']);
    Route::get('/admins', [UserController::class, 'getAdmins']);
    Route::get('/audit', [UserController::class, 'auditTrail']);
    Route::get('/biodata2', [Biodata2Controller::class, 'index']);
    Route::get('/biodata2/{id}', [Biodata2Controller::class, 'show']);
    Route::get('/old/records/all', [Biodata2Controller::class, 'getAllRecords']);
    Route::get('/biodata2/import-status', [Biodata2Controller::class, 'importStatus']);
    
    Route::post('/import',[ExcelController::class, 'import']);
    Route::get('/export',[ExcelController::class, 'download']);
    Route::post('/new/data',[NewBiodataController::class, 'storeBiodata']);
    Route::get('/new/records/all', [NewBiodataController::class, 'getAllRecords']);

    Route::get('/check/{name?}',[ExcelController::class, 'check']);

    Route::get('raw/data',[BiodataController::class, 'getdata']);
    Route::get('user', [authenticationController::class, 'getUser']);
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
Route::middleware([JwtMiddleware::class,'role:zonal_command','login_attempt'])->group(function(){
    Route::get('/z/records',[AdminZonalCommandController::class, 'getSoSafeCorpsBiodata']);
    Route::get('/z/records',[AdminZonalCommandController::class, 'storeBiodata']);
    Route::get('/z/record', [AdminZonalCommandController::class, 'getNewRecords']);
    Route::get('/z/download', [AdminZonalCommandController::class, 'download']);

});

// Admin Division Controller

Route::middleware([JwtMiddleware::class,'role:division_command','login_attempt'])->group(function(){
    Route::get('/d/records',[AdminDivisionCommandController::class, 'getSoSafeCorpsBiodata']);
    Route::get('/d/records',[AdminDivisionCommandController::class, 'storeBiodata']);
    Route::get('/d/record/edit', [AdminDivisionCommandController::class, 'editBiodata']);
    Route::get('/d/download', [AdminDivisionCommandController::class, 'download']);
});
Route::post('/export', [ExcelController::class, 'export']);



Route::get('/test',[biodataController::class, 'test']);
Route::get('/d',[ExcelController::class, 'download']);

