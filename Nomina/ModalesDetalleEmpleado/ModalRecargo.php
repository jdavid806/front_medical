<?php 

$isRequiredSign = "<font class='text-primary'>*</font>";

?>

<div class="modal fade" id="ModalNuevoRecargo" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-plus"></i> Nuevo Recargo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">


                        <div class="col-md-6">
                            <label for="">Tipo de recargo <?= $isRequiredSign ?></label>
                            <select class="selectModalRecargo" style="width: 100%;" onchange="calcularRecargo();" id="tipoRecargo">
                                <option value="">Seleccione</option>
                                <?php
                                foreach ($datosTiposRecargo as $tiposRecargo) {
                                    $id = $tiposR[$tiposRecargo["id"]];
                                    $nombre = $tiposRecargo["nombre"];
                                    echo "<option data-tipocalculo='" . $tiposRecargo['calcularSegun'] . "' data-porcentaje='" . $tiposRecargo['valor'] . "' value='$id'>$nombre</option>";
                                }

                                ?>

                            </select>
                        </div>


                        <?php

                        $camposContrato = [
                            // "Tipo de recargo" => ["select", "tipoRecargo", "required", $tiposR, "", "", ""],
                            "Fecha" => ["input", "fechaRecargo", "date", "required", date("Y-m-d"), "", ""],
                            "Horas de Recargo" => ["input", "horasRecargo", "number", "required", "1", "calcularRecargo()", ""],
                            "Motivo" => ["input", "motivo", "text", "required", "", "", ""],
                            "Valor" => ["input", "valorRecargo", "number", "required", "100", "calcularRecargo()", ""],
                        ];

                        foreach ($camposContrato as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalRecargo" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option selected>Seleccione...</option>
                                        <?php foreach ($datos[4] as $key => $value) {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?>
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <div class="col-md-12">
                            <label for="">Observaciones</label>
                            <textarea class="form-control" style="height: 100px" id="observaciones"></textarea>
                        </div>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="pagado" value="No">
                        <input type="hidden" id="idTrabajador" value="<?= $idTrabajador ?>">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-Recargo" onclick="guardarRecargo()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Recargo</button>
            </div>
        </div>
    </div>
</div>

<script>
    function calcularRecargo() {
        // Obtener valores numéricos del salario y valor hora desde PHP
        const salarioEmpleado = parseFloat("<?= $datosTrabajador['salario'] ?>") || 0;
        const valorHoraConfiguracion = parseFloat("<?= $datosTrabajador['valorHora'] ?>") || 0;

        // Obtener valores de los campos del modal
        const horasRecargo = parseFloat($("#ModalNuevoRecargo #horasRecargo").val()) || 0;
        const tipoRecargo = $("#ModalNuevoRecargo #tipoRecargo option:selected");
        const tipocalculo = tipoRecargo.attr("data-tipocalculo");
        const porcentaje = parseFloat(tipoRecargo.attr("data-porcentaje")) || 0;

        console.log({
            salarioEmpleado,
            valorHoraConfiguracion,
            horasRecargo,
            tipoRecargo: tipoRecargo.text(),
            tipocalculo,
            porcentaje
        });

        // Validaciones iniciales
        if (isNaN(horasRecargo) || horasRecargo <= 0) {
            // alert("Por favor, introduce un valor válido para las horas de recargo.");
            return;
        }

        if (!tipoRecargo.length || !tipocalculo) {
            // alert("Por favor, selecciona un tipo de recargo válido.");
            return;
        }

        let valorRecargo = 0;

        // Calculo del recargo según el tipo
        if (tipocalculo === 'horaTrabajador') {
            // Calculo basado en salario del empleado
            const valorHoraEmpleado = salarioEmpleado / 30 / 8;
            valorRecargo = horasRecargo * valorHoraEmpleado * (porcentaje / 100);
        } else {
            // Calculo basado en la configuración general
            valorRecargo = horasRecargo * valorHoraConfiguracion * (porcentaje / 100);
        }

        // Redondear a dos decimales y establecer el valor en el campo correspondiente
        valorRecargo = Math.round(valorRecargo * 100) / 100;

        $("#ModalNuevoRecargo #valorRecargo").val(valorRecargo);

        console.log("Valor del recargo calculado: ", valorRecargo);
    }



    function guardarRecargo() {
        let keys = [];
        var modalID = '#ModalNuevoRecargo';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#ModalNuevoRecargo #" + keys[key]);
            let value = elemento.val();
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                })
                return false;
            }

            data[keys[key]] = value;
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxRecargo.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {
                    icon,
                    title,
                    text
                } = dataResponse
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

        $("#ModalNuevoRecargo").modal('hide');
        resetModalNuevoRecargo();
        return data;
    }

    function resetModalNuevoRecargo() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Recargo`);
        $("#button-save-Recargo").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Recargo`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#ModalNuevoRecargo';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                if (id != "id") {
                    keys.push(id);
                }

            }
        });
        for (const key in keys) {
            let elemento = $("#ModalNuevoRecargo #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarRecargo(id) {
        $("#header-modal-Recargo").html(`<i class="fas fa-wrench"></i> Editar Recargo`);
        $("#button-save-Recargo").html(`<i class="fas fa-wrench"></i> Actualizar Recargo`);
        $("#ModalNuevoRecargo #id").val(id);

        const data = document.getElementById("data_Recargo" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#ModalNuevoRecargo #" + key);
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

        $("#ModalNuevoRecargo").modal('show');
    }

    function borrarRecargo(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Recargo?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxRecargo.php",
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
                        } = dataResponse
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
                })

                $("#filaRecargo" + id).remove();
            }
        })
    }

    $('#ModalNuevoRecargo').on('hidden.bs.modal', function() {
        resetModalNuevoRecargo();
    });

    $('#ModalNuevoRecargo').on('shown.bs.modal', function() {});

    $(document).ready(function() {
        selectToModal("ModalNuevoRecargo", "selectModalRecargo")
    })
</script>

<style>
    .displayNone {
        display: none;
    }
</style>