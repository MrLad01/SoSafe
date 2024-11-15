<?php

namespace App\Http\Controllers;
use App\Models\Hero;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HeroController extends Controller
{
    public function getHero(){
        $hero = Hero::where('status',1)->get();
        return response()->json($hero, 200);
    }

    public function storeHero(Request $request){
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
        $hero = Hero::create($validate);
        return response()->json(['message'=> 'success']);
    }

    public function editHero(Request $request,$id){
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
            $hero = Hero::findOrFail($id);
            $hero->update($request->all());
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Hero with id {$id} not found"]);
        } 

    }
    public function deleteHero($id){
        try {
        $Hero = Hero::findOrFail($id);
        $Hero->status = 0;
        $Hero->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"Hero with id {$id} not found"]);
    }
}

    
}
