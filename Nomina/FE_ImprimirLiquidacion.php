<?php 

require_once __DIR__ .  "./../funciones/conn3.php";
require_once __DIR__ .  "./../funciones/funciones.php";
require_once __DIR__ .  "./../funciones/funcionesModels.php";


// ? MODELS Y CONTROLLERS DE NOMINA
require_once __DIR__ .  "./../Models/Nomina/index.php";
require_once __DIR__ .  "./../Controllers/Nomina/index.php";
// ? MODELS Y CONTROLLERS DE NOMINA


$idLiquidacion = base64_decode(base64_decode($_GET['i']));
$idUsuario = base64_decode(base64_decode($_GET['u']));

$ControllerLiquidaciones = new LiquidacionesController($conn3);
$datosLiquidacion = $ControllerLiquidaciones->obtenerPorId($idLiquidacion);
$detalleLiquidacion = json_decode($datosLiquidacion["detalle"], true);

$ControllerConfiguracion = new ConfiguracionesController($conn3);
$ConfigNominaUser = $ControllerConfiguracion->obtenerPorIdUsuario($idUsuario);

$ControllerTrabajadores = new TrabajadoresController($conn3);
$datosTrabajador = $ControllerTrabajadores->obtenerPorId($datosLiquidacion["idTrabajador"]);

$ControllerCargo = new CargoController($conn3);


$moneda = $datosLiquidacion["moneda"];


function reemplazarValores($text) {
    $search = ["cesantias", "interesesCesantias", "primaServicios", "vacaciones", "totalLiquidacion"];
    $replace = ["Cesantías", "Intereses de cesantías", "Prima de servicios", "Vacaciones", "Total Liquidación"];

    $texto1 = str_replace($search, $replace, $text);

    return $texto1;
}



?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" sizes="32x32" href="<?=$ConfigNominaUser["logoBase64"]?>">
    <title>Comprobante de Liquidacion #<?= str_pad($idLiquidacion, 6, "0", STR_PAD_LEFT) ?></title>
    <!-- Latest compiled and minified CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Orbitron:wght@400..900&display=swap" rel="stylesheet">

    <!-- Latest compiled JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<div class="content-detalle-individual">
        <h4 class="text-center">Comprobante de liquidación</h4>
        <div class="col-12 row">
            <div class="col-3">
                <center>
                    <img src="<?= $ConfigNominaUser["logoBase64"] ?>" style="max-height: 2.5cm;" alt="">
                    <h6><?= $ConfigNominaUser["razonSocial"] ?></h6>
                </center>
            </div>
            <div class="col-9 text-end">
                <p>
                    <strong>Comprobante Numero:</strong> <?= "#" . str_pad($idLiquidacion, 6, "0", STR_PAD_LEFT) ?><br>
                    <strong>Fecha de Ingreso:</strong> <?= $datosLiquidacion["fechaIngreso"] ?><br>
                    <strong>Fecha de Egreso:</strong> <?= $datosLiquidacion["fechaSalida"] ?><br>
                    <strong>Empresa:</strong> <?= $ConfigNominaUser["razonSocial"]  ?><br>
                    <strong>NIT/ID:</strong> <?= number_format($ConfigNominaUser["nit"]) ?><br>
                </p>
            </div>

            <center>
            <div class="col-12 row p-0">
                <div class="col-12 pr-1">
                    <table style="width:98%" class="table table-bordered">
                        <thead>
                            <tr>
                                <th colspan="2" class="text-center">Datos del trabajador</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-center"><b>Nombre<b></td>
                                <td class="text-center"><b>Documento/Identificacion<b></td>
                            </tr>
                            <tr>
                                <td class="text-center"><?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"]  ?></td>
                                <td class="text-center"><?= $datosTrabajador["numero_documento"] ?></td>
                            </tr>
                            <tr>
                                <td class="text-center"><b>Salario<b></td>
                                <td class="text-center"><b>Ultimo cargo desempeñado<b></td>
                            </tr>
                            <tr>
                                <td class="text-center"><?= "$ " . number_format($datosTrabajador["salario"]) . " " .$moneda ?></td>
                                <td class="text-center"><?=$ControllerCargo->obtenerPorId($datosTrabajador["cargo"])["nombre"] ?></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="width:98%" class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-center">Descripcion</th>
                                <th class="text-center">Valore</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php  foreach ($detalleLiquidacion as $item => $valor) { ?>
                            <tr>
                                <td class="text-center"><?= reemplazarValores($item) ?></td>
                                <td class="text-center"><?= "$ " .number_format($valor) . " " . $moneda?></td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>


                    <table style="width:98%" class="table table-bordered">
                        <tfoot>
                            <tr>
                                <th class="text-center"><b>Firma trabajador</b></th>
                                <th class="text-center"><b>Firma empleador</b></th>
                            </tr>
                            <tr>
                                <td class="text-center" style="height: 100px;"></td>
                                <td class="text-center" style="height: 100px;"></td>
                            </tr>
                        </tfoot>
                    </table>


                </div>

            </div>
            </center>


        </div>
    </div>
</body>
</html>

<script>
    document.addEventListener("DOMContentLoaded", (event) => {
        window.print();
    });
</script>


<style>
    * {
        font-family: "Open Sans", serif;
        font-optical-sizing: auto;
    }

    table * {
        font-size: 15px !important;
    }
</style>