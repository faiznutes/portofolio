FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    bash \
    git \
    curl \
    unzip \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    sqlite-dev \
    && docker-php-ext-install \
    bcmath \
    intl \
    mbstring \
    pdo \
    pdo_sqlite \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY backend/ ./

RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

RUN mkdir -p database storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

EXPOSE 8000

CMD ["sh", "-lc", "[ -f .env ] || cp .env.example .env; php artisan migrate --force; php artisan serve --host=0.0.0.0 --port=8000 --no-reload"]
