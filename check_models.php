<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = config('services.gemini.key');
echo "Checking API Key: " . substr($apiKey, 0, 5) . "...\n";

$url = "https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
if ($httpCode === 200) {
    $data = json_decode($response, true);
    foreach ($data['models'] as $model) {
        echo "- " . $model['name'] . " (Supports: " . implode(', ', $model['supportedGenerationMethods']) . ")\n";
    }
} else {
    echo "Error: " . $response . "\n";
}
