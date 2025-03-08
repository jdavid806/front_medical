<?php 

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalTiposRecargo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo Tipo de Recargo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php $campos = [
                            "Nombre" => ["input", "nombre", "text", "required", "" , "", ""],
                            "Calcular valor segun" => ["select", "calcularSegun", "", "required", ["horaConfiguracion" => "Valor de hora de configuracion de usuario", "horaTrabajador" => "Valor de hora de trabajador"] , "", ""],
                            "Porcentaje " => ["input", "valor", "number", "required", "" , "", ""],
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalTipoRecargo" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option value="" selected>Seleccione...</option>
                                        <?php foreach ($datos[4] as $key => $value) {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?>
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <div class="col-md-12">
                            <label for="">Notas u observaciones</label>
                            <textarea class="form-control" style="height:100px" id="notas"></textarea>
                        </div>


                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-TipoRecargo" onclick="guardarTipoRecargo()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Tipo de Recargo</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarTipoRecargo() {
        let keys = [];
        var modalID = '#modalTiposRecargo';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalTiposRecargo #" + keys[key]);
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
            url: "<?= $BASE ?>Nomina/Ajax/AjaxTipoRecargo.php",
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

        $("#modalTiposRecargo").modal('hide');
        resetmodalTiposRecargo();
        return data;
    }

    function resetmodalTiposRecargo() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Tipo de Recargo`);
        $("#button-save-TipoRecargo").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Tipo de Recargo`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalTiposRecargo';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalTiposRecargo #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarTipoRecargo(id) {
        $("#header-modal-TipoRecargo").html(`<i class="fas fa-wrench"></i> Editar Tipo de Recargo`);
        $("#button-save-TipoRecargo").html(`<i class="fas fa-wrench"></i> Actualizar Tipo de Recargo`);
        $("#modalTiposRecargo #id").val(id);

        const data = document.getElementById("data_TipoRecargo" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalTiposRecargo #" + key);
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
        $("#modalTiposRecargo").modal('show');
    }

    function borrarTipoRecargo(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Tipo de Recargo?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxTipoRecargo.php",
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
                $("#filaTipoRecargo" + id).remove();
            }
        });
    }

    $('#modalTiposRecargo').on('hidden.bs.modal', function() {
        resetmodalTiposRecargo();
    });

    $('#modalTiposRecargo').on('shown.bs.modal', function() {
    });

    $(document).ready(function() {
        selectToModal("modalTiposRecargo", "selectModalTipoRecargo");
    });

</script>

<style>
    .displayNone {
        display: none;
    }
</style>