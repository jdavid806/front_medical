<?php
require_once '../dompdf_php5/autoload.inc.php';

use Dompdf\Dompdf;

$templates = [
    "Consentimiento_Informado" => "CONSENTIMIENTO INFORMADO\n\nFecha: " . date("d-m-Y") . "\n\nYo, HOY ddd Prueba NNN con número de documento: 111111111\nFecha de Nacimiento: 2024-09-05, Edad: 4 Meses, 28 Días.\nCelular: 4141765181.\n\nDECLARO: Que, en pleno uso de mis facultades mentales...",

    "Acta_de_salida" => "ACTA DE SALIDA\n\nFecha: " . date("d-m-Y") . "\n\nYo, ____________________, identificado con C.C. No. ______________, declaro haber recibido satisfactoriamente la atención y entiendo..."
];

// Información del médico
$medico = [
    "nombre" => "Dr. Juan Pérez",
    "clinica" => "Clínica San Rafael",
    "especialidad" => "Cirujano General",
    "telefono" => "123-456-7890"
];

$html = '<html><body style="margin:0; padding:0;">';
$html .= '<div style="width:100%; height: 60px; position:fixed; top:0; left:0; text-align:center; background-color:lightgray;">';
$html .= "<p style='margin: 3px; text-align: left;'>{$medico['nombre']} - {$medico['especialidad']}</p></br>
    <p style='margin: 3px; text-align: left;'>{$medico['clinica']}</p></br>
    <p style='margin: 3px; text-align: left;'>Tel: {$medico['telefono']}</p>";
$html .= '</div>';
$html .= '<div style="width:100%; min-height:' . ('100%' - '60px') . 'px; margin-top:62px; text-align:left;">';
$html .= '<p>' . nl2br($templates['Consentimiento_Informado']) . '</p>';

// Inicializar Dompdf
$dompdf = new Dompdf();
$dompdf->set_option('isHtml5ParserEnabled', true);
$dompdf->set_option('isRemoteEnabled', true);

// Cargar el contenido HTML
$dompdf->loadHtml($html);

// Configurar el tamaño de la página
$dompdf->setPaper('letter', 'portrait');

// Renderizar el PDF
$dompdf->render();

// Descargar el PDF
$dompdf->stream("previsualizacionConsentimiento.pdf");
