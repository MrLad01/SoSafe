<?php

namespace App\Http\Controllers;

<<<<<<< HEAD
use App\Models\Biodata;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Exception;

class Biodata2Controller extends Controller
{
    /**
     * Get all records with pagination
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 100);
        try {
            $perPage = (int)$perPage;
            $perPage = 100; // Default value
            $biodata = Biodata::query()
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                      ->orWhere('lastname', 'like', "%{$search}%")
                      ->orWhere('form_no', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                    });
                })
                ->when($request->sort_by, function($query, $sortBy) {
                    $direction = $request->sort_direction ?? 'asc';
                    $query->orderBy($sortBy, $direction);
                })
                ->paginate($perPage);
                
                return response()->json([
                    'data' => $biodata->items(),
                    'meta' => [
                        'current_page' => $biodata->currentPage(),
                        'last_page' => $biodata->lastPage(),
                        'per_page' => $biodata->perPage(),
                        'total' => $biodata->total()
                        ]
                    ]);
                } catch (Exception $e) {
                    return response()->json([
                        'error' => 'An error occurred while fetching records.',
                        'message' => $e->getMessage()
                    ], 500);
                }
    }

    /**
     * Get a single record by ID
     */
    public function show($id)
    {
        // $biodata = Biodata::findOrFail($id);
        try {
            $biodata = Biodata::findOrFail($id);
        }  catch (ModelNotFoundException $exception) {
            return response()->json(["Status"=>"Error",
            "Message"=>"Biodata with ID {$id} not found"], 404);
        }
        return response()->json([
            'data' => $biodata
=======
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
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        ]);
    }

    /**
<<<<<<< HEAD
     * Get a single record by form number
     */
    public function findByFormNo($formNo)
    {
        // $biodata = Biodata::where('form_no', $formNo)->firstOrFail();
        try {
            $biodata = Biodata::where('form_no', $formNo)->firstOrFail();
        }  catch (ModelNotFoundException $exception) {
            return response()->json(["Status"=>"Error",
            "Message"=>"Biodata with form number {$formNo} not found"], 404);
        }
        if (!$biodata) {
            return response()->json([
                'message' => 'Biodata not found'
            ], 404);
        }
        return response()->json([
            'data' => $biodata
        ]);
    }

    public function findByPhoneNo($phoneNo)
    {
        try {
            // $phoneNo = str_replace(['+', ' ', '-', '(', ')'], '', $phoneNo);
            $biodata = Biodata::where('phone_no', $phoneNo)->firstOrFail();
        }  catch (ModelNotFoundException $exception) {
            return response(["Status"=>"Error",
            "Message"=>"Biodata with phone number {$phoneNo} not found"]);
        }
        
        return response()->json([
            'data' => $biodata
        ]);
    }
    public function getAllRecords()
    {
        $biodata = Biodata::all();
        return response()->json([
            'data' => $biodata,
            'total' => $biodata->count()
=======
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
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        ]);
    }

    public function importStatus()
    {
<<<<<<< HEAD
        $totalRecords = Biodata::count();
        $lastRecord = Biodata::latest()->first();
        
        return response()->json([
            'total_records' => $totalRecords,
            'last_record_created' => $lastRecord ? $lastRecord->created_at : null
=======
        $totalRecords = NewBiodata::count();
        $lastRecord   = NewBiodata::latest()->first();

        return response()->json([
            'total_records'       => $totalRecords,
            'last_record_created' => $lastRecord?->created_at,
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
        ]);
    }
}