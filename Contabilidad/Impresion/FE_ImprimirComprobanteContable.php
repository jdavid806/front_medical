<?php

include "../../funciones/conn3.php";
include "../../funciones/funciones.php";
include "../../funciones/funcionesModels.php";

include "../../Models/Contabilidad/index.php";
include "../../Controllers/Contabilidad/index.php";

include "../../Models/Facturacion/index.php";
include "../../Controllers/Facturacion/index.php";


$idComprobante = base64_decode($_GET['id']);
$idUsuario = base64_decode($_GET['idU']);


$ControllerComprobante = new ComprobantesContablesController($conn3);
$datosComprobante = $ControllerComprobante->obtenerPorId($idComprobante);

$ControllerComprobanteDetalle = new CContableDetalleController($conn3);
$datosDetalle = $ControllerComprobanteDetalle->obtenerPorComprobante($idComprobante);

$ControllerCContables = new CuentasContablesController($conn3);

$ControllerTerceros = new TercerosController($conn3);

$ControllerCentrosCosto = new CentrosCostoController($conn3);

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
            <h4 class="text-center">Comprobante Contable</h4>
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
                                <td class="table-active"><b>Comprobante Contable N°.</b></td>
                                <td><?= str_pad($idComprobante, 6, "0", STR_PAD_LEFT); ?></td>
                            </tr>
                            <tr>
                                <td class="table-active"><b>Fecha de elaboracion</b></td>
                                <td><?= explode(" ", $datosComprobante["fechaRegistro"])[0] ?></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="col-12 row p-0">
                    <div class="col-12 pr-1">
                        <table style="width:100%" class="table table-bordered">
                            <thead>
                                <tr class="table-active">
                                    <th class="text-center" style="width:2% !important">#</th>
                                    <th class="text-center">Cuenta Contable</th>
                                    <th class="text-center">Tercero</th>
                                    <th class="text-center">Detalle</th>
                                    <th class="text-center">Descripcion</th>
                                    <th class="text-center">Centro de Costo</th>
                                    <th class="text-center">Débito</th>
                                    <th class="text-center">Crédito</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php  
                                $totalDebito = 0;
                                $totalCredito = 0;
                                foreach ($datosDetalle as $i => $detalle) {         
                                    $totalDebito +=  $detalle["debito"];
                                    $totalCredito += $detalle["credito"];
                                
                                ?>
                                <tr>
                                    <td class="text-start" style="width:2% !important"><?= $i + 1 ?></td>
                                    <td class="text-start"><?= $ControllerCContables->obtenerPorId($detalle["cuentaContable"])["nombre"] ?></td>
                                    <td class="text-start"><?= $ControllerTerceros->obtenerPorId($detalle["tercero"])["nombresContacto"] . " " .$ControllerTerceros->obtenerPorId($detalle["tercero"])["apellidosContacto"] ?></td>
                                    <td class="text-center"><?= $detalle["detalle"] ?></td>
                                    <td class="text-center"><?= $detalle["descripcion"] ?></td>
                                    <td class="text-end"><?= $ControllerCentrosCosto->obtenerPorId($detalle["centroCosto"])["descripcion"] ?></td>
                                    <td class="text-end"><?= number_format($detalle["debito"], 2) ?></td>
                                    <td class="text-end"><?= number_format($detalle["credito"], 2) ?></td>
                                </tr>
                                <?php } ?>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="6" class="text-end"><b>Total</b></td>
                                    <td class="text-end"><?= number_format($detalle["debito"], 2) ?></td>
                                    <td class="text-end"><?= number_format($detalle["credito"], 2) ?></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <p style="font-size: 12px" class="text-start"><b>Observaciones:</b> <br> <?= $datosComprobante["observaciones"] ?></p>

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
