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

<<<<<<< HEAD
    public function store(Request $request)
=======
    public function storeDivision(Request $request)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        $request->validate([
            'name'    => 'required|string',
            'area_id' => 'required|exists:areas,id',
        ]);
<<<<<<< HEAD

=======
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        return response()->json(
            Division::create([
                'name'    => strtoupper($request->name),
                'area_id' => $request->area_id,
            ]),
            201
        );
    }

<<<<<<< HEAD
    public function show(string $id)
=======
    public function showDivision(string $id)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        return Division::with('area.zone')->findOrFail($id);
    }

<<<<<<< HEAD
    public function update(Request $request, string $id)
=======
    public function updateDivision(Request $request, string $id)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        $division = Division::findOrFail($id);

        $request->validate([
            'name'    => 'required|string',
<<<<<<< HEAD
            // area_id is optional on update — keeps the existing value if not supplied
            'area_id' => 'sometimes|exists:areas,id',
=======
            'area_id' => 'sometimes|exists:areas,id', // optional — keep existing if not sent
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        ]);

        $division->update([
            'name'    => strtoupper($request->name),
            'area_id' => $request->area_id ?? $division->area_id,
        ]);

        return response()->json($division);
    }

<<<<<<< HEAD
    public function destroy(string $id)
=======
    public function destroyDivision(string $id)
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
    {
        $division = Division::findOrFail($id);
        $division->delete();
        return response()->json(['message' => 'Deleted']);
    }
}