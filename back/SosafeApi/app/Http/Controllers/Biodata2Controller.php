<?php

namespace App\Http\Controllers;

use App\Models\NewBiodata;
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
    public function index(Request $request)
    {
        try {
            $biodata = NewBiodata::query()
                ->when($request->search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('sname', 'like', "%{$search}%")
                          ->orWhere('fname', 'like', "%{$search}%")
                          ->orWhere('fno',   'like', "%{$search}%")
                          ->orWhere('sno',   'like', "%{$search}%");
                    });
                })
                ->when($request->sort_by, function ($query, $sortBy) use ($request) {
                    $query->orderBy($sortBy, $request->sort_direction ?? 'asc');
                })
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
}