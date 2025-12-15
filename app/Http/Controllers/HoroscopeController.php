<?php

namespace App\Http\Controllers;

use App\Models\Reading; // Assuming you have a Reading model
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HoroscopeController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function predict(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'dob' => 'required|date',
            'time' => 'required|string', // e.g., "14:30"
            'location' => 'required|string',
        ]);

        $prompt = "Act as an expert astrologer. Generate a detailed and mystical horoscope reading for {$request->name}, born on {$request->dob} at {$request->time} in {$request->location}. Include insights on love, career, and health.";

        // Use a transaction to ensure data integrity
        $reading = DB::transaction(function () use ($request, $prompt) {
            $reading = Reading::create([
                'user_id' => $request->user()->id,
                'type' => 'horoscope',
                'input_data' => json_encode($request->only(['name', 'dob', 'time', 'location'])),
                'status' => 'pending',
            ]);

            $result = $this->geminiService->generateContent($prompt);

            $reading->update([
                'result' => $result,
                'status' => 'completed',
            ]);

            return $reading;
        });

        return response()->json([
            'data' => $reading,
        ]);
    }
}
