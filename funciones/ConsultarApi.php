<?php

function consultarApi($url)
{
  // Inicializamos la sesión cURL
  $ch = curl_init();

  // Configuramos la URL y las opciones cURL
  curl_setopt($ch, CURLOPT_URL, $url); // URL de la API
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Para obtener la respuesta como string
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Seguir redirecciones si las hay
  curl_setopt($ch, CURLOPT_TIMEOUT, 30); // Timeout de la solicitud

  $response = curl_exec($ch);

  // Verificamos si ocurrió algún error durante la solicitud
  if (curl_errno($ch)) {
    echo 'Error en la consulta: ' . curl_error($ch);
    curl_close($ch);
    return null; // Retornamos null si hay un error
  }

  // Obtenemos el código de estado HTTP
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  // Verificamos el código de estado HTTP
  if ($httpCode !== 200) {
    echo 'Error en la API, código HTTP: ' . $httpCode;
    return null;
  }

  // Aquí puedes realizar una validación adicional sobre la respuesta JSON, por ejemplo:
  $data = json_decode($response, true);

  // Comprobamos si la decodificación fue exitosa
  if ($data === null) {
    echo 'Error en la respuesta JSON';
    return null;
  }

  // Validamos si la respuesta contiene un campo de error
  if (isset($data['error']) && $data['error'] !== '') {
    echo 'Error en la API: ' . $data['error'];
    return null;
  }

  // Si todo es correcto, retornamos los datos
  return $data;
}
?>