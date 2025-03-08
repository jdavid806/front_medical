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
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            max-height: 50px;
        }

        .section {
            margin-bottom: 20px;
        }

        .details th, .details td, .summary th, .summary td {
            padding: 5px;
            border: 1px solid #ddd;
            text-align: left;
        }

        .details th {
            background-color: #f4f4f4;
        }

        .summary th, .summary td {
            text-align: right;
        }

        .signature {
            margin-top: 30px;
        }

        .signature div {
            display: inline-block;
            width: 45%;
            text-align: center;
        }

        .signature div span {
            display: block;
            margin-top: 40px;
            border-top: 1px solid #000;
        }

        .stamp {
            text-align: center;
            margin-top: 20px;
        }

        .stamp img {
            max-width: 100px;
            opacity: 0.8;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Encabezado -->
        <div class="header">
            <h4><?php echo $NOMBRE_USUARIO ?></h4>
            <p>RNC: <?php echo $nit ?> &nbsp;&nbsp; Fecha: <?php echo $fechaOperacion ?> &nbsp;&nbsp; No: <?php echo $numeroDoc ?></p>
            <?php echo $Logo ?>
        </div>

        <!-- Datos de la factura -->
        <div class="section">
            <table class="table table-borderless">
                <tr>
                    <td><strong>NOMBRE O RAZON SOCIAL: </strong><?php echo $nombre_cliente ?></td>
                    <td><strong>FACTURA GUBERNAMENTAL</strong></td>
                </tr>
                <tr>
                    <td><strong>RNC:</strong> <?php echo $CODI_CLIENTE ?></td>
                    <td><strong>NCF:</strong> B1500000856</td>
                </tr>
                <tr>
                    <td><strong>FECHA:</strong> <?php echo $fechaOperacion ?></td>
                    <td><strong>Valida hasta:</strong> <?php echo $fechaVencimiento ?></td>
                </tr>
                <tr>
                    <td><strong>CODIGO:</strong> <?php echo $numeroDoc ?></td>
                </tr>
            </table>
        </div>

        <!-- Resumen de la factura -->
        <div class="section">
            <h5 class="text-center">Resumen Factura</h5>
            <table class="table details">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>DESCRIPCION</th>
                        <th>CANTIDAD</th>
                        <th>DESCUENTO</th>
                        <th>ITBIS</th>
                        <th>VALOR</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Lógica PHP para imprimir filas -->
                    <?php
                    $Numero = 0;
                    $resultado = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion = $idOperacion");
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $Numero++;
                        echo "<tr>
                                <td>{$Numero}</td>
                                <td>{$fila['descripcion']}</td>
                                <td>{$fila['cantidad']}</td>
                                <td>" . number_format($fila['descuento'], 2) . "</td>
                                <td>" . number_format($fila['impuesto'], 2) . "</td>
                                <td>" . number_format($fila['totalbase'], 2) . "</td>
                            </tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>

        <!-- Resumen total -->
        <div class="section">
            <table class="table summary">
                <tr>
                    <th>SUB-TOTAL:</th>
                    <td><?php echo number_format($totalNeto, 2); ?> <?php echo $moneda; ?></td>
                </tr>
                <tr>
                    <th>TOTAL:</th>
                    <td><?php echo number_format($totalNeto, 2); ?> <?php echo $moneda; ?></td>
                </tr>
            </table>
        </div>

        <!-- Cantidad de recibos -->
        <div class="section">
            <p><strong>Cantidad de recibos facturados:</strong><?php echo $totalFacturas ?></p>
        </div>

        <!-- Firma y sellos -->
        <div class="signature">
            <div>
                <span>ENTREGADO POR: <?php echo $NOMBRE_USUARIO ?></span>
            </div>
            <div>
                <span>RECIBIDO POR:</span>
            </div>
        </div>

       
    </div>
</body>

</html>