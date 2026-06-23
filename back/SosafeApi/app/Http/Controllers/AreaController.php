<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;

class AreaController extends Controller
{

    public function index()
    {
        return Area::with('zone', 'divisions')->get();
    }


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

    {
        return Area::with('zone', 'divisions')->findOrFail($id);
    }


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
    {
        $area = Area::findOrFail($id);
        $area->delete();
        return response()->json(['message' => 'Deleted']);
    }

}
