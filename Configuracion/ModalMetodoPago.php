<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<div class="modal fade" id="modalNuevoMetodoPago" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addMPModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-metodopago"><i class="fas fa-cash-register"></i> Nuevo Metodo de Pago</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <!-- <div class="card">
                            <h5 class="card-header">Metodos de pago</h5>
                            <div class="card-body col-md-12 row"> -->
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Nombre <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="nombre" placeholder="" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Cuenta Contable <?= $isRequiredSign ?></label>
                            <!-- required -->
                            <select  class="select2MetodoPago" style="width:100%" id="cuentaContable"></select>
                        </div>
                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Descripción <?= $isRequiredSign ?></label>
                            <textarea style="height: 100px" id="descripcion" class="form-control"></textarea>
                        </div>
                        <!-- </div>
                        </div> -->
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION['ID'] ?>">
            

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarMetodoPago()" id="button-save-metodopago"><i class="fas fa-bookmark"></i> &nbsp; Crear Metodo de Pago</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarMetodoPago() {
        let keys = ["nombre", "cuentaContable", "descripcion", "id","idUsuario"];
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoMetodoPago #"+ keys[key]);
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
            url: "<?= $BASE ?>Configuracion/Ajax/AjaxMetodosPago.php",
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

        // console.log(data);
        $("#modalNuevoMetodoPago").modal('hide');
        resetmodalNuevoMetodoPago();
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Correcto',
        //     text: 'Metodo de pago guardado correctamente',
        // });
        return data;
    }

    function resetmodalNuevoMetodoPago() {
        $("#modalNuevoMetodoPago #header-modal-metodopago").html(`<i class="fas fa-tags"></i> Nuevo Metedo de pago`);
        $("#modalNuevoMetodoPago #button-save-metodopago").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Metedo de pago`);
        $("#modalNuevoMetodoPago #id").val("0");
        let keys = ["nombre", "cuentaContable", "descripcion"];
        for (const key in keys) {
            let elemento = $("#modalNuevoMetodoPago #"+ keys[key]);
            elemento.val("").change();
        }
    }

    function eliminarMetodoPago(id) {
        Swal.fire({
            title: '¿Deseas eliminar este metodo de pago?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $BASE ?>Configuracion/Ajax/AjaxMetodosPago.php",
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
                $("#rowmp-" + index).remove();
            }
        });
    }

    function editarMetodoPago(id, index) {
        $("#modalNuevoMetodoPago #header-modal-metodopago").html(`<i class="fas fa-wrench"></i> Editar Metodo de Pago`);
        $("#modalNuevoMetodoPago #button-save-metodopago").html(`<i class="fas fa-wrench"></i> Actualizar Metodo de Pago`);
        $("#modalNuevoMetodoPago #id").val(id);

        const data = document.getElementById("data_metodopago_" + index).value;
        const dataPrincipal = JSON.parse(data);
        // console.log(dataPrincipal);
        
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoMetodoPago #"+ key);
            elemento.val(dataPrincipal[key]).change();
        }

        $("#modalNuevoMetodoPago").modal('show');
    }

    $('#modalNuevoMetodoPago').on('hidden.bs.modal', function() {
        resetmodalNuevoMetodoPago();
    });

    // Captura el evento de cuando el modal se muestra completamente
    $('#modalNuevoMetodoPago').on('shown.bs.modal', function() {
        $('#modalNuevoMetodoPago #cuentaContable').html(optionsCuentasContables());
    });


    $(document).ready(function() {
        selectToModal("modalNuevoMetodoPago", "select2MetodoPago");
    });
</script>