<?php

namespace App\Http\Controllers;

use App\Models\NewBiodata;
use App\Models\MemberComment;  
use App\Models\Area; 
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Biodata2Controller extends Controller
{
    private const MASKED_DOB = '****-**-**';

    /**
     * True only when the authenticated admin guard user is a superadmin.
     * Public routes (officer lookup) have no authenticated user → always masked.
     */
    private function canSeeDob(): bool
    {
        $user = auth()->guard('admin')->user();
        return $user && $user->role === 'superadmin';
    }

    private function maskRecord(array $record): array
    {
        if (!$this->canSeeDob()) {
            $record['dob'] = self::MASKED_DOB;
        }
        return $record;
    }

    private function maskCollection(iterable $records): array
    {
        return collect($records)
            ->map(fn($r) => $this->maskRecord(
                $r instanceof \Illuminate\Database\Eloquent\Model ? $r->toArray() : (array) $r
            ))
            ->all();
    }

    /**
     * Get all records with pagination.
     */
    // public function index(Request $request)
    // {
    //     try {
    //         $biodata = NewBiodata::query()
    //             ->when($request->search, function ($query, $search) {
    //                 $query->where(function ($q) use ($search) {
    //                     $q->where('sname', 'like', "%{$search}%")
    //                       ->orWhere('fname', 'like', "%{$search}%")
    //                       ->orWhere('fno',   'like', "%{$search}%")
    //                       ->orWhere('sno',   'like', "%{$search}%");
    //                 });
    //             })
    //             ->when($request->sort_by, function ($query, $sortBy) use ($request) {
    //                 $query->orderBy($sortBy, $request->sort_direction ?? 'asc');
    //             })
    //             ->paginate(100);

    //         return response()->json([
    //             'data' => $this->maskCollection($biodata->items()),
    //             'meta' => [
    //                 'current_page' => $biodata->currentPage(),
    //                 'last_page'    => $biodata->lastPage(),
    //                 'per_page'     => $biodata->perPage(),
    //                 'total'        => $biodata->total(),
    //             ],
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error'   => 'An error occurred while fetching records.',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }
    public function index(Request $request)
    {
        try {
            $sortable = ['id', 'fno', 'servno', 'sname', 'fname', 'rank', 'sex', 'zone', 'area'];

            $biodata = NewBiodata::query()
                ->select('new_biodatas.*')
                ->addSelect([
                    'latest_status' => MemberComment::select('status')
                        ->whereColumn('member_comments.fno', 'new_biodatas.fno')
                        ->whereNotNull('status')
                        ->orderByDesc('id')
                        ->limit(1),
                ])
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('sname', 'like', "%{$search}%")
                        ->orWhere('fname', 'like', "%{$search}%")
                        ->orWhere('fno',   'like', "%{$search}%")
                        ->orWhere('sno',   'like', "%{$search}%");
                    });
                })
                ->when(
                    in_array($request->sort_by, $sortable, true),
                    fn ($query) => $query->orderBy(
                        $request->sort_by,
                        $request->sort_direction === 'desc' ? 'desc' : 'asc'
                    )
                )
                ->orderBy('id')          // stable order so pages don't repeat or skip rows
                ->paginate(100);

            return response()->json([
                'data' => $this->maskCollection($biodata->items()),
                'meta' => [
                    'current_page' => $biodata->currentPage(),
                    'last_page'    => $biodata->lastPage(),
                    'per_page'     => $biodata->perPage(),
                    'total'        => $biodata->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'An error occurred while fetching records.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single record by ID.
     */
    public function show($id)
    {
        try {
            $biodata = NewBiodata::findOrFail($id);
        } catch (ModelNotFoundException) {
            return response()->json([
                'Status'  => 'Error',
                'Message' => "Biodata with ID {$id} not found",
            ], 404);
        }

        return response()->json(['data' => $this->maskRecord($biodata->toArray())]);
    }

    public function update(Request $request, $id)
    {
        try {
            $biodata = NewBiodata::findOrFail($id);
        } catch (ModelNotFoundException) {
            return response()->json([
                'Status'  => 'Error',
                'Message' => "Biodata with ID {$id} not found",
            ], 404);
        }

        // Fields only superadmin can change
        $restrictedFields = ['fno', 'sname', 'dob', 'nok', 'relation', 'nokno'];

        $data = $request->only([
            'fno', 'sname', 'fname', 'oname', 'dob',
            'address', 'phone', 'nin', 'sex',
            'city', 'zone', 'area',
            'servno', 'position', 'enlisted',
            'rank', 'nok', 'relation', 'nokno',
            'qualification',
        ]);

        // Strip restricted fields if the user is not a superadmin
        if (!$this->canSeeDob()) {  
            foreach ($restrictedFields as $field) {
                unset($data[$field]);
            }
        }

        $biodata->update($data);

        return response()->json([
            'Status'  => 'Success',
            'Message' => 'Record updated successfully',
            'data'    => $this->maskRecord($biodata->fresh()->toArray()),
        ]);
    }

    /**
     * Delete a single record — superadmin only.
     */
    public function destroy($id)
    {
        if (!$this->canSeeDob()) {
            return response()->json([
                'error' => 'Only superadmins can delete records',
            ], 403);
        }

        try {
            $biodata = NewBiodata::findOrFail($id);
        } catch (ModelNotFoundException) {
            return response()->json([
                'Status'  => 'Error',
                'Message' => "Biodata with ID {$id} not found",
            ], 404);
        }

        $biodata->delete();

        return response()->json([
            'Status'  => 'Success',
            'Message' => "Record {$id} deleted successfully",
        ]);
    }

    /**
     * Get a single record by form number.
     */
    public function findByFormNo($formNo)
    {
        try {
            $biodata = NewBiodata::where('fno', $formNo)->firstOrFail();
        } catch (ModelNotFoundException) {
            return response()->json([
                'Status'  => 'Error',
                'Message' => "Biodata with form number {$formNo} not found",
            ], 404);
        }

        return response()->json(['data' => $this->maskRecord($biodata->toArray())]);
    }

    /**
     * Get a single record by phone number.
     */
    public function findByPhoneNo($phoneNo)
    {
        try {
            $biodata = NewBiodata::where('phone', $phoneNo)->firstOrFail();
        } catch (ModelNotFoundException) {
            return response()->json([
                'Status'  => 'Error',
                'Message' => "Biodata with phone number {$phoneNo} not found",
            ]);
        }

        return response()->json(['data' => $this->maskRecord($biodata->toArray())]);
    }

    /**
     * Get all records — also used for Excel download.
     * DOB masking applies here too, so non-superadmins get masked DOBs in the export.
     */
    public function getAllRecords()
    {
        $biodata = NewBiodata::all();

        return response()->json([
            'data'  => $this->maskCollection($biodata),
            'total' => $biodata->count(),
        ]);
    }

    public function importStatus()
    {
        $totalRecords = NewBiodata::count();
        $lastRecord   = NewBiodata::latest()->first();

        return response()->json([
            'total_records'       => $totalRecords,
            'last_record_created' => $lastRecord?->created_at,
        ]);
    }

    public function comments($id)
    {
        $m = NewBiodata::findOrFail($id);
        return response()->json(MemberComment::where('fno', $m->fno)->latest()->get());
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'body'   => 'required|string|max:2000',
            'status' => 'nullable|in:active,inactive,retired,deceased',
        ]);
        $m = NewBiodata::findOrFail($id);

        $c = MemberComment::create([
            'fno'    => $m->fno,
            'status' => $request->status,
            'body'   => $request->body,
            'author' => auth()->guard('admin')->user()?->name,
        ]);
        return response()->json($c, 201);
    }

    public function bulkAssignArea(Request $request)
    {
        $data = $request->validate([
            'ids'   => 'required|array|min:1|max:5000',
            'ids.*' => 'integer',
            'area'  => 'required|integer|exists:areas,id',
        ]);

        $area = Area::findOrFail($data['area']);

        $updated = NewBiodata::whereIn('id', $data['ids'])->update([
            'area' => $area->id,
            'zone' => $area->zone_id,   // zone follows the area
            'city' => null,
        ]);

        return response()->json(['updated' => $updated]);
    }

    public function bulkComment(Request $request)
    {
        $data = $request->validate([
            'ids'    => 'required|array|min:1|max:5000',
            'ids.*'  => 'integer',
            'body'   => 'required|string|max:2000',
            'status' => 'nullable|in:active,retired,deceased',
        ]);

        $author = auth()->guard('admin')->user()?->name;
        $now    = now();

        $rows = NewBiodata::whereIn('id', $data['ids'])
            ->whereNotNull('fno')
            ->pluck('fno')
            ->map(fn ($fno) => [
                'fno'        => $fno,
                'status'     => $data['status'] ?? null,
                'body'       => $data['body'],
                'author'     => $author,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();

        foreach (array_chunk($rows, 500) as $batch) {
            MemberComment::insert($batch);
        }

        return response()->json(['added' => count($rows)]);
    }
}