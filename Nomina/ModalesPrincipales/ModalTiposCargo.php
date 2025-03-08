<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<div class="modal fade" id="modalNuevoCargo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCargoModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-cargo"><i class="fas fa-briefcase"></i> Nuevo Cargo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Nombre del Cargo <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="nombre" placeholder="Ingrese el nombre del cargo" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Código del Cargo <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="codigo" placeholder="Ingrese el código del cargo" />
                        </div>
                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Principales Funciones <?= $isRequiredSign ?></label>
                            <textarea style="height: 100px" id="funciones" class="form-control" placeholder="Describa las principales funciones"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarCargo()" id="button-save-cargo"><i class="fas fa-bookmark"></i> &nbsp; Crear Cargo</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarCargo() {
        let keys = ["nombre", "codigo", "funciones", "id"];
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoCargo #"+ keys[key]);
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
            url: "<?= $Base ?>Nomina/Ajax/AjaxCargos.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {icon,title,text} = dataResponse
                Swal.fire({icon,title,text,});

                if (dataResponse.error) {
                    console.log(dataResponse.error);
                    return;
                }

                if (icon == "success") {
                    setTimeout(() => { location.reload(); }, 500);
                }

            }
        });

        $("#modalNuevoCargo").modal('hide');
        resetModalNuevoCargo();
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Correcto',
        //     text: 'Cargo guardado correctamente',
        // });
        return data;
    }

    function resetModalNuevoCargo() {
        $("#header-modal-cargo").html(`<i class="fas fa-briefcase"></i> Nuevo Cargo`);
        $("#button-save-cargo").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Cargo`);
        $("#id").val("0");
        let keys = ["nombre", "codigo", "funciones"];
        for (const key in keys) {
            let elemento = $("#modalNuevoCargo #"+ keys[key]);
            elemento.val("").change();
        }
    }

    function editarCargo(id, index) {
        $("#header-modal-cargo").html(`<i class="fas fa-wrench"></i> Editar Cargo`);
        $("#button-save-cargo").html(`<i class="fas fa-wrench"></i> Actualizar Cargo`);
        $("#modalNuevoCargo #id").val(id);

        const data = document.getElementById("data_cargo_" + index).value;
        const dataPrincipal = JSON.parse(data);
        console.log(dataPrincipal);
        
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoCargo #"+ key);
            elemento.val(dataPrincipal[key]).change();
        }

        $("#modalNuevoCargo").modal('show');
    }

    function eliminarCargo(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este cargo?',
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
                    url: "<?= $Base ?>Nomina/Ajax/AjaxCargos.php",
                    data: {
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

                    }
                })

                $("#rowcargo-" + id).remove();
            }
        })
    }



    $('#modalNuevoCargo').on('hidden.bs.modal', function() {
        resetModalNuevoCargo();
    });

    $(document).ready(function() {
        // Inicialización adicional si es necesario
    });
</script>
