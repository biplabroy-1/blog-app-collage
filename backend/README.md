# Blog App Backend API

PHP + MongoDB backend for the Blog App.

## Requirements

- PHP 8.0 or higher
- MongoDB 4.0 or higher
- Composer
- Apache with mod_rewrite enabled

## Installation

1. Install Composer dependencies:
```bash
cd backend
composer install
```

2. Configure MongoDB connection in `config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'blog_app');
define('DB_PORT', 27017);
```

3. Update JWT secret in `config.php` (IMPORTANT for production):
```php
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');
```

4. Create the MongoDB database:
The database will be created automatically when first accessed.

5. Start the PHP built-in server (for development):
```bash
php -S localhost:8000
```

Or configure Apache to point to the backend directory.

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/signup
Register a new user.
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Posts

#### GET /api/posts
Get all posts (sorted by newest first).

#### POST /api/posts
Create a new post (requires authentication).
```json
{
  "title": "Post Title",
  "body": "Post content here..."
}
```

#### GET /api/posts/{id}
Get a specific post by ID.

#### PUT /api/posts/{id}
Update a post (requires authentication, must own the post).
```json
{
  "title": "Updated Title",
  "body": "Updated content..."
}
```

#### DELETE /api/posts/{id}
Delete a post (requires authentication, must own the post).

### Users

#### GET /api/users/{userId}
Get user profile by ID.

#### PUT /api/users/{userId}
Update user profile (requires authentication, must own the profile).
```json
{
  "name": "New Name",
  "bio": "User bio...",
  "avatar_url": "https://example.com/avatar.jpg",
  "location": "City, Country",
  "website": "https://example.com"
}
```

#### GET /api/users/{userId}/posts
Get all posts by a specific user.

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

JWT tokens are valid for 7 days.

## Response Format

Success response:
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message"
}
```

## CORS

CORS is enabled for the following origins:
- http://localhost:8080
- http://localhost:5173

Update `ALLOWED_ORIGINS` in `config.php` to add more origins.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  isAdmin: Boolean (default: false),
  bio: String (optional),
  avatar_url: String (optional),
  location: String (optional),
  website: String (optional),
  joined_at: Date (auto)
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  body: String (required),
  author_id: String (required),
  excerpt: String (auto-generated),
  created_at: Date (auto),
  updated_at: Date (auto)
}
```

## Development

For development, you can use the PHP built-in server:
```bash
php -S localhost:8000
```

Make sure to update the frontend API_BASE_URL to match your backend URL.

## Production Deployment

For production:
1. Update JWT_SECRET to a secure random string
2. Set `error_reporting(0)` and `display_errors` to 0 in `config.php`
3. Configure proper Apache/Nginx virtual host
4. Enable HTTPS
5. Update ALLOWED_ORIGINS to your production domain
6. Set up proper MongoDB authentication
7. Use environment variables for sensitive configuration

## License

MIT

