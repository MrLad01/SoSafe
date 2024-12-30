<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\UsersExport;
use App\jobs\NotifyUserOfCompletedExport;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;
use Rap2hpoutre\FastExcel\FastExcel;
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
    public function import(){
        $file = public_path()."/test.xlsx";
        $users = (new FastExcel)->import($file, function ($line) {
            return biodata::firstOrCreate([
                
                'code' => $line['code'],
                'firstname' => $line['surnama'],
                'lastname' => $line['fname'],
                'othername' => $line['onames'],
                'address' => $line['addres'],
                'phone_no' => $line['phone'],
                'dob' => $line['dob'],
                'sex' => $line['sex'],
                'community' => $line['comunity'],
                'za_command' => $line['zacomand'],
                'division_command' => $line['divcomand'],
                'service_code' => $line['servcode'],
                'position' => $line['positn'],
                'date_engage' => $line['datengage'],
                'rank' => $line['rankk'],
                'nok' => $line['nofkin'],
                'relationship' => $line['relat'],
                'nok_phone' => $line['kinphone'],
                'photo' => $line['photo'],
                'qualification' => $line['qualif'],
            ]);
        });

        return response()->json('done');

    }
}
