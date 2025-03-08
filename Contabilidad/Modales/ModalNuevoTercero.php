<?php 
$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevoTercero" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-terceros"><i class="fas fa-file-signature"></i> Nuevo Tercero</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <div id="datos-nuevo-tercero-1">
                            <div class="col-md-12 row">
                                <h4 class="mb-2"> Datos generales</h4>

                                <div class="col-md-12 mb-1">
                                    <label for="">Tipo</label>
                                    <select class="selectModalTerceros" style="width: 100%;" id="tipoTercero">
                                        <option value="">Seleccione</option>
                                        <option value="1">Contratista</option>
                                        <option value="2">Comercial</option>
                                    </select>
                                </div>
                                <?php 
                                    $arrayTD = ["DNI", "Carnet de Identidad", "Pasaporte"];
                                    $arrayCiudades = ["La Paz", "Santa Cruz", "Cochabamba"];
                                    
                                    $camposContrato = [
                                        "Tipo de documento" => ["select", "tipoDocumento", "", "required", $arrayTD, "", ""],
                                        "Numero de Documento " => ["input", "documento", "number", "required", "", "", ""],
                                        "Nombres del contacto " => ["input", "nombresContacto", "text", "required", "", "", ""],
                                        "Apellidos del contacto " => ["input", "apellidosContacto", "text", "required", "", "", ""],
                                        "Ciudad" => ["select", "ciudad", "text", "required", $arrayCiudades, "", ""],
                                        "" => ["", "", "", "", "", "", ""],
                                    ];
                                ?>
        
                                <?php foreach ($camposContrato as $label => $datos) { ?>
                                    <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                        <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select onchange="<?= $datos[5] ?>" class="form-select selectModalTerceros" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                                <option selected>Seleccione...</option>
                                                <?php foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                } ?>
                                            </select>
                                        <?php } elseif ($datos[0] == "input") { ?>
                                            <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>
                                
                                <?php 
                                
                                    $camposContrato = [
                                        "Indicativo" => ["input", "indicativo", "number", "required", "57", "", ""],
                                        "Numero de telefono " => ["input", "telefono", "number", "required", "", "", ""],
                                        "Extension " => ["input", "extension", "number", "", "", "", ""],
                                    ];
                                    foreach ($camposContrato as $label => $datos) { ?>
                                    <div class="col-md-4 mb-1 <?= $datos[6] ?>">
                                        <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select onchange="<?= $datos[5] ?>" class="form-select selectModalTerceros" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                                <option selected>Seleccione...</option>
                                                <?php foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                } ?>
                                            </select>
                                        <?php } elseif ($datos[0] == "input") { ?>
                                            <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>
                                
                            </div>
                        </div>
                        <div id="datos-nuevo-tercero-2">
                            <div class="col-md-12 row">
                                <h4 class="mb-2"> Informacion para facturacion y envío</h4>
                                <?php 
                                    $arryTiposRegimen = ["IVA", "ICA"];
                                    $arryTiposOtros = ["0-13 Gran Contribuyente", "0-15 Autoretenedor", "0-23 Agente de retencion de IVA", "0-47 No aplica - otros"];
                                    
                                    $camposContrato = [
                                        "Nombres del contacto" => ["input", "nombresContactoFE", "text", "required", "", "", ""],
                                        "Apellidos del contacto " => ["input", "apellidosContactoFE", "text", "required", "", "", ""],
                                        "Email (Opcional)" => ["input", "emailFE", "email", "required", "", "", ""],
                                        "Tipo de regimen " => ["select", "tipoRegimen", "", "required", $arryTiposRegimen, "", ""],
                                        // "" => ["", "", "", "", "", "", ""],
                                        "Indicativo" => ["input", "indicativoFE", "number", "required", "", "", ""],
                                        "Numero" => ["input", "numeroFE", "number", "required", "", "", ""],
                                    ];
                                ?>
         
                                <?php foreach ($camposContrato as $label => $datos) { ?>
                                    <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                        <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select onchange="<?= $datos[5] ?>" class="form-select selectModalTerceros" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                                <option selected>Seleccione...</option>
                                                <?php foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                } ?>
                                            </select>
                                        <?php } elseif ($datos[0] == "input") { ?>
                                            <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } 
                                
                                foreach ($arryTiposOtros as $key => $tipo) { ?>
                                <div class="col-md-12 mb-1">
                                    <input type="checkbox" class="form-check-input mx-2 checkboxesTipos" name="<?= $tipo ?>" value="<?= $tipo ?>">
                                    <label for=""> <?= $tipo ?></label>
                                </div>
                                <?php } ?>
                            </div>
                        </div>
 

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <div class="col-md-12 row">
                    <div class="col-md-6" id="paginacionModal"></div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                        <button class="btn btn-primary my-0" id="button-save-Terceros" onclick="guardarTerceros()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Tercero</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarTerceros() {
        let keys = [];
        var modalID = '#modalNuevoTercero';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoTercero #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                })
                return false;
            }

            data[keys[key]] = elemento.val();
        }

        let checkboxesTipos = [];
        $(".checkboxesTipos").each(function() {
            if ($(this).is(":checked")) {
                checkboxesTipos.push($(this).val());
            }
        });


        data["tipos"] = JSON.stringify(checkboxesTipos);
        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Contabilidad/Ajax/AjaxTerceros.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {icon,title,text} = dataResponse;
                Swal.fire({icon,title,text,});

                if (dataResponse.error) {
                    console.log(dataResponse.error);
                    return;
                }

                if (icon == "success") {
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                }
            }
        });

        $("#modalNuevoTercero").modal('hide');
        resetmodalNuevoTercero();
        return data;
    }

    function resetmodalNuevoTercero() {
        $("#header-modal-terceros").html(`<i class="fas fa-briefcase"></i> Nuevo Tercero`);
        $("#button-save-Terceros").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Tercero`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevoTercero';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevoTercero #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarTerceros(id) {
        $("#header-modal-Terceros").html(`<i class="fas fa-wrench"></i> Editar Tercero`);
        $("#button-save-Terceros").html(`<i class="fas fa-wrench"></i> Actualizar Tercero`);
        $("#modalNuevoTercero #id").val(id);

        const data = document.getElementById("data_Terceros" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoTercero #" + key);
            if (elemento.is(':checkbox')) {
                elemento.prop('checked', dataPrincipal[key] == 'true' ? true : false);
                continue;
            }

            if (key == 'contenido') {
                insertarContenido(dataPrincipal[key]);
                continue;
            }

            elemento.val(dataPrincipal[key]).change();
        }

        console.log("data.tipos");
        console.log(dataPrincipal.tipos);
        
        let checkboxes = dataPrincipal.tipos;
        let checkboxesTipos = [];
        $(".checkboxesTipos").each(function() {
            if (checkboxes.includes($(this).attr('value'))) {
                $(this).prop('checked', true);
            }
        });



        $("#modalNuevoTercero").modal('show');
    }

    function borrarTerceros(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Tercero?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $BASE ?>Contabilidad/Ajax/AjaxTerceros.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse;
                        Swal.fire({icon,title,text,});
                        if (icon == "success") {
                            setTimeout(() => {
                                location.reload();
                            }, 500);
                        }
                        if (dataResponse.error) {
                            console.log(dataResponse.error);
                            return;
                        }
                    }
                });
                $("#filaTerceros" + id).remove();
            }
        });
    }

    $('#modalNuevoTercero').on('hidden.bs.modal', function() {
        resetmodalNuevoTercero();
    });

    $('#modalNuevoTercero').on('shown.bs.modal', function() {
    });

    $(document).ready(function() {
        selectToModal("modalNuevoTercero", "selectModalTerceros");
        paginacionModal("modalNuevoTercero", "datos-nuevo-tercero-", 2)
    });

</script>

<style>
    .displayNone {
        display: none;
    }
</style>