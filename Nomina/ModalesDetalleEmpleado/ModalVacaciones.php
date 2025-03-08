<?php $isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevoVacaciones" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-vacaciones"><i class="fas fa-plane"></i> Nueva Solicitud de Vacaciones</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <!-- Datos del Empleado -->
                        <input type="hidden" id="idTrabajador" value="<?= $idTrabajador ?>">

                        <!-- Información de Vacaciones -->
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Fecha de Inicio <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="date" onchange="$('#modalNuevoVacaciones #diasSolicitados').val(calcularDias($('#modalNuevoVacaciones #fechaInicioVacaciones').val(), $('#modalNuevoVacaciones #fechaFinVacaciones').val() ))" id="fechaInicioVacaciones" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Días Solicitados <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="number" id="diasSolicitados" readonly />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Fecha de Fin <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="date" onchange="$('#modalNuevoVacaciones #diasSolicitados').val(calcularDias($('#modalNuevoVacaciones #fechaInicioVacaciones').val(), $('#modalNuevoVacaciones #fechaFinVacaciones').val() ))" id="fechaFinVacaciones" />
                        </div>
                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Días Disponibles <?= $isRequiredSign ?></label>
                            <input required class="form-control" type="number" id="diasDisponibles" placeholder="Días de vacaciones disponibles" />
                        </div>

                        <!-- Detalles adicionales -->
                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Tipo de Vacaciones <?= $isRequiredSign ?></label>
                            <select required class="form-control" id="tipoVacaciones">
                                <option value="Regulares">Vacaciones Regulares</option>
                                <option value="Fraccionadas">Vacaciones Fraccionadas</option>
                                <option value="Extraordinarias">Vacaciones Extraordinarias</option>
                            </select>
                        </div>
                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Comentarios</label>
                            <textarea class="form-control" id="comentariosVacaciones" placeholder="Añada comentarios opcionales"></textarea>
                        </div>


                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarVacaciones()" id="button-save-vacaciones"><i class="fas fa-bookmark"></i> &nbsp; Solicitar Vacaciones</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarVacaciones() {
        let keys = ["idTrabajador","fechaInicioVacaciones","diasSolicitados","fechaFinVacaciones","diasDisponibles","tipoVacaciones","comentariosVacaciones","id", "idUsuario"];

        // Validaciones
        if (new Date($("#modalNuevoVacaciones #fechaInicio").val) > new Date($("#modalNuevoVacaciones #fechaFin").val)) {
            Swal.fire({
                title: "Error",
                text: "La fecha de inicio no puede ser posterior a la fecha de fin",
                icon: "error"
            });
            return;
        }

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoVacaciones #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") !== undefined) {
                Swal.fire({
                    title: "Error",
                    text: "Completa todos los datos obligatorios",
                    icon: "error"
                });
                return;
            }
            data[keys[key]] = elemento.val();
        }

        
        data["action"] = data.id == 0 ? "crear" : "actualizar";
        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Ajax/AjaxVacaciones.php",
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


        // Swal.fire({
        //     title: "Correcto",
        //     text: "Periodo de vacaciones creado correctamente",
        //     icon: "success"
        // });

        // Ocultar el modal y reiniciar campos
        $("#modalNuevoVacaciones").modal('hide');
        resetModalNuevoVacaciones();
        // console.log(data); // Aquí puedes manejar la lógica para guardar la solicitud de vacaciones
        return data
    }

    function calcularDias(fechaInicio, fechaFin) {

        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        const diffTime = Math.abs(endDate - startDate);
        const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        console.log("Activado calcularDias: "+ dias);
        
        return dias;
    }

    function resetModalNuevoVacaciones() {
        $("#modalNuevoVacaciones #header-modal-vacaciones").html(`<i class="fas fa-plane"></i> Nueva Solicitud de Vacaciones`);
        $("#modalNuevoVacaciones #button-save-vacaciones").html(`<i class="fas fa-bookmark"></i> &nbsp; Solicitar Vacaciones`);
        $("#modalNuevoVacaciones #id").val("0");
        $("#modalNuevoVacaciones #fechaInicioVacaciones").val("");
        $("#modalNuevoVacaciones #fechaFinVacaciones").val("");
        $("#modalNuevoVacaciones #diasSolicitados").val("");
        $("#modalNuevoVacaciones #diasDisponibles").val("");
        $("#modalNuevoVacaciones #comentariosVacaciones").val("");
    }

    $('#modalNuevoVacaciones').on('hidden.bs.modal', function() {
        resetModalNuevoVacaciones();
    });
</script>