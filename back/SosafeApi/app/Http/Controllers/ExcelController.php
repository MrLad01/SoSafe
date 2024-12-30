<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\UsersExport;
use App\jobs\NotifyUserOfCompletedExport;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;
class ExcelController extends Controller
{
    public function export(){
    // $user = $area = JWTAuth::user();    
    // $file= (new UsersExport)->queue('invoices.xlsx')->chain([
    //     new NotifyUserOfCompletedExport(request()->user()),
    // ]);
    // return (new UsersExport)->download('invoices.xlsx');
    (new UsersExport)->queue('biodata.xlsx');

    return response()->json('export started');;
     }
    
    public function download(){
        $url = url('storage/app/biodata.xlsx');
        return Storage::download('biodata.xlsx');
    }
}
