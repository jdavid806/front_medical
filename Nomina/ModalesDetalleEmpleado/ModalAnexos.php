<?php $isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevoAnexo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-vacaciones"><i class="fas fa-file-pdf"></i> Nuevo anexo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <form class="pagina col-md-12 row" id="form-vacaciones" action="<?=$BASE?>Nomina/GuardarAnexoEmpleado.php" enctype="multipart/form-data" method="post">
                        <input type="hidden" id="idTrabajador" name="idTrabajador" value="<?= $idTrabajador ?>">
                        <input type="hidden" id="idUsuario" name="idUsuario" value="<?= $_SESSION['ID'] ?>">
    
                        <!-- Información de Vacaciones -->
                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Anexo <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="file" name="archivo" id="archivo" />
                        </div>
                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Descripcion </label>
                            <input class="form-control" type="text" name="descripcionArchivo" id="descripcionArchivo" />
                        </div>
                    </form>
                    <!-- <div class="pagina col-md-12 row"> -->
                        <!-- Datos del Empleado -->


                    <!-- </div> -->
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0"  id="button-save-vacaciones" onclick="$('#form-vacaciones').submit()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Anexo</button>
            </div>
        </div>
    </div>
</div>

<script>
    function borrarArchivo(id) {
        Swal.fire({
            title: '¿Estas seguro de borrar este archivo?',
            text: "No podras revertir esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    type: "POST",
                    url: "<?=$BASE?>Nomina/Ajax/AjaxAnexos.php",
                    data: {
                        action:"eliminar",
                        id
                    },
                    success: function(json) {
                        const response = JSON.parse(json);
                        const {icon, title, text} = response;
                        Swal.fire({icon, text, title});
                        if (icon == "success") {
                            setTimeout(() => { location.reload() }, 100);
                        }else{
                            if (response.error ) {
                                console.log(response.error);
                            }
                            return false;
                        }
                    }
                });


                $("#filaAnexo" + id).remove();
            }
        })
    }
</script>