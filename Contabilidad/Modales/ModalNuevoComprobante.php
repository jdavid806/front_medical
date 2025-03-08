<?php
include "./Utilidades/UtilidadesComprobanteCC.php";

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<style>
    #modalNuevoComprobante table *{
        font-size: 0.8rem;
    }
</style>

<div class="modal fade" id="modalNuevoComprobante" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo Comprobante</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php $campos = [
                            "Tipo de Comprobante" => ["select", "tipoComprobante", "", "required", ["General", "Ingreso", "Egreso"], "", ""],
                            "Numero de factura" => ["input", "numeroFactura", "number", "required", "0", "", ""],
                            "Fecha de elaboracion" => ["input", "fechaElaboracion", "date", "required", date("Y-m-d"), "", ""],
                            "" => ["", "", "", "", "", "", ""], /// col-md-6 vacio
                        ]; ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] =="select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalComprobanteContable" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
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

                        <table class="table table-striped table-sm fs-9 mt-2 p-2 bg-light table-modal" id="tabla-modal">
                            <thead>
                                <tr>
                                    <th style="padding:10px;">Cuenta contable</th>
                                    <th style="padding:10px;">Tercero</th>
                                    <th style="padding:10px;">Detalle contable</th>
                                    <th style="padding:10px;">Descripcion</th>
                                    <th style="padding:10px;">Centro de costo</th>
                                    <th style="padding:10px;">Debito</th>
                                    <th style="padding:10px;">Crédito</th>
                                    <th style="padding:10px;"></th>
                                </tr>
                            </thead>
                            <tbody id="tbody-modal-comprobante"></tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="6">Total Neto</th>
                                    <th class="text-end" id="total-neto-inner">0.00</th>
                                    <!-- <input type="hidden" id="total-neto" value="0"> -->
                                </tr>
                            </tfoot>
                        </table>


                        <label class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observaciones" style="height: 100px;"></textarea>

                        <label class="form-label">Archivo</label>
                        <input class="form-control" type="file" id="archivoFile">

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="archivo" value="">
                        <input type="hidden" id="idUsuario" value="<?= $_SESSION["ID"] ?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-ComprobanteContable" onclick="guardarComprobanteContable()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Comprobante</button>
            </div>
        </div>
    </div>
</div>

