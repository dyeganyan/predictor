<?php

namespace App\Http\Controllers;

use App\Models\Reading;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PalmController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * @OA\Post(
     *     path="/api/palm",
     *     summary="Analyze Palm",
     *     tags={"Readings"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"image"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary",
     *                     description="Palm image file"
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
            'image' => 'required|image|max:10240', // Max 10MB
        ]);

        $path = $request->file('image')->store('palm_images', 'public');
        $fullPath = storage_path('app/public/' . $path);

        $prompt = "Analyze this palm reading image. Focus on the heart line, head line, life line, and fate line. Provide a mystical and insightful reading about the person's character and future.";

        $reading = DB::transaction(function () use ($request, $path, $fullPath, $prompt) {
            $reading = Reading::create([
                'user_id' => $request->user()->id,
                'type' => 'palm',
                'input_data' => json_encode(['image_path' => $path]),
                'status' => 'pending',
            ]);

            $result = $this->geminiService->generateContent($prompt, [$fullPath]);

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
