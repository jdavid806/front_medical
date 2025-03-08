<?php
date_default_timezone_set('America/Bogota');

include "../funciones/conn3.php";
include "../funciones/funciones.php";



$idOperacion = $_GET['idOperacion'];

$queryList = mysqli_query($conn3, "SELECT * FROM  FacturaOperacion where idOperacion = $idOperacion");
$nrowl = mysqli_num_rows($queryList);
while ($rowMotorizado = mysqli_fetch_array($queryList)) {
  $idOperacion      = $rowMotorizado['idOperacion'];
  $numeroDoc      = $rowMotorizado['numeroDoc'];
  $idCliente      = $rowMotorizado['idCliente'];
  $idClienteFac      = $rowMotorizado['idClienteFac'];
  $idEmpresa      = $rowMotorizado['idEmpresa'];
  $fechaOperacion      = $rowMotorizado['fechaOperacion'];
  $fechaVencimiento      = $rowMotorizado['fechaVencimiento'];
  //$subTotal      =$rowMotorizado['subTotal'];
  $impuesto      = $rowMotorizado['impuesto'];
  $impuestoBase = $rowMotorizado['impuestoBase'];
  $totalNeto      = $rowMotorizado['totalNeto'];
  $totalBruto      = $rowMotorizado['totalBruto'];
  $cantidadProduc      = $rowMotorizado['cantidadProduc'];
  $descuentos      = $rowMotorizado['descuentos'];
  $montoPagado      = $rowMotorizado['montoPagado'];
  $nota      = $rowMotorizado['nota'];
}

// Contador de facturas emitidas
$queryCount = mysqli_query($conn3, "SELECT COUNT(*) as total_facturas FROM FacturaDetalle WHERE idOperacion = $idOperacion");
$rowCount = mysqli_fetch_assoc($queryCount);
$totalFacturas = $rowCount['total_facturas'];







$queryList = mysqli_query($conn3, "SELECT * FROM  usuarios where ID = $idEmpresa");
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


if ($idClienteFac > 0){
  $idCliente_ = $idClienteFac;
}else{
  $idCliente_ = $idCliente;
}

$queryList = mysqli_query($connMedical, "SELECT * FROM  config where ID_Usuario = $idEmpresa");
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


   // Iniciar la construcción del HTML
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
                margin: 0 auto;
                padding: 20px;
                width: 90%;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-height: 50px;
            }
            .header h4 {
                margin: 5px 0;
            }
            .header p {
                margin: 5px 0;
                font-size: 12px;
                color: #555;
            }
            .section {
                margin-bottom: 20px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .table th, .table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            .table th {
                background-color: #f4f4f4;
                font-weight: bold;
            }
            .summary th, .summary td {
                padding: 8px;
                text-align: right;
            }
            .signature div {
                margin-top: 50px;
                display: inline-block;
                width: 45%;
                text-align: center;
            }
            .signature div span {
                display: block;
                margin-top: 40px;
                border-top: 1px solid #000;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h4>{$rowConfig['NOMBRE_USUARIO']}</h4>
                <p>RNC: {$rowConfig['nit']} - Fecha: {$rowOperacion['fechaOperacion']} - Factura No: {$rowOperacion['numeroDoc']}</p>
                $Logo
            </div>
            <div class='section'>
                <table class='table'>
                    <tr>
                        <td><strong>Nombre o Razón Social:</strong> {$rowCliente['nombre_cliente']}</td>
                        <td><strong>Factura Gubernamental</strong></td>
                    </tr>
                    <tr>
                        <td><strong>RNC:</strong> {$rowCliente['CODI_CLIENTE']}</td>
                        <td><strong>NCF:</strong> B1500000856</td>
                    </tr>
                    <tr>
                        <td><strong>Fecha:</strong> {$rowOperacion['fechaOperacion']}</td>
                        <td><strong>Válida hasta:</strong> {$rowOperacion['fechaVencimiento']}</td>
                    </tr>
                    <tr>
                        <td><strong>Código:</strong> {$rowOperacion['numeroDoc']}</td>
                    </tr>
                </table>
            </div>
            <div class='section'>
                <h5>Resumen Factura</h5>
                <table class='table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Descuento</th>
                            <th>ITBIS</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>";
$contador = 1;
while ($detalle = mysqli_fetch_assoc($queryDetalle)) {
    $html .= "
                        <tr>
                            <td>{$contador}</td>
                            <td>{$detalle['descripcion']}</td>
                            <td>{$detalle['cantidad']}</td>
                            <td>" . number_format($detalle['descuento'], 2) . "</td>
                            <td>" . number_format($detalle['impuesto'], 2) . "</td>
                            <td>" . number_format($detalle['totalbase'], 2) . "</td>
                        </tr>";
    $contador++;
}

$html .= "
                    </tbody>
                </table>
            </div>
            <div class='section'>
                <table class='table summary'>
                    <tr>
                        <th>Subtotal:</th>
                        <td>" . number_format($rowOperacion['totalBruto'], 2) . " {$rowConfig['moneda']}</td>
                    </tr>
                    <tr>
                        <th>Total:</th>
                        <td>" . number_format($rowOperacion['totalNeto'], 2) . " {$rowConfig['moneda']}</td>
                    </tr>
                </table>
            </div>
            <div class='signature'>
                <div>
                    <span>Entregado por: {$rowConfig['NOMBRE_USUARIO']}</span>
                </div>
                <div>
                    <span>Recibido por:</span>
                </div>
            </div>
        </div>
    </body>
</html>";

?>