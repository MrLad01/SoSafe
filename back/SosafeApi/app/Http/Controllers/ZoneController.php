<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Zone;

class ZoneController extends Controller
{
<<<<<<< HEAD
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
=======
    public function index()
    {
        // 'areas.divisions' must match the relationship method names on Zone/Area models
        return response()->json(Zone::with('areas.divisions')->get());
    }

    public function storeZone(Request $request)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        $request->validate(['name' => 'required|string|unique:zones']);
        return response()->json(Zone::create(['name' => strtoupper($request->name)]), 201);
    }

<<<<<<< HEAD
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
=======
    public function showZone(string $id)
    {
        return Zone::with('areas.divisions')->findOrFail($id);
    }

    public function updateZone(Request $request, string $id)
    {
        $zone = Zone::findOrFail($id);
        // Exclude current record from unique check so saving the same name doesn't fail
        $request->validate(['name' => 'required|string|unique:zones,name,' . $zone->id]);
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        $zone->update(['name' => strtoupper($request->name)]);
        return response()->json($zone);
    }

<<<<<<< HEAD
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
=======
    public function destroyZone(string $id)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        $zone = Zone::findOrFail($id);
        $zone->delete();
        return response()->json(['message' => 'Deleted']);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
