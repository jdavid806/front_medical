<?php
include "../menu.php";
include "../header.php";


// include "./datosPrueba.php";
include "./datosNomina.php";
$idTrabajador = intval(base64_decode($_GET['id']));
$datosTrabajador = $ControllerTrabajadores->obtenerPorId($idTrabajador);


$RetardosTrabajador = $ControllerMarcaje->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador' AND retardo = 'Si'");
$AusenciasTrabajador = $ControllerMarcaje->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador' AND inasistencia = 'Si'");
$VacacionesTrabajador = $ControllerVacaciones->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");
$ContratosTrabajador = $ControllerContratos->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");
$AnexosTrabajador = $ControlleraAnexos->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");
$dataRecargos = $ControllerRecargos->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");
$BeneficiosTrabajador = $ControllerBeneficios->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");
$DeduccionesTrabajador = $ControllerDeducciones->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");
$HistorialNominaTrabajador = $ControllerNominaIndividual->obtenerPorCondicion(" AND idTrabajador = '$idTrabajador'");

$cargoTrabajador = $ControllerCargo->obtenerPorId($datosTrabajador["cargo"])["nombre"];
$incapacidadesTrabajador = $ControllerIncapacidades->obtenerPorIdTrabajador($idTrabajador);
// var_dump($incapacidadesTrabajador);
// die();
// $ConfigNominaUser => PARA CONFIGURACION DEL USUARIO ACTUALMENTE EN SESION


