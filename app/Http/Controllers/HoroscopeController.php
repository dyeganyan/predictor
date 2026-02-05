<?php

namespace App\Http\Controllers;

use App\Models\Reading;
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

    /**
     * @OA\Post(
     *     path="/api/horoscope",
     *     summary="Generate Horoscope",
     *     tags={"Readings"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="period", type="string", example="weekly"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="dob", type="string", format="date"),
     *             @OA\Property(property="time", type="string", example="14:30"),
     *             @OA\Property(property="location", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful reading",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function predict(Request $request)
    {
        $user = $request->user();
        $cost = 5.00;

        // Check Balance
        if ($user->balance < $cost) {
            return response()->json(['error' => 'Insufficient balance. Please add funds.'], 402);
        }

        // Determine parameters (Use Request or Fallback to Profile)
        $name = $request->input('name', $user->name);
        $dob = $request->input('dob', $user->birth_date ? $user->birth_date->format('Y-m-d') : null);
        $time = $request->input('time', $user->birth_time ?? '12:00');
        $location = $request->input('location', $user->birth_location ?? 'Unknown City');
        $period = $request->input('period', 'weekly'); // Default to weekly as per requirement

        if (!$dob) {
            return response()->json(['error' => 'Date of Birth is required. Please update your profile or provide it.'], 422);
        }

        $prompt = "Act as an expert astrologer. Generate a detailed {$period} horoscope reading for {$name}, born on {$dob} at {$time} in {$location}. Include insights on love, career, and health for the coming week.";

        $inputData = [
            'name' => $name,
            'dob' => $dob,
            'time' => $time,
            'location' => $location,
            'period' => $period
        ];

        // Use a transaction to ensure data integrity
        $reading = DB::transaction(function () use ($request, $user, $cost, $prompt, $inputData) {
            // Deduct balance
            $user->balance -= $cost;
            $user->save();

            $reading = Reading::create([
                'user_id' => $user->id,
                'type' => 'horoscope',
                'input_data' => json_encode($inputData),
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
            'remaining_balance' => (float) $reading->user->balance
        ]);
    }
}
