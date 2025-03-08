<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<style>
    @page {
        size: 8.5in 11in;
        /* Tamaño carta en pulgadas */
        margin: 0.5in;
        /* Ajusta los márgenes si es necesario */
    }

    .content-detalle-individual {
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 20px;
        width: 100% !important;
        min-height: 4.5in !important;
        /* size: 8.5in 5.5in; Tamaño media carta */
    }

    .content-detalle-individual p {
        font-size: 14px;
        line-height: 1.2;
        margin-bottom: 10px;
    }

    .content-detalle-individual table * {
        font-size: 11px;
        line-height: 1;
        /* margin-bottom: 10px; */
    }
</style>

<?php

require_once "../funciones/conn3.php";
require_once "../funciones/funciones.php";
require_once "../funciones/funcionesModels.php";

require_once "../Models/Nomina/index.php";
require_once "../Controllers/Nomina/index.php";

$idNominaGrupal = base64_decode($_GET['id']);
$accion = base64_decode($_GET['accion']);
$modo = base64_decode($_GET['modo']);
$contenido = base64_decode($_GET['contenido']);
$idUsuario = base64_decode($_GET['idUsuario']);

if (strtolower($accion) == 'descargar' && strtolower($modo) == 'excel') {
    header('Content-type: application/vnd.ms-excel;charset=iso-8859-15');
    header('Content-Disposition: attachment; filename=ComprobanteNomina_No' . $idNominaGrupal . '.xls');
}



// ? NOMINA GRUPAL
$ControllerNominaGrupal = new NominaGrupalController($conn3);
$datosNomina = $ControllerNominaGrupal->obtenerPorId($idNominaGrupal);

// ? TRABAJADORES
$ControllerTrabajadores = new TrabajadoresController($conn3);

// ? CARGOS
$ControllerCargo = new CargoController($conn3);

// * INICIALIZAR LA CONFIGURACION DE USUARIO ACTUAL
$ControllerConfiguracion = new ConfiguracionesController($conn3);
// $ConfigNominaUser = $ControllerConfiguracion->obtenerPorCondicion(" AND idUsuario = " . $datosNomina["usuarioId"]);
$ConfigNominaUser = $ControllerConfiguracion->obtenerPorCondicion(" AND idUsuario = " . $idUsuario)[0];

// * INICIALIZAR LA CONFIGURACION DE USUARIO ACTUAL

$detalleNomina = json_decode($datosNomina["jsonNomina"], true);
$detalleNomina = $detalleNomina["detalle"];



