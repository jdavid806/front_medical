<?php
require_once '../dompdf_php5/autoload.inc.php';

use Dompdf\Dompdf;

$input = file_get_contents("php://input"); // Obtener el cuerpo de la solicitud
$data = json_decode($input, true); // Decodificar JSON a un array asociativo

// Validar que los datos se hayan recibido correctamente
if (isset($data['data']) && is_array($data['data']) && isset($data['title'])) {
    $tableData = $data['data']; // Los datos de la tabla
    $title = $data['title'];    // El título para el reporte

    // Comprobar que los datos de la tabla contienen al menos una fila
    if (count($tableData) > 0) {
        // Generar el HTML de la tabla con estilos mejorados
        $html = "
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    table, th, td {
                        border: 1px solid #ddd;
                    }
                    th, td {
                        padding: 12px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    td {
                        background-color: #fff;
                    }
                    tr:nth-child(even) td {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h2>" . htmlspecialchars($title) . "</h2>
                <table>
                    <thead>
                        <tr>";

        // Añadir encabezados de la tabla (opcional, si los datos los contienen)
        if (isset($tableData[0])) {
            foreach (array_keys($tableData[0]) as $header) {
                $html .= "<th>" . htmlspecialchars($header) . "</th>";
            }
        }

        $html .= "</tr></thead><tbody>";

        // Recorrer las filas y columnas
        foreach ($tableData as $row) {
            $html .= "<tr>";
            foreach ($row as $cell) {
                $html .= "<td>" . htmlspecialchars($cell) . "</td>";
            }
            $html .= "</tr>";
        }

        $html .= "</tbody></table>
            </body>
        </html>";

        // Inicializar Dompdf
        $dompdf = new Dompdf();
        $dompdf->set_option('isHtml5ParserEnabled', true);
        $dompdf->set_option('isRemoteEnabled', true);

        // Cargar el contenido HTML
        $dompdf->loadHtml($html);

        // Configurar el tamaño de la página
        $dompdf->setPaper(array(0, 0, 730, 842), 'portrait');

        // Renderizar el PDF
        $dompdf->render();

        // Descargar el PDF
        $dompdf->stream("patientsReport.pdf");
    } else {
        // Si no hay datos en la tabla
        echo "Error: No hay datos para generar el reporte.";
    }
} else {
    // Si los datos están incompletos o mal formateados
    echo "Error: Datos de entrada no válidos.";
}
