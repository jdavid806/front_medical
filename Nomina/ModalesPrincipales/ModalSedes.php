<?php $isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevaSede" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addSedeModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-sede"><i class="fas fa-map-marker-alt"></i> Nueva Sede</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <div class="col-md-6 mb-1">
                            <label class="form-label">Nombre de la Sede <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="nombreSede" placeholder="Ingrese el nombre de la sede" />
                        </div>

                        <div class="col-md-6 mb-1">
                            <label class="form-label">Código de la Sede <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="codigoSede" placeholder="Ingrese el código de la sede" />
                        </div>

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Dirección <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="direccionSede" placeholder="Ingrese la dirección de la sede" />
                        </div>

                        <div class="col-md-6 mb-1">
                            <label class="form-label">Ciudad <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="ciudadSede" placeholder="Ingrese la ciudad de la sede" />
                        </div>

                        <div class="col-md-6 mb-1">
                            <label class="form-label">Teléfono <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="tel" id="telefonoSede" placeholder="Ingrese el teléfono de la sede" />
                        </div>

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" style="height: 100px" id="descripcionSede" placeholder="Ingrese una descripción (opcional)"></textarea>
                        </div>

                        <input type="hidden" id="id" value="0">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-sede" onclick="guardarSede()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Sede</button>
            </div>
        </div>
    </div>
</div>

<script>
    function resetModalSede() {
        let keys = ['nombreSede', 'codigoSede', 'direccionSede', 'ciudadSede', 'telefonoSede', 'descripcionSede'];
        for (const key in keys) {
            let elemento = $("#modalNuevaSede #" + keys[key]);
            elemento.val('');
        }

        $("#modalNuevaSede #header-modal-sede").html(`<i class="fas fa-map-marker-alt"></i> Nueva Sede`);
        $("#modalNuevaSede #id").val("0");
        $("#modalNuevaSede #button-save-sede").html(`<i class="fas fa-bookmark"></i> &nbsp; Guardar Sede`);
    }

    function guardarSede() {
        let keys = ['nombreSede', 'codigoSede', 'direccionSede', 'ciudadSede', 'telefonoSede', 'descripcionSede', 'id'];
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevaSede #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") !== undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos obligatorios deben estar completos!'
                })
                return false;
            }
            data[keys[key]] = elemento.val();
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Ajax/AjaxSucursal.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {
                    icon,
                    title,
                    text
                } = dataResponse
                Swal.fire({
                    icon,
                    title,
                    text,
                });

                if (dataResponse.error) {
                    console.log(dataResponse.error);
                    return;
                }

            }
        })
        resetModalSede();
        $("#modalNuevaSede").modal("hide");
    }

    function borrarSede(id) {
        Swal.fire({
            title: '¿Estás seguro de borrar esta sede?',
            text: "No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $Base ?>Nomina/Ajax/AjaxSucursal.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse
                        Swal.fire({
                            icon,
                            title,
                            text,
                        });

                        if (dataResponse.error) {
                            console.log(dataResponse.error);
                            return;
                        }

                    }
                })

                $("#rowSede-" + id).remove();
            }
        })
    }

    function editarSede(id, index) {
        let dataJson = $("#data_sede_" + index).val();
        let data = JSON.parse(dataJson);
        $("#modalNuevaSede #id").val(id);
        $("#modalNuevaSede #header-modal-sede").html(`<i class="fas fa-wrench"></i> Actualizar Sede`);
        $("#modalNuevaSede #button-save-sede").html(`<i class="fas fa-wrench"></i> &nbsp; Actualizar Sede`);

        for (const key in data) {
            $("#modalNuevaSede #" + key).val(data[key]).change();
        }

        $("#modalNuevaSede").modal("show");
    }

    $(document).ready(function() {
        selectToModal("modalNuevaSede", "selectModalSede");

        $("#modalNuevaSede").on("hidden.bs.modal", function() {
            resetModalSede();
        });

        $("#modalNuevaSede").on("shown.bs.modal", function() {
            // resetModalSede();
        });

    });
</script>