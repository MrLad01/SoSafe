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
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\DivisionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('admin/check',       [authenticationController::class, 'check']);
Route::post('upload',           [authenticationController::class, 'upload']);
Route::post('register',         [authenticationController::class, 'register']);
Route::post('login',            [authenticationController::class, 'login']);
Route::middleware(['login_attempt'])->post('user/login', [UserAdminController::class, 'login']);
Route::get('missing',           [MissingWantedController::class, 'getMissing']);
Route::get('hero',              [HeroController::class, 'getHero']);
Route::get('division',          [DivisionCommandController::class, 'getDivision']);
Route::get('zonal_command',     [ZonalCommandController::class, 'getZonalCommands']);
Route::get('community',         [CommunityController::class, 'getCommunities']);
Route::get('news',              [NewsController::class, 'getNews']);
Route::post('logout',           [authenticationController::class, 'logout']);

Route::post('/get',             [BiodataController::class, 'record']);
Route::get('/biodata2/form/{formNo}',         [Biodata2Controller::class, 'findByFormNo']);
Route::post('/upload/image',    [UserAdminController::class, 'imageUpload']);
Route::get('/biodata2/form/phone/{phoneNo}',  [Biodata2Controller::class, 'findByPhoneNo']);

// ─── Admin routes ────────────────────────────────────────────────────────────
Route::middleware([JwtMiddleware::class, 'role:admin'])->group(function () {

    Route::post('/edit/admin',    [UserController::class, 'editAdmin']);
    Route::post('/create/admin',  [UserController::class, 'addAdmin']);
    Route::post('/reset',         [UserController::class, 'ResetLoginAttempt']);
    Route::get('/reset-all',      [UserController::class, 'ResetAllLoginAttempt']);
    Route::get('/admins',         [UserController::class, 'getAdmins']);
    Route::get('/audit',          [UserController::class, 'auditTrail']);
    Route::get('/biodata2',       [Biodata2Controller::class, 'index']);
    Route::get('/biodata2/{id}',  [Biodata2Controller::class, 'show']);
    Route::get('/old/records/all',[Biodata2Controller::class, 'getAllRecords']);
    Route::get('/biodata2/import-status', [Biodata2Controller::class, 'importStatus']);

    // ── Excel import (corrected) ──────────────────────────────────────────────
    Route::post('/import',        [ExcelController::class, 'import']);

    // SSE progress stream — kept inside the admin group so it's JWT-protected.
    // The browser EventSource API does NOT send custom headers, so JWT is read
    // from a query-string token instead of the Authorization header.
    // In JwtMiddleware::handle(), fall back to:  $token = $request->query('token')
    // when the Authorization header is absent.
    Route::get('/import/progress/{importId}', [ExcelController::class, 'progress']);

    Route::get('/export',         [ExcelController::class, 'download']);
    Route::post('/new/data',      [NewBiodataController::class, 'storeBiodata']);
    Route::get('/new/records/all',[NewBiodataController::class, 'getAllRecords']);
    Route::get('/check/{name?}',  [ExcelController::class, 'check']);
    Route::get('raw/data',        [BiodataController::class, 'getdata']);
    Route::get('user',            [authenticationController::class, 'getUser']);

    // News
    Route::post('news',           [NewsController::class, 'storeNews']);
    Route::put('news/{id}',       [NewsController::class, 'editNews']);
    Route::delete('news/{id}',    [NewsController::class, 'deleteNews']);

    // Missing / Wanted
    Route::post('missing',        [MissingWantedController::class, 'storeNews']);
    Route::put('Missing/{id}',    [MissingWantedController::class, 'editMissing']);
    Route::delete('Missing/{id}', [MissingWantedController::class, 'deleteMissing']);

    // Hero
    Route::post('hero',           [HeroController::class, 'storeNews']);
    Route::put('Hero/{id}',       [HeroController::class, 'editHero']);
    Route::delete('Hero/{id}',    [HeroController::class, 'deleteHero']);

    // Community
    Route::post('community',      [CommunityController::class, 'storeCommunity']);
    Route::put('community/{id}',  [CommunityController::class, 'editCommunity']);
    Route::delete('community/{id}', [CommunityController::class, 'deleteCommunity']);

    // Division command
    Route::post('division',       [DivisionCommandController::class, 'storeDivision']);
    Route::put('division/{id}',   [DivisionCommandController::class, 'editDivision']);
    Route::delete('division/{id}',[DivisionCommandController::class, 'deleteDivision']);

    // Zonal command
    Route::post('Zonal_command',      [ZonalCommandController::class, 'storeZonalCommand']);
    Route::put('Zonal_command/{id}',  [ZonalCommandController::class, 'editZonalCommand']);
    Route::delete('Zonal_command/{id}',[ZonalCommandController::class, 'deleteZonalCommand']);

    // Biodata
    Route::post('biodata',        [SoSafeCorpsBiodataController::class, 'storeBiodata']);
    Route::put('biodata/{id}',    [SoSafeCorpsBiodataController::class, 'editSosafe']);
    Route::get('biodata',         [SoSafeCorpsBiodataController::class, 'getBiodatas']);

    // Zone / Area / Division lookup tables
    Route::get('zones',                   [ZoneController::class, 'index']);
    Route::post('zones',                  [ZoneController::class, 'storeZone']);
    Route::put('zones/{zone}',            [ZoneController::class, 'updateZone']);
    Route::delete('zones/{zone}',         [ZoneController::class, 'destroyZone']);

    Route::post('areas',                  [AreaController::class, 'storeArea']);
    Route::put('areas/{area}',            [AreaController::class, 'updateArea']);
    Route::delete('areas/{area}',         [AreaController::class, 'destroyArea']);

    Route::post('zone-divisions',         [DivisionController::class, 'storeDivision']);
    Route::put('zone-divisions/{division}',[DivisionController::class, 'updateDivision']);
    Route::delete('zone-divisions/{division}',[DivisionController::class, 'destroyDivision']);
});

// ─── Zonal command routes ────────────────────────────────────────────────────
Route::middleware([JwtMiddleware::class, 'role:zonal_command', 'login_attempt'])->group(function () {
    Route::get('/z/records',  [AdminZonalCommandController::class, 'getSoSafeCorpsBiodata']);
    Route::get('/z/record',   [AdminZonalCommandController::class, 'getNewRecords']);
    Route::get('/z/download', [AdminZonalCommandController::class, 'download']);
});

// ─── Division command routes ─────────────────────────────────────────────────
Route::middleware([JwtMiddleware::class, 'role:division_command', 'login_attempt'])->group(function () {
    Route::get('/d/records',      [AdminDivisionCommandController::class, 'getSoSafeCorpsBiodata']);
    Route::get('/d/record/edit',  [AdminDivisionCommandController::class, 'editBiodata']);
    Route::get('/d/download',     [AdminDivisionCommandController::class, 'download']);
});

Route::post('/export', [ExcelController::class, 'export']);
Route::get('/test',    [BiodataController::class, 'test']);
Route::get('/d',       [ExcelController::class, 'download']);