<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\UsersExport;
use App\jobs\NotifyUserOfCompletedExport;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Validation\Rules\File;
use Illuminate\Support\Facades\Validator;
use App\Models\Biodata;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;
use Pion\Laravel\ChunkUpload\Handler\ResumableJSUploadHandler;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;


class ExcelController extends Controller
{
    public function export(){
    // $user = $area = JWTAuth::user();    
    // $file= (new UsersExport)->queue('invoices.xlsx')->chain([
    //     new NotifyUserOfCompletedExport(request()->user()),
    // ]);
    // return (new UsersExport)->download('invoices.xlsx');
    (new UsersExport)->queue('biodata.xlsx');

    return response()->json('export started');;
     }
    
    public function download(){
        $url = url('storage/app/biodata.xlsx');
        return Storage::download('biodata.xlsx');
    }


    public function import(Request $request){
        $file = $request->file('raw_data');
        $validate = $request->all();

        $rules = [
            'raw_data'=>['required',File::types(['xlsx'])
        ],
            
        ];

        $validator=Validator::make($validate,$rules);

        if($validator->fails()){
            $errors = $validator->messages()->all();
            return response()->json(['errors' => $errors]);
        }
        // dd($request->all());
        $receiver = new FileReceiver($request->raw_data, $request, HandlerFactory::classFromRequest($request));

    if (!$receiver->isUploaded()) {
        // file not uploaded
        return response()->json(['status'=>'file not uploaded']);
    }

    $fileReceived = $receiver->receive(); // receive file
    if ($fileReceived->isFinished()) { // file uploading is complete / all chunks are uploaded
        // $file = $fileReceived->getFile(); // get file
        // $newFileName= $file->hashName();
        // $file->move(storage_path('app/chunks'),$newFileName);
        return $this->saveFile($fileReceived->getFile());
        // $extension = $file->getClientOriginalExtension();
        // $fileName = str_replace('.'.$extension, '', $file->getClientOriginalName()); //file name without extenstion
        // $fileName .= '_' . md5(time()) . '.' . $extension; // a unique file name

        // $disk = Storage::disk(config('filesystems.default'));
        // $path = $disk->putFileAs('videos', $file, $fileName);

        // delete chunked file
        // unlink($file->getPathname());
        // return [
        //     'path' => asset('storage/' . $path),
        //     'filename' => $fileName
        // ];
    }

    // otherwise return percentage information
    $handler = $fileReceived->handler();
    // return [
    //     'done' => $handler->getPercentageDone(),
    //     'status' => true
    // ];
        // $file = public_path()."/test.xlsx";
        // $users = (new FastExcel)->import($file, function ($line) {
        //     return biodata::firstOrCreate([
                
        //         'code' => $line['code'],
        //         'firstname' => $line['surnama'],
        //         'lastname' => $line['fname'],
        //         'othername' => $line['onames'],
        //         'address' => $line['addres'],
        //         'phone_no' => $line['phone'],
        //         'dob' => $line['dob'],
        //         'sex' => $line['sex'],
        //         'community' => $line['comunity'],
        //         'za_command' => $line['zacomand'],
        //         'division_command' => $line['divcomand'],
        //         'service_code' => $line['servcode'],
        //         'position' => $line['positn'],
        //         'date_engage' => $line['datengage'],
        //         'rank' => $line['rankk'],
        //         'nok' => $line['nofkin'],
        //         'relationship' => $line['relat'],
        //         'nok_phone' => $line['kinphone'],
        //         'photo' => $line['photo'],
        //         'qualification' => $line['qualif'],
        //     ]);
        // });

        return response()->json([
            'progress' => $handler->getPercentageDone(),
            'status' => true
        ]);

    }

    public function check(){
        // if(Storage::files('app/chunks')){
        //     return response()->json('true');
        // }

        return response()->json(Storage::files('chunks'));

    }

    protected function saveFile(UploadedFile $file)
    {
        $fileName = $this->createFilename($file);
        // Group files by mime type
        $mime = str_replace('/', '-', $file->getMimeType());
        // Group files by the date (week
        $dateFolder = date("Y-m-W");

        // Build the file path
        $filePath = "upload/{$mime}/{$dateFolder}/";
        // $finalPath = storage_path("app/".$filePath);
        $finalPath = storage_path('app/chunks');

        // move the file name
        // move(storage_path('app/chunks'),$fileName);
        $file->move($finalPath, $fileName);

        return response()->json([
            'path' => $filePath,
            'name' => $fileName,
            'mime_type' => $mime
        ]);
    }

    /**
     * Create unique filename for uploaded file
     * @param UploadedFile $file
     * @return string
     */
    protected function createFilename(UploadedFile $file)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = str_replace(".".$extension, "", $file->getClientOriginalName()); // Filename without extension

        // Add timestamp hash to name of the file
        $filename .= "_" . md5(time()) . "." . $extension;

        return $filename;
    }
}
