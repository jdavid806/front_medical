<div class="modal fade" id="modalNuevoVendedor" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVendedorModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-vendedor"><i class="fas fa-user"></i> Nuevo Vendedor</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <!-- <div class="card">
                            <h5 class="card-header">Datos del Vendedor</h5>
                            <div class="card-body col-md-12 row"> -->
                                <div class="col-md-12 mb-1">
                                    <label class="mb-0">Nombre</label>
                                    <input required class="form-control" type="text" id="nombreVendedor" placeholder="" />
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
                <button class="btn btn-primary my-0" onclick="guardarVendedor()" id="button-save-vendedor"><i class="fas fa-bookmark"></i> &nbsp; Crear Vendedor</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarVendedor() {
    let nombre = $("#nombreVendedor").val();
    let id = $("#modalNuevoVendedor #id").val();
    let idUsuario = $("#modalNuevoVendedor #idUsuario").val();

    if (!nombre) {
        Swal.fire({title: "Error", text: "Por favor, ingrese el nombre del vendedor", icon: "error"});
        return;
    }

    let data = {
        id: id,
        nombre: nombre,
        idUsuario: idUsuario
    };

    data["action"] = data.id == 0 ? "crear" : "actualizar";

    $.ajax({
        type: "POST",
        url: "<?= $BASE ?>Configuracion/Ajax/AjaxVendedores.php",
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

    // Aquí puedes manejar la lógica para guardar el vendedor en tu base de datos

    $("#modalNuevoVendedor").modal('hide');
    resetModalNuevoVendedor();

    console.log(data); // Reemplaza esto con tu lógica para guardar el vendedor
}

function resetModalNuevoVendedor() {
    $("#header-modal-vendedor").html(`<i class="fas fa-user"></i> Nuevo Vendedor`);
    $("#button-save-vendedor").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Vendedor`);
    $("#modalNuevoVendedor #id").val("0");
    $("#nombreVendedor").val("");
}

function eliminarVendedor(id) {
    Swal.fire({
        title: '¿Deseas eliminar este vendedor?',
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
                url: "<?= $BASE ?>Configuracion/Ajax/AjaxVendedores.php",
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

            $("#rowvendedor-" + index).remove();
        }
    });
}

function editarVendedor(id, index) {
    $("#header-modal-vendedor").html(`<i class="fas fa-wrench"></i> Editar Vendedor`);
    $("#button-save-vendedor").html(`<i class="fas fa-wrench"></i> Actualizar Vendedor`);
    $("#modalNuevoVendedor #id").val(id);
    
    const data = document.getElementById("data_vendedor_" + index).value;
    const dataPrincipal = JSON.parse(data);
    
    $("#nombreVendedor").val(dataPrincipal.nombre);
    $("#modalNuevoVendedor").modal('show');
}

$('#modalNuevoVendedor').on('hidden.bs.modal', function () {
    resetModalNuevoVendedor();
});

</script>