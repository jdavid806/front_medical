<?php
include "../funciones/funcionesEncrypt/encriptar.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  $datosJSON = file_get_contents("php://input");
  $datos = json_decode($datosJSON, true);

  if (!$datos) {
    http_response_code(400);
    echo "Error en los datos enviados.";
    exit;
  }

  $titulo = $datos['titulo'];
  $consultorio = $datos['consultorio'];
  $logo_consultorio = $consultorio['logo_consultorio'];
  $nombre_consultorio = $consultorio['nombre_consultorio'];
  $marca_agua = '<img src="' . $consultorio['marca_agua'] . '" alt="Marca de Agua" class="img-fluid">';
  $datos_consultorio = $consultorio['datos_consultorio'];
  $datos_paciente = $datos['paciente'];
  $contenido = $datos['contenido'];
  $doctor = $datos['doctor'];
  $nombre_doctor = $doctor['nombre'];
  $especialidad_doctor = $doctor['especialidad'];
  $firma_doctor = $doctor['firma'];
  $sello_doctor = $doctor['sello'];
  $tipo_Impresion = $datos['tipo_Impresion'];

  ob_start();
  switch ($tipo_Impresion) {
    case "Completa":
      include 'PlantillaCompleta.php';
      break;
    case "Carta":
      include 'PlantillaMediaCarta.php';
      break;
    default:
      include 'ImpresionCompleta.php';
      break;
  }
  $html = ob_get_clean();

  $html .= "<script>
  window.onload = function () {
    window.print();
  };
</script>";

  echo $html;
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}