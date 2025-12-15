<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
    }

    public function generateContent($prompt, $images = [])
    {
        if (empty($this->apiKey)) {
            return $this->mockResponse();
        }

        $parts = [
            ['text' => $prompt]
        ];

        foreach ($images as $imagePath) {
            $mimeType = mime_content_type($imagePath);
            $imageData = base64_encode(file_get_contents($imagePath));

            $parts[] = [
                'inline_data' => [
                    'mime_type' => $mimeType,
                    'data' => $imageData
                ]
            ];
        }

        $response = Http::post("{$this->baseUrl}?key={$this->apiKey}", [
            'contents' => [
                [
                    'parts' => $parts
                ]
            ]
        ]);

        if ($response->successful()) {
            return $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? 'No text generated.';
        }

        Log::error('Gemini API Error: ' . $response->body());
        return 'Error generating reading. Please try again later.';
    }

    protected function mockResponse()
    {
        return "The stars align in a mysterious way. (Mock Response: No API Key provided)";
    }
}
