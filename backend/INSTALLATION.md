# Backend Installation Guide

Complete installation instructions for the Blog App backend.

## Prerequisites

Before starting, ensure you have the following installed:

### 1. PHP 8.0 or Higher

**Check if PHP is installed:**
```bash
php -v
```

**Install PHP if needed:**
- Windows: Download from https://windows.php.net/download/
- macOS: `brew install php` or use MAMP/XAMPP
- Linux: `sudo apt install php php-cli php-common` (Ubuntu/Debian)

### 2. Composer

**Check if Composer is installed:**
```bash
composer --version
```

**Install Composer:**
- Download from https://getcomposer.org/download/
- Or use: `curl -sS https://getcomposer.org/installer | php`

### 3. MongoDB

**Check if MongoDB is installed:**
```bash
mongod --version
```

**Install MongoDB:**
- Windows: Download from https://www.mongodb.com/try/download/community
- macOS: `brew install mongodb-community`
- Linux: Follow instructions at https://www.mongodb.com/docs/manual/installation/

### 4. PHP MongoDB Extension (IMPORTANT!)

This is required for the MongoDB PHP library to work.

#### Windows Installation

1. Download the MongoDB extension DLL from:
   https://pecl.php.net/package/mongodb

2. Find your PHP version and architecture:
   ```bash
   php -v
   php -i | findstr "Thread Safety"
   ```

3. Place the downloaded `php_mongodb.dll` in your PHP `ext` folder

4. Edit `php.ini` and add:
   ```ini
   extension=mongodb
   ```

5. Restart your web server

#### macOS Installation (Homebrew)

```bash
# Install PHP MongoDB extension via PECL
pecl install mongodb

# Add to php.ini
echo "extension=mongodb.so" >> /opt/homebrew/etc/php/8.2/php.ini

# Restart PHP-FPM if using it
brew services restart php
```

#### Linux Installation (Ubuntu/Debian)

```bash
# Install via PECL
sudo apt install php-pear php-dev
sudo pecl install mongodb

# Add to php.ini
echo "extension=mongodb.so" | sudo tee -a /etc/php/8.2/cli/php.ini
echo "extension=mongodb.so" | sudo tee -a /etc/php/8.2/apache2/php.ini

# Restart Apache if using it
sudo systemctl restart apache2
```

#### Alternative: Using apt/yum packages

**Ubuntu/Debian:**
```bash
sudo apt install php-mongodb
sudo systemctl restart apache2
```

**CentOS/RHEL:**
```bash
sudo yum install php-mongodb
sudo systemctl restart httpd
```

#### Verify Installation

Check if MongoDB extension is loaded:
```bash
php -m | grep mongodb
```

Or create a test file:
```php
<?php
phpinfo();
```

Look for "mongodb" in the output.

## Installation Steps

### Step 1: Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or start manually:**
```bash
mongod
```

### Step 2: Install PHP Dependencies

```bash
cd backend
composer install
```

This will install:
- `mongodb/mongodb` - MongoDB driver (requires PHP extension)
- `firebase/php-jwt` - JWT token handling

**If you get "ext-mongodb is missing" error:**
- Follow the PHP MongoDB Extension installation steps above
- Or temporarily skip: `composer install --ignore-platform-req=ext-mongodb` (not recommended)

### Step 3: Configure the Application

Edit `config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'blog_app');
define('DB_PORT', 27017);

// IMPORTANT: Change this in production!
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');

// Update this with your frontend URL
define('ALLOWED_ORIGINS', ['http://localhost:8080', 'http://localhost:5173']);
```

### Step 4: Verify Installation

**Test PHP version:**
```bash
php -v  # Should be 8.0 or higher
```

**Test MongoDB connection:**
```bash
mongosh
show dbs
exit
```

**Test Composer packages:**
```bash
php vendor/autoload.php
```

### Step 5: Start the Server

**Development (PHP built-in server):**
```bash
php -S localhost:8000
```

**Or use the provided scripts:**
```bash
# Windows
start.bat

# Unix/Mac
./start.sh
```

**Production (Apache/Nginx):**
- Configure virtual host to point to backend directory
- Enable mod_rewrite (Apache)
- Ensure .htaccess is being processed

### Step 6: Test the API

Open your browser and navigate to:
```
http://localhost:8000/api/posts
```

You should see:
```json
{
  "success": true,
  "data": []
}
```

Or use curl:
```bash
curl http://localhost:8000/api/posts
```

## Troubleshooting

### "Class 'MongoDB\\Client' not found"

**Solution:** PHP MongoDB extension is not installed or enabled.
- Follow the PHP MongoDB Extension installation steps above
- Verify with: `php -m | grep mongodb`
- Restart your web server

### "Connection refused to localhost:27017"

**Solution:** MongoDB is not running.
```bash
# Check MongoDB status
# Windows: net start | findstr MongoDB
# macOS: brew services list | grep mongodb
# Linux: sudo systemctl status mongod

# Start MongoDB
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### "Could not resolve host"

**Solution:** DNS issue or MongoDB not on localhost.
- Edit `config.php` and change `DB_HOST` if MongoDB is on a different host
- Check MongoDB connection: `mongosh mongodb://localhost:27017`

### "Composer not found"

**Solution:** Install Composer.
- Windows: Download and run Composer-Setup.exe
- Unix/Mac: `curl -sS https://getcomposer.org/installer | php`
- Or install system-wide: https://getcomposer.org/doc/00-intro.md

### "No such file or directory"

**Solution:** Wrong directory.
```bash
cd backend
pwd  # Verify you're in the correct directory
```

### CORS Errors from Frontend

**Solution:** Update `ALLOWED_ORIGINS` in config.php.
```php
define('ALLOWED_ORIGINS', ['http://localhost:5173', 'http://localhost:8080']);
```

### PHP Built-in Server Not Working

**Solution:** Try a different port or check if it's already in use.
```bash
php -S localhost:8001  # Use different port
```

Or check what's using port 8000:
```bash
# Windows
netstat -ano | findstr :8000

# Unix/Mac
lsof -i :8000
```

## Next Steps

Once the backend is running:
1. Follow the [SETUP.md](SETUP.md) guide
2. Test the API endpoints
3. Start the frontend application
4. Read the [API_SUMMARY.md](API_SUMMARY.md) for API documentation

## Production Deployment

For production deployment:
1. Install PHP-FPM and configure nginx or Apache
2. Set up SSL/HTTPS
3. Configure MongoDB authentication
4. Update JWT_SECRET to a strong random string
5. Disable PHP error display
6. Set up proper firewall rules
7. Configure backups
8. Set up monitoring

## Need Help?

- MongoDB: https://www.mongodb.com/docs/manual/installation/
- PHP MongoDB Extension: https://www.php.net/manual/en/mongodb.installation.php
- Composer: https://getcomposer.org/doc/
- JWT: https://github.com/firebase/php-jwt

