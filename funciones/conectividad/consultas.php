<?php
function obtenerDatos($tabla, $id)
{
  $url = "http://consultorio2.medicalsoft.ai/medical/$tabla/$id";

  $respuesta = @file_get_contents($url);
  if ($respuesta === FALSE) {
    return ["error" => "No se pudo obtener la información"];
  }

  return json_decode($respuesta, true);
}
?>