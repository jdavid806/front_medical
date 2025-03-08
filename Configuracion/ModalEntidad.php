<?= $isRequiredSign = "<font class='text-primary'>*</font>"; ?>

<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>


<div class="modal fade" id="modalEntidad" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addDealModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-entidad"> <i class="fas fa-building"></i> Nueva Entidad</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <svg class="svg-inline--fa fa-xmark text-danger" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <!-- Contenido de la página, se puede actualizar dinámicamente -->
                    <div id="pagina1" class="pagina col-md-12 row">
                        <div class="col-md-12 row">
                            <h4 class="mb-0 border-0 p-0 mb-2"> &nbsp;&nbsp;&nbsp; Datos de entidad</h4>
                            <!-- <div class="card">
                                <h5 class="card-header">Datos de entidad</h5>
                                <div class="card-body col-md-12 row"> -->
                            <?php
                            $array_Campos = [
                                "Nombre de la Entidad" => ["text", "nombreEntidad", $datosEmpresa["nombre"], true],
                                "NIT" => ["text", "nit", $datosEmpresa["nit"], true],
                                "DV" => ["text", "dv", "", true],
                                "Email FE" => ["email", "emailFE", "", true],
                                "Dirección" => ["text", "direccion", "", true],
                                "Teléfono" => ["text", "telefono", "", true],
                                "Celular" => ["text", "celular", "", true],
                                "Ciudad" => ["text", "ciudad", "", true],
                            ];

                            foreach ($array_Campos as $key => $value) { ?>
                                <div class="col-md-4 mb-1"> <!-- Ajusta aquí el tamaño y el espaciado -->
                                    <label class="mb-0"><?= $key ?> <?= ($value[3]) ? $isRequiredSign : "" ?></label>
                                    <input <?= (($value[3]) ? "required" : "") ?> class="form-control" value="<?= $value[2] ?>" type="<?= $value[0] ?>" id="<?= $value[1] ?>" placeholder="" />
                                </div>
                            <?php } ?>

                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Actividad Económica <?= $isRequiredSign ?></label>
                                <select STYLE="width:100%" class="select2ModalConfig form-select" id="actividadEconomica" required>
                                    <?php
                                    // $options = ["Agropecuaria", "Desarrollo de Software", "Manufactura", "Comercio", "Servicios"];
                                    // foreach ($options as $key => $value) {
                                    //     echo "<option value='$key'>$value</option>";
                                    // }

                                    foreach ($dataActividadEconomica as $rowActividadEconomica) {
                                        echo "<option value='{$rowActividadEconomica["id"]}'>{$rowActividadEconomica["codigo"]} - {$rowActividadEconomica["descripcion"]}</option>";
                                    }

                                    ?>
                                </select>
                            </div>

                            <div class="col-md-4 mb-1">
                                <label class="mb-0">Tipo Persona</label>
                                <select STYLE="width:100%" class="select2ModalConfig form-select" id="tipoPersona" required>
                                    <?php
                                    $options = ["Natural", "Juridica"];
                                    foreach ($options as $key => $value) {
                                        echo "<option value='$key'>$value</option>";
                                    }
                                    ?>
                                </select>
                            </div>

                            <!-- </div>
                            </div> -->

                        </div>




                    </div>


                    <div id="pagina2" class="pagina" style="display: none; width:100%">
                        <div class="col-md-12">
                            <h4 class="mb-0 border-0 p-0 mb-2">Procedimientos</h4>
                            <!-- <div class="card" style="width:100%">
                                <div class="card-body col-md-12 row"> -->
                            <div class="col-md-12">
                                <label for=""></label>
                                <select style="width:100%" class="select2Modal" multiple id="ArrayProcedimientos" style="width:100%" onchange="enlistarProcedimientos()">
                                    <?php
                                    foreach ($dataProcedimientos as $value) {
                                        $json = [
                                            "precio" => $value["precio"],
                                            "codigo_cups" => $value["codigo_cups"],
                                            "nombreProcedimiento" => $value["nombreProcedimiento"],
                                            "id" => $value["id"],
                                        ];

                                        $json = json_encode($json);

                                        echo '<option data-json=\'' . $json . '\' value="' . $value["id"] . '">' . $value["codigo_cups"] . ' - ' . $value["nombreProcedimiento"] . '</option>';
                                    }
                                    ?>
                                </select>
                            </div>

                            <div id="procedimientosTablaContainer" class="col-md-12">
                                <table id="procedimientosTabla" class="table">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Valor Entidad</th>
                                            <th>Aplica copago</th>
                                            <th>Porcentaje Copago</th>
                                            <th>Copago descuenta</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-procedimientos-editar"></tbody>
                                    <tbody id="tbody-procedimientos"></tbody>
                                </table>
                            </div>

                            <!-- </div>
                            </div> -->

                        </div>

                    </div>

                </div>

                <div class="col-md-12 row mt-3">
                    <div class="col-md-6"></div>
                    <div class="col-md-6 text-end">
                        <button type="button" class="btn btn-primary btn-sm col-md-3" id="btn-anterior" onclick="paginacion('anterior')"> <i class="fas fa-angle-left"></i> &nbsp; Anterior</button>
                        <button type="button" class="btn btn-primary btn-sm col-md-3" id="btn-siguiente" onclick="paginacion('siguiente')">Siguiente &nbsp; <i class="fas fa-angle-right"></i> </button>
                    </div>
                </div>

            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button class="btn btn-primary my-0" onclick="guardarEntidad()" id="button-save-entidad"> <i class="fas fa-bookmark"></i> &nbsp; Crear Entidad</button>
            </div>
        </div>
    </div>
