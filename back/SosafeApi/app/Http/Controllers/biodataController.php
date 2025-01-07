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
    public function record(Request $request){
        
        if($request->form_no){

            $data= Biodata::where('form_no',$request->form_no)->firstOrFail();

            return response()->json($data);
        }
        if($request->phone_no){
            $data= Biodata::where('phone_no',$request->phone_no)->firstOrFail();
            return response()->json($data);
        }
        return response()->json(['message'=>'only form number or phone number is required']);
        
        // return view("s.test",compact('data'));
    }
}
