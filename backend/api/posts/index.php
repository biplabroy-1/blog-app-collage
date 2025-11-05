<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config.php';

use App\Database;
use App\Auth;
use App\Response;
use MongoDB\BSON\ObjectId;
use App\CORS;

CORS::handle();

$posts = Database::getCollection('posts');
$users = Database::getCollection('users');

$tokenData = Auth::getUserFromToken();

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all posts
        $postsCursor = $posts->find([], [
            'sort' => ['created_at' => -1]
        ]);

        $allPosts = [];
        foreach ($postsCursor as $post) {
            // Get author info
            $author = $users->findOne(['_id' => new ObjectId($post['author_id'])]);

            $postData = [
                'id' => (string)$post['_id'],
                'title' => $post['title'],
                'body' => $post['body'],
                'author_id' => $post['author_id'],
                'author_name' => $author ? $author['name'] : 'Unknown',
                'author_avatar_url' => $author ? ($author['avatar_url'] ?? null) : null,
                'created_at' => $post['created_at']->toDateTime()->format('c'),
                'excerpt' => isset($post['excerpt']) ? $post['excerpt'] : null
            ];

            $allPosts[] = $postData;
        }

        Response::success($allPosts);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create new post
        if (!$tokenData) {
            Response::error('Authentication required', 401);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['title']) || !isset($data['body'])) {
            Response::error('Title and body are required', 400);
        }

        $userId = $tokenData['user_id'];

        // Create excerpt from body (first 150 characters)
        $excerpt = mb_substr(strip_tags($data['body']), 0, 150) . '...';

        $result = $posts->insertOne([
            'title' => $data['title'],
            'body' => $data['body'],
            'author_id' => $userId,
            'excerpt' => $excerpt,
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ]);

        $postId = (string)$result->getInsertedId();

        // Get author info
        $author = $users->findOne(['_id' => new ObjectId($userId)]);

        $postData = [
            'id' => $postId,
            'title' => $data['title'],
            'body' => $data['body'],
            'author_id' => $userId,
            'author_name' => $author ? $author['name'] : 'Unknown',
            'author_avatar_url' => $author ? ($author['avatar_url'] ?? null) : null,
            'created_at' => (new MongoDB\BSON\UTCDateTime())->toDateTime()->format('c'),
            'excerpt' => $excerpt
        ];

        Response::success($postData, '', 201);
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}
