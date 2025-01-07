#!/bin/bash
# docker/start.sh

# Function to check service health
check_service() {
    local service=$1
    local max_attempts=$2
    local attempt=1

    until "$@" &>/dev/null; do
        echo "Attempt $attempt/$max_attempts: Waiting for $service..."
        if [ $attempt -eq $max_attempts ]; then
            echo "$service failed to start after $max_attempts attempts"
            return 1
        fi
        sleep 2
        ((attempt++))
    done
    return 0
}

# Function to safely run Laravel commands
run_laravel_command() {
    local command=$1
    echo "Running: php artisan $command"
    php artisan "$command" || {
        echo "Failed to run: php artisan $command"
        return 1
    }
}

# Create storage link if it doesn't exist
if [ ! -L "/var/www/public/storage" ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

# Start PHP-FPM with proper configurations
echo "Starting PHP-FPM..."
php-fpm -D

# Verify PHP-FPM started successfully
check_service "pgrep php-fpm" 5 || exit 1

# Configure PHP for large file uploads
echo "Configuring PHP settings..."
echo "
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 600
max_input_time = 600
memory_limit = 256M
" > /usr/local/etc/php/conf.d/uploads.ini

# Optimize Laravel for production
echo "Optimizing Laravel..."
run_laravel_command "config:clear" || exit 1
run_laravel_command "config:cache" || exit 1
run_laravel_command "route:cache" || exit 1
run_laravel_command "view:cache" || exit 1

# Run migrations with proper error handling
echo "Running migrations..."
run_laravel_command "migrate --force" || {
    echo "Migration failed. Checking database connection..."
    php artisan db:monitor
    exit 1
}

# Clear old temp files
echo "Cleaning temporary upload files..."
find /tmp -type f -name "php*" -mtime +1 -delete

# Create required directories with proper permissions
echo "Setting up upload directories..."
mkdir -p /var/www/storage/app/chunks
mkdir -p /var/www/storage/app/uploads
chown -R www-data:www-data /var/www/storage
chmod -R 775 /var/www/storage

# Start queue worker in background for handling file processing
echo "Starting queue worker..."
php artisan queue:work --daemon --tries=3 --timeout=600 &

# Monitor services and restart if necessary
(
    while true; do
        if ! pgrep php-fpm > /dev/null; then
            echo "PHP-FPM died. Restarting..."
            php-fpm -D
        fi
        if ! pgrep "queue:work" > /dev/null; then
            echo "Queue worker died. Restarting..."
            php artisan queue:work --daemon --tries=3 --timeout=600 &
        fi
        sleep 30
    done
) &

# Start Nginx in foreground
echo "Starting Nginx..."
exec nginx -g "daemon off;"