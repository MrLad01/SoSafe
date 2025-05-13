<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Exception;

class Biodata2Controller extends Controller
{
    /**
     * Get all records with pagination
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 100);
        try {
            $perPage = (int)$perPage;
            $perPage = 100; // Default value
            $biodata = Biodata::query()
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                      ->orWhere('lastname', 'like', "%{$search}%")
                      ->orWhere('form_no', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                    });
                })
                ->when($request->sort_by, function($query, $sortBy) {
                    $direction = $request->sort_direction ?? 'asc';
                    $query->orderBy($sortBy, $direction);
                })
                ->paginate($perPage);
                
                return response()->json([
                    'data' => $biodata->items(),
                    'meta' => [
                        'current_page' => $biodata->currentPage(),
                        'last_page' => $biodata->lastPage(),
                        'per_page' => $biodata->perPage(),
                        'total' => $biodata->total()
                        ]
                    ]);
                } catch (Exception $e) {
                    return response()->json([
                        'error' => 'An error occurred while fetching records.',
                        'message' => $e->getMessage()
                    ], 500);
                }
    }

    /**
     * Get a single record by ID
     */
    public function show($id)
    {
        // $biodata = Biodata::findOrFail($id);
        try {
            $biodata = Biodata::findOrFail($id);
        }  catch (ModelNotFoundException $exception) {
            return response()->json(["Status"=>"Error",
            "Message"=>"Biodata with ID {$id} not found"], 404);
        }
        return response()->json([
            'data' => $biodata
        ]);
    }

    /**
     * Get a single record by form number
     */
    public function findByFormNo($formNo)
    {
        // $biodata = Biodata::where('form_no', $formNo)->firstOrFail();
        try {
            $biodata = Biodata::where('form_no', $formNo)->firstOrFail();
        }  catch (ModelNotFoundException $exception) {
            return response()->json(["Status"=>"Error",
            "Message"=>"Biodata with form number {$formNo} not found"], 404);
        }
        if (!$biodata) {
            return response()->json([
                'message' => 'Biodata not found'
            ], 404);
        }
        return response()->json([
            'data' => $biodata
        ]);
    }

    public function findByPhoneNo($phoneNo)
    {
        try {
            // $phoneNo = str_replace(['+', ' ', '-', '(', ')'], '', $phoneNo);
            $biodata = Biodata::where('phone_no', $phoneNo)->firstOrFail();
        }  catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Biodata with phone number {$phoneNo} not found"]);
        }
        
        return response()->json([
            'data' => $biodata
        ]);
    }
    public function getAllRecords()
    {
        $biodata = Biodata::all();
        return response()->json([
            'data' => $biodata,
            'total' => $biodata->count()
        ]);
    }

    public function importStatus()
    {
        $totalRecords = Biodata::count();
        $lastRecord = Biodata::latest()->first();
        
        return response()->json([
            'total_records' => $totalRecords,
            'last_record_created' => $lastRecord ? $lastRecord->created_at : null
        ]);
    }
}