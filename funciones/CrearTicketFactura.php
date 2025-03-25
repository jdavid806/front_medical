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
  $empresa_direccion = $empresa['datos_consultorio'][1]['Dirección'];
  $empresa_telefono = $empresa['datos_consultorio'][2]['Teléfono'];
  $empresa_correo = $empresa['datos_consultorio'][3]['Correo'];

  $paciente_nombre = $patient['paciente_nombre'][0] . ' ' . $patient['paciente_nombre'][1] . ' ' . $patient['paciente_nombre'][2] . ' ' . $patient['paciente_nombre'][3];
  $paciente_documento = $patient['paciente_documento'];
  $paciente_direccion = $patient['paciente_direccion'];
  $paciente_telefono = $patient['paciente_telefono'];

  $numero_comprobante = $related_invoice['numero_comprobante'];
  $numero_autorizacion = $related_invoice['numero_autorizacion'];

  if ($numero_autorizacion) {
    $tipo_factura = "RECIBO DE CAJA";
    $agregar_autorizacion = true;
  } else {
    $tipo_factura = "RECIBO DE VENTA";
    $agregar_autorizacion = false;
  }

  $fecha_autorizacion = date('d-m-Y h:i A', strtotime($related_invoice['fecha_autorizacion']));
  $fecha_impresion = date('Y-m-d H:i:s');
  $fecha_factura = date('d-m-Y h:i A', strtotime($related_invoice['fecha_factura']));

  $subtotal = $related_invoice['subtotal'];
  $iva = $related_invoice['iva'];
  $total = $related_invoice['total'];
  $descuento = $related_invoice['descuento'];

  $nombre_pdf = strtolower(str_replace(' ', '_', $tipo_factura)) . "_" . date('Ymd', strtotime($related_invoice['fecha_factura'])) . "_" . $paciente_documento . ".pdf";

  $detalles_ticket_html = "<ul style='list-style-type: none; padding-left: 0;'>";
  foreach ($datails as $detalle) {
    $detalles_ticket_html .= "<li>
                                  <strong>{$detalle['producto']}</strong><br>
                                  Cantidad: {$detalle['cantidad']}<br>
                                  Precio Unitario: $" . number_format($detalle['precio_unitario'], 2) . "<br>
                                  Subtotal: $" . number_format($detalle['subtotal'], 2) . "<br>
                                  Descuento: $" . number_format($detalle['descuento'], 2) . "<br>
                                  Total: $" . number_format($detalle['total'], 2) . "<br>
                                </li><hr>";
  }
  $detalles_ticket_html .= "</ul>";

  $metodos_pago_html = "<table style='width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #000;'>";
  $metodos_pago_html .= "<tr>
                        <th style='text-align: left; border-bottom: 1px solid #000; padding: 5px;'>Método de Pago</th>
                        <th style='text-align: right; border-bottom: 1px solid #000; padding: 5px;'>Monto</th>
                      </tr>";

  foreach ($payment_methods as $metodo) {
    $metodos_pago_html .= "<tr>
                            <td style='padding: 5px;'>{$metodo['metodo']}</td>
                            <td style='text-align: right; padding: 5px;'>$" . number_format($metodo['monto'], 2) . "</td>
                          </tr>";
  }

  // Calcular y mostrar el total
  $total_pagos = array_sum(array_column($payment_methods, 'monto'));
  $metodos_pago_html .= "<tr>
                        <td style='padding: 5px; font-weight: bold;'>Total</td>
                        <td style='text-align: right; padding: 5px; font-weight: bold;'>$" . number_format($total_pagos, 2) . "</td>
                      </tr>";

  $metodos_pago_html .= "</table>";

  $footer_mensaje = "¡Gracias por su visita!";

  ob_start();
  include "../PlantillasImpresion/PlantillaTicket.php";
  $html = ob_get_clean();

  // echo $html;

  $dompdf->loadHtml($html);

  $dompdf->setPaper([0, 0, 240, 1000], 'portrait');

  $dompdf->render();

  header('Content-Type: application/pdf');
  $dompdf->stream($nombre_pdf, array("Attachment" => $descargar));
} else {
  http_response_code(405);
  echo "Acceso no permitido.";
}