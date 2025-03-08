<div class="modal fade" id="modalNuevoImpuestoRetencion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addImpuestoRetencionModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-impuesto-retencion"><i class="fas fa-tags"></i> Nuevo Impuesto de Retención</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <h5 class="mb-0 border-0 p-0 mb-2"> &nbsp;&nbsp;&nbsp; Datos del Impuesto de Retención</h5>
                        <!-- <div class="card">
                            <div class="card-body col-md-12 row"> -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Nombre</label>
                                    <input required class="form-control" type="text" id="nombreImpuestoRetencion" placeholder="" />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Tasa de retencion</label>
                                    <input required class="form-control" type="number" id="tasaRetencion" placeholder="" />
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
                <button class="btn btn-primary my-0" onclick="guardarImpuestoRetencion()" id="button-save-impuesto-retencion"><i class="fas fa-bookmark"></i> &nbsp; Crear Impuesto de Retención</button>
            </div>
        </div>
    </div>
</div>
<script>
    function guardarImpuestoRetencion() {
    let id = $("#modalNuevoImpuestoRetencion #id").val();
    let nombre = $("#modalNuevoImpuestoRetencion #nombreImpuestoRetencion").val();
    let tasaRetencion = $("#modalNuevoImpuestoRetencion #tasaRetencion").val();
    let idUsuario = $("#modalNuevoImpuestoRetencion #idUsuario").val();

    if (tasaRetencion < 0 || tasaRetencion > 100) {
        Swal.fire({title: "Error", text: "Por favor, ingrese la tasa de retencion en un rango entre 0 y 100", icon: "error"});
        return;
        
    }


    if (!nombre || !tasaRetencion) {
        Swal.fire({title: "Error", text: "Por favor, complete todos los campos", icon: "error"});
        return;
    }

    let data = {
        id: id,
        nombre: nombre,
        idUsuario: idUsuario,
        tasaRetencion
    };

    data["action"] = data.id == 0 ? "crear" : "actualizar";

    $.ajax({
        type: "POST",
        url: "<?= $BASE ?>Configuracion/Ajax/AjaxImpuestoRetencion.php",
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

    // Aquí puedes manejar la lógica para guardar el impuesto de retención en tu base de datos

    $("#modalNuevoImpuestoRetencion").modal('hide');
    resetModalNuevoImpuestoRetencion();

    console.log(data); // Reemplaza esto con tu lógica para guardar el impuesto de retención
}

function resetModalNuevoImpuestoRetencion() {
    $("#modalNuevoImpuestoRetencion #header-modal-impuesto-retencion").html(`<i class="fas fa-tags"></i> Nuevo Impuesto de Retención`);
    $("#modalNuevoImpuestoRetencion #button-save-impuesto-retencion").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Impuesto de Retención`);
    $("#modalNuevoImpuestoRetencion #id").val("0");
    $("#nombreImpuestoRetencion").val("");
}

function eliminarImpuestoRetencion(id) {
    Swal.fire({
        title: '¿Deseas eliminar este impuesto de retención?',
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
                url: "<?= $BASE ?>Configuracion/Ajax/AjaxImpuestoRetencion.php",
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
            $("#row-" + index).remove();
        }
    });
}

function editarImpuestoRetencion(id, index) {
    $("#modalNuevoImpuestoRetencion #header-modal-impuesto-retencion").html(`<i class="fas fa-wrench"></i> Editar Impuesto de Retención`);
    $("#modalNuevoImpuestoRetencion #button-save-impuesto-retencion").html(`<i class="fas fa-wrench"></i> Actualizar Impuesto de Retención`);
    $("#modalNuevoImpuestoRetencion #id").val(id);
    
    const data = document.getElementById("data_impuesto_retencion_" + index).value;
    const dataPrincipal = JSON.parse(data);
    
    $("#modalNuevoImpuestoRetencion #nombreImpuestoRetencion").val(dataPrincipal.nombre);
    $("#modalNuevoImpuestoRetencion #tasaRetencion").val(dataPrincipal.tasaRetencion);
    $("#modalNuevoImpuestoRetencion").modal('show');
}

$('#modalNuevoImpuestoRetencion').on('hidden.bs.modal', function () {
    resetModalNuevoImpuestoRetencion();
});

</script>