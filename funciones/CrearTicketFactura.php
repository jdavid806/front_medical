<?php
require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $rutaApi = rtrim($_POST['rutaApi'], "/");

  $options = new Options();
  $options->set('isRemoteEnabled', true);
  $options->set('isHtml5ParserEnabled', true);

  $dompdf = new Dompdf($options);

  try {

    // Inicializamos cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $rutaApi);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    // Ejecutamos la solicitud y guardamos la respuesta
    $response = curl_exec($ch);

    // Verificamos errores de cURL
    if (curl_errno($ch)) {
      throw new Exception("Error en la solicitud API: " . curl_error($ch));
    }

    // Cerramos cURL
    curl_close($ch);

    // Decodificamos la respuesta
    $respuesta = json_decode($response, true);

    var_dump($respuesta);

    // if ($cita && isset($cita['nombre_paciente'])) {
    //   echo "<h1>Factura de la cita #{$idCita}</h1>";
    //   echo "<p>Paciente: " . htmlspecialchars($cita['nombre_paciente']) . "</p>";
    //   echo "<p>Fecha: " . htmlspecialchars($cita['fecha']) . "</p>";
    //   echo "<p>Servicio: " . htmlspecialchars($cita['servicio']) . "</p>";
    //   echo "<p>Total: $" . number_format($cita['total'], 2) . "</p>";
    // } else {
    //   echo "Cita no encontrada o datos incompletos.";
    // }

  } catch (Exception $e) {
    echo "Error al generar la factura: " . $e->getMessage();
  }


  ob_start();
  include "../PlantillasImpresion/PlantillaTicket.php";
  $html = ob_get_clean();

  echo $html;


  // $dompdf->loadHtml($html);

  // $dompdf->setPaper([0, 0, 164, 1000], 'portrait');

  // $dompdf->render();

  // header('Content-Type: application/pdf');
// $dompdf->stream("ticket.pdf", array("Attachment" => false));
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}