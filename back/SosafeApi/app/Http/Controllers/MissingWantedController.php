<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Missing;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MissingWantedController extends Controller
{
    public function getMissing(){
        $missing = Missing::where('status',1)->get();
        return response()->json($missing, 200);
    }

    public function storeMissing(Request $request){
        $validate = $request->all();

        $rules = [
            'name'=> ['string','required'],
            'image'=>['required'],
            'description' =>['string','required'],
            'location' =>['string','required'],
            'age' =>['string','required'],
            'height' =>['string','required'],
            'weight' =>['string','required'],
            'distinguishing_features' =>['string','required'],
            'status' =>['string','required'],
            'case_number' =>['string','required'],
            'contact' =>['string','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        $missing = Missing::create($validate);
        return response()->json(['message'=> 'success']);
    }

    public function editMissing(Request $request,$id){
        $validate = $request->all();

        $rules = [
            'name'=> ['string','required'],
            'image'=>['required'],
            'description' =>['string','required'],
            'location' =>['string','required'],
            'age' =>['string','required'],
            'height' =>['string','required'],
            'weight' =>['string','required'],
            'distinguishing_features' =>['string','required'],
            'status' =>['string','required'],
            'case_number' =>['string','required'],
            'contact' =>['string','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        try {
            $missing = Missing::findOrFail($id);
            $missing->update($request->all());
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"missng/wanted with id {$id} not found"]);
        }    

    }

    public function deleteMissing($id){
        try {
        $missing = Missing::findOrFail($id);
        $missing->status = 0;
        $missing->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"Missing with id {$id} not found"]);
    }
}
}
