<?php

namespace App\Http\Controllers;

use App\Models\Reading;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CoffeeController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * @OA\Post(
     *     path="/api/coffee",
     *     summary="Read Coffee Cup",
     *     tags={"Readings"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"images[]"},
     *                 @OA\Property(
     *                     property="images[]",
     *                     type="array",
     *                     @OA\Items(type="string", format="binary"),
     *                     description="Coffee cup images"
     *                 )
     *             )
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
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'image|max:10240', // Max 10MB per image
        ]);

        $user = $request->user();
        $cost = 5.00;

        if ($user->balance < $cost) {
            return response()->json(['error' => 'Insufficient balance. Please add funds.'], 402);
        }

        $imagePaths = [];
        $fullPaths = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('coffee_images', 'public');
            $imagePaths[] = $path;
            $fullPaths[] = storage_path('app/public/' . $path);
        }

        $prompt = "You are a gifted coffee cup reader (Tasseographer). Analyze these images of a coffee cup from different angles. Identify symbols, shapes, and patterns formed by the coffee grounds. Interpret their meaning in a mystical and fortune-telling manner, providing advice and predictions for the future.";

        $reading = DB::transaction(function () use ($request, $user, $cost, $imagePaths, $fullPaths, $prompt) {
            // Deduct balance
            $user->balance -= $cost;
            $user->save();

            $reading = Reading::create([
                'user_id' => $user->id,
                'type' => 'coffee',
                'input_data' => json_encode(['image_paths' => $imagePaths]),
                'status' => 'pending',
            ]);

            $result = $this->geminiService->generateContent($prompt, $fullPaths);

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
