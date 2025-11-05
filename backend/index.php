<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/src/CORS.php';

use App\CORS;

// Handle CORS
CORS::handle();

// Get the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Parse the route
$path = parse_url($requestUri, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Route handling
if (isset($pathParts[0]) && $pathParts[0] === 'api') {
    $endpoint = $pathParts[1] ?? '';
    $subEndpoint = $pathParts[2] ?? '';
    $param = $pathParts[3] ?? '';
    $subParam = $pathParts[4] ?? '';

    // OPTIONS requests are already handled by CORS::handle()

    try {
        // Route: /api/auth/login
        if ($endpoint === 'auth' && $subEndpoint === 'login' && $requestMethod === 'POST') {
            require __DIR__ . '/api/auth/login.php';
            exit;
        }

        // Route: /api/auth/signup
        if ($endpoint === 'auth' && $subEndpoint === 'signup' && $requestMethod === 'POST') {
            require __DIR__ . '/api/auth/signup.php';
            exit;
        }

        // Route: /api/posts
        if ($endpoint === 'posts' && $subEndpoint === '' && ($requestMethod === 'GET' || $requestMethod === 'POST')) {
            require __DIR__ . '/api/posts/index.php';
            exit;
        }

        // Route: /api/posts/{id}
        if ($endpoint === 'posts' && $subEndpoint !== '' && in_array($requestMethod, ['GET', 'PUT', 'DELETE'])) {
            require __DIR__ . '/api/posts/[id].php';
            exit;
        }

        // Route: /api/users/{userId}
        if ($endpoint === 'users' && $subEndpoint !== '' && $param === '' && in_array($requestMethod, ['GET', 'PUT'])) {
            require __DIR__ . '/api/users/[userId].php';
            exit;
        }

        // Route: /api/users/{userId}/posts
        if ($endpoint === 'users' && $subEndpoint !== '' && $param === 'posts' && $requestMethod === 'GET') {
            require __DIR__ . '/api/users/[userId]/posts.php';
            exit;
        }

        // If no route matches, return 404
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found'
        ]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage()
        ]);
        exit;
    }
}

// If not an API request, return 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'API endpoint not found'
]);
