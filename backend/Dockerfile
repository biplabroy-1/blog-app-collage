FROM php:8.2-apache

# install system deps and mongodb extension
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    libssl-dev \
    pkg-config \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Copy composer from the official composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy app
COPY . /var/www/html

# Install PHP dependencies (composer)
RUN composer install --no-dev --optimize-autoloader --no-interaction || true

# Ensure correct permissions for apache user
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
