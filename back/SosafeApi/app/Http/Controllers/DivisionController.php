<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Division;

class DivisionController extends Controller
{
    public function index()
    {
        return Division::with('area.zone')->get();
    }

    public function storeDivision(Request $request)
    {
        $request->validate([
            'name'    => 'required|string',
            'area_id' => 'required|exists:areas,id',
        ]);

        return response()->json(
            Division::create([
                'name'    => strtoupper($request->name),
                'area_id' => $request->area_id,
            ]),
            201
        );
    }

    public function showDivision(string $id)
    {
        return Division::with('area.zone')->findOrFail($id);
    }

    public function updateDivision(Request $request, string $id)
    {
        $division = Division::findOrFail($id);

        $request->validate([
            'name'    => 'required|string',
            'area_id' => 'sometimes|exists:areas,id', // optional — keep existing if not sent
        ]);

        $division->update([
            'name'    => strtoupper($request->name),
            'area_id' => $request->area_id ?? $division->area_id,
        ]);

        return response()->json($division);
    }

    public function destroyDivision(string $id)
    {
        $division = Division::findOrFail($id);
        $division->delete();
        return response()->json(['message' => 'Deleted']);
    }
}