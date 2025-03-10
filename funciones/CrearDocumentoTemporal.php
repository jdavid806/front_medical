<?php

require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// Configurar Dompdf
$options = new Options();
$options->set('isRemoteEnabled', true);
$options->set('defaultPaperSize', 'letter');
$options->set('isHtml5ParserEnabled', true);

$dompdf = new Dompdf($options);

// **Ruta personalizada para almacenar PDFs**
$rutaPersonalizada = "../documentos_generados/"; // Cambia esta ruta según tu necesidad

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  $titulo = $_POST['titulo'];

  $consultorio = json_decode($_POST['consultorio'], true);
  $logo_consultorio = $consultorio['logo_consultorio'];
  $nombre_consultorio = $consultorio['nombre_consultorio'];
  $marca_agua = $consultorio['marca_agua'];
  $datos_consultorio = $consultorio['datos_consultorio'];

  $datos_paciente = json_decode($_POST['paciente'], true);

  $contenido = $_POST['contenido'];

  $doctor = json_decode($_POST['doctor'], true);
  $nombre_doctor = $doctor['nombre'];
  $especialidad_doctor = $doctor['especialidad'];
  $firma_doctor = $doctor['firma'];

  $tipo_Impresion = $_POST['tipo_Impresion'];
  $tipo_documento = $_POST['tipoDocumento'];

  $sin_logo = empty($logo_consultorio) || in_array(strtolower(trim($logo_consultorio)), ["vacío", "No especificado", "null", ""]);
  $sin_marca_agua = empty($marca_agua) || in_array(strtolower(trim($marca_agua)), ["vacío", "No especificado", "null", ""]);
  $sin_firma = empty($firma_doctor) || in_array(strtolower(trim($firma_doctor)), ["vacío", "No especificado", "null", ""]);

  if (!$sin_logo) {
    $tamañoDiv = "70%";
    $paddingDiv = "20px";
  } else {
    $tamañoDiv = "100%";
    $paddingDiv = "0px";
  }

  if (!$sin_firma) {
    $firmaDigital = "<p><strong>Firmado Digitalmente</strong></p>";
  } else {
    $firmaDigital = "";
  }

  ob_start();
  include "../PlantillasImpresion/PDescargaCarta.php";
  $html = ob_get_clean();

  $dompdf->loadHtml($html);
  $dompdf->render();

  // **Verificar si la carpeta personalizada existe, si no, crearla**
  if (!is_dir($rutaPersonalizada)) {
    mkdir($rutaPersonalizada, 0777, true);
  }

  // **Eliminar archivos antiguos (mayores a 1 día)**
  $files = glob($rutaPersonalizada . "*.pdf");
  $now = time();
  foreach ($files as $file) {
    if (is_file($file) && $now - filemtime($file) > 86400) { // 86400 segundos = 1 día
      unlink($file);
    }
  }

  // **Generar un nombre único para el archivo**
  $filename = "documento_" . time() . ".pdf";
  $filePath = $rutaPersonalizada . $filename;

  // **Guardar el PDF en la carpeta personalizada**
  file_put_contents($filePath, $dompdf->output());

  // **Retornar la ruta del archivo en JSON**
  echo json_encode(["ruta" => $filePath]);

} else {
  http_response_code(405);
  echo json_encode(["error" => "Acceso no permitido."]);
}
