<?php


require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;
$dompdf = new Dompdf();

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

  // Mostrar los valores capturados para depuración
  echo "<h2>Datos Capturados</h2>";
  echo "<strong>Título:</strong> " . htmlspecialchars($titulo) . "<br>";
  echo "<strong>Contenido:</strong> " . htmlspecialchars($contenido) . "<br>";
  echo "<strong>Tipo de Impresión:</strong> " . htmlspecialchars($tipo_Impresion) . "<br>";
  echo "<strong>Tipo de Documento:</strong> " . htmlspecialchars($tipo_documento) . "<br>";

  echo "<h3>Consultorio</h3>";
  echo "<pre>" . print_r($consultorio, true) . "</pre>";

  echo "<h3>Paciente</h3>";
  echo "<pre>" . print_r($datos_paciente, true) . "</pre>";

  echo "<h3>Doctor</h3>";
  echo "<pre>" . print_r($doctor, true) . "</pre>";

  // if ($tipo_documento == "Descarga") {
  //   $generarDescarga = true;
  // } else {
  //   $generarDescarga = false;
  // }

  // $sin_logo = empty($logo_consultorio) || in_array(strtolower(trim($logo_consultorio)), ["vacío", "No especificado", "null", ""]);
  // $sin_marca_agua = empty($marca_agua) || in_array(strtolower(trim($marca_agua)), ["vacío", "No especificado", "null", ""]);
  // $sin_firma = empty($firma_doctor) || in_array(strtolower(trim($firma_doctor)), ["vacío", "No especificado", "null", ""]);

  // if (!$sin_logo) {
  //   $tamañoDiv = "70%";
  //   $paddingDiv = "20px";
  // } else {
  //   $tamañoDiv = "100%";
  //   $paddingDiv = "0px";
  // }

  // if (!$sin_firma) {
  //   $firmaDigital = "<p><strong>Firmado Digitalmente</strong></p>";
  // } else {
  //   $firmaDigital = "";
  // }

  // $nombrePdf = $titulo . "_" . $datos_paciente['datos_basicos']['documento'] . "_" . $datos_paciente['datos_generales']['fecha_consulta'] . ".pdf";

  // ob_start();
  // include "../PlantillasImpresion/PDescargaCartaTest.php";
  // // include "../PlantillasImpresion/PDescargaCarta.php";
  // $html = ob_get_clean();

  // $options = $dompdf->getOptions();
  // $options->set(array('isRemoteEnabled' => true));
  // $options->set('defaultPaperSize', 'letter');
  // $options->set('isHtml5ParserEnabled', true);
  // $dompdf->setOptions($options);

  // $dompdf->loadHtml($html);

  // $dompdf->render();

  // header('Content-Type: application/pdf');
  // $dompdf->stream($nombrePdf, array("Attachment" => $generarDescarga));
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}
