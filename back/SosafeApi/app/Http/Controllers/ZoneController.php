<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Zone::with('areas.divisions')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:zones']);
        return response()->json(Zone::create(['name' => strtoupper($request->name)]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Zone::with('areas.divisions')->findOrFail($id);  
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $zone = Zone::findOrFail($id);
        $request->validate(['name' => 'required|string|unique:zones,name,'.$zone->id]);
        $zone->update(['name' => strtoupper($request->name)]);
        return response()->json($zone);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $zone = Zone::findOrFail($id);
        $zone->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
