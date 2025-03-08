<?php $isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevoContrato" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-contrato"><i class="fas fa-file-signature"></i> Nuevo contrato</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <div class="col-md-6 mb-1">
                            <label class="form-label">Trabajador <?= '<span class="text-primary">*</span>' ?></label>
                            <select onchange="" class="form-select selectModalContrato" style="width:100%" id="idTrabajador" required>
                                <option selected>Seleccione...</option>
                                <?php foreach ($trabajadores as $key => $trabajador) {
                                    echo '<option value="' . $trabajador["id"] . '">' . $trabajador['numero_documento'] . ' - ' . $trabajador['nombre'] . ' ' . $trabajador['apellido'] . '</option>';
                                } ?>
                            </select>
                        </div>

                        <div class="col-md-6 mb-1">
                            <label class="form-label">Cargo <?= '<span class="text-primary">*</span>' ?></label>
                            <select onchange="" class="form-select selectModalContrato" style="width:100%" id="cargoId" required>
                                <option selected>Seleccione...</option>
                                <?php foreach ($datosCargos as $key => $cargo) {
                                    echo '<option value="' . $cargo["id"] . '">' . $cargo['codigo'] . ' - ' . $cargo['nombre'] . '</option>';
                                } ?>
                            </select>
                        </div>
                        
                        <?php
                        $tiposContrato = [
                            "Fijo" => "A Término Fijo",
                            "Indefinido" => "Indefinido",
                            "Obra-Labor" => "Por Obra o Labor",
                            "Temporal" => "Temporal"
                        ];

                        $tiposJornadaLaboral = [
                            "Diurna" => "Diurna",
                            "Nocturna" => "Nocturna",
                            "Unica" => "Única"
                        ];

                        $camposContrato = [
                            "Fecha del Contrato" => ["input", "fechaContrato", "date", "required", date("Y-m-d"), "", ""],
                            "Tipo de Contrato" => ["select", "tipoContrato", "", "required", ["Nuevo", "Renovacion", ""], "", ""],
                            "Duración del Contrato" => ["select", "duracionContrato", "", "required", $tiposContrato, "validarDuracionContrato(this.value)", ""],
                            "Fecha Finalizacion" => ["input", "fechaFinContrato", "date", "required", date("Y-m-d"), "", "displayNone"],
                            "Período de Prueba (En dias)" => ["input", "periodoPrueba", "text", "required", "0", "", ""],
                            "Jornada Laboral" => ["select", "jornada", "", "required", $tiposJornadaLaboral, "", ""],
                            "Salario" => ["input", "salario", "number", "required", ""],
                            // "Archivo" => ["input", "archivo", "file", "", ""]
                        ];

                        foreach ($camposContrato as $label => $datos) { ?>
                            <div class="col-md-<?= $label == 'Archivo' ? '12' : '6' ?> mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalContrato" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
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
                            <label for="">Funciones del cargo</label>
                            <textarea class="form-control" style="height: 100px" id="funcionesCargo"></textarea>
                        </div>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="usuarioId" value="<?= $_SESSION["id"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-contrato" onclick="guardarContrato()"><i class="fas fa-bookmark"></i> &nbsp; Guardar contrato</button>
            </div>
        </div>
    </div>
</div>

<script>
    function resetModalContrato() {
        let keys = ['idTrabajador', 'cargoId', 'fechaContrato','tipoContrato','duracionContrato','fechaFinContrato','periodoPrueba', 'jornada','salario'];
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoContrato #" + keys[key]);
            ielemento.val() = '';
        }

        $("#modalNuevoContrato #header-modal-contrato").html(`<i class="fas fa-file-signature"></i> Nuevo contrato</h3>`);
        $("#modalNuevoContrato #id").val("0");
        $("#modalNuevoContrato #button-save-contrato").html(`<i class="fas fa-bookmark"></i> &nbsp; Guardar contrato`);

    }


    function guardarContrato() {
        let keys = ['idTrabajador', 'cargoId', 'fechaContrato','tipoContrato','duracionContrato','fechaFinContrato','periodoPrueba', 'jornada','salario',"usuarioId", "fechaRegistro" ,"id"];
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoContrato #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") !== undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Todos los campos son obligatorios!'
                })
                return false;
            }

            data[keys[key]] = elemento.val();
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";
        console.log(data);

        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Ajax/AjaxContratos.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {icon,title,text} = dataResponse
                Swal.fire({icon,title,text});

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

        // Swal.fire({
        //     "icon": "success",
        //     "title": "Correcto",
        //     "text": "Contrato guardado correctamente",
        // });

        resetModalContrato()
        $("#modalNuevoContrato").modal("hide");
    
    }

    function borrarContrato(id) {
        Swal.fire({
            title: '¿Estas seguro de borrar este contrato?',
            text: "No podras revertir esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $Base ?>Nomina/Ajax/AjaxContratos.php",
                    data:{
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse
                        Swal.fire({icon,title,text});

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


                $("#rowcontrato-" + id).remove();
            }
        })
    }

    function editarContrato(id, index) {
        let dataJson = $("#data_contrato_" + index).val();
        let data = JSON.parse(dataJson);
        $("#modalNuevoContrato #id").val(id);
        $("#modalNuevoContrato #header-modal-contrato").html(`<i class="fas fa-wrench"></i> Actualizar contrato</h3>`);
        $("#modalNuevoContrato #button-save-contrato").html(`<i class="fas fa-wrench"></i> &nbsp; Actualizar contrato`);


        for (const key in data) {
            $("#modalNuevoContrato #" + key).val(data[key]).change();
        }

        $("#modalNuevoContrato").modal("show");

    }

    



    function validarDuracionContrato(tipo) {
        if (tipo == 'fijo') {
            $(".displayNone").each(function() {
                $(this).css("display", "block");
                $(this).val("");
            });
        } else {
            $(".displayNone").each(function() {
                $(this).css("display", "none");
                $(this).val("");
            });
        }
    }


    $(document).ready(function() {
        selectToModal("modalNuevoContrato", "selectModalContrato")
    })
</script>



<style>
    .displayNone {
        display: none;
    }
</style>