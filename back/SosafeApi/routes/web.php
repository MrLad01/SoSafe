<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\biodataController;
use App\Http\Controllers\ExcelController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/test',[biodataController::class, 'test']);
Route::get('/',[ExcelController::class, 'export']);
Route::get('/d',[ExcelController::class, 'download']);

