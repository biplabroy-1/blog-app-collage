#!/bin/bash

# Start script for Blog App Backend

echo "Starting Blog App Backend..."

# Check if vendor directory exists
if [ ! -d "vendor" ]; then
    echo "Installing dependencies..."
    composer install
fi

# Check if MongoDB is running
echo "Checking MongoDB connection..."

# Start the PHP built-in server
echo "Starting PHP server on http://localhost:8000"
echo "Press Ctrl+C to stop"
php -S localhost:8000 router.php

