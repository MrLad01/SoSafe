<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewBiodata;
use Illuminate\Support\Facades\Validator;

class NewBiodataController extends Controller
{
    public function storeBiodata(Request $request){
        $validate = $request->all();
        $rules = [
            'form_no'=>['string','required','unique:new_biodatas'],
            'code' =>['string','required','unique:new_biodatas'],
            'firstname'=>['required'],
            'lastname' =>['string','required'],
            'othername' =>['string','required'],
            'address' =>['string','required'],
            'phone_no' =>['string','required','unique:new_biodatas'],
            'dob' =>['date','required'],
            'sex' =>['string','required'],
            'community_id' =>['integer','required'],
            'za_command_id' =>['integer','required'],
            'division_command_id' =>['integer','required'],
            'service_code' =>['string','required','unique:new_biodatas'],
            'position' =>['string','required'],
            'date_engage' =>['string','required'],
            'rank' =>['string','required'],
            'nok' =>['string','required'],
            'relationship' =>['string','required'],
            'nok_phone' =>['string','required'],
            'qualification' =>['string','required']
        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        $data = new NewBiodata;
        $data->form_no= $request->form_no; 
        $data->code = $request->code;
        $data->firstname = $request->firstname;
        $data->lastname = $request->lastname;
        $data->othername = $request->othername;
        $data->address = $request->address;
        $data->phone_no = $request->phone_no;
        $data->dob = $request->dob;
        $data->sex = $request->sex;
        $data->community_id = $request->community_id;
        $data->za_command_id = $request->za_command_id;
        $data->division_command_id = $request->division_command;
        $data->service_code = $request->service_code;
        $data->position = $request->position;
        $data->date_engage = $request->date_engage;
        $data->rank = $request->rank;
        $data->nok = $request->nok;
        $data->relationship = $request->relationship;
        $data->nok_phone = $request->nok_phone;
        $data->qualification = $request->qualification;
        $data->save();

        return response()->json(['message'=> 'success']);
    }
}
