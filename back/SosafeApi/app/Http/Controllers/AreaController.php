<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Area::with('zone', 'divisions')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $request->validate(['name' => 'required|string', 'zone_id' => 'required|exists:zones,id']);
        return response()->json(Area::create(['name' => strtoupper($request->name), 'zone_id' => $request->zone_id]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Area::with('zone', 'divisions')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $area = Area::findOrFail($id);
        $request->validate(['name'=>'required|string|unique:areas,name,'.$area->id, 'zone_id'=>'required|exists:zones,id']);
        $area->update(['name' => strtoupper($request->name), 'zone_id' => $request->zone_id]);
        return response()->json($area);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $area = Area::findOrFail($id);
        $area->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