if ($modo == 'Pdf' &&  ($contenido == 'grupal' || $contenido == 'grupal_e_individual')) {  ?>
    <div class="content-detalle-individual">
        <h4 class="text-center">Comprobante general de nomina</h4>
        <div class="col-12 row">
            <div class="col-3">
                <center>
                    <img src="<?= $ConfigNominaUser["logoBase64"] ?>" style="max-height: 2.5cm;" alt="">
                    <h6><?= $ConfigNominaUser["razonSocial"] ?></h6>
                </center>
            </div>
            <div class="col-9 text-end">
                <p>
                    <strong>Periodo de Pago:</strong> <?= $datosNomina["fechaInicio"] . " - " . $datosNomina["fechaFin"] ?><br>
                    <strong>Comprobante Numero:</strong> <?= "#" . str_pad($datosNomina["id"], 6, "0", STR_PAD_LEFT) ?><br>
                    <strong>Empresa:</strong> <?= $ConfigNominaUser["razonSocial"]  ?><br>
                    <strong>NIT/ID:</strong> <?= number_format($ConfigNominaUser["nit"]) ?><br>
                </p>
            </div>

            <div class="col-12 row p-0">
                <div class="col-12 pr-1">
                    <table style="width:100%" class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-center">Descripcion</th>
                                <th class="text-center">Valore</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Numero de trabajadores<b></td>
                                <td><?= $datosNomina["totalTrabajadores"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Salarios<b></td>
                                <td><?= "$ " . number_format($datosNomina["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Extras<b></td>
                                <td><?= "$ " . number_format($datosNomina["totalExtras"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Descuentos<b></td>
                                <td><?= "$ " . number_format($datosNomina["totalDescuentos"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Deducciones<b></td>
                                <td><?= "$ " . number_format($datosNomina["totalDeducciones"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="col-12 pr-1">
                    <table style="width:100%" class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-end"><b>Total nomina:</b> &nbsp; &nbsp; &nbsp; <?= "$ " .  number_format($datosNomina["total"], 2) . " " . $ConfigNominaUser["moneda"]  ?> </th>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div>
        </div>
    </div>
<?php } else if ($modo == 'Excel' &&  ($contenido == 'grupal' || $contenido == 'grupal_e_individual')) { ?>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th colspan="2" class="text-center">
                    <h4>Comprobante General de Nómina</h4>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="width: 30%; text-align: center; vertical-align: middle;">
                    <img src="<?= $ConfigNominaUser["logoBase64"] ?>" style="max-height: 0.5cm;" alt="Logo">
                    <h6><?= $ConfigNominaUser["razonSocial"] ?></h6>
                </td>
                <td style="width: 70%; text-align: right; vertical-align: top;">
                    <p>
                        <strong>Periodo de Pago:</strong> <?= $datosNomina["fechaInicio"] . " - " . $datosNomina["fechaFin"] ?><br>
                        <strong>Comprobante Número:</strong> <?= "#" . str_pad($datosNomina["id"], 6, "0", STR_PAD_LEFT) ?><br>
                        <strong>Empresa:</strong> <?= $ConfigNominaUser["razonSocial"] ?><br>
                        <strong>NIT/ID:</strong> <?= number_format($ConfigNominaUser["nit"]) ?><br>
                    </p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-center">Descripción</th>
                                <th class="text-center">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Número de Trabajadores</b></td>
                                <td class="text-end"><?= $datosNomina["totalTrabajadores"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Salarios</b></td>
                                <td class="text-end"><?= "$ " . number_format($datosNomina["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Extras</b></td>
                                <td class="text-end"><?= "$ " . number_format($datosNomina["totalExtras"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Descuentos</b></td>
                                <td class="text-end"><?= "$ " . number_format($datosNomina["totalDescuentos"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Total Deducciones</b></td>
                                <td class="text-end"><?= "$ " . number_format($datosNomina["totalDeducciones"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="text-end">
                    <b>Total Nómina:</b> <?= "$ " . number_format($datosNomina["total"], 2) . " " . $ConfigNominaUser["moneda"] ?>
                </td>
            </tr>
        </tbody>
    </table>

<?php }





foreach ($detalleNomina as $key => $nominaTrabajador) {
    $idTrabajador = $nominaTrabajador["idTrabajador"];

    $datosTrabajador = $ControllerTrabajadores->obtenerPorId($idTrabajador);
    $datosCargo = $ControllerCargo->obtenerPorId($datosTrabajador["cargo"]);
    // $datosCargo = $ControllerCargo->obtenerPorId($nominaTrabajador["cargo"]);

?>

    <center>

        <?php if ($modo == 'Excel' &&  ($contenido == 'individual' || $contenido == 'grupal_e_individual')) {  ?>
            <table class="table table-bordered" style="width: 100%; border-collapse: collapse;border: 1px solid black">
                <thead>
                    <tr>
                        <th colspan="2" style="text-align: center; font-size: 18px; padding: 10px;">Comprobante de Nómina</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 30%; text-align: center;">
                            <img src="<?= $ConfigNominaUser["logoBase64"] ?>" style="max-height: 0.5cm;" alt="">
                            <h6><?= $ConfigNominaUser["razonSocial"] ?></h6>
                        </td>
                        <td style="width: 70%; text-align: right; vertical-align: top;">
                            <p>
                                <strong>Periodo de Pago:</strong> <?= $datosNomina["fechaInicio"] . " - " . $datosNomina["fechaFin"] ?><br>
                                <strong>Comprobante Número:</strong> <?= $datosNomina["fechaInicio"] . $datosNomina["fechaFin"] . $nominaTrabajador["idTrabajador"] ?><br><br>
                                <strong>Nombre:</strong> <?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?><br>
                                <strong>Identificación:</strong> <?= $datosTrabajador["numero_documento"] ?><br>
                                <strong>Cargo:</strong> <?= $datosCargo["nombre"] ?><br>
                                <strong>Salario Básico:</strong> <?= "$ " . number_format($nominaTrabajador["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <table class="table table-bordered" style="width: 100%; border: 1px solid black; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th style="width: 50%; text-align: center; border: 1px solid black;">Ingresos</th>
                                        <th style="width: 50%; text-align: center; border: 1px solid black;">Deducciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="border: 1px solid black; vertical-align: top;">
                                            <table class="table table-bordered" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="border: 1px solid black;"><b>Salario</b></td>
                                                    <td style="border: 1px solid black; text-align: right;"><?= "$ " . number_format($nominaTrabajador["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                                </tr>
                                                <?php foreach ($nominaTrabajador["extras"] as $extra): ?>
                                                    <tr>
                                                        <td style="border: 1px solid black;"><b><?= $extra["motivo"] ?></b></td>
                                                        <td style="border: 1px solid black; text-align: right;"><?= "$ " . number_format($extra["valor"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                                <tr>
                                                    <td style="border: 1px solid black;"><b>Total Ingresos</b></td>
                                                    <td style="border: 1px solid black; text-align: right;"><?= "$ " . number_format($nominaTrabajador["totalBase"] + $nominaTrabajador["totalBaseExtras"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style="border: 1px solid black; vertical-align: top;">
                                            <table class="table table-bordered" style="width: 100%; border-collapse: collapse;">
                                                <?php foreach ($nominaTrabajador["deducciones"] as $deduccion): ?>
                                                    <tr>
                                                        <td style="border: 1px solid black;"><b><?= $deduccion["motivo"] ?></b></td>
                                                        <td style="border: 1px solid black; text-align: right;"><?= "$ " . number_format($deduccion["valor"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                                <?php foreach ($nominaTrabajador["descuentos"] as $key1 => $descuento):
                                                    if ($key1 > 1) break; ?>
                                                    <tr>
                                                        <td style="border: 1px solid black;"><b><?= $descuento["motivo"] ?></b></td>
                                                        <td style="border: 1px solid black; text-align: right;"><?= "$ " . number_format($descuento["valor_descuento"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                                    </tr>
                                                <?php endforeach; ?>
                                                <tr>
                                                    <td style="border: 1px solid black;"><b>Total Deducciones</b></td>
                                                    <td style="border: 1px solid black; text-align: right;"><?= "$ " . number_format($nominaTrabajador["totalDeducciones"] + $nominaTrabajador["totalDescuentos"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="text-align: right; border: 1px solid black; padding: 10px;">
                                            <b>Total a Pagar:</b> <?= "$ " . number_format($nominaTrabajador["total"], 2) . " " . $ConfigNominaUser["moneda"] ?>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        <?php } elseif ($modo == 'Pdf' &&  ($contenido == 'individual' || $contenido == 'grupal_e_individual')) { ?>

            <div class="content-detalle-individual">
                <h4 class="text-center">Comprobante de Nomina</h4>
                <div class="col-12 row">
                    <div class="col-3">
                        <center>
                            <img src="<?= $ConfigNominaUser["logoBase64"] ?>" style="max-height: 2.5cm;" alt="">
                            <h6><?= $ConfigNominaUser["razonSocial"] ?></h6>
                        </center>
                    </div>
                    <div class="col-9 text-end">
                        <p>
                            <strong>Periodo de Pago:</strong> <?= $datosNomina["fechaInicio"] . " - " . $datosNomina["fechaFin"] ?><br>
                            <strong>Comprobante Numero:</strong> <?= $datosNomina["fechaInicio"] . $datosNomina["fechaFin"] . $nominaTrabajador["idTrabajador"] ?><br><br>
                            <strong>Nombre:</strong> <?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?><br>
                            <strong>Identificación:</strong> <?= $datosTrabajador["numero_documento"] ?><br>
                            <strong>Cargo:</strong> <?= $datosCargo["nombre"] ?><br>
                            <strong>Salario Básico:</strong> <?= "$ " . number_format($nominaTrabajador["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?>
                        </p>
                    </div>

                    <div class="col-12 row p-0">
                        <div class="col-6 pr-1">
                            <table style="width:100%" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colspan="2" class="text-center">Ingresos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><b>Salario<b></td>
                                        <td><?= "$ " . number_format($nominaTrabajador["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                    </tr>
                                    <?php
                                    foreach ($nominaTrabajador["extras"] as $key1 => $extra) { ?>
                                        <tr>
                                            <td><b><?= $extra["motivo"] ?><b></td>
                                            <td><?= "$ " . number_format($extra["valor"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        </tr>
                                    <?php } ?>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Total Ingresos</th>
                                        <td><?= "$ " .  number_format($nominaTrabajador["totalBase"] + $nominaTrabajador["totalBaseExtras"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="col-6 pl-1">
                            <table style="width:100%" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colspan="2" class="text-center">Deducciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    foreach ($nominaTrabajador["deducciones"] as $key1 => $deduccion) { ?>
                                        <tr>
                                            <td><b><?= $deduccion["motivo"] ?><b></td>
                                            <td><?= "$ " . number_format($deduccion["valor"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        </tr>
                                    <?php } ?>
                                    <?php
                                    foreach ($nominaTrabajador["descuentos"] as $key1 => $descuento) {
                                        if ($key1 > 1) {
                                            break;
                                        }
                                    ?>
                                        <tr>
                                            <td><b><?= $descuento["motivo"] ?><b></td>
                                            <td><?= "$ " . number_format($descuento["valor_descuento"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        </tr>
                                    <?php } ?>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Total Deducciones</th>
                                        <td><?= "$ " .  number_format($nominaTrabajador["totalDeducciones"] + $nominaTrabajador["totalDescuentos"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="col-12 pr-1">
                            <table style="width:100%" class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-end"><b>Total a pagar:</b> &nbsp; &nbsp; &nbsp; <?= "$ " .  number_format($nominaTrabajador["total"], 2) . " " . $ConfigNominaUser["moneda"]  ?> </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        <?php } ?>



    </center>


<?php }  


if ($modo == 'Pdf') { ?>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.print();
    });
</script>
<?php } ?>

<?php

// include "../Models/Nomina/NominaGrupal.php";
// include "../Controllers/Nomina/NominaGrupal.php";
// include "../Models/Nomina/Trabajadores.php";
// include "../Controllers/Nomina/Trabajadores.php";
// require "../Models/Nomina/Cargos.php";
// require "../Controllers/Nomina/Cargos.php";
// require "../Models/Nomina/Configuracion.php";
// require "../Controllers/Nomina/Configuracion.php";

?>