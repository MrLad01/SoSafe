<?php

namespace App\Http\Controllers;

use App\Models\Biodata;
use Illuminate\Http\Request;

class Biodata2Controller extends Controller
{
    /**
     * Get all records with pagination
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 100);
        
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
    }

    /**
     * Get a single record by ID
     */
    public function show($id)
    {
        $biodata = Biodata::findOrFail($id);
        
        return response()->json([
            'data' => $biodata
        ]);
    }

    /**
     * Get a single record by form number
     */
    public function findByFormNo($formNo)
    {
        $biodata = Biodata::where('form_no', $formNo)->firstOrFail();
        
        return response()->json([
            'data' => $biodata
        ]);
    }
}