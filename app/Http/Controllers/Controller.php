<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Novatix Oracle API",
 *     description="API documentation for Novatix Oracle application"
 * )
 *
 * @OA\Get(
 *     path="/api/health",
 *     summary="Health Check",
 *     @OA\Response(response="200", description="System is healthy")
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer"
 * )
 */
abstract class Controller
{
    //
}
