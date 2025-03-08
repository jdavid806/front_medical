<div class="mb-8" id="sub-content-sedes">
    <!-- <div class="mb-8" id="content-masivos-sedes"> -->
    <div class=" col-12 row mb-4"
        id="scrollspyFacturacionVentas">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyFacturacionVentas">Sedes</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Direccion</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosSedes as $index => $sede) { ?>
                                    <tr id="rowSede-<?= $sede['id'] ?>">
                                        <input type="hidden" id="data_sede_<?= $index ?>" value='<?= htmlspecialchars(json_encode($sede), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $index + 1 ?></td>
                                        <td class="align-middle"><?= htmlspecialchars($sede['nombreSede']) ?></td>
                                        <td class="align-middle"><?= htmlspecialchars($sede['direccionSede']) ?></td>
                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarSede('<?= $sede['id'] ?>', '<?= $index ?>')"></i>
                                            <i class="fas fa-trash" title="Editar" onclick="borrarSede('<?= $sede['id'] ?>')"></i>
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

<div class="mb-8" id="sub-content-cargos">
    <!-- <div class="mb-8" id="content-masivos-cargos"> -->
    <div class=" col-12 row mb-4"
        id="scrollspyFacturacionVentas">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyFacturacionVentas">Cargos</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Codigo</th>
                                    <th>Cargo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosCargos as $index => $cargo) { ?>
                                    <tr id="rowcargo-<?= $cargo['id'] ?>">
                                        <input type="hidden" id="data_cargo_<?= $cargo['id'] ?>" value='<?= htmlspecialchars(json_encode($cargo), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $cargo['id']  ?></td>
                                        <td class="align-middle"><?= htmlspecialchars($cargo['codigo']) ?></td>
                                        <td class="align-middle"><?= htmlspecialchars($cargo['nombre']) ?></td>
                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarCargo('<?= htmlspecialchars($cargo['id']) ?>', '<?= $cargo['id'] ?>')"></i>
                                            <i class="fas fa-trash" title="Editar" onclick="eliminarCargo('<?= $cargo['id'] ?>')"></i>
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


<div class="mb-8" id="sub-content-deduccionesgrupales">
    <div class=" col-12 row mb-4">
        <div class="col-6">
            <h4 class="mb-1">Deducciones</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Valor</th>
                                    <th>Descuenta segun</th>
                                    <th>Aplicable a</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosDeduccionesGrupales as $index => $deduccion) { 
                                    
                                    $descuentoSegun = $deduccion["porcentajeSalario"] ? "Porcentaje de Salario" : "Monto Fijo";
                                    
                                    ?>
                                    <tr id="rowdeduccion-<?= $deduccion['id'] ?>">
                                        <input type="hidden" id="data_DeduccionGrupal<?= $deduccion['id'] ?>" value='<?= htmlspecialchars(json_encode($deduccion), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $deduccion['id']  ?></td>
                                        <td class="align-middle"><?= $deduccion['nombre']  ?></td>
                                        <td class="align-middle"><?= $deduccion['valor'] . ($deduccion["porcentajeSalario"] ? "%" : "") ?></td>
                                        <td class="align-middle"><?= $descuentoSegun ?></td>
                                        <td class="align-middle"><?= $deduccion['aplicableA'] ?></td>
                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarDeduccionGrupal('<?= htmlspecialchars($deduccion['id']) ?>', '<?= $deduccion['id'] ?>')"></i>
                                            <i class="fas fa-trash" title="Editar" onclick="borrarDeduccionGrupal('<?= $deduccion['id'] ?>')"></i>
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

<div class="mb-8" id="sub-content-tiposrecargos">
    <div class=" col-12 row mb-4">
        <div class="col-6">
            <h4 class="mb-1">Tipos de recargo</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Valor</th>
                                    <th>Descuenta segun</th>
                                    <th>Aplicable a</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                    foreach ($datosTiposRecargo as $index => $recargo) { 
                                    $calcularSegun = $recargo["calcularSegun"] == 'horaTrabajador' ? "Hora de trabajador" : "Hora de configuracion";
                                ?>
                                    <tr id="rowtiposrecargo-<?= $recargo['id'] ?>">
                                        <input type="hidden" id="data_TipoRecargo<?= $recargo['id'] ?>" value='<?= htmlspecialchars(json_encode($recargo), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $recargo['nombre']  ?></td>
                                        <td class="align-middle"><?= $recargo['valor'] . " %" ?></td>
                                        <td class="align-middle"><?= $descuentoSegun ?></td>
                                        <td class="align-middle"><?= $recargo['aplicableA'] ?></td>
                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarTipoRecargo('<?= htmlspecialchars($recargo['id']) ?>', '<?= $recargo['id'] ?>')"></i>
                                            <i class="fas fa-trash" title="Editar" onclick="borrarTipoRecargo('<?= $recargo['id'] ?>')"></i>
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

<div class="mb-8" id="sub-content-adicionesgrupales">
    <div class=" col-12 row mb-4">
        <div class="col-6">
            <h4 class="mb-1">Provisiones</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Valor</th>
                                    <th>Descuenta segun</th>
                                    <th>Aplicable a</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                
                                foreach ($datosAdiciones as $index => $adiciones) { 
                                    
                                    $descuentoSegun = $deduccion["porcentajeSalario"] ? "Porcentaje de Salario" : "Monto Fijo";
                                    
                                    ?>
                                    <tr id="rowdeduccion-<?= $adiciones['id'] ?>">
                                        <input type="hidden" id="data_adicionesGrupal<?= $adiciones['id'] ?>" value='<?= htmlspecialchars(json_encode($adiciones), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $adiciones['id']  ?></td>
                                        <td class="align-middle"><?= $adiciones['nombre']  ?></td>
                                        <td class="align-middle"><?= $adiciones['valor'] . ($adiciones["porcentajeSalario"] ? "%" : "") ?></td>
                                        <td class="align-middle"><?= $descuentoSegun ?></td>
                                        <td class="align-middle"><?= $adiciones['aplicableA'] ?></td>
                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarAdicionGrupal('<?= htmlspecialchars($adiciones['id']) ?>', '<?= $adiciones['id'] ?>')"></i>
                                            <i class="fas fa-trash" title="Editar" onclick="borrarAdicionGrupal('<?= $adiciones['id'] ?>')"></i>
                                        </td>
                                    </tr>
                                <?php 
                                } 
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="mb-8" id="sub-content-retencionessalario">
    <!-- <div class="mb-8" id="content-masivos-retencionessalario"> -->
    <div class=" col-12 row mb-4"
        id="scrollspyRetenciones">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyRetenciones">Retenciones de salario</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Rango salarial</th>
                                    <th>Porcentaje de retencion</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosRetencionesSalariales as $index => $retencion) {  ?>
                                    <tr id="rowret-<?= $retencion['id'] ?>">
                                        <input type="hidden" id="data_retencion_<?= $retencion['id'] ?>" value='<?= htmlspecialchars(json_encode($retencion), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $retencion['id'] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($retencion['rangoSalarialDesde']) . " - " . "$ " . number_format($retencion['rangoSalarialHasta']) ?></td>
                                        <td class="align-middle"><?= $retencion['porcentajeRetencion'] . "%" ?></td>
                                        <td class="align-middle">
                                            <i class="fas fa-pencil" title="Editar" onclick="editarRetencion('<?= htmlspecialchars($retencion['id']) ?>', '<?= $retencion['id'] ?>')"></i>
                                            <i class="fas fa-trash" title="Editar" onclick="eliminarRetencion('<?= $retencion['id'] ?>')"></i>
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



<div class="mb-8" id="sub-content-estados" style="display: block;">
    <div class=" col-12 row mb-4" id="scrollspyFacturacionVentas">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyFacturacionVentas">Estados</h4>
            <!-- <small class=""></small> -->
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <!-- tableDataTableSearch  id="<?= 'tabla_' . rand(10, 50000) ?>"-->
                <table class="table tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>" id="tablaEstadosCandidato" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Estado</th>
                            <th>Color</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        foreach ($datosEstadosCandidato as $key => $datos) { ?>                            
                        <tr id="rowestado-<?$datos['id']?>">
                            <input type="hidden" id="data_estado_<?= $datos['id'] ?>" value='<?= htmlspecialchars(json_encode($datos), ENT_QUOTES) ?>'>
                            <td><?= $datos['id'] ?></td>
                            <td><?= $datos["nombre"] ?></td>
                            <td>
                                <div style="border-radius:100%; width:25px; height:25px; background-color:<?= $datos["color"]  ?>"></div>
                            </td>
                            <td>
                                <i class="fas fa-pen" title="Editar" onclick="editarEstadoReclutamiento(<?= $datos['id'] ?>)"></i>
                                <i class="fas fa-trash" title="Eliminar" onclick="borrarEstadoReclutamiento(<?= $datos['id'] ?>)"></i>
                            </td>
                        </tr>
                        <?php } ?>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="mb-8" id="sub-content-plantillasc" style="display: block;">
    <div class=" col-12 row mb-4" id="scrollspyFacturacionVentas">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyFacturacionVentas">Plantillas de Contrato</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <!-- tableDataTableSearch  id="<?= 'tabla_' . rand(10, 50000) ?>"-->
                <table class="table tableDataTableSearch" id="<?= 'tabla_' . rand(10, 50000) ?>" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Contenido</th>
                            <th>Adicionales</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        foreach ($datosPlantillasContrato as $key => $contrato) { 
                            $lista = "<ul>";
                            $lista .= $contrato["aplicaFirma"] == "true" ? "<li>Firma</li>" : "";
                            $lista .= $contrato["aplicaDocumento"] == "true" ? "<li>Documento</li>" : "";
                            $lista .= $contrato["aplicaFoto"] == "true" ? "<li>Foto</li>" : "";
                            $lista .= "</ul>";
                            
                            
                            ?>                            
                        <tr id="rowPlantillaContrato-<?$contrato['id']?>">
                            <input type="hidden" id="data_PlantillaContrato_<?= $contrato['id'] ?>" value='<?= htmlspecialchars(json_encode($contrato), ENT_QUOTES) ?>'>
                            <td><?= $contrato['id'] ?></td>
                            <td><?= $contrato["nombre"] ?></td>
                            <td><?= substr($contrato["contenido"], 0, 50) . "..." ?></td>
                            <td><?= $lista ?></td>
                            <td>
                                <i class="fas fa-pen" title="Editar" onclick="editarPlantillaContrato(<?= $contrato['id'] ?>)"></i>
                                <i class="fas fa-trash" title="Eliminar" onclick="eliminarPlantillaContrato(<?= $contrato['id'] ?>)"></i>
                            </td>
                        </tr>
                        <?php } ?>
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>