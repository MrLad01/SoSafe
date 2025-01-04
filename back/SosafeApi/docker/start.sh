#!/bin/bash
# docker/start.sh

# Wait for any dependent services (if you're using them)
# Uncomment if you have external dependencies like MySQL
# while ! nc -z db 3306; do
#   echo "Waiting for MySQL Database to start..."
#   sleep 2
# done

# Start PHP-FPM
php-fpm -D

# Verify PHP-FPM started successfully
if [ $? -ne 0 ]; then
    echo "Failed to start PHP-FPM"
    exit 1
fi

# Clear and cache Laravel configuration
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (with error handling)
php artisan migrate --force || {
    echo "Migration failed"
    exit 1
}


# Start Nginx in foreground
echo "Starting Nginx..."
nginx -g "daemon off;"