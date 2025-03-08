<?php 

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevaCuentaContable" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-CContable"><i class="fas fa-file-signature"></i> Nuevo Cuenta Contable</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Codigo <span class="text-primary">*</span>  (Sin puntos ni espacios) </label>
                            <input required type="text" class="form-control" id="codigo" onkeyup="validarCodigo(this)" >
                        </div>

                        <div class="col-md-12 mb-1">
                            <label class="form-label">Nombre <span class="text-primary">*</span></label>
                            <input required type="text" class="form-control" onkeyup="this.value = this.value.toUpperCase()" id="nombre">
                        </div>

                        <?php 
                        $categorias = ["Caja - Bancos", "Cuentas por cobrar", "Otros activos corrientes", "Inventarios", "Activos Fijos", "Otros Activos", "Cuentas por pagar", "Otros pasivos corrientes", "Pasivo corto plazo", "Pasivo largos plazos", "Otros pasivos", "Patrimonio" ];
                        $saldosCartera = [ "Sin detalle de vencimientos", "Clientes, controla vencimientos y estados de cuenta", "Proveedores, controla vencimientos y estqado de cuenta" ];

                        $campos = [
                            "Saldo inicial" => ["input", "saldoInicial", "number", "required", "0", "", ""],
                            "Categorias" => ["select", "categoriaCC", "", "required", $categorias, "", ""],
                            "Detallar saldos de cartera o proveedores" => ["select", "detallarSaldosCartera", "", "required", $saldosCartera, "", ""],
                            "" => ["", "", "", "", "", "", ""],
                            "Cuenta de diferencia fiscal o ajustes NIIF" => ["input", "cuentaDiffFiscal", "checkbox", "required", "1", "", ""],
                            "Activa" => ["input", "cuentaActiva", "checkbox", "required", "1", "", ""],
                        ]; 


                        ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <select onchange="<?= $datos[5] ?>" class="form-select selectModalCContable" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?>>
                                        <option value="" selected>Seleccione...</option> 
                                        <?php foreach ($datos[4] as $key => $value)  {
                                            echo '<option value="' . $key . '">' . $value . '</option>';
                                        } ?>
                                    </select>
                                <?php } elseif ($datos[0] == "input") { ?> 
                                    <input onchange="<?= $datos[5] ?>" value="<?= $datos[4] ?>" class="<?= $datos[2] != 'checkbox'  ? 'form-control' : '' ?>" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                <?php } ?>
                            </div>
                        <?php } ?>

                                    
                        <div class="col-md-12 mb-1">
                            <label class="form-label">Observaciones </label>
                            <textarea class="form-control" id="observaciones" style="height: 100px"></textarea>
                        </div>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-CContable" onclick="guardarCContable()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Cuenta Contable</button>
            </div>
        </div>
    </div>
</div>

<script>

    function guardarCContable() {
        let keys = [];
        var modalID = '#modalNuevaCuentaContable';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevaCuentaContable #" + keys[key]);
            if (elemento.attr("type") == "checkbox") {
                data[keys[key]] = elemento.is(":checked");
                continue; 
            }
            
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

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Contabilidad/Ajax/AjaxCuentasContables.php",
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

        $("#modalNuevaCuentaContable").modal('hide');
        resetmodalNuevaCuentaContable();
        return data;
    }

    function resetmodalNuevaCuentaContable() {
        $("#header-modal-CContable").html(`<i class="fas fa-briefcase"></i> Nuevo Cuenta Contable`);
        $("#button-save-CContable").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Cuenta Contable`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevaCuentaContable';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevaCuentaContable #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarCContable(id) {
        $("#header-modal-CContable").html(`<i class="fas fa-wrench"></i> Editar Cuenta Contable`);
        $("#button-save-CContable").html(`<i class="fas fa-wrench"></i> Actualizar Cuenta Contable`);
        $("#modalNuevaCuentaContable #id").val(id);

        const data = document.getElementById("data_CContable" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevaCuentaContable #" + key);
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
        $("#modalNuevaCuentaContable").modal('show');
    }

    function validarCodigo(input) {
        let valor = input.value;
        let valorFiltrado = valor.replace(/[^0-9]/g, '');
        input.value = valorFiltrado;
    }


    // function validarCodigo(input) {
    //     let valor = input.value;
    //     let valorFiltrado = valor.replace(" ", '');
    //     valorFiltrado = valorFiltrado.replace("-", '');
    //     valorFiltrado = valorFiltrado.replace("e", '');
    //     valorFiltrado = valorFiltrado.replace("+", '');
    //     valorFiltrado = valorFiltrado.replace(".", '');
    //     valorFiltrado = valorFiltrado.replace("/", '');
    //     valorFiltrado = valorFiltrado.replace("*", '');
    //     input.value = valorFiltrado;
    // }

    function borrarCContable(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Cuenta Contable?',
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
                    url: "<?= $BASE ?>Contabilidad/Ajax/AjaxCuentasContables.php",
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
                $("#filaCContable" + id).remove();
            }
        });
    }

    $('#modalNuevaCuentaContable').on('hidden.bs.modal', function() {
        resetmodalNuevaCuentaContable();
    });

    $('#modalNuevaCuentaContable').on('shown.bs.modal', function() {
    });

    $(document).ready(function() {
        selectToModal("modalNuevaCuentaContable", "selectModalCContable");
    });

</script>

<style>
    .displayNone {
        display: none;
    }
</style>