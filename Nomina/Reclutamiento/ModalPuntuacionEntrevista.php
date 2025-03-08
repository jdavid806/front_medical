<?php

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalPuntuacionEntrevista" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-p-entrevista"><i class="fas fa-file-signature"></i></h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">


                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Item/ Parametro</th>
                                    <th>Puntuacion</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-puntuacion-entrevista"></tbody>
                        </table>

                        <?php $campos = [
                            "Persona que ingresa la puntuacion" => ["input", "nombreIngresaResultados", "text", "required", "", "", ""],
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-12 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalPuntuacion" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option value="" selected>Seleccione...</option>
                                        <?php foreach ($datos[4] as $key => $value) {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?>
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <div class="col-md-12 mb-1 <?= $datos[6] ?>">
                            <label class="form-label">Observaciones<span class="text-primary">*</span></label>
                            <textarea class="form-control" id="observaciones" style="height: 100px"></textarea>
                        </div>



                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idEntrevista" value="0">
                        <input type="hidden" id="idCandidato" value="0">
                        <input type="hidden" id="idPostulacion" value="0">
                        <input type="hidden" id="idPuesto" value="0">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-Puntuacion" onclick="guardarPuntuacion()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Puntuacion de Entrevista</button>
            </div>
        </div>
    </div>
</div>

<script>
    function puntuarEntrevista(idEntrevista, idCandidato, idPostulacion, idPuesto) {
        $("#modalPuntuacionEntrevista #idEntrevista").val(idEntrevista);
        $("#modalPuntuacionEntrevista #idCandidato").val(idCandidato);
        $("#modalPuntuacionEntrevista #idPostulacion").val(idPostulacion);
        $("#modalPuntuacionEntrevista #idPuesto").val(idPuesto);
        $("#modalPuntuacionEntrevista #header-modal-p-entrevista").html("<i class='fas fa-chart-line'></i> Puntuacion de entrevista - N° " + idEntrevista);

        let datosPuntuacionElement = document.getElementById("data_parametros_entrevista_" + idEntrevista);
        if (!datosPuntuacionElement) {
            console.error("No se encontró el elemento con ID:", "data_parametros_entrevista_" + idEntrevista);
            return;
        }

        let datosPuntuacion = datosPuntuacionElement.value || datosPuntuacionElement.innerText || datosPuntuacionElement.textContent;
        console.log("datosPuntuacion antes de parsear:", datosPuntuacion);

        // Parsear el JSON
        try {
            datosPuntuacion = JSON.parse(datosPuntuacion);
        } catch (error) {
            console.error("Error al parsear datosPuntuacion:", error);
            return;
        }
        console.log("datosPuntuacion después de parsear:", datosPuntuacion);

        // Verificar si es un arreglo
        if (!Array.isArray(datosPuntuacion)) {
            // Convertir a arreglo
            datosPuntuacion = Object.values(datosPuntuacion);
        }

        let html = '';
        datosPuntuacion.forEach((datos, index) => {
            console.log("datos", datos);
            console.log("index", index);

            if (datos && datos.parametro !== undefined && datos.porcentaje !== undefined) {
                html += `
                <tr id="filaParametrosEvaluados-${index}">
                    <td style="padding:5px" class="text-center">
                        ${datos.parametro}
                        <input type="hidden" value="${datos.parametro}" name="detalleEvaluacion[${index}][parametro]">
                    </td>
                    <td style="padding:5px">
                        <label>Min: 0 - Max: ${datos.porcentaje}</label><br>
                        <label id="labelPuntaje${index}">Puntaje Final: 0</label>
                        <input type="range" step="5" onchange="$('#labelPuntaje${index}').html('Puntaje Final: ' + this.value)" value="0" min="0" max="${datos.porcentaje}" class="form-range" name="detalleEvaluacion[${index}][porcentaje]">
                    </td>
                </tr>`;
            } else {
                console.error('El objeto datos no tiene las propiedades esperadas:', datos);
            }
        });

        $("#modalPuntuacionEntrevista #tbody-puntuacion-entrevista").html(html);
        $("#modalPuntuacionEntrevista").modal('show');
    }





    function guardarPuntuacion() {
        let keys = [];
        var modalID = '#modalPuntuacionEntrevista';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalPuntuacionEntrevista #" + keys[key]);
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

        let detalleParametros = [];
        let totalParametros = 0;
        $(`#modalPuntuacionEntrevista #tbody-puntuacion-entrevista tr`).each(function() {
            let idFila = $(this).attr("id");
            let indice = idFila.replace("filaParametrosEvaluados-", "");

            let parametro = $(`input[name="detalleEvaluacion[${indice}][parametro]"]`).val();
            let porcentaje = $(`input[name="detalleEvaluacion[${indice}][porcentaje]"]`).val();

            const parametroEvaluacion = {
                                            parametro,
                                            porcentaje
                                        };
            
            detalleParametros.push(parametroEvaluacion);            
        })



        data["detalle"] = JSON.stringify(detalleParametros);
        data["action"] = data.id == 0 ? "crear" : "actualizar";

        // console.log("data" , data);
        // return;
        

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Reclutamiento/Ajax/AjaxPuntuacionEntrevista.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {
                    icon,
                    title,
                    text
                } = dataResponse;
                Swal.fire({
                    icon,
                    title,
                    text,
                });

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

        $("#modalPuntuacionEntrevista").modal('hide');
        resetmodalPuntuacionEntrevista();
        return data;
    }

    function resetmodalPuntuacionEntrevista() {
        $("#modalPuntuacionEntrevista #header-modal-p-entrevista").html(`<i class="fas fa-briefcase"></i> Nuevo Puntuacion de Entrevista`);
        $("#modalPuntuacionEntrevista #button-save-Puntuacion").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Puntuacion de Entrevista`);
        $("#modalPuntuacionEntrevista #id").val("0");
        $("#modalPuntuacionEntrevista #tbody-puntuacion-entrevista").html("");
        let keys = [];
        var modalID = '#modalPuntuacionEntrevista';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalPuntuacionEntrevista #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarPuntuacion(id) {
        $("#modalPuntuacionEntrevista #header-modal-Puntuacion").html(`<i class="fas fa-wrench"></i> Editar Puntuacion de Entrevista`);
        $("#modalPuntuacionEntrevista #button-save-Puntuacion").html(`<i class="fas fa-wrench"></i> Actualizar Puntuacion de Entrevista`);
        $("#modalPuntuacionEntrevista #modalPuntuacionEntrevista #id").val(id);

        const data = document.getElementById("data_Puntuacion" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalPuntuacionEntrevista #" + key);
            if (elemento.is(':checkbox')) {
                elemento.prop('checked', dataPrincipal[key] == 'true' ? true : false);
                continue;
            }

            if (key == 'contenido') {
                insertarContenido(dataPrincipal[key]);
                continue;
            }

            elemento.val(dataPrincipal[key]).change();
        }
        $("#modalPuntuacionEntrevista").modal('show');
    }

    function borrarPuntuacion(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Puntuacion de Entrevista?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxPuntuacionEntrevista.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {
                            icon,
                            title,
                            text
                        } = dataResponse;
                        Swal.fire({
                            icon,
                            title,
                            text,
                        });
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
                $("#filaPuntuacion" + id).remove();
            }
        });
    }

    $('#modalPuntuacionEntrevista').on('hidden.bs.modal', function() {
        resetmodalPuntuacionEntrevista();
    });

    $('#modalPuntuacionEntrevista').on('shown.bs.modal', function() {});

    $(document).ready(function() {
        selectToModal("modalPuntuacionEntrevista", "selectModalPuntuacion");
    });
</script>

<style>
    .displayNone {
        display: none;
    }
</style>