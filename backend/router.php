<?php

// PHP built-in server router
// This file routes all requests through index.php

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string
$requestUri = strtok($requestUri, '?');

// If it's a file that exists, serve it directly
if ($requestUri !== '/' && file_exists(__DIR__ . $requestUri)) {
    return false;
}

// Otherwise, route everything through index.php
$_SERVER['REQUEST_URI'] = $requestUri;
require __DIR__ . '/index.php';

