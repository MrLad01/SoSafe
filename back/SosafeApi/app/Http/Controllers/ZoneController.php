<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Zone;

class ZoneController extends Controller
{
    public function index()
    {
        // 'areas.divisions' must match the relationship method names on Zone/Area models
        return response()->json(Zone::with('areas.divisions')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:zones']);
        return response()->json(Zone::create(['name' => strtoupper($request->name)]), 201);
    }

    public function show(string $id)
    {
        return Zone::with('areas.divisions')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $zone = Zone::findOrFail($id);
        // Exclude current record from unique check so saving the same name doesn't fail
        $request->validate(['name' => 'required|string|unique:zones,name,' . $zone->id]);
        $zone->update(['name' => strtoupper($request->name)]);
        return response()->json($zone);
    }

    public function destroy(string $id)
    {
        $zone = Zone::findOrFail($id);
        $zone->delete();
        return response()->json(['message' => 'Deleted']);
    }
}