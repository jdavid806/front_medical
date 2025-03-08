<?php
$isRequiredSign = "<font class='text-primary'>*</font>";

$meses = [
    1 => "Enero",
    2 => "Febrero",
    3 => "Marzo",
    4 => "Abril",
    5 => "Mayo",
    6 => "Junio",
    7 => "Julio",
    8 => "Agosto",
    9 => "Septiembre",
    10 => "Octubre",
    11 => "Noviembre",
    12 => "Diciembre",
];


$optionsMeses = "<option value=''>Seleccione</option>";
foreach ($meses as $key => $mes) {
    $optionsMeses .= "<option value='$key'>" . $key . " - " .  $mes . "</option>";
}


$optionsDias = "<option value=''>Seleccione</option>";
for ($i = 1; $i <= 30; $i++) {
    $optionsDias .= "<option value='$i'>" . $i . "</option>";
}

?>

<div class="modal fade" id="modalAdicionesGrupales" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nueva Provision</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php
                        $campos = [
                            "Adicion" => ["input", "nombre", "text", "required", "", "", ""],
                            "Adiciona segun" => ["select", "descuentoSegun", "", "required", ["porcentajeSalario" => "Porcentaje de Salario", "montoFijo" => "Monto Fijo"], "", ""],
                            "Valor" => ["input", "valor", "", "required", "0", "this.value > this.max ? this.max : this.value", ""],
                            "Aplicable a " => ["select", "aplicableA", "", "required", ["Empresa" => "Empresa", "Trabajador" => "Trabajador"], "", ""],
                            // "Aplicable a " => ["select", "aplicableA", "", "required", ["todos" => "Todos", "empleados" => "Indicar trabajadores", "segunRangoSalarial" => "Segun Rango Salarial"] , "campoSegunAplicableAdicion()", ""],
                        ];

                        ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalAdicionGrupal" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
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

                        <hr>

                        <table class="table table-sm fs-9 mb-0 ">
                            <thead>
                                <tr>
                                    <th colspan="3">Fechas de pago</th>
                                </tr>
                                <tr>
                                    <th>Mes</th>
                                    <th>Dia</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="tbody-fechas-pago"></tbody>
                        </table>



                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-AdicionGrupal" onclick="guardarAdicionGrupal()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Provision</button>
            </div>
        </div>
    </div>
</div>

