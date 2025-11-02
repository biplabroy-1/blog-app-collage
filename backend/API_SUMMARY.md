# API Summary

Complete list of all API endpoints in the Blog App backend.

## Base URL
```
http://localhost:8000/api
```

## Authentication Endpoints

### POST /api/auth/login
User login.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "isAdmin": false,
      "bio": null,
      "avatar_url": null,
      "location": null,
      "website": null,
      "joined_at": "2024-01-01T00:00:00+00:00"
    }
  }
}
```

### POST /api/auth/signup
User registration.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "isAdmin": false,
      "bio": null,
      "avatar_url": null,
      "location": null,
      "website": null,
      "joined_at": "2024-01-01T00:00:00+00:00"
    }
  }
}
```

## Posts Endpoints

### GET /api/posts
Get all posts (no auth required).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Post Title",
      "body": "Post content...",
      "author_id": "507f1f77bcf86cd799439012",
      "author_name": "John Doe",
      "created_at": "2024-01-01T00:00:00+00:00",
      "excerpt": "Post content first 150 chars..."
    }
  ]
}
```

### POST /api/posts
Create a new post (auth required).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "My Post",
  "body": "This is my post content"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "My Post",
    "body": "This is my post content",
    "author_id": "507f1f77bcf86cd799439012",
    "author_name": "John Doe",
    "created_at": "2024-01-01T00:00:00+00:00",
    "excerpt": "This is my post content..."
  }
}
```

### GET /api/posts/:id
Get a specific post (no auth required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Post Title",
    "body": "Post content...",
    "author_id": "507f1f77bcf86cd799439012",
    "author_name": "John Doe",
    "created_at": "2024-01-01T00:00:00+00:00",
    "excerpt": "Post content..."
  }
}
```

### PUT /api/posts/:id
Update a post (auth required, must own post).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Updated Title",
  "body": "Updated content"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "body": "Updated content",
    "author_id": "507f1f77bcf86cd799439012",
    "author_name": "John Doe",
    "created_at": "2024-01-01T00:00:00+00:00",
    "excerpt": "Updated content..."
  }
}
```

### DELETE /api/posts/:id
Delete a post (auth required, must own post).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": []
}
```

## Users Endpoints

### GET /api/users/:userId
Get user profile (no auth required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false,
    "bio": "This is my bio",
    "avatar_url": "https://example.com/avatar.jpg",
    "location": "New York, USA",
    "website": "https://example.com",
    "joined_at": "2024-01-01T00:00:00+00:00"
  }
}
```

### PUT /api/users/:userId
Update user profile (auth required, must own profile).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "name": "New Name",
  "bio": "Updated bio",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "location": "Los Angeles, USA",
  "website": "https://mywebsite.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "email": "user@example.com",
    "name": "New Name",
    "isAdmin": false,
    "bio": "Updated bio",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "location": "Los Angeles, USA",
    "website": "https://mywebsite.com",
    "joined_at": "2024-01-01T00:00:00+00:00"
  }
}
```

### GET /api/users/:userId/posts
Get all posts by a specific user (no auth required).

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Post Title",
      "body": "Post content...",
      "author_id": "507f1f77bcf86cd799439012",
      "author_name": "John Doe",
      "created_at": "2024-01-01T00:00:00+00:00",
      "excerpt": "Post content..."
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (not authorized to perform action)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are valid for 7 days.

## CORS

CORS is enabled for:
- `http://localhost:8080`
- `http://localhost:5173`

Update `ALLOWED_ORIGINS` in `config.php` to add more origins.

