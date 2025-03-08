<?php

include "../../funciones/conn3.php";
include "../../funciones/funciones.php";
include "../../funciones/funcionesModels.php";

include "../../Models/Contabilidad/index.php";
include "../../Controllers/Contabilidad/index.php";

include "../../Models/Facturacion/index.php";
include "../../Controllers/Facturacion/index.php";


$idReciboCaja = base64_decode($_GET['id']);
$idUsuario = base64_decode($_GET['idU']);


$ControllerReciboCaja = new RecibosCajaController($conn3);
$datosRecibo = $ControllerReciboCaja->obtenerPorId($idReciboCaja);

$ControllerCContables = new CuentasContablesController($conn3);

$ControllerTerceros = new TercerosController($conn3);
$datosProveedor = $ControllerTerceros->obtenerPorId($datosRecibo["proveedor"]);


$ControllerCentrosCosto = new CentrosCostoController($conn3);

$ControllerMetodosPago = new MetodosPagoController($conn3);

$optionsTipo = [
    "1" => "RP-1 Recibo de Pago / Egreso",
];


try { ?>

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

    <center>
        <div class="content-detalle-individual">
            <h4 class="text-center">Recibo de caja</h4>
            <div class="col-12 row">

                <div class="col-12 row my-2">
                    <div class="col-3 display-flex justify-content-center align-items-center">
                        <center>
                            <img src="../logo_monaros_sinbg.png" style="max-height: 2cm; width:100%" alt="">
                        </center>
                    </div>
                    <div class="col-4 text-center">
                        <p style="font-size: 10px">MONAROS S.A.S <br> NIT: 1234.5678.55 <br> Sede Virtual <br> Telefono (+123) 001 003 002 <br> Bogotá, Colombia</p>
                    </div>
    
                    <div class="col-5 text-end">

                        <table class="table table-bordered">
                            <tr>
                                <td class="table-active"><b>Pago N°.</b></td>
                                <td><?= str_pad($idReciboCaja, 6, "0", STR_PAD_LEFT); ?></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="col-12 row p-0">
                    <div class="col-6">
                        <table style="width:100%" class="table table-bordered">
                            <tr>
                                <td class="table-active"><b>Pagado a</b></td>
                                <td><?= $datosProveedor["nombresContacto"] . " " .$datosProveedor["apellidosContacto"]?></td>
                                <td colspan="2"></td>
                            </tr>
                            <tr>
                                <td class="table-active"><b>NIT:</b></td>
                                <td><?= $datosProveedor["documento"]?></td>
                                <td class="table-active"><b>Telefono</b></td>
                                <td><?= $datosProveedor["telefono"]?></td>
                            </tr>
                            <tr>
                                <td class="table-active"><b>Direccion</b></td>
                                <td><?= $datosProveedor["direccion"] ?></td>
                                <td class="table-active"><b>Ciudad</b></td>
                                <td><?= $datosProveedor["ciudad"] ?></td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-6 d-flex justify-content-end">
                        <table style="width:70%" class="table table-bordered">
                            <tr>
                                <td class="table-active"><b>Fecha de pago</b></td>
                                <td><?= $datosRecibo["valorPagado"] ?></td>
                            </tr>
                            <tr>
                                <td class="table-active"><b>Forma de pago</b></td>
                                <td><?= $ControllerMetodosPago->obtenerPorId($datosRecibo["dineroSaleDesde"])["descripcion"] ?></td>
                            </tr>
                        </table>
                    </div>

                    <div class="col-12">
                        <table style="width:100%" class="table table-bordered">
                            <tr>
                                <td class="table-active"><b>El valor de</b></td>
                                <td colspan="2"><?= convertirNumeroALetras($datosRecibo["valorPagado"]) ?></td>
                                <td><?= number_format($datosRecibo["valorPagado"], 2) ?></td>
                            </tr>
                        </table>
                    </div>

                </div>



                <div class="col-12 row p-0">
                    <div class="col-12 pr-1">
                        <table style="width:100%" class="table table-bordered">
                            <thead>
                                <tr class="table-active">
                                    <th class="text-center" colspan="4">Concepto</th>
                                    <th class="text-center">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-start"><?= $datosRecibo["realizarUn"] ?></td>
                                    <td class="text-start"><?= "CC. " . $datosRecibo["centroCosto"] ?></td>
                                    <td class="text-start"><?= $optionsTipo[$datosRecibo["tipo"]] ?></td>
                                    <td class="text-center"><?= $datosRecibo["fechaElaboracion"] ?></td>
                                    <td class="text-end"><?= number_format($datosRecibo["valorPagado"], 2) ?></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="text-end"><b>Total</b></td>
                                    <td class="text-end"><?= number_format($datosRecibo["valorPagado"], 2) ?></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <p style="font-size: 12px" class="text-start"><b>Observaciones:</b> <br> <?= $datosRecibo["observaciones"] ?></p>

                </div>
            </div>

        </div>
    </center>


    <script>
        document.addEventListener('DOMContentLoaded', function() {
            window.print();
        });
    </script>

<?php } catch (\Throwable $th) {
    echo $th;
}
