<?php $isRequiredSign = '<font class="text-primary">*</font>'; ?>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<div class="modal fade" id="modalReclutamientoPuesto" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addPuestoModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-puesto"><i class="fas fa-briefcase"></i> Nuevo Puesto de Trabajo</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">

                    <div id="modal-puestotrabajo-page-1">
                        <h4 class="mb-3" id=""><i class="fas fa-info"></i> Datos generales</h4>

                        <div class="pagina col-md-12 row">
                            <!-- Título -->
                            <div class="col-md-6 mb-1">
                                <label class="mb-0">Puesto de trabajo <?= $isRequiredSign ?></label>
                                <select  style="width:100%" class="selectPuestroTrabajo" required id="titulo">
                                    <option value="">Seleccione...</option>
                                    <?php 
                                    foreach ($datosCargos as $key => $cargo) {
                                        echo "<option value='{$cargo['id']}'>{$cargo['codigo']} - {$cargo['nombre']}</option>";
                                    }
                                    ?>
                                </select>
                            </div>
                            
                            <!-- Tipo de trabajo -->
                            <div class="col-md-6 mb-1">
                                <label class="mb-0">Tipo de Trabajo <?= $isRequiredSign ?> <i onclick="mostrarTipoTrabajo()" class="fa-solid fa-circle-plus" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMaster" aria-controls="offcanvasMaster"></i> </label>
                                <select style="width:100%" required class="selectPuestroTrabajo" id="tipoTrabajo">
                                    <option value="">Seleccione...</option>
                                    <?php 
                                    foreach ($tiposTrabajo as $tipoT) {
                                        echo "<option value='{$tipoT['id']}'>{$tipoT['nombre']}</option>";
                                    }
                                    ?>
                                </select>
                            </div>
                            
                            <!-- Designación -->
                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Salario <?= $isRequiredSign ?></label>
                                <input required class="form-control" type="text" id="designacion" placeholder="Ingrese la designación" />
                            </div>
                            
                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Fecha de Cierre <?= $isRequiredSign ?></label>
                                <!-- <input required class="form-control datetimepicker flatpickr-input" type="date" id="fechaCierre" /> -->
                                <input required class="form-control" type="date" id="fechaCierre" />
                            </div>

                            <!-- Estado Publicado -->
                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Estado</label>
                                <!-- <select data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}' style="width:100%" class="form-select selectPuestroTrabajo" id="estadoPublicado"> -->
                                <select style="width:100%" class="selectPuestroTrabajo" id="estadoPublicado">
                                    <option value="Publicado">Publicado</option>
                                    <option value="No Publicado">No Publicado</option>
                                </select>
                            </div>
                            
                            <!-- Fecha de Cierre -->
                            
                            <!-- Número de posiciones -->
                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Vacantes <?= $isRequiredSign ?></label>
                                <input required class="form-control" type="number" id="numPosiciones" placeholder="Ingrese el número de posiciones" />
                            </div>

                            <!-- Género -->
                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Género</label>
                                <select style="width:100%" class="selectPuestroTrabajo" id="genero">
                                    <option value="Cualquiera">Cualquiera</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                </select>
                            </div>
                            
                            <!-- Experiencia mínima -->
                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Experiencia <i onclick="mostrarExperiencia()" class="fa-solid fa-circle-plus" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMaster" aria-controls="offcanvasMaster"></i></label>
                                <!-- <select style="width:100%" class="form-select selectPuestroTrabajo" id="experienciaMinima"> -->
                                <select style="width:100%" class="selectPuestroTrabajo" id="experienciaMinima">
                                    <?php 
                                    foreach ($tiposExperiencia as $tipoE) {
                                        echo "<option value='{$tipoE['id']}'>{$tipoE['experienceYear']}</option>";
                                    }
                                    
                                    ?>
                                </select>
                            </div>
                            
                            <!-- Descripción breve -->
                            <div class="col-md-12 mb-1">
                                <label class="mb-0">Descripción Breve <?=$isRequiredSign?></label>
                                <input type="text" id="descripcionBreve" class="form-control" placeholder="Ingrese una breve descripción">
                                <!-- <textarea style="height: 100px" id="descripcionBreve" class="form-control" placeholder="Ingrese una breve descripción"></textarea> -->
                            </div>
                            
                            <!-- Descripción larga -->
                            <div class="col-md-12 mb-1">
                                <label class="mb-0">Descripción Larga <?=$isRequiredSign?></label>
                                <textarea style="height: 150px" id="descripcionLarga" class="form-control" placeholder="Ingrese una descripción detallada"></textarea>
                            </div>
                        </div>
                    </div>
                    <div id="modal-puestotrabajo-page-2">
                        <h4 class="mb-3" id=""><i class="fas fa-chart-line"></i> Parametros de Evaluación</h4>

                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th style="width: 30% !important;">Parametro <i title="Agregar / Guardar Parametro de Evaluacion" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMaster" aria-controls="offcanvasMaster" onclick="agregarNuevoParametro()" class="fa fa-plus-circle"></i></th>
                                    <th style="width: 60% !important;">Porcentaje de Importancia (Deben sumar 100%)</th>
                                    <th style="width: 10% !important;"> <i title="Agregar Parametro libre" onclick="addFilaFechasParametroEvaluacionLibre()" class="fas fa-plus"></i> </th>
                                </tr>
                            </thead>
                            <tbody id="tbody-lista-parametros-evaluacion">

                            </tbody>
                        </table>
                                

                    </div>


                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?=$_SESSION['ID']?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <div class="col-md-12 row">
                    <div class="col-md-6 p-0 text-start" id="paginacionModal"></div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                        <button class="btn btn-primary my-0" onclick="guardarPuesto()" id="button-save-puesto"><i class="fas fa-bookmark"></i> &nbsp; Crear Puesto</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<script>

    let optionsParametrosEvaluacion = '<option value="">Seleccione...</option>';


    function obtenerOptionsParametrosEvaluacion() {
        // console.log("Funcion ejecutada");
        
        $.ajax({
            url: "<?=$BASE?>Nomina/Reclutamiento/Ajax/AjaxParametrosEvaluacion.php",
            method: "POST",
            data:{
                action: 'obtenerOptions',
                idUsuario: '<?=$_SESSION["ID"]?>'
            },
            success: function(data) {
                // console.log("Funcion response " , data);
                
                optionsParametrosEvaluacion = data;
            }
        })        
    }


    obtenerOptionsParametrosEvaluacion();



    function agregarNuevoParametro() {
        let ajax = "<?=$BASE?>Nomina/Reclutamiento/Ajax/AjaxParametrosEvaluacion.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: null,
                        modal: null,
                        element: null,
                        visible: null,
                        callback: 'obtenerOptionsParametrosEvaluacion'
                    };

        // console.log("El inner es ", inner);
        

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Parametro de Evaluacion</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Nuevo Parametro de Evaluacion',
                            icon    : 'fas fa-plus',
                            reload  : false,
                            inner,
                            callback: 'obtenerOptionsParametrosEvaluacion'
                        }

        drawContentOffCanvas(objeto);
    }


    let indiceParametrosEvaluacion = 0;
    function addFilaFechasParametroEvaluacion() {
        const fila = `  <tr id="filaParametrosEvaluacion-${indiceParametrosEvaluacion}">
                            <td>
                                <select class="selectPuestroTrabajo" onchange="validarFilaAutomaticaParamEvaluacion(${indiceParametrosEvaluacion})" name="detalleParametroEvaluacion[${indiceParametrosEvaluacion}][parametro]" style="width:100%">
                                    ${optionsParametrosEvaluacion}
                                </select>
                            </td>
                            <td>
                                <label id="labelRange${indiceParametrosEvaluacion}">0%</label>
                                <input type="range" step="5" onchange="$('#labelRange${indiceParametrosEvaluacion}').html(this.value + '%')" value="0" min="0" max="100" class="form-range" onchange="validarFilaAutomaticaParamEvaluacion(${indiceParametrosEvaluacion})" name="detalleParametroEvaluacion[${indiceParametrosEvaluacion}][porcentaje]" style="width:100%">
                            </td>
                            <td>
                                <i class="fas fa-trash-alt text-danger" onclick="eliminarFilaParametrosEvaluacion('filaParametrosEvaluacion-${indiceParametrosEvaluacion}')"></i>
                            </td>
                        </tr>`;
        indiceParametrosEvaluacion += 1;
        $("#tbody-lista-parametros-evaluacion").append(fila);
        selectToModal("modalReclutamientoPuesto","selectPuestroTrabajo");
    }

    function addFilaFechasParametroEvaluacionLibre() {
        const fila = `  <tr id="filaParametrosEvaluacion-${indiceParametrosEvaluacion}">
                            <td>    
                                <input class="form-control" onchange="validarFilaAutomaticaParamEvaluacion(${indiceParametrosEvaluacion})" name="detalleParametroEvaluacion[${indiceParametrosEvaluacion}][parametro]" style="width:100%">
                            </td>
                            <td>
                                <label id="labelRange${indiceParametrosEvaluacion}">0%</label>
                                <input type="range" step="5" value="0" min="0" onchange="$('#labelRange${indiceParametrosEvaluacion}').html(this.value + '%')" max="100" class="form-range" onchange="validarFilaAutomaticaParamEvaluacion(${indiceParametrosEvaluacion})" name="detalleParametroEvaluacion[${indiceParametrosEvaluacion}][porcentaje]" style="width:100%">
                            </td>
                            <td>
                                <i class="fas fa-trash-alt text-danger" onclick="eliminarFilaParametrosEvaluacion('filaParametrosEvaluacion-${indiceParametrosEvaluacion}')"></i>
                            </td>
                        </tr>`;
        indiceParametrosEvaluacion += 1;
        $("#tbody-lista-parametros-evaluacion").append(fila);
        selectToModal("modalReclutamientoPuesto","selectPuestroTrabajo");
    }

    function validarFilaAutomaticaParamEvaluacion(indice) {
        let mes = $(`select[name="detalleParametroEvaluacion[${indice}][parametro]"]`);
        let dia = $(`input[name="detalleParametroEvaluacion[${indice}][porcentaje]"]`);
        let fila = $(`#filaParametrosEvaluacion-${indice+1}`);
        if (mes.val() != "" && dia.val() != "" && fila.length == 0) {
            addFilaFechasParametroEvaluacion();
        }
    }


    function eliminarFilaParametrosEvaluacion(idFila) {
        $("#" + idFila).remove();
    }



    function guardarPuesto() {
        // console.log(`Funcion activa`);
        
        
        // let keys = [];
        // $("#modalReclutamientoPuesto input,seolect,textarea").each(function() {
            //     $(this).attr("id") && keys.push($(this).attr("id"));
            // });
            
        // let keys = ["titulo", "tipoTrabajo", "designacion", "numPosiciones", "estadoPublicado", "fechaCierre", "genero", "experienciaMinima", "descripcionBreve", "descripcionLarga", "id"];
        let keys = [];
        var modalID = '#modalReclutamientoPuesto';
        $(modalID).find('input, textarea, select').each(function() {
            var id = $(this).attr('id');
            if (id) {
                keys.push(id);
            }
        });
        
        let data = {};
        for (const key in keys) {
            let elemento = $("#modalReclutamientoPuesto #"+ keys[key]);
            if (elemento.val() == "" && elemento.attr("required") != undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes rellenar todos los campos obligatorios',
                });
                return false;
            }
            data[keys[key]] = elemento.val();
        }


        let tieneParametros = false;
        let detalleParametros = [];
        let totalParametros = 0;
        $(`#modalReclutamientoPuesto #tbody-lista-parametros-evaluacion tr`).each(function() {
            let idFila = $(this).attr("id");
            let indice = idFila.replace("filaParametrosEvaluacion-", "");

            let parametro = $(`select[name="detalleParametroEvaluacion[${indice}][parametro]"]`);

            if (parametro.length == 0) {
                parametro = $(`input[name="detalleParametroEvaluacion[${indice}][parametro]"]`);
            }


            parametro = parametro.val();

            if(parametro !=  "") {
                let porcentaje = $(`input[name="detalleParametroEvaluacion[${indice}][porcentaje]"]`).val();
                totalParametros += parseInt(porcentaje);

                const parametroEvaluacion = {
                    parametro,
                    porcentaje
                };

                // console.log("parametroEvaluacion" , parametroEvaluacion);
                
    
                tieneParametros = true;
                detalleParametros.push(parametroEvaluacion);
            }



        })

        if (totalParametros != 100 && tieneParametros) {
            Swal.fire({ icon: "error",
                        title: "Error",
                        text: "Los parametros deben sumar exactamente 100%, ten en cuenta que las filas cuyo parametro sea vacio no seran tenidas en cuenta"
                    });

            return false;
        }


        data["action"] = data["id"] == 0 ? "crear" : "actualizar";
        data["parametros"] = JSON.stringify(detalleParametros);

        // console.log(data);
        // return;

        $.ajax({
            type: "POST",
            url: "<?=$BASE?>Nomina/Reclutamiento/Ajax/Ajax_PuestoTrabajo.php",
            data,
            success: function (response) {
                // console.log(response);
                const dataJson = JSON.parse(response);
                const {icon, title, text} = dataJson; 
                Swal.fire({icon,title,text});
                if (dataJson.error) {
                    console.log(dataJson.error);
                }

                if (icon == "success")  {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }else{
                    return false;
                }

            }, 
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        })


        // console.log(data); // Aquí puedes enviar los datos al servidor o procesarlos como necesites.
        $("#modalReclutamientoPuesto").modal('hide');
        resetModalNuevoPuesto();
        // Swal.fire({
        //     icon: 'success',
        //     title: 'Correcto',
        //     text: 'Puesto de trabajo guardado correctamente',
        // });
        return data;
    }

    function resetModalNuevoPuesto() {
        $("#modalReclutamientoPuesto #header-modal-puesto").html(`<i class="fas fa-briefcase"></i> Nuevo Puesto de Trabajo`);
        $("#modalReclutamientoPuesto #button-save-puesto").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Puesto`);
        $("#modalReclutamientoPuesto #id").val("0");

        $(`#modalReclutamientoPuesto #tbody-lista-parametros-evaluacion`).html("");
        indiceParametrosEvaluacion = 0;


        let keys = ["titulo", "tipoTrabajo", "designacion", "numPosiciones", "estadoPublicado", "fechaCierre", "genero", "experienciaMinima", "descripcionBreve", "descripcionLarga"];
        for (const key in keys) {
            let elemento = $("#modalReclutamientoPuesto #"+ keys[key]);
            elemento.val("").change();
        }
    }

    function editarPuesto(id, index) {
        $("#modalReclutamientoPuesto #header-modal-puesto").html(`<i class="fas fa-wrench"></i> Editar Puesto de Trabajo`);
        $("#modalReclutamientoPuesto #button-save-puesto").html(`<i class="fas fa-wrench"></i> Actualizar Puesto`);
        $("#modalReclutamientoPuesto #id").val(id);

        const data = document.getElementById("data_puesto_" + index).value;
        const dataPrincipal = JSON.parse(data);
        // console.log(dataPrincipal);
        
        for (const key in dataPrincipal) {
            if (key == 'parametros') continue;
            let elemento = $("#modalReclutamientoPuesto #"+ key);
            elemento.val(dataPrincipal[key]).change();
        }

        const parametros = JSON.parse(dataPrincipal.parametros);
        for (const key in parametros) {
            let indiceDetalle = indiceParametrosEvaluacion;

            const detalleParametro = parametros[key];
            const {parametro, porcentaje} = detalleParametro;
            addFilaFechasParametroEvaluacionLibre();

            setTimeout(() => {                
                $(`input[name="detalleParametroEvaluacion[${indiceDetalle}][parametro]"]`).val(parametro).change();
                $(`input[name="detalleParametroEvaluacion[${indiceDetalle}][porcentaje]"]`).val(porcentaje).change();
            }, 500);
        }



        $("#modalReclutamientoPuesto").modal('show');
    }

    function eliminarPuesto(id) {
        Swal.fire({
            title: '¿Estás seguro de eliminar este puesto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

            $.ajax({
                type: "POST",
                url: "<?=$BASE?>Nomina/Reclutamiento/Ajax/Ajax_PuestoTrabajo.php",
                data: {
                    id, 
                    action: "eliminar"
                },
                success: function (response) {
                    // console.log(response);
                    const dataJson = JSON.parse(response);
                    const {icon, title, text} = dataJson; 
                    Swal.fire({icon,title,text});
                    if (dataJson.error) {
                        console.log(dataJson.error);
                    }

                    if (icon == "success")  {
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    }else{
                        return false;
                    }

                }, 
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                }
            })
                $("#rowpuesto-" + id).remove();
            }
        })
    }

    function mostrarTipoTrabajo() {
        let ajax = "<?=$BASE?>Nomina/Reclutamiento/Ajax/AjaxTipoTrabajo.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'tipoTrabajo',
                        modal: 'modalReclutamientoPuesto',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Tipo de Trabajo</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Nuevo tipo de trabajo',
                            icon    : 'fas fa-plus',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }
    
    function mostrarExperiencia() {
        let ajax = "<?=$BASE?>Nomina/Reclutamiento/Ajax/AjaxTipoExperiencia.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id       : 'experienciaMinima',
                        modal    : 'modalReclutamientoPuesto',
                        element  : '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible  : "experienceYear"


                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Años de experiencia</label>
                                <input class='form-control' id="experienceYear">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`;

        let objeto =    { 
                            html    : content,
                            title   : 'Nuevo tipo de trabajo',
                            icon    : 'fas fa-plus',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }
    
    $(document).ready(function() {
        $('#modalReclutamientoPuesto').on('hidden.bs.modal', function() {
            resetModalNuevoPuesto();
        });

        $('#modalReclutamientoPuesto').on('show.bs.modal', function() {
            addFilaFechasParametroEvaluacion();
        });


        paginacionModal("modalReclutamientoPuesto", "modal-puestotrabajo-page-", 2)


        setTimeout(() => {
            selectToModal("modalReclutamientoPuesto","selectPuestroTrabajo");
            // console.log("SelectModalActivado");
            
        }, 2000);
    });
</script>


<style>
    #tbody-lista-parametros-evaluacion td {
        padding: 15px;
    }
</style>