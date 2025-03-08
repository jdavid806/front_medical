<?php
include "../menu.php";
include "../header.php";
include "./datosContabilidad.php";

$dropDownContabilidad = '<div class="dropdown mb-3">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-plus"></i> Nuevo 
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoTercero">Tercero</a></li>
                                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaCuentaContable">Cuenta Contable</a></li>
                                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoComprobante">Comprobante contable</a></li>
                                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoReciboPago">Recibo de pago</a></li>
                                <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoReciboCaja">Recibo de caja</a></li>
                            </ul>
                            </div>';


?>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#!">Inicio</a></li>
                <li class="breadcrumb-item active">Contabilidad</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="col-10">
                        <div class="col-12 row col-md-auto">
                            <div class="col-6">
                                <h2 class="mb-0">Contabilidad</h2>
                            </div>
                            <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">

                            </div>
                        </div>
                        <div class="col-12 col-md-auto">
                            <div class="d-flex">
                                <div class="flex-1 d-md-none">
                                    <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas" data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-0 g-md-4 g-xl-6">
                <div class="col-md-12 col-lg-12 col-xl-12">
                    <div class="lead-details-container">
                        <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" id="navbar-deals-detail">
                            <ul class="nav nav-underline fs-9" role="tablist">
                                <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-terceros')">Terceros</a></li>
                                <li class="nav-item"><a class="nav-link " data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-plan-cuentas')">Plan de cuentas</a></li>
                                <li class="nav-item"><a class="nav-link " data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-recibos-pago')">Recibos de pago</a></li>
                                <li class="nav-item"><a class="nav-link " data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-recibos-caja')">Recibos de caja</a></li>
                                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-comprobantes-contables')">Comprobantes contables</a></li>
                                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-saldos-contables')">Saldos Contables</a></li>
                                <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-reportes-contables')">Reportes contables</a></li>
                                <!-- <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="false" onclick="showSections('content-documentos-contables')">Documentos contables</a></li> -->
                            </ul>
                        </nav>
                        <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0" data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0">


                            <div class="mb-8" id="content-terceros">
                                <div class="col-12 row mb-4" id="scrollspyFacturacionVentas">
                                    <div class="col-md-12 row mb-4">
                                        <div class="col-6">
                                            <h4 class="mb-1" id="scrollspyFacturacionVentas">Terceros</h4>
                                        </div>
                                        <div class="col-6 text-end">
                                            <?= $dropDownContabilidad ?>
                                        </div>
                                    </div>

                                    <div class="card mb-3 p-3">
                                        <div class="card-body">
                                            <div class="row g-3 list" id="reportsList">
                                                <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                    <thead>
                                                        <tr>
                                                            <th>Tipo</th>
                                                            <th>Nombre</th>
                                                            <th>Tipo de Identificacion</th>
                                                            <th>Identificacion</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <?php foreach ($datosTerceros as $terceros) { ?>
                                                            <tr>
                                                                <input type="hidden" id="data_Terceros<?= $terceros['id'] ?>" value="<?= htmlspecialchars(json_encode($terceros), ENT_QUOTES) ?>">
                                                                <td><?= $terceros["tipoTercero"] ?></td>
                                                                <td><?= $terceros["nombresContacto"] . " " . $terceros["apellidosContacto"] ?></td>
                                                                <td><?= $terceros["tipoDocumento"] ?></td>
                                                                <td><?= $terceros["documento"] ?></td>
                                                                <td>
                                                                    <i class="fas fa-pencil" onclick="editarTerceros(<?= $terceros['id'] ?>)"></i>
                                                                    <i class="fas fa-trash" onclick="borrarTerceros(<?= $terceros['id'] ?>)"></i>
                                                                </td>
                                                            </tr>
                                                        <?php } ?>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-8" id="content-plan-cuentas">
                                <!-- Plan de Cuentas -->
                                <div class="col-12 row" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Plan de cuentas</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>
                                </div>
                                <div class="card mb-3 p-3">
                                    <div class="card-body">
                                        <div class="row g-3 list" id="reportsList">
                                            <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                <thead>
                                                    <tr>
                                                        <th>Codigo</th>
                                                        <th>Nombre</th>
                                                        <th>Detalle</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php 
                                                        $optionsModalFiltrosSC = [];
                                                        foreach ($datosCuentasContables as $cuenta) { 

                                                            $optionsModalFiltrosSC[$cuenta['id']] = $cuenta['codigo'] . " - " . $cuenta['nombre'];
                                                            
                                                            ?>
                                                        <tr>
                                                            <input type="hidden" id="data_CContable<?= $cuenta['id'] ?>" value="<?= htmlspecialchars(json_encode($cuenta), ENT_QUOTES) ?>">
                                                            <td><?= $cuenta["codigo"] ?></td>
                                                            <td><?= $cuenta["nombre"] ?></td>
                                                            <td><?= $cuenta["observaciones"] ?></td>
                                                            <td>
                                                                <i class="fas fa-pencil" onclick="editarCContable(<?= $cuenta['id'] ?>)"></i>
                                                                <i class="fas fa-trash" onclick="borrarCContable(<?= $cuenta['id'] ?>)"></i>
                                                            </td>
                                                        </tr>
                                                    <?php } ?>
                                                </tbody>
                                            </table>


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-8" id="content-recibos-pago">
                                <div class="col-12 row" id="">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="">Recibos de pago</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>
                                </div>
                                <div class="card mb-3 p-3">
                                    <div class="card-body">
                                        <div class="row g-3 list" id="reportsList">
                                            <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Tipo</th>
                                                        <th>Tercero</th>
                                                        <th>Valor pagado</th>
                                                        <th>Observaciones</th>
                                                        <th style="width:5% !important">Archivo</th>
                                                        <th style="width:15% !important"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php foreach ($datosRecibosPago as $reciboP) {
                                                        $urlArchivo = $BASE . "ContabilidadCComprobantes/" . $reciboP["archivo"];
                                                        $iconArchivo = "<i class='fas fa-file' onclick='window.open(\"$urlArchivo\", \"_blank\")'></i>";

                                                        $urlImprimir = $BASE . "FERPPrint?id=" . base64_encode($reciboP["id"]) . "&idU=" . base64_encode($_SESSION["ID"]);
                                                    ?>
                                                        <tr>
                                                            <input type="hidden" id="data_RecPago<?= $reciboP['id'] ?>" value="<?= htmlspecialchars(json_encode($reciboP), ENT_QUOTES) ?>">
                                                            <td><?= $reciboP["fechaRegistro"] ?></td>
                                                            <td><?= $reciboP["realizarUn"] ?></td>
                                                            <td><?= $ControllerTerceros->obtenerPorId($reciboP["proveedor"])["nombresContacto"] . " " . $ControllerTerceros->obtenerPorId($reciboP["tercero"])["apellidosContacto"] ?></td>
                                                            <td><?= number_format($reciboP["valorPagado"]) ?></td>
                                                            <td><?= $reciboP["observaciones"] ?></td>
                                                            <td style="width:5% !important" class="text-center"><?= $reciboP["archivo"] <> "" ? $iconArchivo : "Sin archivo" ?></td>
                                                            <td style="width:15% !important">
                                                                <div class="col-md-12 row d-flex">
                                                                    <div class="col-md-4">
                                                                        <i class="fas fa-pencil" onclick="editarRecPago(<?= $reciboP['id'] ?>)"></i>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <i class="fas fa-trash" onclick="borrarRecPago(<?= $reciboP['id'] ?>)"></i>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <i class="fas fa-print" onclick="window.open('<?= $urlImprimir ?>', '_blank')"></i>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    <?php } ?>
                                                </tbody>
                                            </table>


                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="mb-8" id="content-recibos-caja">
                                <div class="col-12 row" id="">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="">Recibos de caja</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>
                                </div>
                                <div class="card mb-3 p-3">
                                    <div class="card-body">
                                        <div class="row g-3 list" id="reportsList">
                                            <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Tipo</th>
                                                        <th>Tercero</th>
                                                        <th>Valor pagado</th>
                                                        <th>Observaciones</th>
                                                        <th style="width:5% !important">Archivo</th>
                                                        <th style="width:15% !important"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php foreach ($datosRecibosCaja as $reciboC) {
                                                        $urlArchivo = $BASE . "ContabilidadCComprobantes/" . $reciboC["archivo"];
                                                        $iconArchivo = "<i class='fas fa-file' onclick='window.open(\"$urlArchivo\", \"_blank\")'></i>";

                                                        $urlImprimir = $BASE . "FERCPrint?id=" . base64_encode($reciboC["id"]) . "&idU=" . base64_encode($_SESSION["ID"]);
                                                    ?>
                                                        <tr>
                                                            <input type="hidden" id="data_RecCaja<?= $reciboC['id'] ?>" value="<?= htmlspecialchars(json_encode($reciboC), ENT_QUOTES) ?>">
                                                            <td><?= $reciboC["fechaRegistro"] ?></td>
                                                            <td><?= $reciboC["realizarUn"] ?></td>
                                                            <td><?= $ControllerTerceros->obtenerPorId($reciboC["proveedor"])["nombresContacto"] . " " . $ControllerTerceros->obtenerPorId($reciboC["tercero"])["apellidosContacto"] ?></td>
                                                            <td><?= number_format($reciboC["valorPagado"]) ?></td>
                                                            <td><?= $reciboC["observaciones"] ?></td>
                                                            <td style="width:5% !important" class="text-center"><?= $reciboC["archivo"] <> "" ? $iconArchivo : "Sin archivo" ?></td>
                                                            <td style="width:15% !important">
                                                                <div class="col-md-12 row d-flex">
                                                                    <div class="col-md-4">
                                                                        <i class="fas fa-pencil" onclick="editarRecCaja(<?= $reciboC['id'] ?>)"></i>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <i class="fas fa-trash" onclick="borrarRecCaja(<?= $reciboC['id'] ?>)"></i>
                                                                    </div>
                                                                    <div class="col-md-4">
                                                                        <i class="fas fa-print" onclick="window.open('<?= $urlImprimir ?>', '_blank')"></i>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    <?php } ?>
                                                </tbody>
                                            </table>


                                        </div>
                                    </div>
                                </div>

                            </div>

                            <!-- <div class="mb-8" id="content-documentos-contables">
                                 Documentos contable
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Documentos contables</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="table-responsive mb-4 mt-4">
                                                <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                    <thead>
                                                        <tr>
                                                            <th class="sort border-top border-translucent ps-3 " data-sort="number">Id</th>
                                                            <th class="sort border-top" data-sort="date">Número</th>
                                                            <th class="sort border-top" data-sort="user">Fecha</th>
                                                            <th class="sort border-top" data-sort="customer">Descripción</th>
                                                            <th class="sort border-top" data-sort="id">Movimientos</th>
                                                            <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="list">

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->

                            <div class="mb-8" id="content-comprobantes-contables">
                                <!-- Documentos contable -->
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Comprobantes contables</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="table-responsive mb-4 mt-4">
                                                <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                    <thead>
                                                        <tr>
                                                            <th>Número</th>
                                                            <th>Fecha</th>
                                                            <th>Descripción</th>
                                                            <th style="width:5% !important">Anexo</th>
                                                            <th style="width:15% !important"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="list">
                                                        <?php
                                                        foreach ($datosComprobanteContables as $ComprobanteC) {
                                                            $url = $BASE . "ContabilidadCComprobantes/" . $ComprobanteC["archivo"];
                                                            $botonArchivo = "<i class='fas fa-file-lines' onclick='window.open(\"" . $url . "\", \"_blank\")'></i> ";
                                                            $dataDetalle = $ControllerComprobanteContableDetalle->obtenerPorComprobante($ComprobanteC["id"]);
                                                            $urlImprimir = $BASE . "FECCPrint?id=" . base64_encode($ComprobanteC['id']) . "&idU=" . base64_encode($_SESSION['ID']);
                                                        ?>
                                                            <tr>
                                                                <input type="hidden" id="data_ComprobanteContable<?= $ComprobanteC['id'] ?>" value="<?= htmlspecialchars(json_encode($ComprobanteC), ENT_QUOTES) ?>">
                                                                <input type="hidden" id="data_DetalleComprobanteContable<?= $ComprobanteC['id'] ?>" value="<?= htmlspecialchars(json_encode($dataDetalle), ENT_QUOTES) ?>">
                                                                <td><?= "# " . $ComprobanteC["id"] ?></td>
                                                                <td><?= $ComprobanteC["fechaRegistro"] ?></td>
                                                                <td><?= $ComprobanteC["observaciones"] ?></td>
                                                                <td style="width:5% !important"><?= $ComprobanteC["archivo"] != "" ? $botonArchivo : "Sin archivo" ?></td>
                                                                <td style="width:15% !important">
                                                                    <div class="col-md-12 row display-flex align-items-center justify-content-center ">
                                                                        <div class="col-md-3">
                                                                            <i class="fas fa-pencil" onclick="editarComprobanteContable(<?= $terceros['id'] ?>)"></i>
                                                                        </div>
                                                                        <div class="col-md-3">
                                                                            <i class="fas fa-trash" onclick="borrarComprobanteContable(<?= $terceros['id'] ?>)"></i>
                                                                        </div>
                                                                        <div class="col-md-3">
                                                                            <i class="fas fa-print" onclick="window.open('<?= $urlImprimir ?>', '_blank')"></i>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        <?php } ?>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-8" id="content-saldos-contables">
                                <!-- Documentos contable -->
                                <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="">Saldos contables &nbsp;&nbsp; <button data-bs-toggle="modal" data-bs-target="#modalFiltroSaldosContables" class="btn btn-infov2 btn-sm"> <i class="fas fa-filter"></i> Filtrar</button> </h4>
                                        
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>
                                    <div class="card mb-3">
                                        <div class="card-body">
                                            <div class="col-md-12 row" id="contenido-saldos-contables">
                                                <?php
                                                for ($i = 1; $i <= 9; $i++) { ?>
                                                    <div class="col-md-12">
                                                        <table class="table table-sm fs-9 mb-0  tableDataTableSearch">
                                                            <thead>
                                                                <tr>
                                                                    <th>Nivel</th>
                                                                    <th>Transaccional</th>
                                                                    <th>Codigo</th>
                                                                    <th>Cuenta</th>
                                                                    <th>Saldo Inicial</th>
                                                                    <th>Movimiento Debito</th>
                                                                    <th>Movimiento Credito</th>
                                                                    <th>Saldo Final</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="list">
                                                                <?php
                                                                $cuentasPorInicial = $ControllerCuentasContables->obtenerPorInicial($i);
                                                                foreach ($cuentasPorInicial as $cuenta) { 
                                                                    
                                                                    $nivel = clasificacionDeCuentaPorLongitud($cuenta['codigo']);
                                                                    $totalDebito = $ControllerComprobanteContableDetalle->obtenerDebitoPorCuenta($cuenta["id"]);
                                                                    $totalCredito = $ControllerComprobanteContableDetalle->obtenerCreditoPorCuenta($cuenta["id"]);
                                                                    
                                                                    
                                                                    $saldoIncial = intval($cuenta["saldoInicial"]);
                                                                    $saldoFinal = $saldoIncial + intval($totalDebito) - $totalCredito;
                                                                    
                                                                    $classColumn = "";
                                                                    if ($saldoFinal < 0) {
                                                                        $classColumn = "text-danger";
                                                                    }else if ($saldoFinal > 0) {
                                                                        $classColumn = "text-success";
                                                                    }


                                                                    ?>
                                                                <tr>
                                                                    <td><?= $nivel ?></td>
                                                                    <td>No</td>
                                                                    <td><?= $cuenta['codigo'] ?></td>
                                                                    <td><?= $cuenta['nombre'] ?></td>
                                                                    <td><?= "$" . number_format($saldoIncial , 2) ?></td>
                                                                    <td><?= "$" . number_format($totalDebito, 2) ?></td>
                                                                    <td><?= "$" . number_format($totalCredito, 2) ?></td>
                                                                    <td class="<?=$classColumn?>"><?= "$" . number_format($saldoFinal, 2) ?></td>
                                                                </tr>
                                                                <?php } ?>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <hr style="margin-top:20px; margin-bottom:20px;">

                                                <?php } ?>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-8" id="content-reportes-contables">
                            <!-- Reportes contables -->
                            <div class="d-flex justify-content-between align-items-center col-12 row mb-4" id="scrollspyFacturacionVentas">
                                <div class="col-md-12 row">
                                    <div class="col-6">
                                        <h4 class="mb-1" id="scrollspyFacturacionVentas">Reportes contables</h4>
                                    </div>
                                    <div class="col-6 text-end">
                                        <?= $dropDownContabilidad ?>
                                    </div>

                                </div>

                                <div class="card mb-3 p-3">
                                    <div class="card-body">
                                        <div class="row g-3 list" id="reportsList">


                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
