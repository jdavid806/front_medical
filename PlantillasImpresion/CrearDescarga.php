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
  $tipo_Impresion = $datos['tipo_Impresion'];

  ob_start();
  switch ($tipo_Impresion) {
    case "Completa":
      include 'DescargaCompleta.php';
      break;
    case "Carta":
      include 'DescargaMediaCarta.php';
      break;
    default:
      include 'DescargaCompleta.php';
      break;
  }
  $html = ob_get_clean();

  echo $html;
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}



// DEscarga con DomPDF
// require '../vendor/autoload.php';

// use Dompdf\Dompdf;
// use Dompdf\Options;

// $options = new Options();
// $options->set('isRemoteEnabled', true);
// $dompdf = new Dompdf($options);

// if ($_SERVER["REQUEST_METHOD"] == "POST") {


//   $datosJSON = file_get_contents("php://input");
//   $datos = json_decode($datosJSON, true);

//   if (!$datos) {
//     http_response_code(400);
//     echo "Error en los datos enviados.";
//     exit;
//   }

//   $titulo = $datos['titulo'];
//   $consultorio = $datos['consultorio'];
//   $logo_consultorio = $consultorio['logo_consultorio'];
//   $nombre_consultorio = $consultorio['nombre_consultorio'];
//   $marca_agua = '<img src="' . $consultorio['marca_agua'] . '" alt="Marca de Agua" class="img-fluid">';
//   $datos_consultorio = $consultorio['datos_consultorio'];
//   $datos_paciente = $datos['paciente'];
//   $contenido = $datos['contenido'];
//   $doctor = $datos['doctor'];
//   $nombre_doctor = $doctor['nombre'];
//   $especialidad_doctor = $doctor['especialidad'];
//   $firma_doctor = $doctor['firma'];
//   $tipo_Impresion = $datos['tipo_Impresion'];


//   $sin_logo = empty($logo_consultorio) || in_array(strtolower(trim($logo_consultorio)), ["vacío", "No especificado", "null", ""]);
//   $sin_marca_agua = empty($marca_agua) || in_array(strtolower(trim($marca_agua)), ["vacío", "No especificado", "null", ""]);
//   $sin_firma = empty($firma_doctor) || in_array(strtolower(trim($firma_doctor)), ["vacío", "No especificado", "null", ""]);

//   if (!$sin_logo) {
//     $tamañoDiv = "70%";
//     $paddingDiv = "20px";
//   } else {
//     $tamañoDiv = "100%";
//     $paddingDiv = "0px";
//   }

//   if (!$sin_firma) {
//     $firmaDigital = "<p><strong>Firmado Digitalmente</strong></p>";
//   } else {
//     $firmaDigital = "";
//   }

//   ob_start();
//   switch ($tipo_Impresion) {
//     case "Completa":
//       include 'DescargaCompleta.php';
//       break;
//     default:
//       include 'DescargaCompleta.php';
//       break;
//   }
//   $html = ob_get_clean();

//   // echo $html;

//   $dompdf->loadHtml($html);

//   $dompdf->render();

//   $dompdf->stream($titulo . ".pdf", array("Attachment" => true));

// } else {
//   http_response_code(405);
//   echo "Acceso no permitido.";
// }