<?php

// Incluye las librerías necesarias
include "./../funciones/conn3.php";
include "./../funciones/funcionesModels.php"; 

// ? CONTRATOS
include "./../Models/Nomina/Contratos.php";
include "./../Controllers/Nomina/Contratos.php";

// Obtiene el id del contrato
$idContrato = base64_decode($_GET['i']);

$ControllerContrato = new ContratosController($conn3);
$datosContrato = $ControllerContrato->obtenerPorId($idContrato);
$datosContrato = $datosContrato[0];
$contenido = $datosContrato['contenidoContrato'];

// Incluye el autoload de Dompdf
require '../dompdf/autoload.inc.php'; // Asegúrate de que la ruta sea correcta

// Usa Dompdf
use Dompdf\Dompdf;
use Dompdf\Options;

try {
    // Configura las opciones
    $options = new Options();
    $options->set('defaultFont', 'Arial');

    // Crea una instancia de Dompdf
    $dompdf = new Dompdf($options);

    // Carga el contenido HTML
    $html = $contenido; // Asigna el contenido del contrato a la variable $html
    $dompdf->loadHtml($html);

    // Configura el tamaño de papel y la orientación
    $dompdf->setPaper('A4', 'portrait');

    // Renderiza el PDF
    $dompdf->render();

    // Salida del PDF al navegador
    $dompdf->stream('ContratoTrabajo_'.$idContrato.'.pdf', array('Attachment' => 0)); // 0 para mostrar en el navegador, 1 para descargar

} catch (\Throwable $th) {
    echo "Error: " . $th->getMessage() . "<br>";
    echo "Archivo: " . $th->getFile() . "<br>";
    echo "Línea: " . $th->getLine() . "<br>";
}
