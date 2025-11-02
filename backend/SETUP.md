# Backend Setup Guide

Quick setup instructions for the Blog App backend.

## Prerequisites

**IMPORTANT:** Before installing, make sure you have:
1. PHP 8.0+ with MongoDB extension installed
2. Composer installed
3. MongoDB running on your system

**Need help installing?** See [INSTALLATION.md](INSTALLATION.md) for detailed installation instructions.

## Step 1: Install Dependencies

Run this command in the `backend` directory:

```bash
composer install
```

This will install:
- `mongodb/mongodb` - MongoDB driver for PHP (requires PHP MongoDB extension)
- `firebase/php-jwt` - JWT token handling

**Note:** If you get an error about "ext-mongodb is missing", you need to install the PHP MongoDB extension. See [INSTALLATION.md](INSTALLATION.md) for instructions.

## Step 2: Configure MongoDB

Make sure MongoDB is installed and running on your system.

### Starting MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Manual start:**
```bash
mongod
```

## Step 3: Configure the Application

Edit `config.php` if your MongoDB setup differs from defaults:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'blog_app');
define('DB_PORT', 27017);
```

**IMPORTANT:** Change the JWT secret for production:
```php
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');
```

## Step 4: Start the Server

### Option A: PHP Built-in Server (Development)
```bash
php -S localhost:8000 router.php
```

**Or use the provided start scripts:**
```bash
# Unix/Mac
./start.sh

# Windows
start.bat
```

### Option B: Apache/Nginx (Production)

Configure your web server to:
- Point to the `backend` directory
- Enable mod_rewrite (Apache)
- Process `.htaccess` files

### Test the Server

Open your browser and go to:
```
http://localhost:8000/api/posts
```

You should see:
```json
{"success": true, "data": []}
```

## Troubleshooting

### Error: Class not found
Make sure you ran `composer install` and the `vendor` directory exists.

### Error: MongoDB connection failed
- Ensure MongoDB is running
- Check `DB_HOST` and `DB_PORT` in config.php
- Verify MongoDB is accessible on the configured host/port

### Error: CORS issues
Update `ALLOWED_ORIGINS` in config.php to include your frontend URL:
```php
define('ALLOWED_ORIGINS', ['http://localhost:8080', 'http://localhost:5173']);
```

### Error: Authorization header not working
Make sure your frontend is sending:
```
Authorization: Bearer <token>
```

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Posts
```bash
curl http://localhost:8000/api/posts
```

### Create Post (with token)
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My First Post","body":"This is the content"}'
```

## Next Steps

Once the backend is running:
1. Start the frontend application
2. Test signup/login functionality
3. Create your first blog post!

