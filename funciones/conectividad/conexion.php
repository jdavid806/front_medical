<?php
$host = "5.78.129.143";
$port = "5432";
$user = "postgress";
$password = "A97ce2af";
$dbname = "tenantconsultorio2";

try {
  $base_de_datos = new PDO("pgsql:host=$rutaServidor;port=;dbname=$nombreBaseDeDatos", $usuario, $contraseña);
  $base_de_datos->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  echo "Ocurrió un error con la base de datos: " . $e->getMessage();
}
?>