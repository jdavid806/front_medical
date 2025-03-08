<?php 

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevoReciboPago" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo Recibo de pago</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php 
                        $maximoComprobante = $ControllerRecibosPago->obtenerMax();
                        $maximoComprobante = intval($maximoComprobante[0]);
                        $maximoComprobante += 1;
                        $maximoComprobante = str_pad($maximoComprobante, 8, "0", STR_PAD_LEFT);

                        $optionsTipo = [
                            "1" => "RP-1 Recibo de Pago / Egreso",
                        ];
                        
                        $optionsRealizarUn = [
                            "Abono deuda" => "Abono deuda",
                            "Anticipo" => "Anticipo",
                            "Impuesto" => "Impuesto",
                            "Descuento" => "Descuento",
                            "Ajuste" => "Ajuste",
                        ];

                        $terceros = [];
                        $centrosCosto = [];
                        $metodosPago = [];

                        foreach ($datosTerceros as $tercero) {
                            $terceros[$tercero["id"]] = $tercero["documento"] . " - " . $tercero["nombresContacto"] . " " . $tercero["apellidosContacto"];
                        }
                        
                        foreach ($datosMetodosPago as $metodo) {
                            $metodosPago[$metodo["id"]] = $metodo["nombre"];
                        }
                        
                        foreach ($datosCentrosCosto as $centro) {
                            $centrosCosto[$centro["id"]] = $centro["codigo"] . " - " . $centro["descripcion"];
                        }

                        $campos = [
                            "Tipo" => ["select", "tipo", "", "required", $optionsTipo , "", ""],
                            "Numero de Factura" => ["input", "numeroFacutra", "text", "required", $maximoComprobante , "", "classDisabled"],
                            "Proveedor" => ["select", "proveedor", "", "required", $terceros , "", ""],
                            "Fecha de Elaboracion" => ["input", "fechaElaboracion", "date", "required", date("Y-m-d") , "", ""],
                            "Realizar un" => ["select", "realizarUn", "", "required", $optionsRealizarUn , "", ""],
                            "Centro de costo" => ["select", "centroCosto", "", "required", $centrosCosto , "", ""],
                            "De donde sale el dinero" => ["select", "dineroSaleDesde", "", "required", $metodosPago , "", ""],
                            "Valor pagado" => ["input", "valorPagado", "number", "required", "0" , "", ""],
                        ]; 
                        
                        foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalRecPago" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option selected value="">Seleccione...</option>
                                        <?php foreach ($datos[4] as $key => $value) {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?>
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Observaciones</label>
                            <textarea  id="observaciones" class="form-control" style="height: 100px"></textarea>
                        </div>

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Archivo</label>
                            <input type="file" id="archivoInput" class="form-control" >
                        </div>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="archivo" value="">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-RecPago" onclick="guardarRecPago()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Recibo de pago</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarRecPago() {
        let keys = [];
        var modalID = '#modalNuevoReciboPago';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            var type = $(this).attr('type');
            if (id && type != 'file') {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoReciboPago #" + keys[key]);
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
        
        data["action"] = data.id == 0 ? "crear" : "actualizar";

        let file = $("#modalNuevoReciboPago #archivoInput")[0].files[0];
        let formData = new FormData();
        formData.append("archivoInput", file);
        formData.append("data", JSON.stringify(data));

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Contabilidad/Ajax/AjaxReciboPago.php",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
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

        // $("#modalNuevoReciboPago").modal('hide');
        // resetmodalNuevoReciboPago();
        return data;
    }

    function resetmodalNuevoReciboPago() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Recibo de pago`);
        $("#button-save-RecPago").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Recibo de pago`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevoReciboPago';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevoReciboPago #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarRecPago(id) {
        $("#header-modal-RecPago").html(`<i class="fas fa-wrench"></i> Editar Recibo de pago`);
        $("#button-save-RecPago").html(`<i class="fas fa-wrench"></i> Actualizar Recibo de pago`);
        $("#modalNuevoReciboPago #id").val(id);

        const data = document.getElementById("data_RecPago" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoReciboPago #" + key);
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
        $("#modalNuevoReciboPago").modal('show');
    }

    function borrarRecPago(id) {
        let obj = {
                        action: "eliminar",
                        id
                    };
        let data = {
            "data" : JSON.stringify(obj)
        };
        
        Swal.fire({
            title: '¿Estas seguro de eliminar este Recibo de pago?',
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
                    url: "<?= $BASE ?>Contabilidad/Ajax/AjaxReciboPago.php",
                    data,
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
                $("#filaRecPago" + id).remove();
            }
        });
    }

    $('#modalNuevoReciboPago').on('hidden.bs.modal', function() {
        resetmodalNuevoReciboPago();
    });

    $('#modalNuevoReciboPago').on('shown.bs.modal', function() {
    });

    $(document).ready(function() {
        selectToModal("modalNuevoReciboPago", "selectModalRecPago");
        $("#numeroFacutra").attr("disabled", true);
    });

</script>