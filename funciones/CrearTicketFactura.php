<?php
require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);
$options->set('isHtml5ParserEnabled', true);

$dompdf = new Dompdf($options);

ob_start();
include "../PlantillasImpresion/PlantillaTicket.php";
$html = ob_get_clean();

$dompdf->loadHtml($html);

$dompdf->setPaper([0, 0, 164, 1000], 'portrait');

$dompdf->render();

header('Content-Type: application/pdf');
$dompdf->stream("ticket.pdf", array("Attachment" => false));
?>