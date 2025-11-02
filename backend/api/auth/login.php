<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config.php';

use App\Database;
use App\Auth;
use App\Response;
use MongoDB\BSON\ObjectId;

$users = Database::getCollection('users');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
        Response::error('Email and password are required', 400);
    }

    $email = $data['email'];
    $password = $data['password'];

    // Find user by email
    $user = $users->findOne(['email' => $email]);

    if (!$user) {
        Response::error('Invalid email or password', 401);
    }

    // Verify password
    if (!Auth::verifyPassword($password, $user['password'])) {
        Response::error('Invalid email or password', 401);
    }

    // Generate token
    $token = Auth::generateToken([
        'user_id' => (string)$user['_id'],
        'email' => $user['email']
    ]);

    // Prepare user data (exclude password)
    $userData = [
        'id' => (string)$user['_id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'isAdmin' => $user['isAdmin'] ?? false,
        'bio' => $user['bio'] ?? null,
        'avatar_url' => $user['avatar_url'] ?? null,
        'location' => $user['location'] ?? null,
        'website' => $user['website'] ?? null,
        'joined_at' => isset($user['joined_at']) ? $user['joined_at']->toDateTime()->format('c') : null
    ];

    Response::success([
        'token' => $token,
        'user' => $userData
    ]);

} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}