<script>
    function guardarComprobanteContable() {
        let keys = [];
        var modalID = '#modalNuevoComprobante';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoComprobante #" + keys[key]);
            if(elemento.attr("type") == "file") continue;
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

        let detalleIsValid = true;
        let detalleData = [];
        $("#modalNuevoComprobante #tbody-modal-comprobante tr").each(function() {
            if(!detalleIsValid) return;
            let id = $(this).attr("id");
            let index = id.replace("fila", "");

            let idDetalle = $(`input[name='Detalle[${index}][id]']`);
            let cuentaContable = $(`select[name='Detalle[${index}][cuentaContable]']`);
            let tercero = $(`select[name='Detalle[${index}][tercero]']`);
            let detalle = $(`input[name='Detalle[${index}][detalle]']`);
            let descripcion = $(`input[name='Detalle[${index}][descripcion]']`);
            let centroCosto = $(`select[name='Detalle[${index}][centroCosto]']`);
            let debito = $(`input[name='Detalle[${index}][debito]']`);
            let credito = $(`input[name='Detalle[${index}][credito]']`);

            const objetoDetalle = {
                id: idDetalle.val(),
                cuentaContable: cuentaContable.val(),
                tercero: tercero.val(),
                detalle: detalle.val(),
                descripcion: descripcion.val(),
                centroCosto: centroCosto.val(),
                debito: debito.val(),
                credito: credito.val(),
            }

            console.log("Objeto detalle");
            console.log(objetoDetalle);


            let noVacios = Object.values(objetoDetalle).filter(x => x?.trim() !== "");

            if (noVacios.length > 1) { // SI HAY UN ELEMENTO QUE NO SEA EL ID QUE NO ESTE VACIO LA FILA SERA TENIDA EN CUENTA 
                console.log("Se tiene en cuenta");
                let tieneVacio = Object.values(objetoDetalle).some(x => x == "");
                if (tieneVacio) {
                    console.log("No se incluye");
                    detalleIsValid = false;
                    return false; // Detener el ciclo
                }
                console.log("Se incluye");
                detalleData.push(objetoDetalle);
            }
        });


        if (!detalleIsValid) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Una de las filas del detalle del comprobante tiene un espacio vacio, si no deseas ocupar la fila vacía los espacios o elimina la fila',
            })
            return false;
        }

        data["detalle"] = detalleData;
        data["action"] = data.id == 0 ? "crear" : "actualizar";

        let archivo = $('#modalNuevoComprobante #archivoFile')[0].files[0]; 
        let formData = new FormData();

        formData.append('archivoFile', archivo);
        formData.append("data", JSON.stringify(data));

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Contabilidad/Ajax/AjaxComprobanteC.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log("Response");
                console.log(response);
                
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

        // $("#modalNuevoComprobante").modal('hide');
        // resetmodalNuevoComprobante();
        // return data;
    }

    function resetmodalNuevoComprobante() {
        $("#modalNuevoComprobante #tbody-modal-comprobante").html(``);
        indiceFilaCC = 0;
        AnadirFilaCC("modalNuevoComprobante");
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Comprobante`);
        $("#button-save-ComprobanteContable").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Comprobante`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevoComprobante';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id" && id != "idUsuario") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevoComprobante #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarComprobanteContable(id) {
        $("#header-modal-ComprobanteContable").html(`<i class="fas fa-wrench"></i> Editar Comprobante`);
        $("#button-save-ComprobanteContable").html(`<i class="fas fa-wrench"></i> Actualizar Comprobante`);
        $("#modalNuevoComprobante #id").val(id);

        const data = document.getElementById("data_ComprobanteContable" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoComprobante #" + key);
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
        

        
        const jsonDetalle = document.getElementById("data_DetalleComprobanteContable" + id).value;
        const dataDetalle = JSON.parse(jsonDetalle);
        if (dataDetalle.length > 0) {
            $("#modalNuevoComprobante #tbody-modal-comprobante").html(``);
            indiceFilaCC = 0;
        }
        
        dataDetalle.forEach(detalle => {
            let ultimoIndice = indiceFilaCC;
            AnadirFilaCC("modalNuevoComprobante");
            $(`input[name='Detalle[${ultimoIndice}][id]']`).val(detalle.id);
            $(`select[name='Detalle[${ultimoIndice}][cuentaContable]']`).val(detalle.cuentaContable);
            $(`select[name='Detalle[${ultimoIndice}][tercero]']`).val(detalle.tercero);
            $(`input[name='Detalle[${ultimoIndice}][detalle]']`).val(detalle.detalle);
            $(`input[name='Detalle[${ultimoIndice}][descripcion]']`).val(detalle.descripcion);
            $(`select[name='Detalle[${ultimoIndice}][centroCosto]']`).val(detalle.centroCosto);
            $(`input[name='Detalle[${ultimoIndice}][debito]']`).val(detalle.debito);
            $(`input[name='Detalle[${ultimoIndice}][credito]']`).val(detalle.credito);            
        });

        AnadirFilaCC("modalNuevoComprobante");



        $("#modalNuevoComprobante").modal('show');
    }

    function borrarComprobanteContable(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Comprobante?',
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
                    url: "<?= $BASE ?>Contabilidad/Ajax/AjaxComprobanteC.php",
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
                $("#filaComprobanteContable" + id).remove();
            }
        });
    }

    let indiceFilaCC = 0;
    function AnadirFilaCC(modalId) {
        let btnDelete = indiceFilaCC != 0 ? `<i class="fas fa-trash mt-2" onclick="EliminarFilaCC(${indiceFilaCC})"></i>` : ``;
        let nuevaFila = `<tr id="fila${indiceFilaCC}">">
                            <input  type="hidden" class='form-control underline-input' name='Detalle[${indiceFilaCC}][id]' value='0'>
                            <td style="padding:5px 10px !important"><select onchange="filaAutomaticaCC(${indiceFilaCC})" class='form-control underline-input' name='Detalle[${indiceFilaCC}][cuentaContable]'>${obtenerOptionsCuentasContables()}</select></td>
                            <td style="padding:5px 10px !important"><select onchange="filaAutomaticaCC(${indiceFilaCC})" class='form-control underline-input' name='Detalle[${indiceFilaCC}][tercero]'>${obtenerOptionsTerceros()}</select></td>
                            <td style="padding:5px 10px !important"><input onchange="filaAutomaticaCC(${indiceFilaCC})" class='form-control underline-input' name='Detalle[${indiceFilaCC}][detalle]'></td>
                            <td style="padding:5px 10px !important"><input onchange="filaAutomaticaCC(${indiceFilaCC})" class='form-control underline-input' name='Detalle[${indiceFilaCC}][descripcion]'></td>
                            <td style="padding:5px 10px !important"><select onchange="filaAutomaticaCC(${indiceFilaCC})" class='form-control underline-input' name='Detalle[${indiceFilaCC}][centroCosto]'>${obtenerOptionsCentrosCosto()}</select></td>
                            <td style="padding:5px 10px !important"><input onchange="filaAutomaticaCC(${indiceFilaCC})" type="number" class='form-control underline-input' name='Detalle[${indiceFilaCC}][debito]'></td>
                            <td style="padding:5px 10px !important"><input onchange="filaAutomaticaCC(${indiceFilaCC})" type="number" class='form-control underline-input' name='Detalle[${indiceFilaCC}][credito]'></td>
                            <td style="padding:5px 10px !important">${btnDelete} </td>
                        </tr>`;
        $(`#${modalId} #tbody-modal-comprobante`).append(nuevaFila);
        indiceFilaCC += 1;
    }

    function filaAutomaticaCC(indice) {
        let siguienteFila = document.getElementById(`fila${indice + 1}`);
        if (!siguienteFila) {
            AnadirFilaCC("modalNuevoComprobante");
        }
    }

    function EliminarFilaCC(indice) {
        $(`#fila${indice}`).remove();
    }



    $('#modalNuevoComprobante').on('hidden.bs.modal', function() {
        resetmodalNuevoComprobante();
    });

    $('#modalNuevoComprobante').on('shown.bs.modal', function() {});

    $(document).ready(function() {
        selectToModal("modalNuevoComprobante", "selectModalComprobanteContable");
        AnadirFilaCC("modalNuevoComprobante");
    });
</script>
