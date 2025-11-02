<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config.php';

use App\Database;
use App\Auth;
use App\Response;
use MongoDB\BSON\ObjectId;

$users = Database::getCollection('users');

$tokenData = Auth::getUserFromToken();

// Extract userId from path
preg_match('/\/api\/users\/([a-zA-Z0-9]{24})(\/|$)/', $_SERVER['REQUEST_URI'], $matches);
$userId = $matches[1] ?? null;

if (!$userId) {
    Response::error('Invalid user ID', 400);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user by ID
        $user = $users->findOne(['_id' => new ObjectId($userId)]);
        
        if (!$user) {
            Response::error('User not found', 404);
        }

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

        Response::success($userData);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update user profile
        if (!$tokenData) {
            Response::error('Authentication required', 401);
        }

        // Check if user is updating their own profile
        if ($userId !== $tokenData['user_id']) {
            Response::error('Unauthorized', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        $updateData = [];
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['bio'])) {
            $updateData['bio'] = $data['bio'];
        }
        if (isset($data['avatar_url'])) {
            $updateData['avatar_url'] = $data['avatar_url'];
        }
        if (isset($data['location'])) {
            $updateData['location'] = $data['location'];
        }
        if (isset($data['website'])) {
            $updateData['website'] = $data['website'];
        }
        
        if (empty($updateData)) {
            Response::error('No fields to update', 400);
        }

        $users->updateOne(
            ['_id' => new ObjectId($userId)],
            ['$set' => $updateData]
        );

        // Get updated user
        $updatedUser = $users->findOne(['_id' => new ObjectId($userId)]);
        
        $userData = [
            'id' => (string)$updatedUser['_id'],
            'email' => $updatedUser['email'],
            'name' => $updatedUser['name'],
            'isAdmin' => $updatedUser['isAdmin'] ?? false,
            'bio' => $updatedUser['bio'] ?? null,
            'avatar_url' => $updatedUser['avatar_url'] ?? null,
            'location' => $updatedUser['location'] ?? null,
            'website' => $updatedUser['website'] ?? null,
            'joined_at' => isset($updatedUser['joined_at']) ? $updatedUser['joined_at']->toDateTime()->format('c') : null
        ];

        Response::success($userData);

    } else {
        Response::error('Method not allowed', 405);
    }

} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}

