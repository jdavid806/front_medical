<?php

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevaDeduccion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nueva Deduccion</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                    

                        <?php $campos = [
                            "Deduccion" => ["input", "deduccion", "text", "required", "", "", ""],
                            "Valor" => ["input", "valor", "text", "required", "", "", ""],
                            "Periodicidad" => ["input", "periodicidad", "text", "required", "", "", ""],
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalDeduccion" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
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

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="deduccionActiva" value="Si">
                        <input type="hidden" id="idTrabajador" value="<?=$idTrabajador?>">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-Deduccion" onclick="guardarDeduccion()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Deduccion</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarDeduccion() {
        let keys = [];
        var modalID = '#modalNuevaDeduccion';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevaDeduccion #" + keys[key]);
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

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxDeduccion.php",
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

        $("#modalNuevaDeduccion").modal('hide');
        resetmodalNuevaDeduccion();
        return data;
    }

    function resetmodalNuevaDeduccion() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Deduccion`);
        $("#button-save-Deduccion").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Deduccion`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevaDeduccion';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevaDeduccion #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarDeduccion(id) {
        $("#header-modal-Deduccion").html(`<i class="fas fa-wrench"></i> Editar Deduccion`);
        $("#button-save-Deduccion").html(`<i class="fas fa-wrench"></i> Actualizar Deduccion`);
        $("#modalNuevaDeduccion #id").val(id);

        const data = document.getElementById("data_Deduccion" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevaDeduccion #" + key);
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
        $("#modalNuevaDeduccion").modal('show');
    }

    function borrarDeduccion(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Deduccion?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxDeduccion.php",
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
                $("#filaDeduccion" + id).remove();
            }
        });
    }

    $('#modalNuevaDeduccion').on('hidden.bs.modal', function() {
        resetmodalNuevaDeduccion();
    });

    $('#modalNuevaDeduccion').on('shown.bs.modal', function() {
    });

    $(document).ready(function() {
        selectToModal("modalNuevaDeduccion", "selectModalDeduccion");
    });

</script>

<style>
    .displayNone {
        display: none;
    }
</style>