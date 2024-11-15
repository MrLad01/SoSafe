<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\sobiodata;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;
// use Excel;
class biodataController extends Controller
{
    public function getdata(){
        $data = sobiodata::where('sno',"35")->get();
        return response()->json($data, 200);
    }

    public function test(){
        // $data = sobiodata::where('sno',"61")->get();
        // $handle = fopen(public_pathh(path:'storage/biodata.xlsx'),mode:'w');
        // sobiodata::chunk(2000,function ($data) use ($handle){
        //     foreach($data->toArray() as $dat){
        //         fputcsv($handle,$dat);
        //     }
        // });
        // return Excel::download(new UsersExport, 'users.xlsx');
        $data = sobiodata::chunk()->get();

        // return view("s.test",compact('data'));
    }
}
