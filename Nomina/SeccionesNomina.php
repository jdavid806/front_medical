<div class="mb-8" id="sub-content-trabajadores">
    <div class=" col-12 row mb-4"
        id="scrollspyFacturacionVentas">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyFacturacionVentas">Trabajadores</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Cargo</th>
                                    <th>Salario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php


                                foreach ($trabajadores as $index => $datosTrabajador) {
                                    $inputActive = '<div title="Activar/Inactivar" class="form-check form-switch text-center">
                                                  <input onchange="inactivarTrabajador(' . $datosTrabajador["id"] . ', this)" class="form-check-input" ' . (($datosTrabajador['activo'] == 1) ? "checked" : "") . ' type="checkbox" id="flexSwitchCheckDefault">
                                              </div>';

                                    $datosBeneficiarios = $ControllerBeneficiarios->indexConditional(" AND idTrabajador = " . $datosTrabajador["id"]);
                                    $datosInformacionBancaria = $ControllerInformacionBancaria->obtenerPorTrabajador($datosTrabajador["id"]);
                                    $datosInformacionHorario = $ControllerInformacionHorario->obtenerPorTrabajador($datosTrabajador["id"]);

                                ?>
                                    <tr id="rowret-<?= $datosTrabajador["id"] ?>">
                                        <input type="hidden" id="data_trabajador_<?= $datosTrabajador["id"] ?>" value='<?= htmlspecialchars(json_encode($datosTrabajador), ENT_QUOTES) ?>'>
                                        <input type="hidden" id="data_beneficiarios_trabajador_<?= $datosTrabajador["id"] ?>" value='<?= htmlspecialchars(json_encode($datosBeneficiarios), ENT_QUOTES) ?>'>
                                        <input type="hidden" id="data_infobancaria_trabajador_<?= $datosTrabajador["id"] ?>" value='<?= htmlspecialchars(json_encode($datosInformacionBancaria), ENT_QUOTES) ?>'>
                                        <input type="hidden" id="data_infohorario_trabajador_<?= $datosTrabajador["id"] ?>" value='<?= htmlspecialchars(json_encode($datosInformacionHorario), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $datosTrabajador["id"] ?></td>
                                        <!-- <td class="align-middle"><?= htmlspecialchars($datosTrabajador["id"]) ?></td> -->
                                        <td class="align-middle"><?= htmlspecialchars($datosTrabajador['nombre']) ?></td>
                                        <td class="align-middle"><?= htmlspecialchars($datosTrabajador['cargo']) ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($datosTrabajador['salario']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle">
                                            <div class="col-md-12 row">
                                                <div class="col-md-2 p-0">
                                                    <i class="fas fa-file-signature" title="Nuevo contrato digital" onclick="crearNuevoContrato('<?= htmlspecialchars($datosTrabajador['id']) ?>')"></i>
                                                </div>
                                                <div class="col-md-2 p-0">
                                                    <i class="fas fa-pencil" title="Editar" onclick="editarTrabajador('<?= htmlspecialchars($datosTrabajador['id']) ?>', '<?= $datosTrabajador['id'] ?>')"></i>
                                                </div>
                                                <div class="col-md-2 p-0">
                                                    <i class="fas fa-trash" title="Eliminar" onclick="eliminarTrabajador('<?= $datosTrabajador['id'] ?>')"></i>
                                                </div>
                                                <div class="col-md-2 p-0">
                                                    <i class="fas fa-eye" title="Ver detalle" onclick="window.open(href='FE_DetalleEmpleado?id=<?= base64_encode($datosTrabajador['id']) ?>', '_blank')"></i>
                                                </div>
                                                <div class="col-md-2 p-0">
                                                    <?= $inputActive ?>
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
</div>


<!-- <div class="mb-8" id="content-masivos-contratos"> -->
<!-- <div class="mb-8" id="sub-content-contratos">
    <div class=" col-12 row mb-4"
        id="scrollspyContratos">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyContratos">Contratos</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Trabajador</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>Duracion</th>
                                    <th>Salario</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosContratos as $index => $contrato) {

                                    $arrayTrabajador = $ControllerTrabajadores->obtenerPorId($contrato['idTrabajador']);
                                    // var_dump($arrayTrabajador);
                                    $nombreTrabajador = $arrayTrabajador['nombre'] . ' ' . $arrayTrabajador['apellido'];
                                ?>
                                    <tr id="rowcontrato-<?= $contrato['id'] ?>">
                                        <input type="hidden" id="data_contrato_<?= $contrato['id'] ?>" value='<?= htmlspecialchars(json_encode($contrato), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $contrato['id'] ?></td>
                                        <td class="align-middle"><?= $nombreTrabajador  ?></td>
                                        <td class="align-middle"><?= date("Y-m-d") ?></td> 
                                        <td class="align-middle"><?= $contrato['fechaContrato'] ?></td>
                                        <td class="align-middle"><?= $contrato['fechaFinContrato'] ?></td>
                                        <td class="align-middle"><?= $contrato['duracionContrato'] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($contrato['salario']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle" >
                                            <div class="col-md-12" style="display: flex; justify-content: space-around">
                                                <i class="fas fa-pencil" title="Editar Contrato" onclick="editarContrato('<?= htmlspecialchars($contrato['id']) ?>', '<?= $contrato['id'] ?>')"></i>
                                                <i class="fas fa-trash" title="Eliminar Contrato" onclick="borrarContrato('<?= $contrato['id'] ?>')"></i>
                                                <i class="fas fa-print" title="Imprimir" onclick="window.open(href='FE_ImprimirContrato?i=<?= base64_encode($contrato['id']) ?>', '_blank')"></i>
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
</div> -->


<div class="mb-8" id="sub-content-liquidacionestrabajadores">
    <div class=" col-12 row mb-4" id="scrollspyTrabajadores">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyTrabajadores">Liquidaciones Trabajadores</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Trabajador</th>
                                    <th>Fecha Ingreso</th>
                                    <th>Fecha Fin</th>
                                    <th>Total Liquidacion</th>
                                    <th>Salario</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosLiquidaciones as $liquidacion) {

                                    $arrayTrabajador = $ControllerTrabajadores->obtenerPorId($liquidacion['idTrabajador']);
                                    $nombreTrabajador = $arrayTrabajador['nombre'] . ' ' . $arrayTrabajador['apellido'];

                                    $detalle = json_decode($liquidacion['detalle'], true);


                                ?>
                                    <tr id="rowliquidacion-<?= $liquidacion['id'] ?>">
                                        <input type="hidden" id="data_liquidacion_<?= $liquidacion['id'] ?>" value='<?= htmlspecialchars(json_encode($liquidacion), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $liquidacion['id'] ?></td>
                                        <td class="align-middle"><?= $nombreTrabajador  ?></td>
                                        <!-- <td class="align-middle"><?= date("Y-m-d") ?></td> -->
                                        <td class="align-middle"><?= $liquidacion['fechaIngreso'] ?></td>
                                        <td class="align-middle"><?= $liquidacion['fechaSalida'] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($detalle["totalLiquidacion"]). " " . $liquidacion['moneda'] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($liquidacion['salario']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle" >
                                            <div class="col-md-12" style="display: flex; justify-content: space-around">
                                                <i class="fas fa-pencil" title="Editar Contrato" onclick="editarLiquidacion('<?= htmlspecialchars($liquidacion['id']) ?>', '<?= $liquidacion['id'] ?>')"></i>
                                                <i class="fas fa-trash" title="Eliminar Contrato" onclick="borrarLiquidacion('<?= $liquidacion['id'] ?>')"></i>
                                                <i class="fas fa-print" title="Imprimir" onclick="window.open(href='FE_ImprimirLiquidacion?i=<?= base64_encode(base64_encode($liquidacion['id'])) ?>&u=<?= base64_encode(base64_encode($_SESSION['ID'])) ?>', '_blank')"></i>
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
</div>



<div class="mb-8" id="sub-content-liquidacionesnomina">
    <div class=" col-12 row mb-4"
        id="scrollspyContratos">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyContratos">Liquidaciones Nomina</h4>
        </div>
        <!-- <div class="col-6 text-end">
            <?= $dropdownNew ?>
        </div> -->
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                                <tr>
                                    <th>Periodo</th>
                                    <!-- <th>Trabajadores</th> -->
                                    <th>Total Salarios</th>
                                    <th>Total Descuentos</th>
                                    <th>Total Extras</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosNominaGrupal as $index => $nomina) { ?>
                                    <tr id="rownominaliquidacion-<?= $nomina["id"] ?>">
                                        <!-- <input type="hidden" id="data_liquidacionnomina_<?= $nomina["id"] ?>" value='<?= htmlspecialchars(json_encode($nomina), ENT_QUOTES) ?>'> -->
                                        <td class="align-middle"><?= $nomina['fechaInicio'] . " - " . $nomina['fechaFin'] ?></td>
                                        <!-- <td class="align-middle"><?= $nomina['totalTrabajadores'] ?></td> -->
                                        <td class="align-middle"><?= "$ " . number_format($nomina['totalBase']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($nomina['totalDescuentos']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($nomina['totalExtras']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($nomina['total']) . " " . $ConfigNominaUser["moneda"] ?></td>

                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarLiquidacionNominaEdit('<?= base64_encode($nomina['id']) ?>')"></i>
                                            <i class="fas fa-bars" title="Descargar/Imprimir/Compartir" onclick="abrirModalImprimirNomina('<?= base64_encode($nomina['id']) ?>')"></i>
                                            <i class="fas fa-trash" title="Eliminar" onclick="borrarLiquidacionNomina(<?=$nomina['id']?>)"></i>
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


<div class="modal fade" id="modalImprimirNomina" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel"> <i class="fas fa-file"></i> Imp./Des. Comprobante de Nomina</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="idNomina" value="0">

        <div class="col-md-12 row">
            <div class="col-md-12"><h5>Accion</h5></div>
            <div class="col-md-6">
                <input type="radio" checked class="form-check-input" value="Descargar" name="accion" id="accion">
                <label for=""> <i class="fas fa-download"></i> Descargar</label>
            </div>
            <div class="col-md-6">
                <input type="radio" class="form-check-input" onchange="this.checked ? $('#accionPdf').prop('checked', true) : $('#accionPdf').prop('checked', false)" value="Imprimir" name="accion" id="accion">
                <label for=""> <i class="fas fa-print"></i> Imprimir</label>
            </div>
            
            <hr class="my-2">
            <div class="col-md-12"><h5>Modo</h5></div>
            <div class="col-md-6">
                <input type="radio" checked class="form-check-input" value="Excel" name="modo" id="modoExcel">
                <label for="">Excel</label>
            </div>
            <div class="col-md-6">
                <input type="radio" class="form-check-input" value="Pdf" name="modo" id="modoPdf">
                <label for="">PDF</label>
            </div>
            
            <hr class="my-2">
            <div class="col-md-12"><h5>Contenido de impresion</h5></div>
            <div class="col-md-4">
                <input type="radio" checked class="form-check-input" value="grupal" name="contenido" id="contenido">
                <label for="">Comprobante Grupal</label>
            </div>
            <div class="col-md-4">
                <input type="radio" class="form-check-input" value="individual" name="contenido" id="contenido">
                <label for="">Comprobantes Individuales</label>
            </div>
            <div class="col-md-4">
                <input type="radio" class="form-check-input" value="grupal_e_individual" name="contenido" id="contenido">
                <label for="">Comprobantes Individuales y Grupal</label>
            </div>

        </div>


      </div>
      <div class="modal-footer">
            <div class="dropdown">
                <button class="btn btn-sm btn-infov2 dropdown-toggle" role="button" id="dropdownShare" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-share-nodes"></i> Compartir
                </button>

                <ul class="dropdown-menu" aria-labelledby="dropdownShare">
                    <li><a class="dropdown-item" href="#">Compartir con todos los trabajadores</a></li>
                    <li><a class="dropdown-item" href="#">Compartir con un correo electronico</a></li>
                </ul>
            </div>

            <button type="button" class="btn btn-sm btn-primary" onclick="irAImprimirNomina()"> <i class="fas fa-print"></i> Imp./Des.</button>
      </div>
    </div>
  </div>
</div>


<script>
    function irAImprimirNomina() {
        let accion = $("#modalImprimirNomina input[name='accion']:checked").val();
        let modo = $("#modalImprimirNomina input[name='modo']:checked").val();
        let contenido = $("#modalImprimirNomina input[name='contenido']:checked").val();
        let idUsuario = "<?= $_SESSION['ID'] ?>";
        let id = atob($("#modalImprimirNomina #idNomina").val());

        let data  = { accion, modo, contenido, idUsuario, id };
        
        let queryParams = Object.keys(data).map(key => `${key}=${btoa(data[key])}`).join('&');
        let url = "";
        if (accion == 'Descargar' && modo == 'Pdf') {
            url = "<?= $BASE ?>Nomina/FE_InprimirNominaGrupalPdf.php?" + queryParams;
            
        }else{
            url = "<?= $BASE ?>Nomina/FE_InprimirNominaGrupal.php?" + queryParams;
        }
        
        window.open(url, '_blank');
        console.log( { accion, modo, contenido, idUsuario, id } );
        

    }


    function abrirModalImprimirNomina(idBase64) {
        $("#modalImprimirNomina #idNomina").val(idBase64);
        $("#modalImprimirNomina").modal('show');
    }

    $(document).ready(function () {
        // Evento para deshabilitar opciones de "Modo" al seleccionar "Imprimir"
        $('input[name="accion"]').on('change', function () {
            if ($(this).val() === 'Imprimir') {
                // Deshabilitar la opción "Excel"
                $('#modoExcel').prop('disabled', true);
                $('#modoPdf').prop('checked', true); // Cambiar automáticamente a "PDF"
            } else {
                // Habilitar "Excel" si no está seleccionado "Imprimir"
                $('#modoExcel').prop('disabled', false);
            }
        });
    });


</script>