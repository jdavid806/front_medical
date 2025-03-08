

<div class="modal fade" id="modalNuevoProcedimiento" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addProcedureModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-procedimiento"> <i class="fas fa-file-medical"></i> Nuevo Procedimiento</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">

                    <div id="" class="pagina col-md-12 row">
                        <!-- <h5 class="mb-0 border-0 p-0 mb-2">&nbsp;&nbsp;&nbsp;Datos del Procedimiento</h5> -->
                        <!-- <div class="card">
                            <div class="card-body col-md-12 row"> -->
                                <?php
                                $array_Campos = [
                                    "Nombre del Procedimiento" => ["text", "nombreProcedimiento", "", true],
                                    "Código" => ["text", "codigo_cups", "", true],
                                    "Precio Base" => ["number", "precio", "", true]
                                ];
        
                                foreach ($array_Campos as $key => $value) { ?>
                                    <div class="col-md-4 mb-1">
                                        <label class="mb-0"><?= $key ?></label>
                                        <input <?= (($value[3]) ? "required" : "" )?> class="form-control" value="<?= $value[2] ?>" type="<?= $value[0] ?>" id="<?= $value[1] ?>" placeholder="" />
                                    </div>
                                <?php } ?>
                            <!-- </div>
                        </div> -->
                    </div>

                </div>

                
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="usuarioId" value="<?= $_SESSION['ID'] ?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarProcedimiento()" id="button-save-procedimiento"> <i class="fas fa-bookmark"></i> &nbsp; Crear Procedimiento</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarProcedimiento() {
        let selectedValues = $("#ArrayProcedimientos").val();
        let campos = ["nombreProcedimiento", "codigo_cups", "precio", "id","usuarioId"];
        let data = {};
        let next = true;

        campos.forEach(key => {
            if (!next) return;

            let elemento = $(`#modalNuevoProcedimiento #${key}`);
            
            if (elemento.attr("required") && elemento.val() === "") {
                next = false;
                return;
            }

            data[key] = elemento.val();
        });

        if(!next) {
            Swal.fire({title: "Error", text: "Por favor, llene todos los campos requeridos del procedimiento", icon: "error" });
            $("#btn-anterior").click();
            return;
        };

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Configuracion/Ajax/AjaxProcedimiento.php",
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
        
        $("#modalNuevoProcedimiento").modal('hide');
        resetModalNuevoProcedimiento();

        // console.log(data);
        return data;
    }

    function resetModalNuevoProcedimiento() {
        const tbodyProcedimientos = document.getElementById('tbody-procedimientos');
        tbodyProcedimientos.innerHTML = ''; 
        $("#modalNuevoProcedimiento #header-modal-procedimiento").html(`<i class="fas fa-file-medical"></i> Nuevo Procedimiento`);
        $("#modalNuevoProcedimiento #button-save-procedimiento").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Procedimiento`);
        $("#modalNuevoProcedimiento #id").val("0");
        let select = $("#ArrayProcedimientos");
        select.val("0").change();


        let campos = ["nombreProcedimiento", "codigo_cups", "precio"];
        campos.forEach(key => {
            let elemento = $(`#modalNuevoProcedimiento #${key}`);
            elemento.val("");
        });

    }

    function eliminarProcedimiento(id) {
        Swal.fire({
            title: '¿Deseas eliminar este procedimiento?',
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
                    url: "<?= $BASE ?>Configuracion/Ajax/AjaxProcedimiento.php",
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

                $("#filaProc" + index).remove();
            }
        });
    }

    function editarProcedimiento(codigo, index) {
        $("#modalNuevoProcedimiento #header-modal-procedimiento").html(`<i class="fas fa-wrench"></i> Editar Procedimiento`);
        $("#modalNuevoProcedimiento #button-save-procedimiento").html(`<i class="fas fa-wrench"></i> Actualizar Procedimiento`);
        $("#modalNuevoProcedimiento #id").val(codigo);
        
        const data = document.getElementById("data_procedimiento_" + index).value;
        const dataPrincipal = JSON.parse(data);
        
        // console.log("dataPrincipal");
        // console.log(dataPrincipal);
        
        for (const key in dataPrincipal) {
            let value = dataPrincipal[key];
            $(`#modalNuevoProcedimiento #${key}`).val(value);
        }
        $("#modalNuevoProcedimiento").modal('show');
    }

    $('#modalNuevoProcedimiento').on('hidden.bs.modal', function () {
        resetModalNuevoProcedimiento()
    });

</script>