?>
<div class="content">
    <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
            <li class="breadcrumb-item"><a href="FE_Nomina">Nomina</a></li>
            <li class="breadcrumb-item active" onclick="location.reload()">Detalle persona</li>
        </ol>
    </nav>
    <div class="pb-9">
        <div class="row">
            <div class="col-12">
                <div class="row align-items-center justify-content-between g-3 mb-3">
                    <div class="col-12 col-md-auto">
                        <h2 class="mb-0">Detalle de persona</h2>
                    </div>

                </div>
            </div>
        </div>
        <div class="row g-0 g-md-4 g-xl-6">
            <div class="col-md-5 col-lg-5 col-xl-4">
                <div class="sticky-leads-sidebar">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed" id="productFilterColumn">
                        <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
                            <h3 class="mb-0">Lead Details</h3>
                            <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span class="uil uil-times fs-7"></span></button>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle" src="<?=$datosTrabajador["imagenPerfilBase64"]?>" alt="" /></div>
                                    </div>
                                    <div class="col-12 col-sm-auto flex-1">
                                        <h3 class="fw-bolder mb-2"><?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?></h3>
                                        <p class="mb-0"><?= $cargoTrabajador ?></p><a class="fw-bold" href="#!"><?= "$ " . number_format($datosTrabajador['salario']) .  " " .$ConfigNominaUser["moneda"] ?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Acerca de <?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?> </h3>
                                    <button class="btn btn-link px-3" type="button">Editar</button>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-envelope-alt"> </span>
                                        <h5 class="text-body-highlight mb-0">Email</h5>
                                    </div><a href="<?= $datosTrabajador['email'] ?>"><?= $datosTrabajador['email'] ?></a>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-phone"> </span>
                                        <h5 class="text-body-highlight mb-0">Telefono de contacto</h5>
                                    </div><a href="<?= $datosTrabajador['telefono'] ?>"><?= $datosTrabajador['telefono'] ?></a>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-building"></span>
                                        <h5 class="text-body-highlight mb-0">Numero de Documento</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary"><?= $datosTrabajador['numero_documento'] ?></p>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-postcard"></span>
                                        <h5 class="text-body-highlight mb-0">Edad</h5>
                                    </div>
                                    <?php 
                                    $arrayFechaNacimiento = explode($datosTrabajador['fecha_nacimiento'], "-");
                                    ?>
                                    <p class="mb-0 text-body-secondary"><?= $arrayFechaNacimiento[3] ."-" .$arrayFechaNacimiento[2] ?></p>
                                </div>
                                
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-calendar"></span>
                                        <h5 class="text-body-highlight mb-0">Fecha cumpleaños</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary"><?= $datosTrabajador['edad'] ?></p>
                                </div>

                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Informacion de pago </h3>
                                    <button class="btn btn-link px-3" type="button">Editar</button>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-envelope-alt"> </span>
                                        <h5 class="text-body-highlight mb-0">Metodo de pago</h5>
                                    </div><a>Transferencia Bancaria</a>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-phone"> </span>
                                        <h5 class="text-body-highlight mb-0">Banco</h5>
                                    </div><a>Nequi</a>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-building"></span>
                                        <h5 class="text-body-highlight mb-0">Numero de cuenta</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">754546554</p>
                                </div>

                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Informacion de afiliacion </h3>
                                    <button class="btn btn-link px-3" type="button">Editar</button>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-envelope-alt"> </span>
                                        <h5 class="text-body-highlight mb-0">EPS</h5>
                                    </div><a>Compensar</a>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-phone"> </span>
                                        <h5 class="text-body-highlight mb-0">ARL</h5>
                                    </div><a>Sura</a>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-building"></span>
                                        <h5 class="text-body-highlight mb-0">Caja de Compensacion</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Colsubsidio</p>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-building"></span>
                                        <h5 class="text-body-highlight mb-0">Fondo de pensiones</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Colpensiones</p>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div class="phoenix-offcanvas-backdrop d-lg-none top-0" data-phoenix-backdrop="data-phoenix-backdrop"></div>
                </div>
            </div>
            <div class="col-md-7 col-lg-7 col-xl-8">
                <div class="lead-details-container">
                    <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" id="navbar-deals-detail">
                        <ul class="nav nav-underline fs-9">
                            <li class="nav-item"><a class="nav-link me-2" href="#scrollspyHistorial">Historial de pagos</a></li>
                            <li class="nav-item"><a class="nav-link me-2" href="#scrollspyRetardos">Retardos</a></li>
                            <li class="nav-item"><a class="nav-link me-2" href="#scrollspyAusencias">Ausencias</a></li>
                            <li class="nav-item"><a class="nav-link me-2" href="#scrollspyIncapacidades">Incapacidades</a></li>
                            <li class="nav-item"><a class="nav-link me-2" href="#scrollspyVacaciones">Vacaciones</a></li>
                            <li class="nav-item"><a class="nav-link" href="#scrollspyRecargos">Recargos</a></li>
                            <li class="nav-item"><a class="nav-link" href="#scrollspyContratos">Contratos</a></li>
                            <li class="nav-item"><a class="nav-link" href="#scrollspyBeneficios">Beneficios</a></li>
                            <!-- <li class="nav-item"><a class="nav-link" href="#scrollspyDeducciones">Deducciones</a></li> -->
                            <li class="nav-item"><a class="nav-link" href="#scrollspyAnexos">Anexos</a></li>
                        </ul>
                    </nav>
                    <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0" data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" tabindex="0">
                        <div class="mb-8">
                            <h2 class="mb-4" id="scrollspyHistorial">Historial de pagos</h2>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th scope="col">Fecha</th>
                                                <!-- <th scope="col">Cargo</th> -->
                                                <th scope="col">Salario base</th>
                                                <th scope="col">Deducciones</th>
                                                <th scope="col">Bonificaciones</th>
                                                <th scope="col">Descuentos</th>
                                                <th scope="col">Total Neto</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php 
                                            if (!is_array($HistorialNominaTrabajador)) { $HistorialNominaTrabajador = []; }
                                            
                                            foreach ($HistorialNominaTrabajador as $index => $detalleNominaEmpleado) {

                                                $totalDeducciones = $detalleNominaEmpleado["totalDeducciones"];
                                                $totalBonificaciones = $detalleNominaEmpleado["totalExtras"];
                                                $totalDescuentos = $detalleNominaEmpleado["totalDescuentos"];
                                                // $totalDeducciones = intval($detalleNominaEmpleado["deducciones"]["salud"]) + intval($detalleNominaEmpleado["deducciones"]["pension"]);
                                                // $totalBonificaciones = intval($detalleNominaEmpleado["bonificaciones"]["auxilio_transporte"]) + intval($detalleNominaEmpleado["bonificaciones"]["bono_productividad"]);
                                                // $totalDescuentos = 0;
                                                // foreach ($detalleNominaEmpleado["descuentos"] as $value) {
                                                //     $totalDescuentos += $value["valor_descuento"];
                                                // }
                                                $urlAbrir = 'FE_ImprimirNominaI?id='. base64_encode($detalleNominaEmpleado['id']);
                                            ?>
                                                <tr>
                                                    <td scope="col"><?= $detalleNominaEmpleado['fechaRegistro'] ?></td>
                                                    <input type="hidden" id="data_detalle_nomina<?= $detalleNominaEmpleado["id"] ?>" value='<?= htmlspecialchars(json_encode($detalleNominaEmpleado), ENT_QUOTES) ?>'>
                                                    <!-- <td scope="col"><?= $detalleNominaEmpleado['cargo'] ?></td> -->
                                                    <td scope="col"><?= "$ " . number_format($detalleNominaEmpleado['totalBase']) .  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td scope="col"><?= "$ " . number_format($totalDeducciones) .  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td scope="col"><?= "$ " . number_format($totalBonificaciones) .  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td scope="col"><?= "$ " . number_format($totalDescuentos) .  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td scope="col"><?= "$ " . number_format($detalleNominaEmpleado['total']) .  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td scope="col">
                                                        <i title="Ver detalle" alt="Ver detalle de comprobante de nomina" class="fas fa-eye" onclick="verDetalleNomina(<?= $detalleNominaEmpleado['id'] ?>)"></i>
                                                        <i title="Imprimir / Descargar" alt="Imprimir comprobante de nomina" class="fas fa-print" onclick="window.open('<?= $urlAbrir ?>', '_blank')"></i>
                                                        <!-- <i title="Descargar" alt="Descargar comprobante de nomina" class="fas fa-download" onclick="window.location.href='FE_Nomina_DescargarPago?id<?= base64_encode($detalleNominaEmpleado['id']) ?>'"></i> -->
                                                    </td>
                                                </tr>
                                            <?php } ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                        <div class="mb-8">
                            <h2 class="mb-4" id="scrollspyRetardos">Retardos</h2>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Descontado</th>
                                                <th>Fecha</th>
                                                <th>Hora</th>
                                                <th>Valor descontado</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($RetardosTrabajador as $retardo) {
                                                // var_dump($retardo); 
                                                $valorDescuento = $ControllerDescuentos->obtenerPorCondicion(" AND tabla='marcacion' AND idTablaDescuento='{$retardo['id']}' ");
                                                $valorDescuento = $valorDescuento["valorDescuento"];
                                                ?>
                                                <tr id="filaRetardo<?=$retardo['id']?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <td class=""> <input type="checkbox" <?= (($retardo["descontado"] == 'Si') ? "checked" : "") ?> disabled> </td>
                                                    <td class=""><?= $retardo["fechaMarcacion"] . " " .$retardo["horaMarcacion"]?></td>
                                                    <td><input onchange="changeAjaxFast('marcacion', 'justificacion', this.value, 'id' , <?= $retardo['id'] ?> , true)"
                                                    type="text" value="<?= $retardo["justificacion"] ?>" placeholder="<?= $retardo["justificacion"] == '' ? 'Sin Justificacion' : '' ?>" name="" id="" class="form-control"></td>
                                                    <td class=""><?= "$ ". number_format($valorDescuento)  . " " .$ConfigNominaUser["moneda"]?></td>
                                                    <td class=""> <i class="text-danger fas fa-trash" onclick="borrarRetardo(<?=$retardo['id']?>)"></i> </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        <div class="mb-8">
                            <div class="d-flex justify-content-between align-items-center mb-4" id="scrollspyAusencias">
                                <h2 class="mb-0">Ausencias</h2>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Descontado</th>
                                                <th>Fecha</th>
                                                <th>Motivo</th>
                                                <th>Valor descuento</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($AusenciasTrabajador as $index => $inasistencia) { ?>
                                                <tr id="filaInasistencia<?=$inasistencia["id"]?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <td> <input type="checkbox" <?= (($inasistencia["descontado"] == 'Si') ? "checked" : "") ?> disabled> </td>
                                                    <td><?= $inasistencia["fechaRegistro"] .  " " . $inasistencia["horaRegistro"] ?></td>
                                                    <td><input onchange="changeAjaxFast('marcacion', 'justificacion', this.value, 'id' , <?= $inasistencia['id'] ?> , true)" type="text" value="<?= $inasistencia["justificacion"] ?>" placeholder="<?= $inasistencia["justificacion"] == '' ? 'Sin Justificacion' : '' ?>" name="" id="" class="form-control"></td>
                                                    <td><?= "$ ". number_format($inasistencia["valor_descuento"]) .  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td> <i class="text-danger fas fa-trash" onclick="borrarAusencia(<?=$inasistencia['id']?>)"></i> </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="mb-8">
                        <div class="col-md-12 row mb-2">
                                <div class="col-md-6">
                                    <h2 class="mb-2" id="scrollspyIncapacidades">Incapacidades</h2>
                                </div>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalIncapacidad"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Fecha Inicio</th>
                                                <th>Fecha Fin</th>
                                                <th>Archivo</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($incapacidadesTrabajador as $index => $incapacidad) { 
                                                
                                                $dataIncapacidad = $incapacidad;

                                                unset($dataIncapacidad["archivo"]);
                                                
                                                ?>
                                                    
                                                <tr id="filaIncapacidad<?=$incapacidad["id"]?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <input type="hidden" id="data_Incapacidad<?=$incapacidad["id"]?>" value="<?= htmlspecialchars(json_encode($dataIncapacidad, ENT_QUOTES)) ?>">
                                                    <td><?= $incapacidad["fechaIncio"] ?></td>
                                                    <!-- <td><?= var_dump($incapacidad) ?></td> -->
                                                    <td><?= $incapacidad["fechaFin"] ?></td>
                                                    <td><?= $incapacidad["archivo"] <> "" ? "<i class='fas fa-file-pdf' onclick='verIncapacidad(\"" . $incapacidad["archivo"] . "\")'></i>" : "Sin Archivo" ?></td>
                                                    <td> 
                                                        <i class="fas fa-pencil" onclick="editarIncapacidad(<?=$incapacidad['id']?>)"></i> 
                                                        <i class="text-danger fas fa-trash" onclick="borrarIncapacidad(<?=$incapacidad['id']?>)"></i> 
                                                    </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="mb-8">
                            <div class="col-md-12 row mb-2">
                                <div class="col-md-6">
                                    <h2 class="mb-2" id="scrollspyVacaciones">Vacaciones</h2>
                                </div>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalNuevoVacaciones"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Fecha de Inicio</th>
                                                <th>Fecha de Fin</th>
                                                <th>Cantidad de dias</th>
                                                <th>Restante</th>
                                                <th>Valor pagado</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php  foreach ($VacacionesTrabajador as $vacaciones) { 
                                                
                                                $fechaHoy = strtotime(date("Y-m-d"));
                                                $fechaFin = strtotime($vacaciones["fechaFinVacaciones"]);

                                                $diasRestantes = $fechaFin - $fechaHoy;
                                                $diasRestantes = $diasRestantes / (60 * 60 * 24);
                                                
                                                $clase = "";
                                                if ($diasRestantes <= 0) {
                                                    $clase = "success";
                                                    $text = "Finalizado";
                                                }else if ($diasRestantes > 0 && $diasRestantes <= 7) {
                                                    $clase = "info";
                                                    $text = $diasRestantes . " dias";
                                                }else{
                                                    $clase = "primary";
                                                    $text = $diasRestantes . " dias";
                                                }

                                                $label = '<span class="badge badge-phoenix badge-phoenix-'.$clase.'">'.$text.'</span>';


                                                ?>
                                                <tr>
                                                    <td><?= $vacaciones["fechaInicioVacaciones"] ?></td>
                                                    <td><?= $vacaciones["fechaFinVacaciones"] ?></td>
                                                    <td><?= $vacaciones["diasSolicitados"] ?></td>
                                                    <td><?= $label ?></td>
                                                    <td><?= "$ " .number_format("10000") . " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td></td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="col-md-12 row">
                                <h2 class="mb-4 col-md-6" id="scrollspyRecargos">Recargos</h2>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#ModalNuevoRecargo"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>

                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Pagado</th>
                                                <th>Fecha</th>
                                                <th>Motivo</th>
                                                <th>Horas</th>
                                                <th>Valor de recargo</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        

                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($dataRecargos as $index => $recargo) { ?>
                                                <tr id="filaRecargo<?=$recargo["id"]?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <input type="hidden" id="data_Recargo<?=$recargo["id"]?>">
                                                    <td><input type="checkbox" <?= (($recargo["pagado"] == 'Si') ? "checked" : "") ?> disabled> </td>
                                                    <td><?= $recargo["fechaRecargo"] ?></td>
                                                    <td><input type="text" value="<?= $recargo["motivo"] ?>" name="" id="" class="form-control"></td>
                                                    <td><?= $recargo["horasRecargo"] ?></td>
                                                    <td><?= "$ ". number_format($recargo["valorRecargo"]).  " " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td> <i class="text-danger fas fa-trash" onclick="borrarRecargo(<?=$recargo['id']?>)"></i> </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="col-md-12 row mb-2">
                                <div class="col-md-6">
                                    <h2 class="mb-4" id="scrollspyContratos">Contratos</h2>
                                </div>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalNuevoContrato"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Estado</th>
                                                <th>Inicio</th>
                                                <th>Fin</th>
                                                <th>Cargo</th>
                                                <th>Salario</th>
                                                <th>Tipo</th>
                                                <th>Duracion</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($ContratosTrabajador as $index => $contrato) { 
                                                
                                                $jsonUrl = json_encode(["idContrato" => $contrato['id'], "idUsuario" => $_SESSION['ID']]);
                                                $jsonUrl = base64_encode($jsonUrl);


                                                ?>
                                                <tr id="filaContrato<?=$contrato['id']?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <td> <?= ($contrato["fechaDiligenciamiento"] <> "") ? '<span class="badge badge-phoenix badge-phoenix-success">Diligenciado</span>' : '<span class="badge badge-phoenix badge-phoenix-danger">Pendiente</span>' ?> </td>
                                                    <td> <?= $contrato["fechaContrato"] ?> </td>
                                                    <td><?= ( ($contrato["fechaFinContrato"] == '') ? 'No aplica' : $contrato["fechaFinContrato"] ) ?></td>
                                                    <td><?= $contrato["cargo"] ?></td>
                                                    <td><?= "$ " . number_format($contrato["salario"])  ." " .$ConfigNominaUser["moneda"] ?></td>
                                                    <td><?= $contrato["tipoContrato"] ?></td>
                                                    <td><?= $contrato["duracionContrato"] ?></td>
                                                    <td>
                                                        <!-- <a title="Ver Contrato" class="text-dark" target="_blank" href="<?$BASE?>verContrato/<?= base64_encode($contrato['id']) ?>"><i class="fas fa-eye"></i></a> -->
                                                        <a title="Ver Contrato" class="text-dark" target="_blank" href="<?$BASE?>verContrato/<?= $jsonUrl ?>"><i class="fas fa-eye"></i></a>
                                                        <a title="Imprimir Contrato" class="text-dark" target="_blank" href="<?=$BASE?>Contrato/descargar.php?i=<?= base64_encode($contrato['id']) ?>"><i class="fas fa-print"></i></a>
                                                        <a title="Descargar archivo" class="text-dark" target="_blank" href="<?=$BASE?>Contrato/descargar.php?i=<?= base64_encode($contrato['id']) ?>"><i class="fas fa-download"></i></a>
                                                        <a title="Eliminar archivo" class="text-dark" onclick="borrarContrato(<?=$contrato['id']?>)"><i class="text-danger fas fa-trash" ></i></a>
                                                    </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="mb-8">
                            <div class="col-md-12 row mb-2" id="scrollspyBeneficios">
                                <h2 class="col-md-6 mb-2">Beneficios</h2>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalNuevoBeneficio"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Beneficio</th>
                                                <th>Valor</th>
                                                <th>Periodicidad</th>
                                                <th>Beneficio Activo</th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($BeneficiosTrabajador as $index => $beneficio) { ?>
                                                <tr id="filabeneficio<?=$beneficio["id"]?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <td><?= $beneficio["Beneficio"] ?></td>
                                                    <td><?= "$ ". number_format($beneficio["Valor"]) .  " " .$ConfigNominaUser["moneda"]?></td>
                                                    <td><?= $beneficio["Periodicidad"] ?></td>
                                                    <td>
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" <?= $beneficio["beneficioActivo"] == 'Si' ? 'checked' : '' ?> onchange="changeAjaxFast('beneficios', 'beneficioActivo', this.checked == true ? 'Si' : 'No', 'id' , <?= $beneficio['id'] ?> , true)">
                                                            <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="mb-8">
                            <div class="col-md-12 row mb-2" id="scrollspyDeducciones">
                                <h2 class="col-md-6 mb-2">Deducciones</h2>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalNuevaDeduccion"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Deduccion</th>
                                                <th>Valor</th>
                                                <th>Periodicidad</th>
                                                <th>Deduccion Activa</th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($DeduccionesTrabajador as $index => $Deduccion) { ?>
                                                <tr id="filabeneficio<?=$Deduccion["id"]?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <td><?= $Deduccion["deduccion"] ?></td>
                                                    <td><?= "$ ". number_format($Deduccion["valor"]) .  " " .$ConfigNominaUser["moneda"]?></td>
                                                    <td><?= $Deduccion["periodicidad"] ?></td>
                                                    <td>
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" <?= $Deduccion["deduccionActiva"] == 'Si' ? 'checked' : '' ?> onchange="changeAjaxFast('deducciones', 'deduccionActiva', this.checked == true ? 'Si' : 'No', 'id' , <?= $Deduccion['id'] ?> , true)">
                                                            <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php } ?>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> -->
                        <div>
                            <div class="col-md-12 row mb-2">
                                <div class="col-md-6">
                                    <h2 class="mb-4" id="scrollspyAnexos">Anexos</h2>
                                </div>
                                <div class="col-md-6 text-end">
                                    <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalNuevoAnexo"> <i class="fas fa-plus"></i> Agregar</button>
                                </div>
                            </div>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <table class="table tableDataTableSearch table-min-personalizada">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Archivo</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody class="list" id="lead-details-table-body">
                                            <?php foreach ($AnexosTrabajador as $index => $archivo) { ?>
                                                <tr id="filaAnexo<?=$archivo['id']?>" class="hover-actions-trigger btn-reveal-trigger position-static">
                                                    <td> <?= $archivo["descripcionArchivo"] ?> </td>
                                                    <td><?= $archivo["nombreArchivo"] ?></td>
                                                    <td>
                                                        <a title="Ver archivo" target="_blank" class="text-dark" href="<?=$BASE?>NominaAnexos/<?=$archivo["nombreArchivo"]?>"><i class="fas fa-eye"></i></a>
                                                        <a title="Descargar archivo" class="text-dark" download="<?=$BASE?>NominaAnexos/<?=$archivo["nombreArchivo"]?>" href="<?=$BASE?>NominaAnexos/<?=$archivo["nombreArchivo"]?>"><i class="fas fa-download"></i></a>
                                                        <a title="Eliminar archivo" class="text-dark" onclick="borrarArchivo(<?=$archivo['id']?>)"><i class="text-danger fas fa-trash" ></i></a>
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
            </div>
        </div>
    </div>
</div>

<script>
    function verIncapacidad(archivo) {
        let url = '<?=$BASE?>ComprobantesIncapacidades/' + archivo;
        window.open(url, '_blank');
    }
</script>


<?php include "../footer.php" ?>
<?php include "./funcionesJs.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalAnexos.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalBeneficios.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalContrato.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalDeduccion.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalDetalleNomina.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalIncapacidad.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalRecargo.php" ?>
<?php include "./ModalesDetalleEmpleado/ModalVacaciones.php" ?>


<style>
    .table-min-personalizada * {
        font-size: 15px !important;
    }
</style>