FROM php:8.2-apache

# Habilitar módulos de Apache
RUN a2enmod rewrite mime

# Copiar la configuración de Apache
COPY apache-config/000-default.conf /etc/apache2/sites-available/000-default.conf

# Reiniciar Apache
CMD ["apache2-foreground"]