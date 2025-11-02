@echo off
REM Start script for Blog App Backend (Windows)

echo Starting Blog App Backend...

REM Check if vendor directory exists
if not exist "vendor" (
    echo Installing dependencies...
    composer install
)

REM Start the PHP built-in server
echo Starting PHP server on http://localhost:8000
echo Press Ctrl+C to stop
php -S localhost:8000 router.php

