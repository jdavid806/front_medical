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
  $options = new Options();
  $options->set('isRemoteEnabled', true);
  $options->set('isHtml5ParserEnabled', true);

  $dompdf = new Dompdf($options);

  $datos = json_decode($_POST['data'], true);

  if (!$datos) {
    http_response_code(400);
    echo "Error: Datos mal enviados";
    exit;
  }

  // Extraer los datos recibidos
  $empresa = $datos['empresa'];
  $patient = $datos['paciente'];
  $related_invoice = $datos['factura'];
  $payment_methods = $datos['metodos_pago'];
  $total_payment = $datos['total_pagado'];
  $datails = $datos['detalles'];
  $descargar = $datos['descargar'];

  $empresa_nombre = $empresa['nombre_consultorio'];
  $empresa_direccion = $empresa['datos_consultorio'][0]['Dirección'];
  $empresa_telefono = $empresa['datos_consultorio'][1]['Teléfono'];
  $empresa_correo = $empresa['datos_consultorio'][2]['Correo'];

  $paciente_nombre = $patient['paciente_nombre'][0] . ' ' . $patient['paciente_nombre'][1] . ' ' . $patient['paciente_nombre'][2] . ' ' . $patient['paciente_nombre'][3];
  $paciente_documento = $patient['paciente_documento'];
  $paciente_direccion = $patient['paciente_direccion'];
  $paciente_telefono = $patient['paciente_telefono'];

  $numero_comprobante = $related_invoice['numero_comprobante'];
  $numero_autorizacion = $related_invoice['numero_autorizacion'];
  $fecha_autorizacion = date('d-m-Y h:i A', strtotime($related_invoice['fecha_autorizacion']));
  $fecha_impresion = date('Y-m-d H:i:s');
  $fecha_factura = date('d-m-Y h:i A', strtotime($related_invoice['fecha_factura']));

  $subtotal = $related_invoice['subtotal'];
  $iva = $related_invoice['iva'];
  $total = $related_invoice['total'];
  $descuento = $related_invoice['descuento'];

  $pago_monto = $total_payment;

  $detalle_items = "";
  foreach ($datails as $item) {
    $detalle_items .= "{$item['producto']}x {$item['cantidad']} - \${$item['precio_unitario']}\n";
  }

  $footer_mensaje = "¡Gracias por su compra!";

  ob_start();
  include "../PlantillasImpresion/PlantillaTicket.php";
  $html = ob_get_clean();

  // echo $html;

  $dompdf->loadHtml($html);

  $dompdf->setPaper([0, 0, 240, 1000], 'portrait');

  $dompdf->render();

  header('Content-Type: application/pdf');
  $dompdf->stream("ticket.pdf", array("Attachment" => $descargar));
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}