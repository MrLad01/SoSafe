<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\divCommand;
use Illuminate\Support\Facades\Validator;

class DivisionCommandController extends Controller
{
    public function getDivisions(){
        $divCommand = divCommand::all()->get();
        return response()->json($zonalCommand, 200);
    }

    public function storeDivision(Request $request){
        $validate = $request->all();

        $rules = [
            'name' =>['string','required'],
            'za_command_id'=>['integer','required']

        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        $divCommand = new divCommand;
        $divCommand->name = $request->name;
        $divCommand->za_command_id = $request->za_command_id;
        $divCommand->save();
        return response()->json(['message'=> 'success']);
    }

    public function editDivision(Request $request,$id){
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
            $divCommand = divCommand::findOrFail($id);
            $divCommand->update($request->all());
            return response()->json(['message'=> 'edit success']);
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Hero with id {$id} not found"]);
        }    

    }

    public function deleteDivision($id){
        try {
        $divCommand = divCommand::findOrFail($id);
        $divCommand->status = 0;
        $divCommand->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"News with id {$id} not found"]);
    }
}
}