</div>


<script>
    let paginaActual = 1;

    function paginacion(direccion) {
        const pagina1 = document.getElementById('pagina1');
        const pagina2 = document.getElementById('pagina2');

        if (direccion === 'siguiente') {
            if (paginaActual === 1) {
                paginaActual++;
                pagina1.style.display = 'none';
                pagina2.style.display = 'flex';
            }
        } else if (direccion === 'anterior') {
            if (paginaActual === 2) {
                paginaActual--;
                pagina1.style.display = 'flex';
                pagina2.style.display = 'none';
            }
        }
    }



    function enlistarProcedimientos() {
        let selectedValues = $("#ArrayProcedimientos").val();
        let tableBody = $("#procedimientosTabla #tbody-procedimientos");
        tableBody.empty(); // Limpiar la tabla antes de llenarla

        selectedValues.forEach(value => {
            // Obtener la opción seleccionada usando el valor
            let option = $(`#ArrayProcedimientos option[value="${value}"]`);
            let dataJson = option.data('json'); // Obtener el data-json

            // Crear una nueva fila
            let newRow = `<tr>
                                <td>${dataJson.codigo_cups}</td>
                                <td>${dataJson.nombreProcedimiento}</td>
                                <td>
                                    <input type="number" class="form-control" value="${dataJson.precio}" name="Array[${dataJson.id}][precio]">
                                    <input type="hidden" class="form-control" value="${dataJson.id}" name="Array[${dataJson.id}][id]">
                                </td>
                                <td>
                                    <input type=number" class="form-control" value="${dataJson.precio/2}" name="Array[${dataJson.id}][valorEntidad]">
                                </td>
                                <td>
                                    <div class="form-check form-switch text-center">
                                        <input class="form-check-input" type="checkbox" name="Array[${dataJson.id}][aplicaCopago]" id="flexSwitchCheckDefault">
                                    </div>
                                </td>
                                <td>
                                    <input class="form-control" value="0" name="Array[${dataJson.id}][porcentajeCopago]">
                                </td>
                                <td>
                                    <div class="form-check form-switch text-center">
                                        <input class="form-check-input" type="checkbox" name="Array[${dataJson.id}][copagoDescuenta]" id="flexSwitchCheckDefault">
                                    </div>
                                </td>
                                <td></td>
                            </tr>`;

            // Agregar la nueva fila a la tabla
            tableBody.append(newRow);
        });
    }


    function guardarEntidad() {
        let selectedValues = $("#ArrayProcedimientos").val();
        let campos = ["nombreEntidad", "nit", "dv", "emailFE", "direccion", "telefono", "celular", "ciudad", "actividadEconomica", "tipoPersona", "idUsuario" ,"id"];
        let data = {};
        let next = true;

        campos.forEach(key => {
            if (!next) return;

            let elemento = $(`#modalEntidad #${key}`);

            // Verifica si el campo es requerido y está vacío
            if (elemento.attr("required") && elemento.val() === "") {
                next = false;
                // alert(`${key} es un campo requerido.`); // Mensaje de alerta o manejar como desees
                return;
            }

            data[key] = elemento.val();
        });


        if (!next) {
            Swal.fire({
                title: "Error",
                text: "Por favor, llene todos los campos requeridos de empresa",
                icon: "error"
            });
            $("#btn-anterior").click();
            return;
        };


        let procedimientos = {};
        let indiceObjetoProcedimientos = 0;
        selectedValues.forEach((id) => {
            if (!next) return;
            let precio = $(`#modalEntidad #tbody-procedimientos input[name="Array[${id}][precio]"]`).val();
            let idValue = $(`#modalEntidad #tbody-procedimientos input[name="Array[${id}][id]"]`).val(); // Cambié el nombre de la variable para evitar conflicto
            let valorEntidad = $(`#modalEntidad #tbody-procedimientos input[name="Array[${id}][valorEntidad]"]`).val();
            let porcentajeCopago = $(`#modalEntidad #tbody-procedimientos input[name="Array[${id}][porcentajeCopago]"]`).val();
            let aplicaCopago = $(`#modalEntidad #tbody-procedimientos input[name="Array[${id}][aplicaCopago]"]`).is(':checked');
            let copagoDescuenta = $(`#modalEntidad #tbody-procedimientos input[name="Array[${id}][copagoDescuenta]"]`).is(':checked');

            // Validar si hay algún espacio vacío
            if (!precio || !idValue || !valorEntidad || !porcentajeCopago) {
                console.warn(`Hay un campo vacío para el id: ${id}`);
                next = false;
                return; // O puedes manejarlo de otra forma
            }

            const procedimiento = {
                idProcedimiento: idValue,
                precio,
                valorEntidad,
                porcentajeCopago,
                aplicaCopago,
                copagoDescuenta
            };

            procedimientos[indiceObjetoProcedimientos] = procedimiento;
            indiceObjetoProcedimientos += 1;
        });


        $("#modalEntidad #tbody-procedimientos-editar tr").each(function() {
            let fila = $(this);
            let idFila = fila.attr("id");
            let indiceFilaE = idFila.replace("filaPEditar", "");
            
            let precio = $(`#modalEntidad #tbody-procedimientos-editar input[name="Array[${indiceFilaE}][precio]"]`).val();
            let idValue = $(`#modalEntidad #tbody-procedimientos-editar input[name="Array[${indiceFilaE}][id]"]`).val(); // Cambié el nombre de la variable para evitar conflicto
            let valorEntidad = $(`#modalEntidad #tbody-procedimientos-editar input[name="Array[${indiceFilaE}][valorEntidad]"]`).val();
            let porcentajeCopago = $(`#modalEntidad #tbody-procedimientos-editar input[name="Array[${indiceFilaE}][porcentajeCopago]"]`).val();
            let aplicaCopago = $(`#modalEntidad #tbody-procedimientos-editar input[name="Array[${indiceFilaE}][aplicaCopago]"]`).is(':checked');
            let copagoDescuenta = $(`#modalEntidad #tbody-procedimientos-editar input[name="Array[${indiceFilaE}][copagoDescuenta]"]`).is(':checked');

            // Validar si hay algún espacio vacío
            if (!precio || !idValue || !valorEntidad || !porcentajeCopago) {
                console.warn(`Hay un campo vacío para el id: ${indiceFilaE}`);
                console.log("precio => " + precio);
                console.log("idValue => " + idValue);
                console.log("valorEntidad => " + valorEntidad);
                console.log("porcentajeCopago => " + porcentajeCopago);
                next = false;
                return; // O puedes manejarlo de otra forma
            }

            const procedimiento = {
                idProcedimiento: idValue,
                precio,
                valorEntidad,
                porcentajeCopago,
                aplicaCopago,
                copagoDescuenta
            };

            procedimientos[indiceObjetoProcedimientos] = procedimiento;
            indiceObjetoProcedimientos += 1;
        });

        if (!next) {
            Swal.fire({
                title: "Error",
                text: "Por favor, llene todos los campos requeridos de procedimientos",
                icon: "error"
            });
            $("#btn-siguiente").click();
            return;
        };


        data.procedimientos = procedimientos;
        data["action"] = data.id == 0 ? "crear" : "actualizar";

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>Configuracion/Ajax/AjaxEntidad.php",
            data,
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



        $("#modalEntidad").modal('hide');
        resetModalEntidad();

        console.log(data);
        return data;

    }

    function resetModalEntidad() {
        const tbodyTarifas = document.getElementById('tbody-procedimientos');
        tbodyTarifas.innerHTML = ''; // Limpia las filas existentes
        $("#header-modal-entidad").html(`<i class="fas fa-building"></i> Nueva Entidad`);
        $("#button-save-entidad").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Entidad`);
        $("#id").val("0");
        let select = $("#ArrayProcedimientos");
        select.val("0").change();

        let campos = ["nombreEntidad", "nit", "dv", "emailFE", "direccion", "telefono", "celular", "ciudad", "actividadEconomica", "tipoPersona"];
        campos.forEach(key => {
            let elemento = $(`#modalEntidad #${key}`);
            elemento.val("");
        });

    }

    function eliminarEntidad(id) {
        Swal.fire({
            title: '¿Deseas eliminar esta entidad?',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "<?= $BASE ?>Configuracion/Ajax/AjaxEntidad.php",
                    data: {
                        action: "eliminar",
                        id
                    },
                    success: function(response) {
                        console.log(response);
                        
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
                $("#modalEntidad #row-" + index).remove();
            }
        })
    }



    function editarEntidad(nit, id) {
        // Obtiene el valor del campo oculto

        // ? MODO ACTUALIZAR
        $("#modalEntidad #header-modal-entidad").html(`<i class="fas fa-wrench"></i> Editar Entidad`);
        $("#modalEntidad #button-save-entidad").html(`<i class="fas fa-wrench"></i> Actualizar Entidad`);
        $("#modalEntidad #id").val(id);
        // ? MODO ACTUALIZAR



        const data = document.getElementById("data_empresa_" + id).value;

        const dataPrincipal = JSON.parse(data);
        console.log("dataPrincipal");
        console.log(dataPrincipal);

        for (const key in dataPrincipal) {
            if (key === 'procedimientosData') continue;
            let value = dataPrincipal[key];
            $(`#modalEntidad #${key}`).val(value).change();

        }

        const { procedimientosData} = JSON.parse(data);
        let select = $("#ArrayProcedimientos");
        select.val("0").change()

        const tbodyTarifas = document.getElementById('tbody-procedimientos-editar');
        tbodyTarifas.innerHTML = ''; // Limpia las filas existentes

        console.log(procedimientosData);


        let selecteds = [];
        for (const key in procedimientosData) {
            let dataP = procedimientosData[key];
            selecteds.push(dataP.id);
        }

        // $('#ArrayProcedimientos').val(selecteds).change();
        // $('#ArrayProcedimientos').val(selecteds);

        for (const key in procedimientosData) {
            let dataP = procedimientosData[key];

            console.log("Iterando en el procedimiento: la key es=> ", key);
            console.log("La data es ");
            console.log(dataP);
            
            // Ensure dataP has the necessary properties
            if (dataP) {
                let filaAgregar = `<tr id="filaPEditar${dataP.id}">
                                        <td>${dataP.codigo_cups}</td>
                                        <td>${dataP.nombreProcedimiento}</td>
                                        <td>
                                            <input type="number" class="form-control" value="${dataP.precio}" name="Array[${dataP.id}][precio]">
                                            <input type="hidden" class="form-control" value="${dataP.id}" name="Array[${dataP.id}][id]">
                                        </td>
                                        <td>
                                            <input type=number" class="form-control" value="${dataP.valorEntidad}" name="Array[${dataP.id}][valorEntidad]">
                                        </td>
                                        <td>
                                            <div class="form-check form-switch text-center">
                                                <input class="form-check-input" type="checkbox" ${dataP.aplicaCopago=='true'?"checked":""} name="Array[${dataP.id}][aplicaCopago]" id="flexSwitchCheckDefault">
                                            </div>
                                        </td>
                                        <td>
                                            <input class="form-control" value="${dataP.porcentajeCopago}" name="Array[${dataP.id}][porcentajeCopago]">
                                        </td>
                                        <td>
                                            <div class="form-check form-switch text-center">
                                                <input class="form-check-input" type="checkbox" ${dataP.copagoDescuenta=='true'?"checked":""} name="Array[${dataP.id}][copagoDescuenta]" id="flexSwitchCheckDefault">
                                            </div>
                                        </td>
                                        <td>
                                            <i class="fas fa-trash" onclick="eliminarProcedimientoFila(${dataP.id})"></i>
                                        </td>
                                    </tr>`;

                    tbodyTarifas.innerHTML += filaAgregar;

                    // console.log("Entrando... ");
                    // $(`input[name="Array[${dataP.id}][precio]"]`).val(dataP.precio);
                    // $(`input[name="Array[${dataP.id}][id]"]`).val(dataP.id);
                    // $(`input[name="Array[${dataP.id}][valorEntidad]"]`).val(dataP.valorEntidad);
                    // $(`input[name="Array[${dataP.id}][porcentajeCopago]"]`).val(dataP.porcentajeCopago); // Fixed typo
                    // $(`input[name="Array[${dataP.id}][aplicaCopago]"]`).attr('checked', dataP.aplicaCopago == 'true' ? true : false);
                    // $(`input[name="Array[${dataP.id}][copagoDescuenta]"]`).attr('checked', dataP.copagoDescuenta == 'true' ? true : false);
            } else {
                console.warn(`No data found for key: ${key}`);
            }
        }
        // Mostrar el modal, si es necesario
        $("#modalEntidad").modal('show'); // Si usas Bootstrap para mostrar el modal
    }

    function eliminarProcedimientoFila(id) {
        Swal.fire({
            title: '¿Estás seguro de eliminar este procedimiento?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminarlo'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#modalEntidad #filaPEditar" + id).remove();
            }
        })


    }


</script>
<style>
    /* Asegúrate de que el select2 tenga un z-index alto */
    .select2-container--default .select2-selection--single {
        z-index: 9999 !important;
        /* Aumenta el z-index */
    }

    .select2-container--default .select2-selection--multiple {
        z-index: 9999 !important;
        /* Aumenta el z-index para selección múltiple */
    }

    .select2-container {
        z-index: 9999 !important;
        /* Aumenta el z-index del contenedor select2 */
    }
</style>

<script>
    $(document).ready(function() {
        selectToModal("modalEntidad", "select2Modal");

        $('#modalEntidad').on('hidden.bs.modal', function() {
            resetModalEntidad()
        });

    });
</script>