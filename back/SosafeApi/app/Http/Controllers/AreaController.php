<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;

class AreaController extends Controller
{
<<<<<<< HEAD
    /**
     * Display a listing of the resource.
     */
=======
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    public function index()
    {
        return Area::with('zone', 'divisions')->get();
    }

<<<<<<< HEAD
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
=======
    public function storeArea(Request $request)
    {
        $request->validate([
            'name'    => 'required|string',
            'zone_id' => 'required|exists:zones,id',
        ]);
        return response()->json(
            Area::create([
                'name'    => strtoupper($request->name),
                'zone_id' => $request->zone_id,
            ]),
            201
        );
    }

    public function showArea(string $id)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        return Area::with('zone', 'divisions')->findOrFail($id);
    }

<<<<<<< HEAD
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
=======
    public function updateArea(Request $request, string $id)
    {
        $area = Area::findOrFail($id);

        $request->validate([
            'name'    => 'required|string|unique:areas,name,' . $area->id, // exclude self from unique check
            'zone_id' => 'sometimes|exists:zones,id',                      // optional — keep existing if not sent
        ]);

        $area->update([
            'name'    => strtoupper($request->name),
            'zone_id' => $request->zone_id ?? $area->zone_id,
        ]);

        return response()->json($area);
    }

    public function destroyArea(string $id)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        $area = Area::findOrFail($id);
        $area->delete();
        return response()->json(['message' => 'Deleted']);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
