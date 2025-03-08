<?php $isRequiredSign = "<font class='text-primary'>*</font>" ?>

<div class="modal fade" id="modalNuevoContrato" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-ncontrado"><i class="fas fa-file-signature"></i> Nuevo contrato</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="pagina col-md-12 row">

                        <?php
                        $tiposContrato = [
                            "fijo" => "A Término Fijo",
                            "indefinido" => "Indefinido",
                            "obra-labor" => "Por Obra o Labor",
                            "temporal" => "Temporal"
                        ];


                        $tiposJornadaLaboral = [
                            "Diurna" => "Diurna",
                            "Nocturna" => "Nocturna",
                            "Unica" => "Única"
                        ];

                        $Cargos = [];
                        foreach ($datosCargos as $key => $value) {
                            $Cargos[$value["id"]] = $value["nombre"];
                        }

                        
                        $camposContrato = [
                            "Fecha del Contrato" => ["input", "fechaContrato", "date", "required", date("Y-m-d"), "modificarParametrosContrato()", ""],
                            "Tipo de Contrato" => ["select", "tipoContrato", "", "required", ["Nuevo","Renovacion", ""], "modificarParametrosContrato()", ""],
                            "Duración del Contrato" => ["select", "duracionContrato", "", "required", $tiposContrato, "validarDuracionContrato(this.value);modificarParametrosContrato()", ""],
                            "Fecha Finalizacion" => ["input", "fechaFinContrato", "date", "required", date("Y-m-d"), "modificarParametrosContrato()", "displayNone"],
                            "Período de Prueba (En dias)" => ["input", "periodoPrueba", "text", "required", "0", "modificarParametrosContrato()", ""],
                            "Cargo o Puesto de Trabajo" => ["select", "cargo", "", "required", $Cargos, "modificarParametrosContrato()", ""],
                            // "Cargo o Puesto de Trabajo" => ["input", "cargo", "text", "required", "", "modificarParametrosContrato()", ""],
                            "Jornada Laboral" => ["select", "jornada", "", "required", $tiposJornadaLaboral, "modificarParametrosContrato()", ""],
                            "Salario" => ["input", "salario", "number", "required", ""],
                            "Enviar a" => ["input", "emailEnvio", "email", "required", $datosTrabajador["email"]],
                        ];

                        foreach ($camposContrato as $label => $datos) { ?>
                            <div class="col-md-6 mb-1 <?=$datos[6]?>">
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
                            <textarea class="form-control" id="funcionesCargo" onchange="modificarParametrosContrato()"></textarea>
                        </div>

                        <div class="col-md-12">
                            <label for="">Plantilla de Contrato <span class="text-primary">*</span></label>
                            <select id="plantillaContrato" style="width:100%" class="selectModalContrato" onchange="cambiarContenidoContrato(this); modificarParametrosContrato()" required> 
                                <option value="">Seleccione...</option>
                                <?php 
                                //$datosPlantillasContrato => viene del archivo ./datosNomina.php
                                foreach ($datosPlantillasContrato as $value) {
                                    echo '<option data-contenido="'.htmlspecialchars($value["contenido"]).'" value="'.$value["id"].'">'.$value["nombre"].'</option>';
                                }
                                ?>
                            </select>
                        </div>

                        <hr class="mt-2 mb-2">

                        <div class="col-md-12">
                            <label for="">Previsualizacion Contrato <small class="text-primary">*Seleccionar alguna plantilla</small> </label>
                        </div>

                        <div class="card col-md-12">
                            <!-- <textarea id="contenidoContrato" class="editorJR"></textarea> -->
                            <textarea id="contenidoContrato" class="tinymce"  data-tinymce="{}"></textarea>
                        </div>

                        <input type="hidden" id="id" value="0">
                        <input type="hidden" id="idTrabajador" value="<?=$idTrabajador?>">
                        <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                        <input type="hidden" id="firma" value="">
                        <input type="hidden" id="foto" value="">
                        <input type="hidden" id="documento" value="">
                        <input type="hidden" id="ipDiligenciamiento" value="">
                        <input type="hidden" id="fechaDiligenciamiento" value="">
                        <input type="hidden" id="horaDiligenciamiento" value="">
                        <input type="hidden" id="paisDiligenciamiento" value="">
                        <input type="hidden" id="ciudadDiligenciamiento" value="">
                        <input type="hidden" id="regionDiligenciamiento" value="">
                        <input type="hidden" id="coordenadasDiligenciamiento" value="">
                    </div>
                </div>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" id="button-save-ncontrato" onclick="guardarContrato()"><i class="fas fa-bookmark"></i> &nbsp; Guardar Contrato</button>
            </div>
        </div>
    </div>
</div>

<script>
    const datosReemplazarPlantilla = {
        "[FECHA_ACTUAL]" : "<?= date("Y-m-d") ?>", 
        "[FECHA_INICIO_CONTRATO]" : $("#modalNuevoContrato #fechaInicioContrato").val(), 
        "[FECHA_FIN_CONTRATO]" : $("#modalNuevoContrato #fechaFinContrato").val(), 
        "[TIPO_CONTRATO]" : $("#modalNuevoContrato #tipoContrato").val(), 
        "[NOMBRE_TRABAJADOR]" : "<?= $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"] ?>", 
        "[DOCUMENTO_TRABAJADOR]" : "<?= $datosTrabajador["numero_documento"] ?>", 
        "[CARGO_TRABAJADOR]" : $("#modalNuevoContrato #cargo").val(), 
        "[SALARIO_TRABAJADOR]" : $("#modalNuevoContrato #salario").val(),
        "[CIUDAD_TRABAJADOR]" : "<?= $datosTrabajador["ciudad"] ?>",
        "[DIRECCION_TRABAJADOR]" : "<?= $datosTrabajador["direccion"] ?>", 
        "[NOMBRE_EMPLEADOR]" : "", 
        "[DOCUMENTO_EMPLEADOR]" : "",
        "[CIUDAD_EMPLEADOR]" : "",
        "[DIRECCION_EMPLEADOR]" : "", 
        "[METODO_PAGO]" : ""
    };


    function modificarParametrosContrato() {
        let contenidoTextarea = obtenerContenidoDesdeIframe();
        if (contenidoTextarea.length < 10) return false;


        // console.log("Contenido de Textarea: => " + contenidoTextarea);
        
        // console.log("Objeto");
        // console.log(datosReemplazarPlantilla);
        

        for (const buscar in datosReemplazarPlantilla) {
            let reemplazar = datosReemplazarPlantilla[buscar];
            contenidoTextarea = contenidoTextarea.replace(buscar, reemplazar);
        }
        insertarContenido(contenidoTextarea)

    }


    function obtenerContenidoDesdeIframe() {
        const iframe = document.querySelector('#modalNuevoContrato #contenidoContrato_ifr'); // El iframe generado por TinyMCE
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const contenidoHTML = doc.body.innerHTML; // Obtener el HTML dentro del iframe
        console.log(contenidoHTML);
        return contenidoHTML;
    }

    function insertarContenido(contenidoHTML) {
        const iframe = document.querySelector('#modalNuevoContrato #contenidoContrato_ifr'); // ID del iframe generado por TinyMCE
        const doc = iframe.contentDocument || iframe.contentWindow.document; // Obtener el documento del iframe
        doc.body.innerHTML = contenidoHTML; // Esto inserta el HTML directamente en el iframe
    }

    function cambiarContenidoContrato(select) {
        let opcionSeleccionada = select.options[select.selectedIndex];
        let contenido = opcionSeleccionada.getAttribute("data-contenido");
        insertarContenido(contenido);
    }

    function validarDuracionContrato(valor) {
        if (valor == 'fijo') {
            $(".displayNone").css("display", "block");
        }else{
            $(".displayNone").css("display", "none");
        }
    }


   
    function guardarContrato() {
        let keys = [];
        var modalID = '#modalNuevoContrato';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });


        let data = {};
        for (const key in keys) {
            let elemento = $("#modalNuevoContrato #" + keys[key]);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos',
                })
                return false;
            }

            if ( keys[key] == "contenidoContrato") {
                data["contenidoContrato"] = obtenerContenidoDesdeIframe();
                continue;
            }


            let value = elemento.val() ;
            if (elemento.is(':checkbox')) {
                value = elemento.is(':checked') ? true : false;
            }

            data[keys[key]] = value;
        }

        data["action"] = data.id == 0 ? "crear" : "actualizar";

        console.log(data);
        // return false;


        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Nomina/Ajax/AjaxContratos.php",
            data,
            success: function(response) {
                let dataResponse = JSON.parse(response);
                const {icon,title,text} = dataResponse
                Swal.fire({icon,title,text,});

                if (dataResponse.error) {
                    console.log(dataResponse.error);
                    return;
                }

                // if (icon == "success") {
                //     setTimeout(() => {
                //         location.reload();
                //     }, 500);
                // }

            }
        });

        $("#modalNuevoContrato").modal('hide');
        resetmodalNuevoContrato();
        return data;
    }

    function resetmodalNuevoContrato() {
        $("#header-modal-ncontrado").html(`<i class="fas fa-briefcase"></i> Nuevo Contrato`);
        $("#button-save-ncontrato").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Contrato`);
        $("#id").val("0");
        let keys = [];
        var modalID = '#modalNuevoContrato';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                if (id != "id") {
                    keys.push(id);
                }

            }
        });
        for (const key in keys) {
            let elemento = $("#modalNuevoContrato #" + keys[key]);
            elemento.val("").change();
        }
    }

    function editarContrato(id) {
        $("#header-modal-ncontrado").html(`<i class="fas fa-wrench"></i> Editar Contrato`);
        $("#button-save-ncontrato").html(`<i class="fas fa-wrench"></i> Actualizar Contrato`);
        $("#modalNuevoContrato #id").val(id);

        const data = document.getElementById("data_contrato_" + id).value;
        const dataPrincipal = JSON.parse(data);
        for (const key in dataPrincipal) {
            let elemento = $("#modalNuevoContrato #" + key);
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

        $("#modalNuevoContrato").modal('show');
    }

    function borrarContrato(id) {
        Swal.fire({
            title: '¿Estas seguro de eliminar este contrato?',
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
                    url: "<?= $BASE ?>Nomina/Ajax/AjaxContratos.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        let dataResponse = JSON.parse(response);
                        const {icon,title,text} = dataResponse
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
                })

                $("#filaContrato" + id).remove();
            }
        })
    }

    $('#modalNuevoContrato').on('hidden.bs.modal', function() {
        resetmodalNuevoContrato();
    });

    $('#modalNuevoContrato').on('shown.bs.modal', function() {
        // setTimeout(() => {
        //     tinymce.init({
        //         selector: '.textareaE',
        //         plugins: 'lists link image table',
        //         toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
        //         height: 300
        //     });
        // }, 1000);
    });


    $(document).ready(function() {
        selectToModal("modalNuevoContrato", "selectModalContrato")
    })


</script>



<style>
    .displayNone {
        display: none;
    }
</style>