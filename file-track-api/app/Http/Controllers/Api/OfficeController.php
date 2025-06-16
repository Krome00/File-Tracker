<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Office;
use Illuminate\Http\Request;

class OfficeController extends Controller
{
    public function index()
    {
        return Office::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'required|string|max:10',
        ]);

        $office = Office::create($validated);

        return response()->json($office, 201);
    }

    public function show(Office $office)
    {
        return response()->json($office);
    }

    public function update(Request $request, Office $office)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'required|string|max:50',
        ]);

        $office->update($data);

        return response()->json($office);
    }

    public function destroy(Office $office)
    {
        $office->delete();

        return response()->noContent();
    }
}

