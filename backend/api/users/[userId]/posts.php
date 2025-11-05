<?php

require_once(__DIR__ . '/../../../vendor/autoload.php');
require_once(__DIR__ . '/../../../config.php');

use App\Database;
use App\Auth;
use App\Response;
use MongoDB\BSON\ObjectId;
use App\CORS;

CORS::handle();

$posts = Database::getCollection('posts');
$users = Database::getCollection('users');

$tokenData = Auth::getUserFromToken();

// Extract userId from path
preg_match('/\/api\/users\/([a-zA-Z0-9]{24})\/posts(\/|$)/', $_SERVER['REQUEST_URI'], $matches);
$userId = $matches[1] ?? null;

if (!$userId) {
    Response::error('Invalid user ID', 400);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all posts by user
        $postsCursor = $posts->find(
            ['author_id' => $userId],
            ['sort' => ['created_at' => -1]]
        );

        $allPosts = [];
        foreach ($postsCursor as $post) {
            // Get author info
            $author = $users->findOne(['_id' => new ObjectId($post['author_id'])]);

            $postData = [
                'id' => (string)$post['_id'],
                'title' => $post['title'],
                'body' => $post['body'],
                'author_id' => $post['author_id'],
                'author_avatar_url' => $author ? $author['avatar_url'] : null,
                'author_name' => $author ? $author['name'] : 'Unknown',
                'created_at' => $post['created_at']->toDateTime()->format('c'),
                'excerpt' => isset($post['excerpt']) ? $post['excerpt'] : null
            ];

            $allPosts[] = $postData;
        }

        Response::success($allPosts);
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}
