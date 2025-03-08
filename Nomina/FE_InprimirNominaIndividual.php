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

include "../funciones/conn3.php";
include "../funciones/funciones.php";
include "../funciones/funcionesModels.php";

$idNomina = base64_decode($_GET['id']);

// ? NOMINA INIDIVIDUAL
include "../Models/Nomina/NominaIndividual.php";
include "../Controllers/Nomina/NominaIndividual.php";
$ControllerNominaIndividual = new NominaIndividualController($conn3);
$datosNomina = $ControllerNominaIndividual->obtenerPorId($idNomina);


// ? TRABAJADORES
include "../Models/Nomina/Trabajadores.php";
include "../Controllers/Nomina/Trabajadores.php";
$ControllerTrabajadores = new TrabajadoresController($conn3);

// ? CARGOS
require "../Models/Nomina/Cargos.php";
require "../Controllers/Nomina/Cargos.php";
$ControllerCargo = new CargoController($conn3);

$datosTrabajador = $ControllerTrabajadores->obtenerPorId($datosNomina["idTrabajador"]);
$datosCargo = $ControllerCargo->obtenerPorId($datosNomina["cargo"]);


// * INICIALIZAR LA CONFIGURACION DE USUARIO ACTUAL
require "../Models/Nomina/Configuracion.php";
require "../Controllers/Nomina/Configuracion.php";
$ControllerConfiguracion = new ConfiguracionesController($conn3);
$ConfigNominaUser = $ControllerConfiguracion->obtenerPorId(1);
// * INICIALIZAR LA CONFIGURACION DE USUARIO ACTUAL

// $detalleNomina = json_decode($datosNomina["jsonNomina"], true);
// $detalleNomina = $detalleNomina["detalle"];




?>

<center>


    <div class="content-detalle-individual">
        <h4 class="text-center">Comprobante de Nomina</h4>
        <div class="col-12 row">
            <div class="col-3">
                <center>
                    <!-- <img src="<?= $ConfigNominaUser["logoBase64"] ?>" alt=""> -->
                    <img src="<?= $ConfigNominaUser["logoBase64"] ?>" style="max-height: 2.5cm;" alt="">
                    <h5><?= $ConfigNominaUser["razonSocial"] ?></h5>
                </center>
            </div>
            <div class="col-9 text-end">
                <p>
                    <strong>Periodo de Pago:</strong> <?= $datosNomina["fechaInicio"] . " - " . $datosNomina["fechaFin"] ?><br>
                    <strong>Comprobante Numero:</strong> <?= $datosNomina["fechaInicio"] . $datosNomina["fechaFin"] . $datosNomina["idTrabajador"] ?><br><br>
                    <strong>Nombre:</strong> <?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?><br>
                    <strong>Identificación:</strong> <?= $datosNomina["numero_documento"] ?><br>
                    <strong>Cargo:</strong> <?= $datosCargo["nombre"] ?><br>
                    <strong>Salario Básico:</strong> <?= "$ " . number_format($datosNomina["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?>
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
                                <td style="width: 50%;"><b>Salario<b></td>
                                <td style="width: 50%;"><?= "$ " . number_format($datosNomina["totalBase"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                            <?php
                            foreach (json_decode($datosNomina["extras"],true) as $key1 => $extra) { ?>
                                <tr>
                                    <td style="width: 50%;"><b><?= $extra["motivo"] ?><b></td>
                                    <td style="width: 50%;"><?= "$ " . number_format($extra["valor"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                </tr>
                            <?php } ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total Ingresos</th>
                                <td><?= "$ " .  number_format($datosNomina["totalBase"] + $datosNomina["totalBaseExtras"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
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
                            foreach (json_decode($datosNomina["deducciones"],true) as $key1 => $deduccion) { ?>
                                <tr>
                                    <td style="width: 50%;"><b><?= $deduccion["motivo"] ?><b></td>
                                    <td style="width: 50%;"><?= "$ " . number_format($deduccion["valor"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                </tr>
                            <?php } ?>
                            <?php
                            foreach (json_decode($datosNomina["descuentos"],true) as $key1 => $descuento) {
                                if ($key1 > 1) {
                                    break;
                                }
                            ?>
                                <tr>
                                    <td style="width: 50%;"><b><?= $descuento["motivo"] ?><b></td>
                                    <td style="width: 50%;"><?= "$ " . number_format($descuento["valor_descuento"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                                </tr>
                            <?php } ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total Deducciones</th>
                                <td><?= "$ " .  number_format($datosNomina["totalDeducciones"] + $datosNomina["totalDescuentos"], 2) . " " . $ConfigNominaUser["moneda"] ?></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="col-12 pr-1">
                    <table style="width:100%" class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-end"><b>Total a pagar:</b> &nbsp; &nbsp; &nbsp; <?= "$ " .  number_format($datosNomina["total"], 2) . " " . $ConfigNominaUser["moneda"]  ?> </th>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div>
        </div>

    </div>
</center>


<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.print();
    });
</script>