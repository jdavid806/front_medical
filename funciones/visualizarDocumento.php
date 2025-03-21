<?php
require_once '../dompdf/autoload.inc.php';
$id = $_GET['id'] ?? 'desconocido';
$tipo = $_GET['tipo'] ?? 'ninguno';
$host = $_SERVER['HTTP_HOST'];

switch ($tipo) {
    case 'receta':
        $urlApi = $host."/medical/recipes/{$id}";
        break;
    
    default:
        # code...
        break;
}

try {
    $context = stream_context_create([
        "http" => ["ignore_errors" => true]
    ]);
    $response = file_get_contents($urlApi, false, $context);
    if ($response === false) {
        throw new Exception("Error al obtener la respuesta.");
    }
    $data = json_decode($response, true);
    var_dump($data);
    if (!$data) {
        throw new Exception("Error al decodificar la respuesta.");
    }
    echo "Título: " . $data['title'];
} catch (Exception $e) {
    echo ":advertencia: Error: " . $e->getMessage();
}
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
$html = '<h1>Documento Privado</h1><p>Acceso restringido. Solo lectura.</p>';

// $dompdf->loadHtml($html);

// // Configuramos el formato carta y las orientaciones
// $dompdf->setPaper('letter', 'portrait'); // 'portrait' o 'landscape'

// Renderizamos el PDF
// $dompdf->render();

// // Configurar contraseñas y permisos
// $canvas = $dompdf->getCanvas();
// $canvas->get_cpdf()->setEncryption(
//     'admin2025',     // Contraseña maestra (desbloquea todo)
//     '',     // Contraseña de usuario (abre el PDF)
//     ['copy', 'print'] // Bloquea copiar e imprimir
// );

// // Enviamos el PDF al navegador para visualizar (sin descargar)
// header('Content-Type: application/pdf');
// $dompdf->stream("Factura.pdf", array("Attachment" => false));
