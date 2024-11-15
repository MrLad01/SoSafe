#!/bin/bash
# docker/start.sh

# Start PHP-FPM
php-fpm -D

# Run any pending migrations (optional, remove if not needed)
php artisan migrate --force

# Start Nginx
nginx -g "daemon off;"