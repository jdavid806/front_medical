<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<div class="modal fade" id="modalRetencionSalarial" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="retencionModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-retencion"><i class="fas fa-percent"></i> Nueva Retención Salarial</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <div class="col-md-12">
                            <label class="mb-0">Rango Salarial <?= $isRequiredSign ?></label>
                        </div>

                        <div class="col-md-6 mb-1">
                            <input required class="form-control" type="text" id="rangoSalarialDesde" placeholder="Desde" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <input required class="form-control" type="text" id="rangoSalarialHasta" placeholder="Hasta" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Nombre de la Retención <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="text" id="nombreRetencion" placeholder="Ingrese el nombre de la retención" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Porcentaje de Retención (1 a 100) <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="number" id="porcentajeRetencion" min="1" max="100" placeholder="Ingrese el porcentaje de retención" />
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarRetencion()" id="button-save-retencion"><i class="fas fa-bookmark"></i> &nbsp; Crear Retención</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarRetencion() {
        let keys = ["rangoSalarialDesde","rangoSalarialHasta", "nombreRetencion", "porcentajeRetencion", "id"];
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalRetencionSalarial #"+ keys[key]);
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
        console.log(data);

        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Ajax/AjaxRetencionesSalario.php",
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

        // console.log(data);
        $("#modalRetencionSalarial").modal('hide');
        resetModalRetencion();
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Correcto',
        //     text: 'Retención guardada correctamente',
        // });
        return data;
    }

    function resetModalRetencion() {
        $("#header-modal-retencion").html(`<i class="fas fa-percent"></i> Nueva Retención Salarial`);
        $("#button-save-retencion").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Retención`);
        $("#modalRetencionSalarial #id").val("0");
        let keys = ["rangoSalarial", "nombreRetencion", "porcentajeRetencion"];
        for (const key in keys) {
            let elemento = $("#modalRetencionSalarial #"+ keys[key]);
            elemento.val("").change();
        }
    }

    function editarRetencion(id, index) {
        $("#header-modal-retencion").html(`<i class="fas fa-wrench"></i> Editar Retención Salarial`);
        $("#button-save-retencion").html(`<i class="fas fa-wrench"></i> Actualizar Retención`);
        $("#modalRetencionSalarial #id").val(id);

        const data = document.getElementById("data_retencion_" + index).value;
        const dataPrincipal = JSON.parse(data);
        console.log(dataPrincipal);
        
        for (const key in dataPrincipal) {
            let elemento = $("#modalRetencionSalarial #"+ key);
            elemento.val(dataPrincipal[key]).change();
        }

        $("#modalRetencionSalarial").modal('show');
    }

    $('#modalRetencionSalarial').on('hidden.bs.modal', function() {
        resetModalRetencion();
    });

    $(document).ready(function() {
        // Inicialización adicional si es necesario
    });
</script>
