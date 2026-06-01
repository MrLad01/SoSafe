<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Division;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Division::with('area.zone')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string', 'area_id' => 'required|exists:areas,id']);
        return response()->json(Division::create(['name' => strtoupper($request->name), 'area_id' => $request->area_id]), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Division::with('area.zone')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $division = Division::findOrFail($id);
        $request->validate(['name' => 'required|string', 'area_id' => 'required|exists:areas,id']);
        $division->update(['name' => strtoupper($request->name), 'area_id' => $request->area_id]);
        return response()->json($division);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $division = Division::findOrFail($id);
        $division->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
