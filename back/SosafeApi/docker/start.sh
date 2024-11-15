#!/bin/bash
# docker/start.sh

# Start PHP-FPM
service php8.2-fpm start

# Start Nginx
nginx -g "daemon off;"