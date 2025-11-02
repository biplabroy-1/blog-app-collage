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

// Extract ID from path
preg_match('/\/api\/posts\/([a-zA-Z0-9]{24})(\/|$)/', $_SERVER['REQUEST_URI'], $matches);
$postId = $matches[1] ?? null;

if (!$postId) {
    Response::error('Invalid post ID', 400);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get post by ID
        $post = $posts->findOne(['_id' => new ObjectId($postId)]);

        if (!$post) {
            Response::error('Post not found', 404);
        }

        // Get author info
        $author = $users->findOne(['_id' => new ObjectId($post['author_id'])]);

        $postData = [
            'id' => (string)$post['_id'],
            'title' => $post['title'],
            'body' => $post['body'],
            'author_id' => $post['author_id'],
            'author_name' => $author ? $author['name'] : 'Unknown',
            'created_at' => $post['created_at']->toDateTime()->format('c'),
            'excerpt' => isset($post['excerpt']) ? $post['excerpt'] : null
        ];

        Response::success($postData);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update post
        if (!$tokenData) {
            Response::error('Authentication required', 401);
        }

        $post = $posts->findOne(['_id' => new ObjectId($postId)]);

        if (!$post) {
            Response::error('Post not found', 404);
        }

        // Check if user owns the post
        if ($post['author_id'] !== $tokenData['user_id']) {
            Response::error('Unauthorized', 403);
        }

        $data = json_decode(file_get_contents('php://input'), true);

        $updateData = [];
        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }
        if (isset($data['body'])) {
            $updateData['body'] = $data['body'];
            // Update excerpt
            $updateData['excerpt'] = mb_substr(strip_tags($data['body']), 0, 150) . '...';
        }

        if (empty($updateData)) {
            Response::error('No fields to update', 400);
        }

        $updateData['updated_at'] = new MongoDB\BSON\UTCDateTime();

        $posts->updateOne(
            ['_id' => new ObjectId($postId)],
            ['$set' => $updateData]
        );

        // Get updated post
        $updatedPost = $posts->findOne(['_id' => new ObjectId($postId)]);
        $author = $users->findOne(['_id' => new ObjectId($updatedPost['author_id'])]);

        $postData = [
            'id' => (string)$updatedPost['_id'],
            'title' => $updatedPost['title'],
            'body' => $updatedPost['body'],
            'author_id' => $updatedPost['author_id'],
            'author_name' => $author ? $author['name'] : 'Unknown',
            'created_at' => $updatedPost['created_at']->toDateTime()->format('c'),
            'excerpt' => isset($updatedPost['excerpt']) ? $updatedPost['excerpt'] : null
        ];

        Response::success($postData);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete post
        if (!$tokenData) {
            Response::error('Authentication required', 401);
        }

        $post = $posts->findOne(['_id' => new ObjectId($postId)]);

        if (!$post) {
            Response::error('Post not found', 404);
        }

        // Check if user owns the post
        if ($post['author_id'] !== $tokenData['user_id']) {
            Response::error('Unauthorized', 403);
        }

        $posts->deleteOne(['_id' => new ObjectId($postId)]);

        Response::success([], 'Post deleted successfully', 200);
    } else {
        Response::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    Response::error('Server error: ' . $e->getMessage(), 500);
}
