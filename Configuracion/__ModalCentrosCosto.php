<div class="modal fade" id="modalNuevoCentroCosto" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCostCenterModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-centro-costo"><i class="fas fa-coins"></i> Nuevo Centro de Costo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div id="" class="pagina col-md-12 row">
                        <div class="card">
                            <h5 class="card-header">Datos del Centro de Costo</h5>
                            <div class="card-body col-md-12 row">
                                <?php
                                $array_Campos = [
                                    "Nombre del Centro de Costo" => ["text", "nombre", "", true],
                                    "Código" => ["text", "codigo", "", true],
                                ];
        
                                foreach ($array_Campos as $key => $value) { ?>
                                    <div class="col-md-6 mb-1">
                                        <label class="mb-0"><?= $key ?></label>
                                        <input <?= (($value[3]) ? "required" : "" )?> class="form-control" value="<?= $value[2] ?>" type="<?= $value[0] ?>" id="<?= $value[1] ?>" placeholder="" />
                                    </div>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="idCentroCostoActualizar" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarCentroCosto()" id="button-save-centro-costo"> <i class="fas fa-bookmark"></i> &nbsp; Crear Centro de Costo</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarCentroCosto() {
        let campos = ["nombreCentroCosto", "codigoCentroCosto", "idCentroCostoActualizar"];
        let data = {};
        let next = true;

        campos.forEach(key => {
            if (!next) return;

            let elemento = $(`#modalNuevoCentroCosto #${key}`);
            
            if (elemento.attr("required") && elemento.val() === "") {
                next = false;
                return;
            }

            data[key] = elemento.val();
        });

        if (!next) {
            Swal.fire({title: "Error", text: "Por favor, llene todos los campos requeridos del centro de costo", icon: "error"});
            return;
        }

        $("#modalNuevoCentroCosto").modal('hide');
        resetModalNuevoCentroCosto();
        
        // Aquí puedes manejar la lógica para guardar el centro de costo en tu base de datos

        console.log(data); // Reemplaza esto con tu lógica para guardar el centro de costo
        return data;
    }

    function resetModalNuevoCentroCosto() {
        $("#header-modal-centro-costo").html(`<i class="fas fa-coins"></i> Nuevo Centro de Costo`);
        $("#button-save-centro-costo").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Centro de Costo`);
        $("#idCentroCostoActualizar").val("0");
        
        let campos = ["nombreCentroCosto", "codigoCentroCosto"];
        campos.forEach(key => {
            let elemento = $(`#modalNuevoCentroCosto #${key}`);
            elemento.val("");
        });
    }

    function eliminarCentroCosto(index) {
        Swal.fire({
            title: '¿Deseas eliminar este centro de costo?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#rowcc-" + index).remove();
            }
        });
    }

    function editarCentroCosto(codigo, index) {
        $("#header-modal-centro-costo").html(`<i class="fas fa-wrench"></i> Editar Centro de Costo`);
        $("#button-save-centro-costo").html(`<i class="fas fa-wrench"></i> Actualizar Centro de Costo`);
        $("#idCentroCostoActualizar").val(codigo);
        
        const data = document.getElementById("data_centro_costo_" + index).value;
        const dataPrincipal = JSON.parse(data);
        console.log(dataPrincipal);

        for (const key in dataPrincipal) {
            let value = dataPrincipal[key];
            $(`#modalNuevoCentroCosto #${key}`).val(value);
        }

        $("#modalNuevoCentroCosto").modal('show');
    }

    $('#modalNuevoCentroCosto').on('hidden.bs.modal', function () {
        resetModalNuevoCentroCosto()
    });

</script>
