<?php

namespace App\Http\Controllers\Api;

use App\Models\Equipment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EquipmentController extends Controller
{
    public function index()
    {
        return Equipment::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'plate_no' => 'nullable|string',
            'chassis_no' => 'nullable|string',
            'engine_no' => 'nullable|string',
            'property_no' => 'nullable|string',
            'date_acquired' => 'nullable|date',
            'acquisition_cost' => 'nullable|numeric',
            'date_unserviceable' => 'nullable|date',
            'accountable_office' => 'nullable|string',
            'accountable_officer' => 'nullable|string',
        ]);

        return Equipment::create($validated);
        return response()->json($equipment, 201);
    }

    public function show(Equipment $equipment)
    {
        return $equipment;
    }
    public function exportWithHistories()
    {
        try {
            $equipments = Equipment::with(['histories.parts'])->get();
            return response()->json($equipments);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'plate_no' => 'nullable|string',
            'chassis_no' => 'nullable|string',
            'engine_no' => 'nullable|string',
            'property_no' => 'nullable|string',
            'date_acquired' => 'nullable|date',
            'acquisition_cost' => 'nullable|numeric',
            'date_unserviceable' => 'nullable|date',
            'accountable_office' => 'nullable|string',
            'accountable_officer' => 'nullable|string',
        ]);

        $equipment->update($validated);

        return $equipment;
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();
        return response()->noContent();
    }
}
