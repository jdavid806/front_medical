FROM php:8.2-apache

# Habilitar mod_rewrite y mod_mime
RUN a2enmod rewrite mime

# Copiar los archivos del proyecto al contenedor
COPY . /var/www/html/

# Copiar el archivo .htaccess a la raíz del proyecto
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Reiniciar Apache para aplicar cambios
CMD ["apache2-foreground"]
