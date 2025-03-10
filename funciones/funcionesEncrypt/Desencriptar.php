<?php
function decryptData($encryptedData, $iv, $secretKey)
{
  $cipher = "aes-256-gcm";
  $key = substr(hash("sha256", $secretKey, true), 0, 32); // Asegurar clave de 256 bits
  $iv = base64_decode($iv);
  $data = base64_decode($encryptedData);

  return openssl_decrypt($data, $cipher, $key, OPENSSL_RAW_DATA, $iv);
}

$secretKey = "Ñ123AjIL*";

if (isset($_GET['datos'])) {
  $jsonDatos = json_decode($_GET['datos'], true);

  $iv = base64_encode(implode(array_map("chr", $jsonDatos["iv"])));
  $encryptedData = $jsonDatos["encrypted"];

  $decrypted = decryptData($encryptedData, $iv, $secretKey);

  if ($decrypted) {
    $datos = json_decode($decrypted, true);
    print_r($datos);
  } else {
    echo "Error al descifrar los datos";
  }
}
?>