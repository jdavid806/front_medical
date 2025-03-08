<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../dompdf_php5/autoload.inc.php';

use Dompdf\Dompdf;

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data)) {
    echo json_encode(['status' => 'error', 'message' => 'Se requieren los parámetros.']);
    http_response_code(400);
    return;
}

// Obtener las columnas y filas desde la solicitud
$columns = $data['columns'];
$rows = $data['rows'];

// Crear el HTML para el PDF
$html = '
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1 {
                text-align: center;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
            }
            .table th, .table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            .table th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>

    <h1>Detalles de la Cita</h1>

    <table class="table">
        <thead>
            <tr>';

// Agregar las columnas dinámicamente al encabezado
foreach ($columns as $column) {
    $html .= "<th>{$column}</th>";
}

$html .= '</tr>
        </thead>
        <tbody>';

// Agregar las filas dinámicamente
foreach ($rows as $row) {
    $html .= '<tr>';
    foreach ($row as $cell) {
        // Reemplazar saltos de línea por <br> y evitar problemas con caracteres especiales
        $cell = nl2br(htmlspecialchars($cell));
        $html .= "<td>{$cell}</td>";
    }
    $html .= '</tr>';
}

$html .= '</tbody>
    </table>

    <div class="footer">
        <p>Generado el: ' . date('Y-m-d H:i:s') . '</p>
    </div>

    </body>
    </html>';


// Crear una instancia de Dompdf
$dompdf = new Dompdf();
$dompdf->set_option('isHtml5ParserEnabled', true);
$dompdf->set_option('isRemoteEnabled', true);

$dompdf->loadHtml($html);

// Configurar el tamaño de papel y orientación (A4, Portrait)
$dompdf->setPaper('A4', 'portrait');

// Renderizar el PDF
$dompdf->render();

// Enviar el PDF generado al navegador para su descarga
$dompdf->stream("Cita_" . time() . ".pdf");
