<div class="modal fade" id="modalNuevoTrabajador" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addTrabajadorModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-trabajador"><i class="fas fa-user"></i> Nuevo Trabajador</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <!-- <div id="contenido-pagina"> -->
                <div id="modal-personas-page-1">
                    <div class="pagina col-md-12 row">
                        <div class="card">
                            <h5 class="card-header"> <i class="fas fa-info"></i> Datos del Trabajador</h5>
                            <div class="container text-center mt-1">
                                <!-- <h5>Cargar Imagen de Empleado</h5> -->
                                <img id="profileImage" class="profile-pic" src="https://via.placeholder.com/150" alt="Imagen de Perfil">
                                <input type="hidden" value="" id="imagenPerfilBase64">

                                <div class="upload-btn-wrapper">
                                    <button class="btn-upload">Subir Imagen</button>
                                    <input type="file" id="imageUpload" accept="image/*">
                                </div>

                                <!-- <div class="mt-3">
                                    <small class="text-muted">Sube una imagen de perfil para el empleado. Tamaño máximo: 5MB</small>
                                </div> -->
                            </div>


                            <div class="card-body col-md-12 row">
                                <?php

                                $camposTrabajador = [
                                    //NombreLabel = [ 0 => Tipo , 1 => ID , TipoInput => 2, Required => 3, ValoresSelect => 4 ]
                                    "Nombre" =>  ["input", "nombre", "text", "required", "", ""],
                                    "Apellido" =>  ["input", "apellido", "text", "required", "", ""],
                                    "N° de Documento" =>  ["input", "numero_documento", "text", "required", "", ""],
                                    // "Cargo" =>  ["input", "cargo", "text", "required", "", ""],
                                    "Fecha de Ingreso" =>  ["input", "fechaIngreso", "date", "required", date("Y-m-d"), ""],
                                    "Salario (En " . $ConfigNominaUser["moneda"] . ")" =>  ["input", "salario", "number", "required", "", ""],
                                    "Email" =>  ["input", "email", "email", "required", "", ""],
                                    "Telefono" =>  ["input", "telefono", "text", "required", "", ""],
                                    "Fecha de Nacimiento" =>  ["input", "fecha_nacimiento", "date", "required", "", ""],
                                    "Edad" =>  ["input", "edad", "number", "required", "", ""],
                                    "Dia de pago" =>  ["select", "diaPago", "", "required", $tiposDiaPago, ""],
                                    "Tipo de Contrato" =>  ["select", "tipoContrato", "", "required", $tiposContrato, "<i onclick='mostrarTipoContrato()' class='fa-solid fa-circle-plus' data-bs-toggle='offcanvas' data-bs-target='#offcanvasMaster' aria-controls='offcanvasMaster'></i>"],
                                    "Fecha fin (Si aplica)" =>  ["input", "fecha_fincontrato", "date", "", "", ""],
                                ];




                                foreach ($camposTrabajador as $label => $datos) { ?>
                                    <div class="col-md-3 mb-1">
                                        <label class="mb-0"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : ('') ) ?> <?= $datos[5] ?> </label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <!-- selectModalTrabajador -->
                                            <select class="form-select" style="width: 100%;" id="<?= $datos[1] ?>">
                                                <?php
                                                foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                }

                                                ?>
                                            </select>
                                        <?php } else if ($datos[0] == "input") { ?>
                                            <input value="<?= $datos[4] ?>" <?= (("fecha_nacimiento" == $datos[1]) ? "onchange='calcularEdad(this.value)' " : "") ?> class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>

                                <div class="col-md-3 mb-1">
                                    <label class="mb-0">Cargo <span class="text-primary">*</span> <i onclick='mostrarCargos()' class='fa-solid fa-circle-plus' data-bs-toggle='offcanvas' data-bs-target='#offcanvasMaster' aria-controls='offcanvasMaster'></i> </label>
                                    <!-- selectModalTrabajador -->
                                    <select class="form-select " style="width: 100%;" id="cargo">
                                        <?php foreach ($datosCargos as $key => $cargo) {
                                            echo '<option value="' . $cargo["id"] . '">' . $cargo["codigo"] . ' - ' . $cargo["nombre"] . '</option>';
                                        } ?>
                                    </select>
                                </div>

                                <div class="col-md-3 mb-1">
                                    <label class="mb-0">Sucursal <span class="text-primary">*</span> <i onclick='mostrarSedes()' class='fa-solid fa-circle-plus' data-bs-toggle='offcanvas' data-bs-target='#offcanvasMaster' aria-controls='offcanvasMaster'></i></label>
                                    <!-- selectModalTrabajador -->
                                    <select class="form-select " style="width: 100%;" id="sucursal">
                                        <?php
                                        foreach ($datosSedes as $key => $sede) {
                                            echo '<option value="' . $sede["id"] . '">' . $sede["codigoSede"] . ' - ' . $sede["nombreSede"] . '</option>';
                                        }
                                        ?>
                                    </select>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>


                <div id="modal-personas-page-2">

                    <div class="pagina col-md-12 row">
                        <div class="card">
                            <h5 class="card-header"> <i class="fas fa-calendar-check"></i> Configuracion de Horario</h5>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $array_horario = [
                                        "Lunes" => ["lunesHabilitado", "lunesInicio", "lunesFin", "08:00", "17:00"],
                                        "Martes" => ["martesHabilitado", "martesInicio", "martesFin", "08:00", "17:00"],
                                        "Miercoles" => ["miercolesHabilitado", "miercolesInicio", "miercolesFin", "08:00", "17:00"],
                                        "Jueves" => ["juevesHabilitado", "juevesInicio", "juevesFin", "08:00", "17:00"],
                                        "Viernes" => ["viernesHabilitado", "viernesInicio", "viernesFin", "08:00", "17:00"],
                                        "Sabado" => ["sabadoHabilitado", "sabadoInicio", "sabadoFin", "08:00", "17:00"],
                                        "Domingo" => ["domingoHabilitado", "domingoInicio", "domingoFin", "08:00", "17:00"],
                                    ];

                                    foreach ($array_horario as $dia => $data) { ?>
                                        <tr>
                                            <td>
                                                <div class="form-check form-switch">
                                                    <label class="form-check-label fs-8" for="showPhone"><?= $dia ?></label>
                                                    <input class="form-check-input" <?= (($dia <> "Domingo") ? "checked" : "") ?> id="<?= $data[0] ?>" type="checkbox" name="showPhone">
                                                </div>
                                            </td>
                                            <td>
                                                <input type="time" class="form-control" value="<?= $data[3] ?>" id="<?= $data[1] ?>">
                                            </td>
                                            <td>
                                                <input type="time" class="form-control" value="<?= $data[4] ?>" id="<?= $data[2] ?>">
                                            </td>
                                        </tr>
                                    <?php } ?>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>


                <div id="modal-personas-page-3">

                    <div class="pagina col-md-12 row">
                        <div class="card">
                            <h5 class="card-header"> <i class="fas fa-piggy-bank"></i> Informacion Bancaria</h5>
                            <div class="card-body col-md-12 row">
                                <?php

                                $camposInfoBancaria = [
                                    "Tipo de Metodo de Pago" =>  ["select", "tipoMetodoPago", "", "required", $tiposMetodoPago, "<i onclick='tiposMetodoPago()' class='fa-solid fa-circle-plus' data-bs-toggle='offcanvas' data-bs-target='#offcanvasMaster' aria-controls='offcanvasMaster'></i>"],
                                    "Banco" =>  ["select", "idBanco", "", "required", $listaBancos, "<i onclick='mostrarBancos()' class='fa-solid fa-circle-plus' data-bs-toggle='offcanvas' data-bs-target='#offcanvasMaster' aria-controls='offcanvasMaster'></i>"],
                                    "Tipo de cuenta" =>  ["select", "tipoCuenta", "", "required", $tipoCuenta, ""],
                                    "Nombre del titular de la cuenta" =>  ["input", "nombreTitularCuenta", "text", "required", "", ""],
                                    "Documento del titular de la cuenta" =>  ["input", "documentoTitularCuenta", "text", "required", "", ""],
                                    "Numero de Cuenta" =>  ["input", "numeroCuenta", "text", "required", "", ""],
                                    "Lugar de pago (Si aplica)" =>  ["input", "lugarPago", "text", "", "", ""],

                                ];

                                foreach ($camposInfoBancaria as $label => $datos) { ?>
                                    <div class="col-md-6 mb-1">
                                        <label class="mb-0"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : ('')) ?> <?= $datos[5] ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select class="form-select selectModalTrabajador" style="width: 100%;" id="<?= $datos[1] ?>">
                                                <?php
                                                foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                }

                                                ?>
                                            </select>
                                        <?php } else if ($datos[0] == "input") { ?>
                                            <input value="<?= $datos[4] ?>" <?= (("fecha_nacimiento" == $datos[1]) ? "onchange='calcularEdad(this.value)' " : "") ?> class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>
                            </div>
                        </div>
                    </div>

                </div>

                <div id="modal-personas-page-4">

                    <div class="pagina col-md-12 row">
                        <div class="card">
                            <h5 class="card-header"> <i class="fas fa-briefcase-medical"></i> Informacion de Afiliacion</h5>
                            <div class="card-body col-md-12 row">
                                <?php
                                            
                                $camposInfoBancaria = [

                                    "Fecha de afiliacion a EPS" =>  ["input", "fechaAfiliacionEPS", "date", "required", date("Y-m-d"), ""],
                                    "Numero de Afiliacion" =>  ["input", "numeroAfiliacionEPS", "text", "required", ""],
                                    "EPS" =>  ["select", "eps", "", "required", $listaEps, "mostrarEPS()"],
                                    "Tipo de afiliacion" =>  ["select", "tipoAfiliacion", "", "required", ["Contributivo", "Subsidiado"], ""],
                                    "Caja de Compensacion" =>  ["select", "cajaCompensacion", "", "required", $listaCajaCompensacion, "mostrarCajaCompensacion()"],
                                    "ARL" =>  ["select", "arl", "", "required", $lista_arl, "mostrarARL()"],
                                    "Pension" =>  ["select", "fondoPensiones", "", "required", $listaPension, "mostrarPension()"],
                                ];

                                foreach ($camposInfoBancaria as $label => $datos) { ?>
                                    <div class="col-md-4 mb-1">
                                        <label class="mb-0"><?= $label ?> <?= (($datos[3] == 'required') ? '<span class="text-primary">*</span>' : ('')) ?> <?= $datos[5] <> "" ? "<i onclick='".$datos[5]."' class='fa-solid fa-circle-plus' data-bs-toggle='offcanvas' data-bs-target='#offcanvasMaster' aria-controls='offcanvasMaster'></i>" : "" ?></label>
                                        <?php if ($datos[0] == "select") { ?>
                                            <select class="form-select selectModalTrabajador" style="width: 100%;" id="<?= $datos[1] ?>">
                                                <?php
                                                foreach ($datos[4] as $key => $value) {
                                                    echo '<option value="' . $key . '">' . $value . '</option>';
                                                }

                                                ?>
                                            </select>
                                        <?php } else if ($datos[0] == "input") { ?>
                                            <input value="<?= $datos[4] ?>" <?= (("fecha_nacimiento" == $datos[1]) ? "onchange='calcularEdad(this.value)' " : "") ?> class="form-control" type="<?= $datos[2] ?>" <?= $datos[3] ?> id="<?= $datos[1] ?>" placeholder="<?= $label ?>" />
                                        <?php } ?>
                                    </div>
                                <?php } ?>
                            </div>
                        </div>

                        <div class="card mt-2">
                            <h5 class="card-header"> <i class="fas fa-users"></i> Beneficiaros</h5>
                            <div class="card-body col-md-12 row">
                                <table class="tabla table-modal" id="tabla-modal">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>N° de Documento</th>
                                            <th>Fecha de Nacimiento</th>
                                            <th>Parentesco</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-modal"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>




            </div>

            <input type="hidden" id="id" value="0">
            <!-- EN LA BASE DE DATOS TAMBIEN SE GUARDARAN CANDIDATOS, POR LO TANTO EL TIPO HACE REFERENCIA A SI ES UN CANDIDATO O UN TRABAJADOR -->
            <input type="hidden" id="tipo" value="Trabajador">
            <input type="hidden" id="usuarioId" value="<?= $_SESSION["ID"] ?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <div class="col-md-12 row">
                    <div class="col-md-6 text-start" id="paginacionModal"></div>
                    <div class="col-md-6 text-end">
                        <button class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                        <button class="btn btn-primary my-0" onclick="guardarTrabajador()" id="button-save-trabajador"><i class="fas fa-bookmark"></i> &nbsp; Crear Trabajador</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    let indiceFila = 0;

    function AnadirFila(modalId) {
        // console.log("Añadiendo fila");

        let btnDelete = indiceFila != 0 ? `<i class="fas fa-trash mt-2" onclick="EliminarFila('filaParentesco${indiceFila}')"></i>` : ``;
        let nuevaFila = `<tr id="filaParentesco${indiceFila}">
                            <input class="underline-input" type="hidden" value="0" onchange="validarNuevaFila(${indiceFila}, '${modalId}', 'filaParentesco')" name="Beneficiarios[${indiceFila}][id]">
                            <td style="padding:10px !important">
                                <input class="underline-input" type="text" onchange="validarNuevaFila(${indiceFila}, '${modalId}', 'filaParentesco')" name="Beneficiarios[${indiceFila}][nombre]">
                            </td> 
                            <td style="padding:10px !important">
                                <input class="underline-input" type="text" onchange="validarNuevaFila(${indiceFila}, '${modalId}', 'filaParentesco')" name="Beneficiarios[${indiceFila}][documento]">   
                            </td> 
                            <td style="padding:10px !important">
                                <input class="form-control underline-input" type="date" onchange="validarNuevaFila(${indiceFila}, '${modalId}', 'filaParentesco')" name="Beneficiarios[${indiceFila}][fechaNacimiento]">
                            </td> 
                            <td style="padding:10px !important">
                                <select class="form-select" type="text" onchange="validarNuevaFila(${indiceFila}, '${modalId}', 'filaParentesco')" name="Beneficiarios[${indiceFila}][parentesco]">
                                    ${obtenerOptionsParentesco()}
                                    </select>
                            </td>
                            <td style="padding:10px !important">
                                ${btnDelete}
                            </td>
                        </tr>`;

        $(`#${modalId} #tbody-modal`).append(nuevaFila);
        indiceFila += 1;
        // console.log("Fila anadida");
    }

    function validarNuevaFila(indice, modalId, comunFila) {

        const nombre = $(`#${modalId} input[name='Beneficiarios[${indice}][nombre]']`).val();
        const documento = $(`#${modalId} input[name='Beneficiarios[${indice}][documento]']`).val();
        const fechaNacimiento = $(`#${modalId} input[name='Beneficiarios[${indice}][fechaNacimiento]']`).val();
        const parentesco = $(`#${modalId} select[name='Beneficiarios[${indice}][parentesco]']`).val();

        let arrayValores = [nombre, documento, fechaNacimiento, parentesco];
        // console.log(arrayValores);

        if (arrayValores.includes("") && indice != 0) {
            return false;
        }

        if (!document.getElementById(`${comunFila}${indice+1}`)) {
            AnadirFila(modalId);
        }
    }


    function EliminarFila(id) {
        $(`#${id}`).remove();
    }


    function resetModalNuevoTrabajador() {
        $("#header-modal-trabajador").html(`<i class="fas fa-user"></i> Nuevo Trabajador`);
        $("#button-save-trabajador").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Trabajador`);
        $("#modalNuevoTrabajador #id").val("0");
        indiceFila = 0;
        $("#modalNuevoTrabajador #tbody-modal").html("");

        let ids = ["fechaIngreso", "nombre", "apellido", "numero_documento", "fecha_fincontrato", "cargo", "sucursal", "salario", "edad", "email", "telefono", "fecha_nacimiento", "imagenPerfilBase64", "tipoMetodoPago", "idBanco", "tipoCuenta", "nombreTitularCuenta", "documentoTitularCuenta", "numeroCuenta", "lugarPago", "diaPago", "tipoContrato"];
        for (const index in ids) {
            let key = ids[index]; // Obtener la clave del array ids
            let elemento = $("#modalNuevoTrabajador #" + key);
            elemento.val("");
        }
        $("#modalNuevoTrabajador #profileImage").attr("src", "https://via.placeholder.com/150");


        // console.log("Modal reseteado");
    }

    function guardarTrabajador() {
        const ids = [
            "fechaIngreso", "nombre", "apellido", "numero_documento", "fecha_fincontrato",
            "cargo", "sucursal", "salario", "edad", "email", "telefono",
            "fecha_nacimiento", "imagenPerfilBase64", "diaPago", "tipoContrato",
            "fechaAfiliacionEPS", "numeroAfiliacionEPS", "eps", "tipoAfiliacion",
            "cajaCompensacion", "arl", "fondoPensiones", "usuarioId", "tipo", "id"
        ];

        const data = recolectarDatos(ids, "modalNuevoTrabajador");
        if (!data) return; // Si algún campo requerido está vacío, detener la ejecución

        const keysHorario = {
            "Lunes": ["lunesHabilitado", "lunesInicio", "lunesFin"],
            "Martes": ["martesHabilitado", "martesInicio", "martesFin"],
            "Miercoles": ["miercolesHabilitado", "miercolesInicio", "miercolesFin"],
            "Jueves": ["juevesHabilitado", "juevesInicio", "juevesFin"],
            "Viernes": ["viernesHabilitado", "viernesInicio", "viernesFin"],
            "Sabado": ["sabadoHabilitado", "sabadoInicio", "sabadoFin"],
            "Domingo": ["domingoHabilitado", "domingoInicio", "domingoFin"]
        };

        const dataHorario = recolectarHorarios(keysHorario, "modalNuevoTrabajador");
        if (!dataHorario) return;

        data.configuracionHorario = dataHorario;

        const keysInfoBancaria = [
            "tipoMetodoPago", "idBanco", "tipoCuenta", "nombreTitularCuenta",
            "documentoTitularCuenta", "numeroCuenta", "lugarPago"
        ];

        const dataInfoBancaria = recolectarDatos(keysInfoBancaria, "modalNuevoTrabajador");
        if (!dataInfoBancaria) return;

        data.informacionBancaria = dataInfoBancaria;

        const dataBeneficiarios = recolectarBeneficiarios("modalNuevoTrabajador");
        if (!dataBeneficiarios) return;

        data.beneficiarios = dataBeneficiarios;

        data["action"] = data.id == 0 ? "crear" : "actualizar";
        data["tipo"] = "Trabajador";

        console.log(data);

        $.ajax({
            type: "POST",
            url: "<?= $Base ?>Nomina/Ajax/AjaxTrabajadores.php",
            data,
            success: function(response) {
                const dataResponse = JSON.parse(response);
                const { icon, title, text } = dataResponse;

                Swal.fire({ icon, title, text });

                if (dataResponse.error) {
                    console.log("Detalle Error => " + dataResponse.error);
                    return;
                }

                if (icon === "success") {
                    setTimeout(() => location.reload(), 500);
                }
            }
        });
    }

    /**
     * Recolecta datos de un conjunto de campos en un modal.
     */
    function recolectarDatos(ids, modalId) {
        const data = {};
        for (const key of ids) {
            const elemento = $(`#${modalId} #${key}`);
            if ((elemento.val() === "" || elemento.val() === null) && elemento.attr("required") !== undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Por favor, llena todos los campos requeridos => ${key}`,
                });
                return null;
            }
            data[key] = elemento.val();
        }
        return data;
    }

    /**
     * Recolecta datos del horario configurado en el modal.
     */
    function recolectarHorarios(keysHorario, modalId) {
        const dataHorario = {};
        for (const dia in keysHorario) {
            const [habilitado, inicio, fin] = keysHorario[dia].map(key => $(`#${modalId} #${key}`));

            if ((inicio.val() === "" || inicio.val() === null) && inicio.attr("required") !== undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Por favor, complete la configuración de horario",
                });
                return null;
            }

            if ((fin.val() === "" || fin.val() === null) && fin.attr("required") !== undefined) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Por favor, complete la configuración de horario",
                });
                return null;
            }

            dataHorario[dia] = {
                habilitado: habilitado.is(":checked") ? "on" : "off",
                inicio: inicio.val(),
                fin: fin.val(),
            };
        }
        return dataHorario;
    }

    /**
     * Recolecta beneficiarios configurados en el modal.
     */
    function recolectarBeneficiarios(modalId) {
        const dataBeneficiarios = [];
        let isValid = true;

        $(`#${modalId} #tbody-modal tr`).each(function() {
            if (!isValid) return;

            const indice = $(this).attr("id").replace("filaParentesco", "");
            const beneficiario = {
                id: $(`#${modalId} input[name='Beneficiarios[${indice}][id]']`).val(),
                nombre: $(`#${modalId} input[name='Beneficiarios[${indice}][nombre]']`).val(),
                documento: $(`#${modalId} input[name='Beneficiarios[${indice}][documento]']`).val(),
                fechaNacimiento: $(`#${modalId} input[name='Beneficiarios[${indice}][fechaNacimiento]']`).val(),
                parentesco: $(`#${modalId} select[name='Beneficiarios[${indice}][parentesco]']`).val(),
            };

            if (Object.values(beneficiario).some(value => value === "" || value === null) && beneficiario.nombre != '') {
                console.log("Beneficiario" , beneficiario);
                
                
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Por favor, complete todos los campos de beneficiario o elimine las filas vacías.",
                });
                isValid = false;
                return null;
            }

            dataBeneficiarios.push(beneficiario);
        });

        return isValid ? dataBeneficiarios : null;
    }


    // function guardarTrabajador() {
    //     let ids = ["fechaIngreso", "nombre", "apellido", "numero_documento", "fecha_fincontrato", "cargo", "sucursal", "salario", "edad", "email", "telefono", "fecha_nacimiento", "imagenPerfilBase64", "diaPago", "tipoContrato", "fechaAfiliacionEPS","numeroAfiliacionEPS","eps","tipoAfiliacion","cajaCompensacion","arl","fondoPensiones" , "usuarioId", "tipo" ,"id"];
    //     let data = {};

    //     for (const index in ids) {
    //         let key = ids[index]; // Obtener la clave del array ids
    //         let elemento = $("#modalNuevoTrabajador #" + key);

    //         // Verificar si el campo es requerido y está vacío
    //         if ((elemento.val() == "" || elemento.val() == null) && elemento.attr("required") !== undefined) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Por favor, llena todos los campos requeridos => ' + key,
    //             });
    //             return; // Detener la ejecución si hay un campo requerido vacío
    //         }

    //         data[key] = elemento.val(); // Asignar el valor del campo al objeto data
    //     }

    //     let keysHorario  = {
    //         "Lunes" : ["lunesHabilitado", "lunesInicio", "lunesFin"],
    //         "Martes" : ["martesHabilitado", "martesInicio", "martesFin"],
    //         "Miercoles" : ["miercolesHabilitado", "miercolesInicio", "miercolesFin"],
    //         "Jueves" : ["juevesHabilitado", "juevesInicio", "juevesFin"],
    //         "Viernes" : ["viernesHabilitado", "viernesInicio", "viernesFin"],
    //         "Sabado" : ["sabadoHabilitado", "sabadoInicio", "sabadoFin"],
    //         "Domingo" : ["domingoHabilitado", "domingoInicio", "domingoFin"],
    //     };
    //     let dataHorario = {};

    //     for (const dia in keysHorario) {
    //         const columnsDias = keysHorario[dia]; 
    //         const diaHabilitado = $("#modalNuevoTrabajador #" + columnsDias[0]);
    //         const diaInicio = $("#modalNuevoTrabajador #" + columnsDias[1]);
    //         const diaFin = $("#modalNuevoTrabajador #" + columnsDias[2]);

    //         // Verificar si el campo es requerido y está vacío
    //         if ((diaInicio.val() == "" || diaInicio.val() == null) && diaInicio.attr("required") !== undefined) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Por favor, complete la configuracion de horario',
    //             });
    //             return; // Detener la ejecución si hay un campo requerido vacío
    //         }

    //         if ((diaFin.val() == "" || diaFin.val() == null) && diaFin.attr("required") !== undefined) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Por favor, complete la configuracion de horario',
    //             });
    //             return; // Detener la ejecución si hay un campo requerido vacío
    //         }

    //         const objetoDia = {
    //             habilitado : diaHabilitado.is(":checked") ? 'on' : 'off',
    //             inicio : diaInicio.val(),
    //             fin : diaFin.val(),
    //         }




    //         dataHorario[dia] = objetoDia; // Asignar el valor del campo al objeto data
    //     }

    //     // console.log(dataHorario);
    //     data.configuracionHorario = dataHorario;


    //     let keysInfoBancaria = ["tipoMetodoPago", "idBanco", "tipoCuenta", "nombreTitularCuenta", "documentoTitularCuenta", "numeroCuenta", "lugarPago"];
    //     let dataInfoBancaria = {};
    //     for (const index in keysInfoBancaria) {
    //         let key = keysInfoBancaria[index]; // Obtener la clave del array ids
    //         let elemento = $("#modalNuevoTrabajador #" + key);

    //         // Verificar si el campo es requerido y está vacío
    //         if ((elemento.val() == "" || elemento.val() == null) && elemento.attr("required") !== undefined) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Por favor, llena todos los campos requeridos => ' + key,
    //             });
    //             return; // Detener la ejecución si hay un campo requerido vacío
    //         }

    //         dataInfoBancaria[key] = elemento.val(); // Asignar el valor del campo al objeto data
    //     }
    //     data.informacionBancaria = dataInfoBancaria;
    //     // console.log(dataInfoBancaria);

    //     let dataBeneficiarios = [];
    //     let isValidBeneficiarios = true;
    //     $("#modalNuevoTrabajador #tbody-modal tr").each(function() {
    //         if (!isValidBeneficiarios) return; // Si hay un error en los datos anteriores, sal del ciclo

    //         let id = $(this).attr("id");
    //         let indice = id.replace("filaParentesco", "");

    //         const idB = $(`#modalNuevoTrabajador input[name='Beneficiarios[${indice}][id]']`).val();
    //         const nombre = $(`#modalNuevoTrabajador input[name='Beneficiarios[${indice}][nombre]']`).val();
    //         const documento = $(`#modalNuevoTrabajador input[name='Beneficiarios[${indice}][documento]']`).val();
    //         const fechaNacimiento = $(`#modalNuevoTrabajador input[name='Beneficiarios[${indice}][fechaNacimiento]']`).val();
    //         const parentesco = $(`#modalNuevoTrabajador select[name='Beneficiarios[${indice}][parentesco]']`).val();

    //         if (nombre !== "") {
    //             const beneficiario = {
    //                 id: idB,
    //                 nombre,
    //                 documento,
    //                 fechaNacimiento,
    //                 parentesco
    //             }

    //             // console.log("Beneficiario", beneficiario);

    //             const tieneVacio = obj => Object.values(obj).some(value => value === null || value === undefined || value === '');

    //             if (tieneVacio(beneficiario)) {
    //                 isValidBeneficiarios = false;
    //                 // console.log("Faltan datos en el beneficiario:", beneficiario);
    //                 return; // Termina la iteración si algún valor está vacío
    //             }

    //             dataBeneficiarios.push(beneficiario);
    //         }
    //     });

    //     // console.log("Variable dataBeneficiarios");
    //     // console.log(dataBeneficiarios);


    //     if (!isValidBeneficiarios) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'Por favor, complete todos los campos de beneficiario, si no desea agregar beneficiario vacie todos los campos de la fila o elimine la fila',
    //         });

    //         return;
    //     };

    //     data.beneficiarios = dataBeneficiarios;
    //     data["action"] = data.id == 0 ? "crear" : "actualizar";
    //     data["tipo"] =  "Trabajador";

    //     console.log(data);
    //     return data;

    //     $.ajax({
    //         type: "POST",
    //         url: "<?= $Base ?>Nomina/Ajax/AjaxTrabajadores.php",
    //         data,
    //         success: function(response) {
    //             console.log(response);
    //             let dataResponse = JSON.parse(response);
    //             console.log(dataResponse);


    //             const {icon,title,text} = dataResponse
    //             Swal.fire({icon,title,text});

    //             if (dataResponse.error) {
    //                 console.log("Detalle Error => " + dataResponse.error);
    //                 return;
    //             }

    //             if (icon == "success") {
    //                 setTimeout(() => {
    //                     location.reload();
    //                 }, 500);
    //             }

    //         }
    //     });

    //     // $("#modalNuevoTrabajador").modal('hide');
    //     // Ocultar el modal y resetear los campos
    //     // resetModalNuevoTrabajador();
    //     // console.log(data);
    //     return data;
    // }


    function calcularEdad(fechNacimiento) {
        let hoy = new Date();
        let cumpleanos = new Date(fechNacimiento);
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        let m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        $("#edad").val(edad);
    }


    function eliminarTrabajador(index) {
        Swal.fire({
            title: '¿Deseas eliminar este trabajador?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#rowret-" + index).remove();
                // Aquí puedes manejar la lógica para eliminar el trabajador en tu base de datos
            }
        });
    }

    function editarTrabajador(id, index) {
        // console.log("editarTrabajador");

        $("#header-modal-trabajador").html(`<i class="fas fa-wrench"></i> Editar Trabajador`);
        $("#button-save-trabajador").html(`<i class="fas fa-wrench"></i> Actualizar Trabajador`);
        $("#modalNuevoTrabajador #id").val(id);

        const data = document.getElementById("data_trabajador_" + index).value;
        const dataPrincipal = JSON.parse(data);
        const keyData = Object.keys(dataPrincipal);
        keyData.forEach(key => {
            let elemento = $("#modalNuevoTrabajador #" + key);
            if (elemento) {
                if (elemento.is(":checkbox")) {
                    elemento.prop("checked", dataPrincipal[key] == 'on' ? true : false);
                } else {
                    elemento.val(dataPrincipal[key]);
                }
            }
        });

        $("#modalNuevoTrabajador #profileImage").attr("src", dataPrincipal.imagenPerfilBase64);


        const dataBeneficiarios = document.getElementById("data_beneficiarios_trabajador_" + index).value;
        const dataPrincipalBeneficiarios = JSON.parse(dataBeneficiarios);
        console.log("dataPrincipalBeneficiarios");
        console.log(dataPrincipalBeneficiarios);
        dataPrincipalBeneficiarios.forEach(datosBeneficiario => {
            let indiceI = indiceFila;
            AnadirFila("modalNuevoTrabajador");
            setTimeout(() => {
                $(`input[name="Beneficiarios[${indiceI}][id]"]`).val(datosBeneficiario.id);
                $(`input[name="Beneficiarios[${indiceI}][nombre]"]`).val(datosBeneficiario.nombre);
                $(`input[name="Beneficiarios[${indiceI}][documento]"]`).val(datosBeneficiario.documento);
                $(`input[name="Beneficiarios[${indiceI}][fechaNacimiento]"]`).val(datosBeneficiario.fechaNacimiento);
                $(`select[name="Beneficiarios[${indiceI}][parentesco]"]`).val(datosBeneficiario.parentesco).change();
                console.log("Valores colocados en columna con indice " + indiceI);
            }, 100);
        });


        //         
        // 
        const dataBancaria = document.getElementById("data_infobancaria_trabajador_" + index).value;
        const dataPrincipalBancaria = JSON.parse(dataBancaria);
        const keyDataBancaria = Object.keys(dataPrincipalBancaria);
        const omitirKeys = ["id", "fechaRegistro", "fechaActualizacion", "usuarioId", "idTrabajador", "activo"];
        keyDataBancaria.forEach(key => {
            if (!omitirKeys.includes(key)) {
                console.log("Data bancaria key => " + key);
                let elemento = $("#modalNuevoTrabajador #" + key);
                console.log("Elemento");
                console.log(elemento);
                console.log("Valor a insertar" + dataPrincipalBancaria[key]);
                if (elemento) {
                    if (elemento.is(":checkbox")) {
                        elemento.prop("checked", dataPrincipalBancaria[key] == 'on' ? true : false);
                    } else {
                        elemento.val(dataPrincipalBancaria[key]);
                    }
                }

            }

        });


        let keysHorario = {
            "Lunes": ["lunesHabilitado", "lunesInicio", "lunesFin"],
            "Martes": ["martesHabilitado", "martesInicio", "martesFin"],
            "Miercoles": ["miercolesHabilitado", "miercolesInicio", "miercolesFin"],
            "Jueves": ["juevesHabilitado", "juevesInicio", "juevesFin"],
            "Viernes": ["viernesHabilitado", "viernesInicio", "viernesFin"],
            "Sabado": ["sabadoHabilitado", "sabadoInicio", "sabadoFin"],
            "Domingo": ["domingoHabilitado", "domingoInicio", "domingoFin"],
        };
        const dataHorario = document.getElementById("data_infohorario_trabajador_" + index).value;
        const dataPrincipalHorario = JSON.parse(dataHorario);
        const keyDataHorario = Object.keys(dataPrincipalHorario);
        keyDataHorario.forEach(key => {
            let datosDia = dataPrincipalHorario[key];
            let idsHtml = keysHorario[datosDia.dia];
            $("#modalNuevoTrabajador #" + idsHtml[0]).prop("checked", datosDia.habilitado == 'on' ? true : false);
            $("#modalNuevoTrabajador #" + idsHtml[1]).val(datosDia.inicio);
            $("#modalNuevoTrabajador #" + idsHtml[2]).val(datosDia.fin);
            // console.log(datosDia);
        });


        $("#modalNuevoTrabajador").modal('show');

    }

    $('#modalNuevoTrabajador').on('hidden.bs.modal', function() {
        resetModalNuevoTrabajador();


    });

    function obtenerOptionsParentesco(nameEmpty = 'Seleccione') {
        let options = `<option data-empresa="" value="">${nameEmpty}</option>`;
        let datos = <?= json_encode($tiposParentesco) ?>;

        let keysData = Object.keys(datos);
        keysData.forEach(key => {
            let data = datos[key];
            options += `<option value="${data}">${data}</option>`;
        })
        return options;
    }

    function mostrarTipoContrato() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxTipoContrato.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'tipoContrato',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Tipo de Contrato</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Nuevo tipo de contrato',
                            icon    : 'fas fa-plus',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }
    
    function mostrarSedes() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxSucursal.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'sucursal',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombreSede"
                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre de sede</label>
                                <input class='form-control' id="nombreSede">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12">
                                <label>Codigo de sede</label>
                                <input class='form-control' id="codigoSede">
                            </div>
                            <div class="col-md-12">
                                <label>Direccion</label>
                                <input class='form-control' id="direccionSede">
                            </div>
                            <div class="col-md-12">
                                <label>Ciudad</label>
                                <input class='form-control' id="ciudadSede">
                            </div>
                            <div class="col-md-12">
                                <label>Telefono</label>
                                <input class='form-control' id="telefonoSede">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Nueva sede',
                            icon    : 'fas fa-map',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }

    function mostrarCargos() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxCargos.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'cargo',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>

                            <div class="col-md-12">
                                <label>Codigo</label>
                                <input class='form-control'  id="codigo">
                            </div>

                            <div class="col-md-12">
                                <label>Funciones</label>
                                <textarea class='form-control' style="height: 100px" id="funciones"></textarea>
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Nuevo cargo',
                            icon    : 'fas fa-briefcase',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }

    
    function tiposMetodoPago() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxMetodosPago.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'tipoMetodoPago',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Metodo de pago',
                            icon    : 'fas fa-coins',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }

    function mostrarBancos() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxBancos.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'idBanco',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
                    };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto =    { 
                            html    : content,
                            title   : 'Nuevo banco',
                            icon    : 'fas fa-piggy-bank',
                            reload  : false,
                            inner
                        }

        drawContentOffCanvas(objeto);
    }

    function tiposMetodoPago() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxMetodosPago.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'tipoMetodoPago',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
        };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto = { 
                    html    : content,
                    title   : 'Nuevo metodo de pago',
                    icon    : 'fas fa-briefcase',
                    reload  : false,
                    inner
        }

        drawContentOffCanvas(objeto);
    }
    
    ////////////////////
    
    function mostrarEPS() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxEPS.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'eps',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
        };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto = { 
                    html    : content,
                    title   : 'Nueva EPS',
                    icon    : 'fas fa-hospital',
                    reload  : false,
                    inner
        }

        drawContentOffCanvas(objeto);
    }
    
    function mostrarCajaCompensacion() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxCajaCompensacion.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'cajaCompensacion',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
        };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto = { 
                    html    : content,
                    title   : 'Nueva caja de compensacion',
                    icon    : 'fas fa-building-user',
                    reload  : false,
                    inner
        }

        drawContentOffCanvas(objeto);
    }
    
    function mostrarARL() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxARL.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'arl',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
        };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto = { 
                    html    : content,
                    title   : 'Nueva ARL',
                    icon    : 'fas fa-briefcase',
                    reload  : false,
                    inner
        }

        drawContentOffCanvas(objeto);
    }
    
    function mostrarPension() {
        let ajax = "<?=$BASE?>Nomina/Ajax/AjaxPension.php";
        ajax = btoa(ajax);
        
        let inner = {
                        id: 'fondoPensiones',
                        modal: 'modalNuevoTrabajador',
                        element: '<option value="[[VALUE]]">[[NAME]]</option>',
                        visible: "nombre"
        };

        let innerJson = btoa(JSON.stringify(inner));
        let content = ` <div class="col-md-12 row">
                            <div class="col-md-12">
                                <label>Nombre</label>
                                <input class='form-control' id="nombre">
                                <input class='form-control' type="hidden" id="idUsuario" value="<?=$_SESSION["ID"]?>">
                            </div>
                            <div class="col-md-12 mt-2">
                                <button class='btn btn-primary' onclick="saveOffCanvas('${ajax}', '${innerJson}')"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
                            </div>
                        </div>`; 

        let objeto = { 
                    html    : content,
                    title   : 'Nuevo fondo de pension',
                    icon    : 'fas fa-coins',
                    reload  : false,
                    inner
        }

        drawContentOffCanvas(objeto);
    }