<style>
    select {
        width: 100%;
    }
</style>



<?php include "../footer.php"; ?>
<script>
    function showSections(idVisible) {
        //"content-documentos-contables",
        let todos = ["content-terceros", "content-plan-cuentas", "content-recibos-pago", "content-saldos-contables", "content-recibos-caja", "content-comprobantes-contables", "content-reportes-contables"];
        todos.forEach(element => {
            if (element == idVisible) {
                document.getElementById(element).style.display = "block";
            } else {
                document.getElementById(element).style.display = "none";
            }
        });
    }
    showSections("content-terceros");
</script>

<?php
// MODALES 
include "./Modales/index.php";
?>|

<style>
    .underline-input {
        border: none;
        border-bottom: 2px solid #D4D4D4;
        background-color: transparent;
        outline: none;
        padding: 5px;
        width: 100%;
    }

    .underline-input:focus {
        border-bottom: 2px solid #007bff;
    }

    .table-modal {
        background-color: #F6F9FC !important;
        padding: 10px !important;
        border-radius: 15px !important;
    }

    .table-modal td {
        padding: 20px !important;
        margin: 20px !important;
        background-color: white !important;
    }

    .table-modal th {
        color: #767C82 !important;
        padding: 20px !important;
        margin: 20px !important;
    }

    .table-modal-mediopago {
        background-color: #FFFFFF !important;
        padding: 10px !important;
        border-radius: 15px !important;
    }

    .table-modal-mediopago td {
        padding: 20px !important;
        margin: 20px !important;
        background-color: white !important;
    }

    .table-modal-mediopago th {
        color: #767C82 !important;
        padding: 20px !important;
        margin: 20px !important;
    }
</style>