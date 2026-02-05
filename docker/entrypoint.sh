#!/bin/bash

# Run migrations
php artisan migrate --force

# Cache configuration, routes, and views
php artisan optimize

# Start PHP-FPM (default command for the image)
exec "$@"
