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

    public function store(Request $request)
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

    public function show(string $id)
    {
        return Division::with('area.zone')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $division = Division::findOrFail($id);

        $request->validate([
            'name'    => 'required|string',
            // area_id is optional on update — keeps the existing value if not supplied
            'area_id' => 'sometimes|exists:areas,id',
        ]);

        $division->update([
            'name'    => strtoupper($request->name),
            'area_id' => $request->area_id ?? $division->area_id,
        ]);

        return response()->json($division);
    }

    public function destroy(string $id)
    {
        $division = Division::findOrFail($id);
        $division->delete();
        return response()->json(['message' => 'Deleted']);
    }
}