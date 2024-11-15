<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ZA_command;
use Illuminate\Support\Facades\Validator;

class ZonalCommandController extends Controller
{
    public function getZonalCommands(){
        $zonalCommand = ZA_command::all()->get();
        return response()->json($zonalCommand, 200);
    }

    public function storeZonalCommand(Request $request){
        $validate = $request->all();

        $rules = [
            'name' =>['string','required'],

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        $zonalCommand = ZA_command::create($validate);
        return response()->json(['message'=> 'success']);
    }

    public function editZonalCommand(Request $request,$id){
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
            $zonalCommand = ZA_command::findOrFail($id);
            $zonalCommand->update($request->all());
            return response()->json(['message'=> 'edit success']);
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Hero with id {$id} not found"]);
        }    

    }

    public function deleteZonalCommand($id){
        try {
        $zonalCommand = ZA_command::findOrFail($id);
        $zonalCommand->status = 0;
        $zonalCommand->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"News with id {$id} not found"]);
    }
}
}
