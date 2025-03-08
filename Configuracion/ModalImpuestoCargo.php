<div class="modal fade" id="modalNuevoImpuesto" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addImpuestoModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-impuesto"><i class="fas fa-tags"></i> Nuevo Impuesto/Cargo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <!-- <div class="card">
                            <h5 class="card-header">Datos del Impuesto/Cargo</h5>
                            <div class="card-body col-md-12 row"> -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Nombre</label>
                                    <input required class="form-control" type="text" id="nombreImpuesto" placeholder="" />
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Tasa de Impuesto (%)</label>
                                    <input required class="form-control" type="number" id="tasaImpuesto" placeholder="" />
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
                <button class="btn btn-primary my-0" onclick="guardarImpuesto()" id="button-save-impuesto"><i class="fas fa-bookmark"></i> &nbsp; Crear Impuesto/Cargo</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarImpuesto() {
    let nombre = $("#modalNuevoImpuesto #nombreImpuesto").val();
    let tasaImpuesto = $("#modalNuevoImpuesto #tasaImpuesto").val();
    let id = $("#modalNuevoImpuesto #id").val();
    let idUsuario = $("#modalNuevoImpuesto #idUsuario").val();

    tasaImpuesto = Number(tasaImpuesto.trim());

    console.log("tasaImpuesto => " + tasaImpuesto);
    
    if (tasaImpuesto < "0" ||tasaImpuesto > "100") {
        Swal.fire({title: "Error", text: "La tasa de impuesto debe estar entre 0 y 100", icon: "error"});
        return;
    }


    if (!nombre || !tasaImpuesto) {
        Swal.fire({title: "Error", text: "Por favor, ingrese todos los campos", icon: "error"});
        return;
    }

    let data = {
        id: id,
        nombre: nombre,
        idUsuario: idUsuario,
        tasaImpuesto
    };

    data["action"] = data.id == 0 ? "crear" : "actualizar";

    $.ajax({
        type: "POST",
        url: "<?= $BASE ?>Configuracion/Ajax/AjaxImpuestoCargo.php",
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

    // Aquí puedes manejar la lógica para guardar el impuesto/cargo en tu base de datos

    $("#modalNuevoImpuesto").modal('hide');
    resetModalNuevoImpuesto();

    console.log(data); // Reemplaza esto con tu lógica para guardar el impuesto/cargo
}

function resetModalNuevoImpuesto() {
    $("#modalNuevoImpuesto #header-modal-impuesto").html(`<i class="fas fa-tags"></i> Nuevo Impuesto/Cargo`);
    $("#modalNuevoImpuesto #button-save-impuesto").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Impuesto/Cargo`);
    $("#modalNuevoImpuesto #id").val("0");
    $("#modalNuevoImpuesto #nombreImpuesto").val("");
}

function eliminarImpuesto(id) {
    Swal.fire({
        title: '¿Deseas eliminar este impuesto/cargo?',
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
                url: "<?= $BASE ?>Configuracion/Ajax/AjaxImpuestoCargo.php",
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

            $("#rowic-" + index).remove();
        }
    });
}

function editarImpuesto(id, index) {
    $("#modalNuevoImpuesto #header-modal-impuesto").html(`<i class="fas fa-wrench"></i> Editar Impuesto/Cargo`);
    $("#modalNuevoImpuesto #button-save-impuesto").html(`<i class="fas fa-wrench"></i> Actualizar Impuesto/Cargo`);
    $("#modalNuevoImpuesto #id").val(id);
    
    const data = document.getElementById("data_impuesto_" + index).value;
    const dataPrincipal = JSON.parse(data);
    
    $("#modalNuevoImpuesto #nombreImpuesto").val(dataPrincipal.nombre);
    $("#modalNuevoImpuesto #tasaImpuesto").val(dataPrincipal.tasaImpuesto);
    $("#modalNuevoImpuesto").modal('show');
}

$('#modalNuevoImpuesto').on('hidden.bs.modal', function () {
    resetModalNuevoImpuesto();
});

</script>