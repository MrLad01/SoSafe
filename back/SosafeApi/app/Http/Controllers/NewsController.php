<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class NewsController extends Controller
{
    public function getNews(){
        $news = News::where('status',1)->get();
        return response()->json($news, 200);
    }

    public function storeNews(Request $request){
        $validate = $request->all();

        $rules = [
            'title' =>['string','required'],
            'blog_image'=>['required'],
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
        $image = $request->blog_image;
        if($request->file('blog_image')){
            $image = $request->file('blog_image');
            $name_gen= hexdec(uniqid()).'.'.$image->getClientOriginalExtension();
            $image->move('upload/blog_images/', $name_gen);
            $url = 'upload/brand_images/'.$name_gen;
        }
        $news = News::insert([
                                'title'=>$request->title,
                                'image'=>$image,
                                'excerpt'=>$request->excerpt,
                                'category'=>$request->category,
                                'author'=>$request->author,
                                'content'=>$request->content,
                                

                            ]);
        return response()->json(['message'=> 'success']);
    }

    public function editNews(Request $request,$id){
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
            $news = News::findOrFail($id);
            $news->update($request->all());
            return response()->json(['message'=> 'edit success']);
        } catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Hero with id {$id} not found"]);
        }    

    }

    public function deleteNews($id){
        try {
        $news = News::findOrFail($id);
        $news->status = 0;
        $news->update();
    } catch (ModelNotFoundException $exception) {
        return response(["Status"=>"Error",
        "Message"=>"News with id {$id} not found"]);
    }
}
}
