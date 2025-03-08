<?php
require_once '../dompdf_php5/autoload.inc.php';

use Dompdf\Dompdf;


// Leer el cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);


if (empty($data)) {
    echo json_encode(['status' => 'error', 'message' => 'Se requieren los parámetros.']);
    http_response_code(400);
    return;
}


// Extraer datos de la solicitud
$width = $data['width'] ?? 816; // Ancho en px
$height = $data['height'] ?? 1056; // Alto en px
$nameSheet = $data['nameSheet'] ?? "document.pdf";
$marginTop = $data['marginTop'] ?? 0;
$marginBottom = $data['marginBottom'] ?? 0;
$headerContent = $data['headerContent'] ?? '';
$headerHeight = $data['headerHeight'] ?? 0;
$bodyContent = $data['bodyContent'] ?? '';
$footerContent = $data['footerContent'] ?? '';
$footerHeight = $data['footerHeight'] ?? 0;
$isSignatureEnabled = $data['isSignatureEnabled'] ?? false;
$signature = $data['signature'] ?? null;

// Crear contenido HTML para el PDF
$html = '<html><body style="margin:0; padding:0;">';

// Encabezado
if ($headerHeight > 0 && !empty($headerContent)) {
    $html .= '<div style="width:100%; height:' . $headerHeight . 'px; position:fixed; top:0; left:0; text-align:center; background-color:lightgray;">';
    $html .= $headerContent;
    $html .= '</div>';
}

// Contenido principal (evitar solapamientos)
$html .= '<div style="width:100%; min-height:' . ($height - $headerHeight - $footerHeight) . 'px; margin-top:' . $headerHeight . 'px; margin-bottom:' . $footerHeight . 'px; text-align:left;">';
$html .= $bodyContent;
$html .= '</div>';

// Pie de página
if ($footerHeight > 0 && !empty($footerContent)) {
    $html .= '<div style="width:100%; height:' . $footerHeight . 'px; position:fixed; bottom:0; left:0; text-align:center; background-color:lightgray;">';
    $html .= $footerContent;
    $html .= '</div>';
}

// Firma (si aplica)
if ($isSignatureEnabled && $signature) {
    $x = $signature['x'] ?? 0;
    $y = $signature['y'] ?? 0;
    $signatureWidth = $signature['width'] ?? 100;
    $signatureHeight = $signature['height'] ?? 50;

    $html .= '<div style="position:absolute; top:' . $y . 'px; left:' . $x . 'px; width:' . $signatureWidth . 'px; height:' . $signatureHeight . 'px; border:1px solid black; text-align:center;">';
    $html .= 'Firma';
    $html .= '</div>';
}

$html .= '</body></html>';

// Inicializar Dompdf
$dompdf = new Dompdf();
$dompdf->set_option('isHtml5ParserEnabled', true);
$dompdf->set_option('isRemoteEnabled', true);

// Cargar el contenido HTML
$dompdf->loadHtml($html);

// Configurar el tamaño de la página
$dompdf->setPaper(array(0, 0, $width, $height), 'portrait');

// Renderizar el PDF
$dompdf->render();

// Descargar el PDF
$dompdf->stream($nameSheet . ".pdf");
