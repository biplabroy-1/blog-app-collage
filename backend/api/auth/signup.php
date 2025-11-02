<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config.php';

use App\Database;
use App\Auth;
use App\Response;
use MongoDB\BSON\UTCDateTime;

$users = Database::getCollection('users');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
        Response::error('Email, password, and name are required', 400);
    }

    $email = $data['email'];
    $password = $data['password'];
    $name = $data['name'];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error('Invalid email format', 400);
    }

    // Validate password
    if (strlen($password) < 6) {
        Response::error('Password must be at least 6 characters', 400);
    }

    // Check if user already exists
    $existingUser = $users->findOne(['email' => $email]);
    if ($existingUser) {
        Response::error('Email already registered', 400);
    }

    // Hash password
    $hashedPassword = Auth::hashPassword($password);

    // Create user
    $result = $users->insertOne([
        'email' => $email,
        'password' => $hashedPassword,
        'name' => $name,
        'isAdmin' => false,
        'joined_at' => new UTCDateTime()
    ]);

    $userId = (string)$result->getInsertedId();

    // Generate token
    $token = Auth::generateToken([
        'user_id' => $userId,
        'email' => $email
    ]);

    // Prepare user data
    $userData = [
        'id' => $userId,
        'email' => $email,
        'name' => $name,
        'isAdmin' => false,
        'bio' => null,
        'avatar_url' => null,
        'location' => null,
        'website' => null,
        'joined_at' => (new UTCDateTime())->toDateTime()->format('c')
    ];

    Response::success([
        'token' => $token,
        'user' => $userData
    ], '', 201);

} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}

