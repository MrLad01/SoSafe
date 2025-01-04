<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Biodata;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
// use Excel;
class BiodataController extends Controller
{
    public function getdata(){
        $data = Biodata::query()->paginate(100);
        return response()->json($data, 200);
    //     DB::table('sobiodata')->orderBy('sno')->chunk(100, function (Collection $users) {
    //     foreach ($users as $user) {
    //        return response()->json($user);;
    //     }
    // });
   
}
    // public function test(){
        
    //     $data= sobiodata::all();
    //     $data = $data->chunk(5000);
    //     return response()->json($data);
    //     // return view("s.test",compact('data'));
    // }
}
