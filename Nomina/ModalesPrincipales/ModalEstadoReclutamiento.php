<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<div class="modal fade" id="modalNuevoEstado" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addEstadoModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-estado"><i class="fas fa-flag"></i> Nuevo Estado de Reclutamiento</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Nombre del Estado <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="nombre" placeholder="Ingrese el nombre del estado" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Color <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="color" id="color" style="height:41px" />
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarEstado()" id="button-save-estado"><i class="fas fa-bookmark"></i> &nbsp; Crear Estado</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarEstado() {
        let keys = ["nombre", "color", "id"];
        let data = {};
        for (const key of keys) {
            let elemento = $("#modalNuevoEstado #" + key);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos obligatorios',
                });
                return false;
            }
            data[key] = elemento.val();
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";
        console.log(data);

        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Ajax/AjaxEstadoReclutamiento.php",
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

                if (icon == "success") {
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                }

            }
        });

        $("#modalNuevoEstado").modal('hide');
        resetModalNuevoEstado();
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Correcto',
        //     text: 'Estado guardado correctamente',
        // });
        return data;
    }

    function resetModalNuevoEstado() {
        $("#header-modal-estado").html(`<i class="fas fa-flag"></i> Nuevo Estado de Reclutamiento`);
        $("#button-save-estado").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Estado`);
        $("#modalNuevoEstado #id").val("0");
        let keys = ["nombre", "color"];
        for (const key of keys) {
            let elemento = $("#modalNuevoEstado #" + key);
            elemento.val("").change();
        }
    }

    function editarEstadoReclutamiento(id) {
        $("#header-modal-estado").html(`<i class="fas fa-wrench"></i> Editar Estado de Reclutamiento`);
        $("#button-save-estado").html(`<i class="fas fa-wrench"></i> Actualizar Estado`);
        $("#modalNuevoEstado #id").val(id);

        const data = document.getElementById("data_estado_" + id).value;
        const dataPrincipal = JSON.parse(data);
        console.log(dataPrincipal);

        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoEstado #" + key);
            elemento.val(dataPrincipal[key]).change();
        }

        $("#modalNuevoEstado").modal('show');
    }

    function borrarEstadoReclutamiento(id) {
        Swal.fire({
            title: '¿Estás seguro de eliminar este estado?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $Base ?>Nomina/Ajax/AjaxEstadoReclutamiento.php",
                    data:{
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse
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


                $("#rowestado-" + id).remove();
            }
        });
    }

    $('#modalNuevoEstado').on('hidden.bs.modal', function() {
        resetModalNuevoEstado();
    });

    $(document).ready(function() {
        // Inicialización adicional si es necesario
    });
</script>