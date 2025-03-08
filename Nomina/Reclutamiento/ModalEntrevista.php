<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<div class="modal fade" id="modalEntrevista" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addPuestoModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-entrevista"><i class="fas fa-handshake"></i> Nueva Citación a Entrevista</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">
                        <!-- Título -->

                        <div class="col-md-6 mb-1">
                            <label class="mb-0">Candidato <?= $isRequiredSign ?></label>
                            <select class="form-control" onchange="$('#modalEntrevista #emailMensaje').val(this.options[this.selectedIndex].getAttribute('data-email'))" style="width:100%" id="idCandidato">
                                <option value="0" selected data-cargoaplica="">Seleccione</option>
                                <?php

                                foreach ($datosCandidatos as $candidato) {
                                    echo '<option data-email="' . $candidato['email']. '" value="' . $candidato["id"] . '">' . $candidato["numero_documento"] . " - " . $candidato["nombre"] . ' ' . $candidato["apellido"] . '</option>';
                                }
                                ?>
                            </select>
                        </div>


                        <?php

                        $arrayCamposEntrevista = [
                            // "Nombre" =>  ["input", "nombre", "text", "required", ""],
                            "Cargo al que se aplica" =>  ["input", "cargoAplica", "text", "required", ""],
                            "Fecha" =>  ["input", "fecha", "date", "required", date("Y-m-d")],
                            "Hora" =>  ["input", "hora", "time", "required", date("H:i:s")],
                            "Email" =>  ["input", "emailMensaje", "email", "required", ""],
                        ];

                        foreach ($arrayCamposEntrevista as $label => $datos) { ?>
                            <div class="col-md-6 mb-1">
                                <label for=""><?= $label ?> <?= $datos[3] <> "" ? $isRequiredSign : "" ?></label>
                                <?php if ($datos[0] == "input") { ?>
                                    <input type="<?= $datos[2] ?>" class="form-control" id="<?= $datos[1] ?>" <?= $datos[3] ?> value="<?= $datos[4] ?>">
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <div class="col-md-12 mb-1">
                            <label class="mb-0">Contenido de correo electrónico <?= $isRequiredSign ?></label>
                            <textarea class="form-control editorJR" id="contenidoEmail" style="height: 200px" aria-hidden="true"></textarea>
                        </div>
                        <!-- Resto de campos ... (igual que en el código original) -->
                        <!-- ... -->
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?=$_SESSION['ID']?>">
            <input type="hidden" id="postulacionId" value="0">
            <input type="hidden" id="cargoId" value="0">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarEntrevista()" id="button-save-entrevista"><i class="fas fa-bookmark"></i> &nbsp; Crear Entrevista</button>
                <!-- <button class="btn btn-danger my-0" onclick="eliminarEntrevista()" id="button-delete-puesto" style="display: none;"><i class="fas fa-trash"></i> &nbsp; Eliminar Entrevista</button> -->
            </div>
        </div>
    </div>
</div>

<script>
    function citarEntrevista(candidatoId, postulacionId, cargoId, nombreCargo) {
        $("#modalEntrevista #idCandidato").val(candidatoId).change();
        $("#modalEntrevista #postulacionId").val(postulacionId);
        $("#modalEntrevista #cargoAplica").val(nombreCargo);
        $("#modalEntrevista #cargoId").val(cargoId);
        $("#modalEntrevista").modal('show');
    }

    function guardarEntrevista() {
        let keys = [];
        $modal = $("#modalEntrevista");
        $modal.find("input, select, textarea").each(function() {
            let idElemento = $(this).attr("id");
            idElemento !== undefined && idElemento != "" ?  keys.push($(this).attr("id")) : "";
        });



        let data = {};
        for (const key of keys) {
            let elemento = $("#modalEntrevista #" + key);
            if (elemento.val() === "" && elemento.attr("required") !== undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos obligatorios',
                });
                return false;
            }
            data[key] = elemento.val();
        }

        data.action = data.id == 0 ? "crear" : "actualizar";

        // console.log(data);
        // return;


        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Reclutamiento/Ajax/AjaxEntrevista.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const { icon, title ,text } = dataResponse
                Swal.fire({ icon, title, text});

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



        // console.log(data); // Aquí puedes enviar los datos al servidor o procesarlos como necesites.
        // $("#modalEntrevista").modal('hide');
        // resetModalNuevoEntrevista();
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Correcto',
        //     text: 'Entrevista guardada correctamente',
        // });
        // return data;
    }

    function resetModalNuevoEntrevista() {
        $("#modalEntrevista #header-modal-entrevista").html(`<i class="fas fa-handshake"></i> Nueva Citación a Entrevista`);
        $("#modalEntrevista #button-save-entrevista").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Entrevista`);
        // $("#button-delete-puesto").hide();
        $("#id").val("0");
        let keys = ["titulo", "tipoTrabajo", "designacion", "numPosiciones", "estadoPublicado", "fechaCierre", "genero", "experienciaMinima", "descripcionBreve", "descripcionLarga"];
        for (const key of keys) {
            $("#modalEntrevista #" + key).val("").change();
        }
    }

    function editarEntrevista(id) {
        $("#modalEntrevista #header-modal-entrevista").html(`<i class="fas fa-wrench"></i> Editar Entrevista`);
        $("#modalEntrevista #button-save-entrevista").html(`<i class="fas fa-wrench"></i> Actualizar Entrevista`);
        // // $("#button-delete-puesto").show();
        $("#id").val(id);

        const data = document.getElementById("data_entrevista_" + id).value;
        const dataPrincipal = JSON.parse(data);

        for (const key in dataPrincipal) {
            $("#modalEntrevista #" + key).val(dataPrincipal[key]);
        }

        //change()

        $("#modalEntrevista").modal('show');
    }

    function eliminarEntrevista(id) {
        // const id = $("#id").val();
        Swal.fire({
            title: '¿Estás seguro de eliminar esta entrevista?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí debes agregar la lógica para eliminar la entrevista del sistema
                console.log(`Entrevista con ID ${id} eliminada.`);
                $("#modalEntrevista").modal('hide');
                resetModalNuevoEntrevista();
                Swal.fire('Eliminada!', 'La entrevista ha sido eliminada.', 'success');
            }
        });
    }

    $(document).ready(function() {
        $('#modalEntrevista').on('hidden.bs.modal', function() {
            resetModalNuevoEntrevista();
        });

        selectToModal("modalEntrevista", "select2Entrevista");
    });
</script>