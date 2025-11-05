<?php
// Database Configuration - read from environment variables if present
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'blog_app');
define('DB_PORT', getenv('DB_PORT') ?: 27017); // Default MongoDB port

// JWT Secret Key (change this in production!) - can be provided via env
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-super-secret-jwt-key-change-this-in-production');
define('JWT_ALGORITHM', getenv('JWT_ALGORITHM') ?: 'HS256');

// CORS Configuration
// Accept ALLOWED_ORIGINS as a comma-separated env var, otherwise fallback to defaults
$allowed_env = getenv('ALLOWED_ORIGINS');
if ($allowed_env !== false && strlen(trim($allowed_env)) > 0) {
	// split on comma and trim each value
	$origins = array_map('trim', explode(',', $allowed_env));
	define('ALLOWED_ORIGINS', $origins);
} else {
	define('ALLOWED_ORIGINS', ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', '*']);
}

// Error Reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Timezone
date_default_timezone_set('UTC');

