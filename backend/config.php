<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'blog_app');
define('DB_PORT', 27017); // Default MongoDB port

// JWT Secret Key (change this in production!)
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');
define('JWT_ALGORITHM', 'HS256');

// CORS Configuration
define('ALLOWED_ORIGINS', ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080',"*"]);

// Error Reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Timezone
date_default_timezone_set('UTC');

