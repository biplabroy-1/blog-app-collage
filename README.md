# Blog App - Full Stack Application

A modern blog application built with React frontend and PHP + MongoDB backend.

## Project Structure

```
blog-app-collage/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/           # PHP backend API
│   ├── api/
│   │   ├── auth/
│   │   ├── posts/
│   │   └── users/
│   ├── src/
│   │   ├── Auth.php
│   │   ├── Database.php
│   │   ├── Response.php
│   │   └── CORS.php
│   ├── config.php
│   ├── composer.json
│   └── index.php
└── README.md
```

## Features

- User authentication (signup, login, logout)
- Blog post CRUD operations
- User profiles with customizable information
- Responsive design with modern UI
- JWT-based authentication
- MongoDB database storage

## Prerequisites

### Frontend
- Node.js 18+
- pnpm or npm

### Backend
- PHP 8.0+ **with MongoDB extension**
- MongoDB 4.0+
- Composer
- Apache with mod_rewrite OR PHP built-in server

> **Note:** The PHP MongoDB extension is required. See [backend/INSTALLATION.md](backend/INSTALLATION.md) for installation instructions.

## Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Configure database settings in config.php
# Update DB_HOST, DB_NAME if needed
# Change JWT_SECRET for production

# Start PHP development server
php -S localhost:8000 router.php

# Or use the start script
./start.sh  # Unix/Mac
# or
start.bat  # Windows
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev
```

The frontend will be available at `http://localhost:5173` (or 8080)

### 3. MongoDB Setup

Make sure MongoDB is running on your machine:

```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: systemctl start mongod
```

The database will be created automatically when first accessed.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile (auth required)
- `GET /api/users/:userId/posts` - Get user's posts

## Configuration

### Backend Config (`backend/config.php`)
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'blog_app');
define('DB_PORT', 27017);
define('JWT_SECRET', 'your-secret-key');
```

### Frontend Config (`frontend/src/services/api.ts`)
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  isAdmin: Boolean,
  bio: String?,
  avatar_url: String?,
  location: String?,
  website: String?,
  joined_at: Date
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  title: String,
  body: String,
  author_id: String,
  excerpt: String,
  created_at: Date,
  updated_at: Date
}
```

## Development

### Backend Development
```bash
cd backend
php -S localhost:8000
```

### Frontend Development
```bash
cd frontend
pnpm dev
```

## Production Deployment

### Backend
1. Use Apache or Nginx with proper virtual host configuration
2. Update `JWT_SECRET` in config.php to a secure random string
3. Set `error_reporting(0)` in config.php
4. Enable HTTPS
5. Configure MongoDB authentication
6. Update CORS allowed origins

### Frontend
1. Build production bundle: `pnpm build`
2. Serve the `dist` folder with a web server
3. Update API_BASE_URL to production backend URL

## Technologies Used

### Frontend
- React + TypeScript
- React Router
- Tailwind CSS
- shadcn/ui components
- TanStack Query
- Vite

### Backend
- PHP 8.0+
- MongoDB
- JWT (firebase/php-jwt)
- Composer

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