</script>

<script>
    document.getElementById('imageUpload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profileImage').src = e.target.result;
                document.getElementById('imagenPerfilBase64').value = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    $(document).ready(function() {
        paginacionModal("modalNuevoTrabajador", "modal-personas-page-", 4)
        // setTimeout(() => {
        selectToModal("modalNuevoTrabajador", "selectModalTrabajador")
        // }, 1000);


        // Captura el evento cuando el modal se muestra completamente
        $('#modalNuevoTrabajador').on('shown.bs.modal', function(e) {
            // console.log("Modal abierto");
            // resetModalNuevoTrabajador();
            AnadirFila("modalNuevoTrabajador")
        });

    })
</script>
<style>
    .profile-pic {
        display: block;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin: 10px auto;
        border: 3px solid #132030;
    }

    .upload-btn-wrapper {
        position: relative;
        overflow: hidden;
        display: inline-block;
    }

    .btn-upload {
        border: 2px solid #132030;
        color: white;
        background-color: #132030;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
    }

    .upload-btn-wrapper input[type="file"] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }
</style>

<style>
    .underline-input {
        border: none;
        /* Sin borde */
        border-bottom: 2px solid #D4D4D4;
        /* Línea inferior */
        background-color: transparent;
        /* Fondo transparente */
        outline: none;
        /* Sin borde de enfoque */
        padding: 5px;
        /* Espaciado */
        width: 100%;
        /* Ancho completo */
    }

    .underline-input:focus {
        border-bottom: 2px solid #132030;
        /* Cambia el color de la línea inferior al hacer foco */
        /* Puedes cambiar el color a lo que prefieras */
    }

    .table-modal {
        background-color: #F6F9FC !important;
        padding: 10px !important;
        border-radius: 15px !important;
    }

    .table-modal td {
        padding: 20px !important;
        margin: 20px !important;
        background-color: white !important;
    }

    .table-modal th {
        color: #767C82 !important;
        padding: 20px !important;
        margin: 20px !important;
        /* background-color: white !important; */
    }
</style>