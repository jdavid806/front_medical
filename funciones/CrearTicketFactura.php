<?php
$user_ip = $_SERVER['REMOTE_ADDR'];
$response = file_get_contents("http://ip-api.com/json/$user_ip");
$data = json_decode($response, true);

if ($data && $data['status'] === 'success') {

  $timezone = $data['timezone'];
  date_default_timezone_set($timezone);
} else {
  date_default_timezone_set('America/Bogota'); // Fallback a una zona por defecto
}

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

    // Extraer datos de la admisión
    $admission = $respuesta['admission'];
    $patient = $admission['patient'];
    $user = $respuesta['user'];
    $related_invoice = $respuesta['related_invoice'][0];

    // Datos de la empresa (puedes personalizarlos)
    $empresa_nombre = "FARMACIA DELIVERY";
    $empresa_direccion = "Av. Principal 123, Ciudad";
    $empresa_telefono = "+1 234 567 890";

    // Datos del paciente
    $paciente_nombre = $patient['first_name'] . ' ' . $patient['middle_name'] . ' ' . $patient['last_name'] . ' ' . $patient['second_last_name'];
    $paciente_documento = $patient['document_type'] . " " . $patient['document_number'];
    $paciente_direccion = $patient['address'];
    $paciente_telefono = $patient['whatsapp'] ?? 'No disponible';

    // Datos de la factura
    $numero_comprobante = $related_invoice['invoice_code'];
    $numero_autorizacion = $related_invoice['resolution_number'];
    $fecha_autorizacion = $related_invoice['created_at'];
    $fecha_impresion = date('Y-m-d H:i:s');
    $fecha_factura = $related_invoice['created_at'];

    $subtotal = $related_invoice['subtotal'];
    $iva = $related_invoice['iva'];
    $total = $related_invoice['total_amount'];
    $descuento = $related_invoice['discount'];

    // Métodos de pago
    $pago_metodo = $related_invoice['payments'][0]['payment_method_id'] ?? 'No especificado';
    $pago_monto = $related_invoice['payments'][0]['amount'] ?? '0.00';

    // Items facturados
    $items = $related_invoice['details'];
    $detalle_items = "";
    foreach ($items as $item) {
      $detalle_items .= $item['quantity'] . "x " . $item['amount'] . " - $" . $item['unit_price'] . "\n";
    }

    // Mensaje final
    $footer_mensaje = "¡Gracias por su compra!";


    ob_start();
    include "../PlantillasImpresion/PlantillaTicket.php";
    $html = ob_get_clean();

  } catch (Exception $e) {
    echo "Error al generar la factura: " . $e->getMessage();
  }


  $dompdf->loadHtml($html);

  $dompdf->setPaper([0, 0, 240, 1000], 'portrait');

  $dompdf->render();

  header('Content-Type: application/pdf');
  $dompdf->stream("ticket.pdf", array("Attachment" => false));
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}