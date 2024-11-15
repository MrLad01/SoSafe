<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SoSafeCorpsBiodata;
use Illuminate\Support\Facades\Validator;

class AdminZonalCommandController extends Controller{
    public function getSoSafeCorpsBiodata(){
        $area = Auth::user()->area;
        $SoSafeCorpsBiodata = SoSafeCorpsBiodata::where('zonal_command',$area)->get();
        return response()->json($SoSafeCorpsBiodata, 200);
    }

    public function storeSoSafeCorpsBiodata(Request $request){
        $validate = $request->all();

        $rules = [
            'image'=>['required'],
            'title' =>['string','required'],
            'description' =>['string','required'],
            'badge' =>['string','required'],
            'date' =>['string','required'],
            'content' =>['string','required'],
            'author' =>['string','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        $SoSafeCorpsBiodata = SoSafeCorpsBiodata::create($validate);
        return response()->json(['message'=> 'success']);
    }

    public function editSoSafeCorpsBiodata(Request $request,$id){
        $validate = $request->all();

        $rules = [
            'image'=>['required'],
            'title' =>['string','required'],
            'description' =>['string','required'],
            'badge' =>['string','required'],
            'date' =>['string','required'],
            'content' =>['string','required'],
            'author' =>['string','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        try {
            $SoSafeCorpsBiodata = SoSafeCorpsBiodata::findOrFail($id);
            $SoSafeCorpsBiodata->update($request->all());
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"SoSafeCorpsBiodata with id {$id} not found"]);
        } 

    }
    public function deleteSoSafeCorpsBiodata($id){
        try {
        $SoSafeCorpsBiodata = SoSafeCorpsBiodata::findOrFail($id);
        $SoSafeCorpsBiodata->status = 0;
        $SoSafeCorpsBiodata->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"SoSafeCorpsBiodata with id {$id} not found"]);
    }
}

    
}

