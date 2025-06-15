<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\History;
use App\Models\Part;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index($equipmentId)
    {
        return History::with('parts')
            ->where('equipment_id', $equipmentId)
            ->orderBy('date_of_service', 'desc')
            ->get();
    }

    public function store(Request $request, $equipmentId)
    {
        $data = $request->validate([
            'date_of_service' => 'required|date',
            'po_number' => 'nullable|string',
            'po_date' => 'nullable|date',
            'supplier_or_mechanic' => 'nullable|string',
            'dr_or_si_number' => 'nullable|string',
            'dr_or_si_date' => 'nullable|date',
            'maintenance_details' => 'nullable|string',
            'remarks' => 'nullable|string',
            'parts' => 'nullable|array',
            'parts.*.part_name' => 'nullable|string',
            'parts.*.qty' => 'nullable|numeric|min:0',
            'parts.*.unit' => 'nullable|string',
            'parts.*.unit_price' => 'nullable|numeric|min:0',
            'parts.*.total' => 'nullable|numeric',
        ]);

        $history = History::create(array_merge($data, ['equipment_id' => $equipmentId]));

        if (!empty($data['parts'])) {
            foreach ($data['parts'] as $part) {
                $history->parts()->create($part);
            }
        }

        return response()->json($history->load('parts'), 201);
    }

    public function update(Request $request, $id)
    {
        $history = History::findOrFail($id);

        $data = $request->validate([
            'date_of_service' => 'required|date',
            'po_number' => 'nullable|string',
            'po_date' => 'nullable|date',
            'supplier_or_mechanic' => 'nullable|string',
            'dr_or_si_number' => 'nullable|string',
            'dr_or_si_date' => 'nullable|date',
            'maintenance_details' => 'nullable|string',
            'remarks' => 'nullable|string',
            'parts' => 'nullable|array',
            'parts.*.part_name' => 'nullable|string',
            'parts.*.qty' => 'nullable|numeric',
            'parts.*.unit' => 'nullable|string',
            'parts.*.unit_price' => 'nullable|numeric',
            'parts.*.total' => 'nullable|numeric',
        ]);

        $history->update($data);

        // Clear existing parts and re-insert
        $history->parts()->delete();
        if (!empty($data['parts'])) {
            foreach ($data['parts'] as $part) {
                $history->parts()->create($part);
            }
        }

        return response()->json($history->load('parts'));
    }

    public function destroy($id)
    {
        $history = History::findOrFail($id);
        $history->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function show($id)
    {
        return History::with('parts')->findOrFail($id);
    }
}