<script>
    let indiceFilaFechasPago = 0;
    //     $optionsMeses
    // $optionsDias
    function addFilaFechasPago() {
        const fila = `  <tr id="filaFechasPago-${indiceFilaFechasPago}">
                            <td>
                                <select class="selectModalAdicionGrupal" onchange="validarFilaAutomatica(${indiceFilaFechasPago})" name="detallePago[${indiceFilaFechasPago}][mes]" style="width:100%">
                                    <?= $optionsMeses ?>
                                </select>
                            </td>
                            <td>
                                <select class="selectModalAdicionGrupal" onchange="validarFilaAutomatica(${indiceFilaFechasPago})" name="detallePago[${indiceFilaFechasPago}][dia]" style="width:100%">
                                    <?= $optionsDias ?>
                                </select>
                            </td>
                            <td>
                                <i class="fas fa-trash-alt text-danger" onclick="eliminarFilaFechasPago('filaFechasPago-${indiceFilaFechasPago}')"></i>
                            </td>
                        </tr>`;
        indiceFilaFechasPago += 1;
        $("#tbody-fechas-pago").append(fila);
        selectToModal("modalAdicionesGrupales", "selectModalAdicionGrupal");

    }

    function validarFilaAutomatica(indice) {
        let mes = $(`select[name="detallePago[${indice}][mes]"]`);
        let dia = $(`select[name="detallePago[${indice}][dia]"]`);
        let fila = $(`#filaFechasPago-${indice+1}`);
        if (mes.val() != "" && dia.val() != "" && fila.length == 0) {
            addFilaFechasPago();
        }
    }


    function eliminarFilaFechasPago(idFila) {
        $("#" + idFila).remove();
    }

    function restringirValorAdicion() {
        let descuentoSegun = $("#descuentoSegun");
        let valor = $("#valor");

        if (descuentoSegun.val() == "porcentajeSalario") {
            valor.attr("max", "100");
        } else if (descuentoSegun.val() == "montoFijo") {
            valor.attr("max", "1000000000000000000000000000");
        }
    }

    function campoSegunAplicableAdicion() {
        let aplicableA = $("#aplicableA").val();
        if (aplicableA == "empleados") {
            $("#divTrabajadores").show();
            $(".divRango").hide();
            $("#modalDeduccionesGrupales #rangoSalarioInicio").val('0');
            $("#modalDeduccionesGrupales #rangoSalarioFin").val('0');
        } else if (aplicableA == "segunRangoSalarial") {
            $("#divTrabajadores").hide();
            $(".divRango").show();
            $("#modalDeduccionesGrupales #listaTrabajadores").val().change();
        } else if (aplicableA == "todos") {
            $("#divTrabajadores").hide();
            $(".divRango").hide();
        }
    }

    function obtenerFechasPago() {
        let detalleFecha = [];
        let rowsIsValid = true;

        $("#tbody-fechas-pago tr").each(function() {
            if (!rowsIsValid) return false;

            let idFila = $(this).attr("id");
            let indice = idFila.replace("filaFechasPago-", "");
            let mes = $(`select[name="detallePago[${indice}][mes]"]`).val();
            let dia = $(`select[name="detallePago[${indice}][dia]"]`).val();

            console.log({
                idFila,
                indice,
                mes,
                dia
            });

            if (mes != "" || dia != "") {
                if (mes == "" || dia == "") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Por favor completa la fila de fechas de pago, si no deseas ocupar una fila deja vacíos todos los valores o elimina la fila',
                    });
                    rowsIsValid = false;
                    return false;
                }

                const objetoFecha = {
                    mes,
                    dia
                }

                detalleFecha.push(objetoFecha);
            }
        });

        if (!rowsIsValid) return false;
        return detalleFecha;
    }





    function guardarAdicionGrupal() {
        let keys = [];
        var modalID = '#modalAdicionesGrupales';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalAdicionesGrupales #" + keys[key]);
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

        const detalleFechasPago = obtenerFechasPago();
        if (!detalleFechasPago) return;

        data["detalleFechas"] = JSON.stringify(detalleFechasPago);
        data["action"] = data.id == 0 ? "crear" : "actualizar";

        // console.log(data);
        // return;


        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxAdicionesGrupales.php",
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

        $("#modalAdicionesGrupales").modal('hide');
        resetmodalAdicionesGrupales();
        return data;
    }

    function resetmodalAdicionesGrupales() {
        $("#modalAdicionesGrupales #header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nueva Provision`);
        $("#modalAdicionesGrupales #button-save-AdicionGrupal").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Provision`);
        $("#modalAdicionesGrupales #id").val("0");
        $("#modalAdicionesGrupales #tbody-fechas-pago").html("");
        indiceFilaFechasPago = 0;

        let keys = [];
        var modalID = '#modalAdicionesGrupales';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalAdicionesGrupales #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarAdicionGrupal(id) {
        $("#header-modal-AdicionGrupal").html(`<i class="fas fa-wrench"></i> Editar Provision`);
        $("#button-save-AdicionGrupal").html(`<i class="fas fa-wrench"></i> Actualizar Provision`);
        $("#modalAdicionesGrupales #id").val(id);

        const data = document.getElementById("data_adicionesGrupal" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalAdicionesGrupales #" + key);
            if (elemento.is(':checkbox')) {
                elemento.prop('checked', dataPrincipal[key] == 'true' ? true : false);
                continue;
            }

            if (key == 'detalleFechas') {
                continue;
            }

            elemento.val(dataPrincipal[key]).change();
        }

        const detalleFechas = JSON.parse(dataPrincipal.detalleFechas);
        for (const key in detalleFechas) {
            let datos = detalleFechas[key];

            console.log("datos.mes", datos.mes);
            console.log("datos.dia", datos.dia);

            // Incrementar antes de usar
            console.log(`select[name="detallePago[${indiceFilaFechasPago}][mes]"]`);

            addFilaFechasPago(); // Asegúrate de que esta función crea las filas correctamente

            // Esperar a que las filas sean generadas
            setTimeout(() => {
                let selectMes = $(`select[name="detallePago[${indiceFilaFechasPago}][mes]"]`);
                let selectDia = $(`select[name="detallePago[${indiceFilaFechasPago}][dia]"]`);

                if (selectMes.length > 0 && selectDia.length > 0) {
                    selectMes.val(datos.mes).change();
                    selectDia.val(datos.dia).change();
                } else {
                    console.error("No se encontraron los select correspondientes.");
                }
            }, 500);

            // Incrementar después de usar
            // indiceFilaFechasPago++;
        }

        $("#modalAdicionesGrupales").modal('show');

    }

    function borrarAdicionGrupal(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar esta provision?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxAdicionesGrupales.php",
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
                $("#filaAdicionGrupal" + id).remove();
            }
        });
    }

    $('#modalAdicionesGrupales').on('hidden.bs.modal', function() {
        resetmodalAdicionesGrupales();
    });

    $('#modalAdicionesGrupales').on('shown.bs.modal', function() {
        addFilaFechasPago();
    });

    $(document).ready(function() {
        selectToModal("modalAdicionesGrupales", "selectModalAdicionGrupal");
    });
</script>

<style>
    .displayNone {
        display: none;
    }
</style>