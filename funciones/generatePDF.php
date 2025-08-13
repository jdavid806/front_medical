<?php
require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;

// Verificar si se recibió contenido HTML
if (!isset($_POST['html_content'])) {
  die('Error: No se recibió contenido HTML para generar el PDF');
}

$html = $_POST['html_content'];
$pdfConfig = isset($_POST['pdf_config']) ? json_decode($_POST['pdf_config'], true) : [];
// echo $html;
// exit();

// Configuración avanzada de DomPDF
$filename = isset($pdfConfig['name']) ? $pdfConfig['name'] : 'documento.pdf';
$isDownload = isset($pdfConfig['isDownload']) ? $pdfConfig['isDownload'] : false;
$dompdf = new Dompdf();
$options = $dompdf->getOptions();
$options->set(array('isRemoteEnabled' => true));

// if (isset($pdfConfig['dimensions']) && is_array($pdfConfig['dimensions'])) {
//     $dompdf->setPaper($pdfConfig['dimensions']);
// } else {
//     // Tamaño por defecto si no se especifican dimensiones
//     $dompdf->setPaper('letter');
// }

$paperSize = isset($pdfConfig['dimensions']) && is_array($pdfConfig['dimensions']) 
    ? $pdfConfig['dimensions'] 
    : 'letter';

$orientation = isset($pdfConfig['orientation']) && in_array(strtolower($pdfConfig['orientation']), ['portrait', 'landscape']) 
    ? strtolower($pdfConfig['orientation']) 
    : 'portrait'; // Valor por defecto

$dompdf->setPaper($paperSize, $orientation);


$options->set('isHtml5ParserEnabled', true);
$dompdf->setOptions($options);

// Cargar el HTML recibido desde JavaScript
$dompdf->loadHtml($html);

// Renderizar el PDF
$dompdf->render();

// Configurar headers y salida
header('Content-Type: application/pdf');

// Mostrar el PDF en el navegador
$dompdf->stream($filename, [
  'Attachment' => $isDownload
]);

exit;
