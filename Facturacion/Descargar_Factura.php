<?php
// Incluir la librería DOMPDF
require_once '../dompdf_php5/autoload.inc.php';

// Recuperar idOperacion
$idOperacion = $_GET['idOperacion'];

// Conectar a la base de datos
include "../funciones/conn3.php";

// Consultar los datos necesarios de la factura
$query = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idOperacion = $idOperacion");
$row = mysqli_fetch_assoc($query);

if (!$row) {
    die("Factura no encontrada.");
}


// Contador de facturas emitidas
$queryCount = mysqli_query($conn3, "SELECT COUNT(*) as total_facturas FROM FacturaDetalle WHERE idOperacion = $idOperacion");
$rowCount = mysqli_fetch_assoc($queryCount);
$totalFacturas = $rowCount['total_facturas'];

$usuarioArray = $row['idEmpresa'];
$queryList = mysqli_query($conn3, "SELECT * FROM  usuarios where ID = $usuarioArray ");
$nrowl = mysqli_num_rows($queryList);
while ($rowMotorizado = mysqli_fetch_array($queryList)) {

  $empresaNombre      = $rowMotorizado['empresaNombre'];
  $pais               = $rowMotorizado['pais'];

  $ciudad             = $rowMotorizado['ciudad'];
  $direccion          = $rowMotorizado['direccion'];
  $telefono           = $rowMotorizado['telefono'];

  $nit                = $rowMotorizado['nit'];
  $NOMBRE_USUARIO                = $rowMotorizado['NOMBRE_USUARIO'];
  $baseDatos                = $rowMotorizado['baseDatos'];
  $sistema                = $rowMotorizado['sistema'];
}

$server = 'localhost';
$user = 'medicaso_rootBase';
$pass = '5qA?o]t6d-h25qA?o]t6d-h2';
$dbname = $baseDatos;
$connMedical = mysqli_connect($server, $user, $pass, $dbname) or die('Ha fallado la conexion MySQL: ' . mysqli_error($connMedical));


$queryList = mysqli_query($connMedical, "SELECT * FROM  config where ID_Usuario = $usuarioArray");
$nrowl = mysqli_num_rows($queryList);
while ($rowMotorizado = mysqli_fetch_array($queryList)) {
  $moneda = $rowMotorizado['moneda'];
  $impuestoF = $rowMotorizado['impuestoF'];

  // Nuevos campos

  $nombreF = $rowMotorizado['nombreF'];
  $telefonoF = $rowMotorizado['telefonoF'];
  $direccionF = $rowMotorizado['direccionF'];
  $emailF = $rowMotorizado['emailF'];
  $ciudadPaisF = $rowMotorizado['ciudadPaisF'];
  $licenciaF = $rowMotorizado['licenciaF'];
  $pieF = $rowMotorizado['pieF'];

  $LogoF               = $rowMotorizado['logoF'];

  $Base = 'https://erp.medicalsoftplus.com/' . $sistema. '/';

  if (strlen($LogoF) > 0) {
    $Logo = '<img src="' . $Base. '/logos/' . $LogoF . '" style="height:3cm; width:auto;">';
  }



  // Nuevos campos 
}
$idCliente_ = $row['idCliente'];
$queryList = mysqli_query($connMedical, "SELECT * FROM  cliente where cliente_id = $idCliente_");
$nrowl = mysqli_num_rows($queryList);
while ($rowMotorizado = mysqli_fetch_array($queryList)) {

  $nombre_cliente             = $rowMotorizado['nombre_cliente'];
  $ciudad_cliente             = $rowMotorizado['ciudad_cliente'];

  $correo_cliente             = $rowMotorizado['correo_cliente'];
  $direccion_cliente          = $rowMotorizado['direccion_cliente'];
  $telefono_cliente           = $rowMotorizado['telefono_cliente'];
  $whatsapp           = $rowMotorizado['whatsapp'];
  $codigo_ciudad           = $rowMotorizado['codigo_ciudad'];
  $CODI_CLIENTE           = $rowMotorizado['CODI_CLIENTE'];
}


// Construir contenido HTML dinámico
$html = "
<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 20px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #ddd;
                padding-bottom: 10px;
            }
            .header h4 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }
            .header p {
                margin: 5px 0;
                font-size: 14px;
                color: #555;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f4f4f4;
                font-weight: bold;
            }
            .summary {
                text-align: right;
                font-size: 14px;
                margin-top: 20px;
            }
            .summary p {
                font-size: 16px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h4>{$NOMBRE_USUARIO}</h4><br><br>
                <p>RNC: {$nit} - Fecha: {$row['fechaOperacion']} - Factura No: {$row['numeroDoc']}</p>
            </div> <br><br>

                        <table>
                <tr>
                    <td><strong>NOMBRE O RAZON SOCIAL: </strong>{$nombre_cliente}</td>
                    <td><strong>FACTURA GUBERNAMENTAL</strong></td>
                </tr>
                <tr>
                    <td><strong>RNC:</strong> {$CODI_CLIENTE}</td>
                    <td><strong>NCF:</strong> B1500000856</td>
                </tr>
                <tr>
                    <td><strong>FECHA:</strong> {$row['fechaOperacion']}</td>
                    <td><strong>Valida hasta:</strong> {$row['fechaVencimiento']}</td>
                </tr>
                <tr>
                    <td><strong>CODIGO:</strong> {$row['numeroDoc']}</td>
                    <td><strong>No Cliente:</strong>{$idCliente_}</td>
                </tr>
            </table>


            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>";

// Consultar los detalles de la factura
$detalleQuery = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion = $idOperacion");
$contador = 1;
while ($detalle = mysqli_fetch_assoc($detalleQuery)) {
    $html .= "
                    <tr>
                        <td>{$contador}</td>
                        <td>{$detalle['descripcion']}</td>
                        <td>{$detalle['cantidad']}</td>
                        <td>" . number_format($detalle['precio'], 2) . "</td>
                        <td>" . number_format($detalle['subtotal'], 2) . "</td>
                    </tr>";
    $contador++;
}

$html .= "
                </tbody>
            </table>
            <div class='summary'>
                <p>Total: " . number_format($row['totalNeto'], 2) . "</p>
                <p>Total: " . number_format($row['totalNeto'], 2) . "</p>
            </div>
        </div>
    </body>
</html>";

// Crear objeto DOMPDF
use Dompdf\Dompdf;
$dompdf = new Dompdf();
$dompdf->loadHtml($html);

// Configurar el tamaño del papel
$dompdf->setPaper('A4', 'portrait');

// Renderizar el PDF
$dompdf->render();

// Descargar el PDF
$dompdf->stream("Factura_{$idOperacion}.pdf");
?>