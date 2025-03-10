<?php
require '../vendor/autoload.php';
use Dompdf\Dompdf;
use Dompdf\Options;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $datosJSON = file_get_contents("php://input");
  $datos = json_decode($datosJSON, true);

  if (!$datos) {
    http_response_code(400);
    echo json_encode(["error" => "Error en los datos enviados."]);
    exit;
  }

  $titulo = $datos['titulo'];
  $consultorio = $datos['consultorio'];
  $datos_paciente = $datos['paciente'];
  $contenido = $datos['contenido'];
  $doctor = $datos['doctor'];
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

  $options = new Options();
  $options->set('isHtml5ParserEnabled', true);
  $dompdf = new Dompdf($options);
  $dompdf->loadHtml($html);
  $dompdf->setPaper('A4', 'portrait');
  $dompdf->render();

  $tempDir = sys_get_temp_dir();
  $fileName = 'reporte_' . time() . '.pdf';
  $filePath = $tempDir . DIRECTORY_SEPARATOR . $fileName;

  file_put_contents($filePath, $dompdf->output());

  echo json_encode(["ruta" => $filePath]);
} else {
  http_response_code(405);
  echo json_encode(["error" => "Acceso no permitido."]);
}
