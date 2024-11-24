<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\UsersExport;
use App\jobs\NotifyUserOfCompletedExport;
use Tymon\JWTAuth\Facades\JWTAuth;
class ExcelController extends Controller
{
    public function export(){
    $user = $area = JWTAuth::user();    
    // $file= (new UsersExport)->queue('invoices.xlsx')->chain([
    //     new NotifyUserOfCompletedExport($user),
    // ]);
    // return (new UsersExport)->download('invoices.xlsx');
    return response()->json([$user]);
     }
}
