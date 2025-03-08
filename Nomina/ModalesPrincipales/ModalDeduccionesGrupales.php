<?php

$isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalDeduccionesGrupales" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo Deduccion</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php 
                        
                        $campos = [
                            "Deduccion" => ["input", "nombre", "text", "required", "" , "", ""],
                            "Descuenta segun" => ["select", "descuentoSegun", "", "required", ["porcentajeSalario" => "Porcentaje de Salario", "montoFijo" => "Monto Fijo"] , "restringirValor()", ""],
                            "Valor" => ["input", "valor", "", "required", "0" , "this.value > this.max ? this.max : this.value", ""],
                            "Aplicable a " => ["select", "aplicableA", "", "required", ["todos" => "Todos", "empleados" => "Indicar trabajadores", "segunRangoSalarial" => "Segun Rango Salarial"] , "campoSegunAplicable()", ""],
                        ]; 
                        
                        
                        ?>

                        <?php foreach ($campos as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?= $datos[6] ?>">
                                <label class="form-label"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : '') ?></label>
                                <?php if ($datos[0] == "select") { ?>
                                    <!-- data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}' -->
                                    <select onchange="<?= $datos[5] ?>" class="selectModalDeduccionGrupal" style="width:100%" id="<?= $datos[1] ?>" <?= $datos[3] ?> >
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

                        <div class="col-md-6" id="divTrabajadores">
                            <label for="">Trabajadores</label>
                            <!-- data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}' -->
                            <select class="selectModalDeduccionGrupal" style="width:100%" id="listaTrabajadores" multiple="multiple" >
                                <?php 

                                var_dump($trabajadores);
                                foreach ($trabajadores as $trabajador) {
                                    echo "<option value='" . $trabajador['id'] . "'>" . $trabajador['nombre'] . "</option>";
                                }
                                ?>
                            </select>
                        </div>
                        
                        <div class="col-md-6 divRango">
                            <label for="">Rango Salarial [Inicio]</label>
                            <input id="rangoSalarioInicio" value="0" type="number" class="form-control">
                        </div>

                        <div class="col-md-6 divRango">
                            <label for="">Rango Salarial [Fin]</label>
                            <input id="rangoSalarioFin" value="0" type="number" class="form-control">
                        </div>


                        <div class="col-md-12">
                            <label for="">Notas adicionales</label>
                            <textarea id="notas" class="form-control" style="height: 100px"></textarea>
                        </div>


                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-DeduccionGrupal" onclick="guardarDeduccionGrupal()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Deduccion</button>
            </div>
        </div>
    </div>
</div>

<script>
    // descuentoSegun
    // restringirValor
    // valor

    function restringirValor() {
        let descuentoSegun = $("#descuentoSegun");
        let valor = $("#valor");

        if (descuentoSegun.val() == "porcentajeSalario") {
            valor.attr("max", "100");
        }else if (descuentoSegun.val() == "montoFijo") {
            valor.attr("max", "1000000000000000000000000000");
        }
    }

    function campoSegunAplicable() {
        let aplicableA = $("#aplicableA").val();
        if (aplicableA == "empleados") {
            $("#divTrabajadores").show();
            $(".divRango").hide();
            $("#modalDeduccionesGrupales #rangoSalarioInicio").val('0');
            $("#modalDeduccionesGrupales #rangoSalarioFin").val('0');
        }else if (aplicableA == "segunRangoSalarial") {
            $("#divTrabajadores").hide();
            $(".divRango").show();
            $("#modalDeduccionesGrupales #listaTrabajadores").val().change();
        }else if (aplicableA == "todos"){
            $("#divTrabajadores").hide();
            $(".divRango").hide();
        }
    }



    function guardarDeduccionGrupal() {
        let keys = [];
        var modalID = '#modalDeduccionesGrupales';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });

        let data = {};
        for (const key in keys) {
            let elemento = $("#modalDeduccionesGrupales #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                })
                return false;
            }

            data[keys[key]] = keys[key] == "listaTrabajadores" ? JSON.stringify(elemento.val()) : elemento.val();
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        // console.log(data);
        // return;

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxDeduccionesGrupales.php",
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

        $("#modalDeduccionesGrupales").modal('hide');
        resetmodalDeduccionesGrupales();
        return data;
    }

    function resetmodalDeduccionesGrupales() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Deduccion`);
        $("#button-save-DeduccionGrupal").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Deduccion`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalDeduccionesGrupales';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id && id != "id") {
                keys.push(id);
            }
        });
        for (const key in keys) {
            let elemento = $("#modalDeduccionesGrupales #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarDeduccionGrupal(id) {
        $("#header-modal-DeduccionGrupal").html(`<i class="fas fa-wrench"></i> Editar Deduccion`);
        $("#button-save-DeduccionGrupal").html(`<i class="fas fa-wrench"></i> Actualizar Deduccion`);
        $("#modalDeduccionesGrupales #id").val(id);

        const data = document.getElementById("data_DeduccionGrupal" + id).value;
        
        
        const dataPrincipal = JSON.parse(data);
        console.log("Data recuperada " , dataPrincipal);
        for (const key in dataPrincipal) {

            let elemento = $("#modalDeduccionesGrupales #" + key);
            
            if (elemento.is(':checkbox')) {
                elemento.prop('checked', dataPrincipal[key] == 'true' ? true : false);
                continue;
            }
            
            if (key == 'listaTrabajadores') {
                elemento.val( JSON.parse(dataPrincipal[key]) ).change();
                continue;
            }

            elemento.val(dataPrincipal[key]).change();
        }
        $("#modalDeduccionesGrupales").modal('show');
    }

    function borrarDeduccionGrupal(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este Deduccion?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxDeduccionesGrupales.php",
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
                $("#filaDeduccionGrupal" + id).remove();
            }
        });
    }

    $('#modalDeduccionesGrupales').on('hidden.bs.modal', function() {
        resetmodalDeduccionesGrupales();
    });

    $('#modalDeduccionesGrupales').on('shown.bs.modal', function() {
        campoSegunAplicable();
    });

    $(document).ready(function() {
        selectToModal("modalDeduccionesGrupales", "selectModalDeduccionGrupal");
    });

</script>

<style>
    .displayNone {
        display: none;
    }
</style>
