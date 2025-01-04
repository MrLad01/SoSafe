#!/bin/sh
php artisan migrate --force
php artisan config:cache
php -S 0.0.0.0:$PORT -t public