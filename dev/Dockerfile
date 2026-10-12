# Entorno local parecido a produccion (HostGator: Apache/LiteSpeed + PHP 8.2). NO se sube por FTP.
FROM php:8.2-apache
RUN apt-get update && apt-get install -y --no-install-recommends libpng-dev libjpeg-dev libfreetype6-dev libzip-dev unzip curl git poppler-utils \
 && docker-php-ext-configure gd --with-jpeg --with-freetype \
 && docker-php-ext-install gd mysqli zip \
 && a2enmod rewrite headers \
 && sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf \
 && echo 'ServerName localhost' > /etc/apache2/conf-enabled/servername.conf \
 && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN echo 'mysqli.default_socket=/run/mysqld/mysqld.sock' > /usr/local/etc/php/conf.d/dev-mysql.ini
RUN { echo 'upload_max_filesize=16M'; echo 'post_max_size=40M'; echo 'memory_limit=256M'; echo 'display_errors=Off'; } > /usr/local/etc/php/conf.d/dev-uploads.ini
