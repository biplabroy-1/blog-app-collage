# Quick Start Guide

Get the Blog App running in 5 minutes!

## Prerequisites Check

Make sure you have installed:
- ✅ PHP 8.0+ (`php -v`)
- ✅ Composer (`composer --version`)
- ✅ MongoDB (`mongod --version`)
- ✅ Node.js 18+ (`node -v`)
- ✅ pnpm or npm (`pnpm -v`)

## Step-by-Step Setup

### 1. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or manually
mongod
```

### 2. Start Backend
```bash
cd backend

# Install dependencies (first time only)
composer install

# Start server
php -S localhost:8000 router.php

# Or use the start script
./start.sh  # Unix/Mac
start.bat   # Windows
```

✅ Backend running at: http://localhost:8000

### 3. Start Frontend
```bash
cd frontend

# Install dependencies (first time only)
pnpm install

# Start development server
pnpm dev
```

✅ Frontend running at: http://localhost:3000

### 4. Test the App

1. Open http://localhost:3000 in your browser
2. Click "Get Started" to sign up
3. Create your first blog post!

## Troubleshooting

### "Composer not found"
Install Composer: https://getcomposer.org/download/

### "MongoDB connection failed"
Make sure MongoDB is running and accessible on localhost:27017

### "Port already in use"
Change the port in the PHP command: `php -S localhost:8001`

### "Permission denied"
Make sure MongoDB has read/write permissions on its data directory

### Backend not starting
Check PHP version: `php -v` (must be 8.0+)

## Next Steps

- Read the [README.md](README.md) for full documentation
- Check [backend/SETUP.md](backend/SETUP.md) for backend details
- See [backend/API_SUMMARY.md](backend/API_SUMMARY.md) for all endpoints

## Quick Commands Reference

```bash
# Start MongoDB
mongod

# Start Backend
cd backend && php -S localhost:8000 router.php

# Start Frontend  
cd frontend && pnpm dev

# Stop servers
# Press Ctrl+C in each terminal
```

That's it! 🎉

