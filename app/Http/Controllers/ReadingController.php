<?php

namespace App\Http\Controllers;

use App\Models\Reading;
use Illuminate\Http\Request;

class ReadingController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/readings",
     *     summary="Get User Reading History",
     *     tags={"Readings"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of readings",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Reading")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $readings = Reading::where('user_id', $request->user()->id)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $readings]);
    }
}
