FROM php:8.3-cli-alpine

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

COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

COPY backend/ ./

RUN mkdir -p database storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chmod -R 777 storage bootstrap/cache database

EXPOSE 8000

CMD ["sh", "-lc", "[ -f .env ] || cp .env.example .env; php artisan key:generate --force; php artisan migrate --force; php artisan db:seed --force; php artisan serve --host=0.0.0.0 --port=8000"]
