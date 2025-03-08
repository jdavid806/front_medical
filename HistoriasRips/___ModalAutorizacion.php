<div class="modal fade" id="modalNuevaAutorizacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addAutorizacionModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-autorizacion"><i class="fas fa-file-medical"></i> Nueva Autorización</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <div class="card">
                            <h5 class="card-header">Datos de la Autorización</h5>
                            <div class="card-body col-md-12 row">
                                <!-- Fecha de Atención -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Fecha de Atención</label>
                                    <input required class="form-control" type="date" id="fechaAtencion" placeholder="Fecha de Atención" />
                                </div>
                                <!-- Nombre del Paciente -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Nombre del Paciente</label>
                                    <input required class="form-control" type="text" id="nombrePaciente" placeholder="Nombre del Paciente" />
                                </div>
                                <!-- Procedimiento -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">CUPS</label>
                                    <select required class="form-control select2Auth" style="width:100%" onchange="$('#procedimiento').val($(this).find(':selected').data('nombre'))" id="cups">
                                        <option data-nombre="" value="" disabled selected>Seleccione un código CUPS</option>
                                        <option data-nombre='Consulta médica general' value="001">001 - Consulta médica general</option>
                                        <option data-nombre='Cirugía menor ambulatoria' value="002">002 - Cirugía menor ambulatoria</option>
                                        <option data-nombre='Radiografía de tórax' value="003">003 - Radiografía de tórax</option>
                                        <option data-nombre='Examen de laboratorio básico' value="004">004 - Examen de laboratorio básico</option>
                                        <option data-nombre='Terapia física' value="005">005 - Terapia física</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Procedimiento</label>
                                    <input required class="form-control" type="text" id="procedimiento" placeholder="Procedimiento" />
                                </div>
                                <!-- CUPS -->
                                <!-- No de Historia Clínica -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">No. de Historia Clínica</label>
                                    <input required class="form-control" type="text" id="noHistoriaClinica" placeholder="Número de Historia Clínica" />
                                </div>
                                <!-- Número de Autorización -->
                                <div class="col-md-6 mb-1">
                                    <label class="mb-0">Número de Autorización</label>
                                    <input required class="form-control" type="text" id="numAutorizacion" placeholder="Número de Autorización" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="idAutorizacionActualizar" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarAutorizacion()" id="button-save-autorizacion"><i class="fas fa-bookmark"></i> &nbsp; Crear Autorización</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarAutorizacion() {
    let fechaAtencion = $("#fechaAtencion").val();
    let nombrePaciente = $("#nombrePaciente").val();
    let procedimiento = $("#procedimiento").val();
    let cups = $("#cups").val();
    let noHistoriaClinica = $("#noHistoriaClinica").val();
    let numAutorizacion = $("#numAutorizacion").val();
    let id = $("#idAutorizacionActualizar").val();

    // Validación básica
    if (!fechaAtencion || !nombrePaciente || !procedimiento || !cups || !noHistoriaClinica || !numAutorizacion) {
        Swal.fire({title: "Error", text: "Por favor, complete todos los campos", icon: "error"});
        return;
    }

    let data = {
        id: id,
        fechaAtencion: fechaAtencion,
        nombrePaciente: nombrePaciente,
        procedimiento: procedimiento,
        cups: cups,
        noHistoriaClinica: noHistoriaClinica,
        numAutorizacion: numAutorizacion
    };

    // Aquí puedes manejar la lógica para guardar la autorización en tu base de datos

    $("#modalNuevaAutorizacion").modal('hide');
    resetModalNuevaAutorizacion();

    Swal.fire({title: "Correcto", text: "Datos guardados correctamente", icon: "success"});
    console.log(data); // Reemplaza esto con tu lógica para guardar la autorización
}

function resetModalNuevaAutorizacion() {
    $("#header-modal-autorizacion").html(`<i class="fas fa-file-medical"></i> Nueva Autorización`);
    $("#button-save-autorizacion").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Autorización`);
    $("#idAutorizacionActualizar").val("0");
    $("#fechaAtencion").val("");
    $("#nombrePaciente").val("");
    $("#procedimiento").val("");
    $("#cups").val("");
    $("#noHistoriaClinica").val("");
    $("#numAutorizacion").val("");
}

function eliminarAutorizacion(index) {
    Swal.fire({
        title: '¿Deseas eliminar esta autorización?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            $("#rowAutorizacion-" + index).remove();
        }
    });
}

function editarAutorizacion(id, index) {
    $("#header-modal-autorizacion").html(`<i class="fas fa-wrench"></i> Editar Autorización`);
    $("#button-save-autorizacion").html(`<i class="fas fa-wrench"></i> Actualizar Autorización`);
    $("#idAutorizacionActualizar").val(id);
    
    const data = document.getElementById("data_autorizacion_" + index).value;
    const dataPrincipal = JSON.parse(data);
    
    $("#fechaAtencion").val(dataPrincipal.fechaAtencion);
    $("#nombrePaciente").val(dataPrincipal.nombrePaciente);
    $("#procedimiento").val(dataPrincipal.procedimiento);
    $("#cups").val(dataPrincipal.cups);
    $("#noHistoriaClinica").val(dataPrincipal.noHistoriaClinica);
    $("#numAutorizacion").val(dataPrincipal.numAutorizacion);
    $("#modalNuevaAutorizacion").modal('show');
}

$('#modalNuevaAutorizacion').on('hidden.bs.modal', function () {
    resetModalNuevaAutorizacion();
});

$(document).ready(function () {
    selectToModal("modalNuevaAutorizacion", "select2Auth");
});

</script>