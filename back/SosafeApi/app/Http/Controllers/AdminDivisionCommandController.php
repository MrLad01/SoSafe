<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\NewBiodata;
class AdminDivisionCommandController extends Controller
{
    public function getBiodata(){
        $area = auth()->guard('admin')->user()->Area;
        $SoSafeCorpsBiodata = NewBiodata::where('division_command',$area)->with('divisionArea')->get();
        auditTrail('fetch new biodata','success');
        return response()->json(['data'=>$SoSafeCorpsBiodata,'area'=>$area], 200);
    }

    public function storeBiodata(Request $request){
        $area = auth()->guard('admin')->user()->area;
        $role = auth()->guard('admin')->user()->Area;
        $validate = $request->all();
        $rules = [
            'form_no'=>['string','required','unique:new_biodatas'],
            'code' =>['string','required','unique:new_biodatas'],
            'firstname'=>['required'],
            'lastname' =>['string','required'],
            'othername' =>['string','required'],
            'address' =>['string','required'],
            'phone_no' =>['string','required','unique:new_biodata'],
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
        if($area != $request->division_command_id ){
            auditTrail('edit new biodata','access denied');
            return response()->json(['message'=> 'Access denied'],401);
    
        }
        $data = new NewBiodata;
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
        $data->division_command_id = $request->division_command_id;
        $data->service_code = $request->service_code;
        $data->position = $request->position;
        $data->date_engage = $request->date_engage;
        $data->rank = $request->rank;
        $data->nok = $request->nok;
        $data->relationship = $request->relationship;
        $data->nok_phone = $request->nok_phone;
        $data->qualification = $request->qualification;
        $data->save();
        if($data->save()){
            auditTrail('stored new biodata','success');
        }else{
            auditTrail('stored new biodata','failed');
        }

        return response()->json(['message'=> 'success']);
    }

    public function editBiodata(Request $request, $id){
        $area = auth()->guard('admin')->user()->area;
        if($area == 2){
        try{
            $validate = $request->all();
        $rules = [
            'form_no'=>['string','required','unique:new_biodatas'],
            'code' =>['string','required','unique:new_biodatas'],
            'firstname'=>['required'],
            'lastname' =>['string','required'],
            'othername' =>['string','required'],
            'address' =>['string','required'],
            'phone_no' =>['string','required','unique:new_biodata'],
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
        if($area != $request->division_command_id ){
            auditTrail('edit new biodata','access denied');
            return response()->json(['message'=> 'Access denied'],401);
    
        }
        $data = NewBiodata::findOrFail($id)->where('division_command_id',$area)->with('ZonalArea')->get();
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
        $data->division_command_id = $request->division_command_id;
        $data->service_code = $request->service_code;
        $data->position = $request->position;
        $data->date_engage = $request->date_engage;
        $data->rank = $request->rank;
        $data->nok = $request->nok;
        $data->relationship = $request->relationship;
        $data->nok_phone = $request->nok_phone;
        $data->qualification = $request->qualification;
        $data->update(); 
    }catch(ModelNotFoundException $exception){
        auditTrail('edit new biodata','fail');
    return response(["Status"=>"Error",
            "Message"=>" {$id} not found"]);
    };
    
    }else{
        auditTrail('edit new biodata','access denied');
        return response(["Status"=>"Error",
            "Message"=>" Access Denied"]);
    }
        
    }

    public function download(){
        
        $command= JWTAuth::user()->Role;
        $area = JWTAuth::user()->Area;
        $data = NewBiodata::where($command,$area)->get();
        return (new FastExcel($data))->download('file.xlsx');
    }
}