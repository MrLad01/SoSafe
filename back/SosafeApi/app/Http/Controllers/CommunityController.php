<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Community;
use Illuminate\Support\Facades\Validator;

class CommunityController extends Controller
{
    public function getcommunities(){
        $Community = Community::all()->get();
        return response()->json($zonalCommand, 200);
    }

    public function storeCommunity(Request $request){
        $validate = $request->all();

        $rules = [
            'name' =>['string','required'],
            'division_id'=>['integer','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        $Community = new  Community;
        $Community->name = $request->name;
        $Community->division_command_id = $request->division_id;
        $Community->save();
        return response()->json(['message'=> 'success']);
    }

    public function editCommunity(Request $request,$id){
        $validate = $request->all();

        $rules = [
            'title' =>['string','required'],
            'image'=>['required'],
            'excerpt' =>['string','required'],
            'category' =>['string','required'],
            'content' =>['string','required'],
            'author' =>['string','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        try {
            $Community = Community::findOrFail($id);
            $Community->update($request->all());
            return response()->json(['message'=> 'edit success']);
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Hero with id {$id} not found"]);
        }    

    }

    public function deleteCommunity($id){
        try {
        $Community = Community::findOrFail($id);
        $Community->status = 0;
        $Community->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"News with id {$id} not found"]);
    }
}
}
