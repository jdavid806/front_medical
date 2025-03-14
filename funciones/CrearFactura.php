<?php
require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// Configuramos opciones para Dompdf
$options = new Options();
$options->set('isRemoteEnabled', true);
$options->set('isHtml5ParserEnabled', true);
$options->set('defaultPaperSize', 'letter');

// Creamos la instancia de Dompdf con las opciones configuradas
$dompdf = new Dompdf($options);

// Capturamos el contenido HTML de la plantilla
ob_start();
include "../PlantillasImpresion/PlantillaFactura.php";
$html = ob_get_clean();

$dompdf->loadHtml($html);

// Configuramos el formato carta y las orientaciones
$dompdf->setPaper('letter', 'portrait'); // 'portrait' o 'landscape'

// Renderizamos el PDF
$dompdf->render();

// Enviamos el PDF al navegador para visualizar (sin descargar)
header('Content-Type: application/pdf');
$dompdf->stream("Factura.pdf", array("Attachment" => false));

?>