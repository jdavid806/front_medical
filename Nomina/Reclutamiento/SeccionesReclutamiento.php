<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script> -->

<div class="animate__fadeInUp" id="sub-content-apertura">

    <div class="card">
        <div class="card-body d-flex align-content-around flex-wrap p-2 gap-2">

            <?php
            foreach ($datosCargosPublicados as $cargosApertura) { ?>
                <div class="col">
                    <div class="card border-secondary mb-3" style="min-height: 17em;">
                        <div class="card-header d-flex justify-content-around p-1">
                            <input type="hidden" id="data_puesto_<?= $cargosApertura['id'] ?>"
                                value='<?= htmlspecialchars(json_encode($cargosApertura), ENT_QUOTES) ?>'>

                            <div class="p-2 flex-grow-1">
                                <a
                                    class="text-primary fw-bold me-1 ml-3 fs-8"><?= $ControllerCargo->obtenerPorId($cargosApertura['titulo'])["nombre"] ?></a>
                            </div>
                            <div class="p-2">
                                <a class="" onclick="eliminarPuesto(<?= $cargosApertura['id'] ?>)">
                                    <i class="fas fa-times"></i></a>
                            </div>
                        </div>


                        <div class="card-body"
                            onclick="editarPuesto(<?= $cargosApertura['id'] ?>, <?= $cargosApertura['id'] ?>)">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <span
                                    class="badge badge-phoenix badge-phoenix-primary"><?= $cargosApertura['estadoPublicado'] ?></span>
                                <p class="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue">
                                    <?= $cargosApertura['numPosiciones'] ?> Vacante(s)
                                </p>
                            </div>

                            <div>
                                <div class="d-flex align-items-center justify-content-between mb-1">
                                    <div>
                                        <span class="fas fa-user-clock"></span> Experiencia
                                    </div>
                                    <div>
                                        <p class="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue">
                                            <?= $cargosApertura['experienciaMinima'] ?> Año(s)
                                        </p>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center justify-content-between mb-1">
                                    <div>
                                        <span class="fas fa-hourglass-end"></span> Fecha Limite
                                    </div>
                                    <div>
                                        <p class="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue">
                                            <?= $cargosApertura['fechaCierre'] ?>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-2">
                                <div>
                                    Descripción
                                </div>
                                <div class="">
                                    <p class="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue">
                                        <?= $cargosApertura['descripcionBreve'] ?>
                                    </p>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>


            <?php } ?>


        </div>
    </div>
</div>

<div class="mb-8 px-4 animate__fadeInUp" id="sub-content-candidatos">
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <table class="table tableDataTableSearch" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Fecha de solicitud</th>
                            <th>Cargo</th>
                            <th>Candidato</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // foreach ($datosCandidatos as $index => $candidato) {
                        foreach ($datosPostulaciones as $index => $postulacion) {
                            // Simulando el estado de la aplicación
                            $estadoAplicacion = $postulacion["estadoAplicacion"];

                            $datosCandidato = $ControllerTrabajadores->obtenerPorId($postulacion["idCandidato"]);
                            $datosEstadoCandidato = $ControllerEstadoR->obtenerPorId($estadoAplicacion);

                            $datosPuesto = $ControllerPuestosTrabajo->obtenerPorId($postulacion["idPuesto"]);
                            $nombrePuesto = $ControllerCargo->obtenerPorId($datosPuesto["titulo"])["nombre"];

                            $estiloFila = $estiloFila = 'font-weight: bolder; background-color: ' . htmlspecialchars($datosEstadoCandidato['color']);
                            ?>
                            <tr style="<?php echo $estiloFila; ?>" >
                                <input type="hidden" id="data_cargopublicado_<?= $postulacion['idCandidato'] ?>"
                                    value='<?= htmlspecialchars(json_encode($postulacion), ENT_QUOTES) ?>'>
                                <input type="hidden" id="data_cargopublicado_candidato_<?= $postulacion['idCandidato'] ?>"
                                    value='<?= htmlspecialchars(json_encode($datosCandidato), ENT_QUOTES) ?>'>
                                <td><?= $postulacion["fechaRegistro"] ?></td>
                                <td><?= $nombrePuesto ?></td>
                                <td><?= $datosCandidato["nombre"] . " " . $datosCandidato["apellido"] ?></td>
                                <td><?= $datosCandidato["email"] ?></td>
                                <td width="20%" class="">
                                    <?= $postulacion["archivo"] ? "<i class='fas fa-file-pdf' title='Ver Curriculum' onclick='abrirPDF(\"" . $postulacion["archivo"] . "\")'></i>" : "" ?></i>
                                    <div class="dropdown d-inline-block me-2">
                                        <i class="fas fa-cogs dropdown-toggle" title="Editar Estado" id="dropdownMenuButton<?= $postulacion['id'] ?>"
                                        data-bs-toggle="dropdown" aria-expanded="false"></i>
                                        
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton<?= $postulacion['id'] ?>">
                                            <?php foreach ($datosEstadosCandidato as $i => $estadoC) { ?>
                                                <li>
                                                    <a class="dropdown-item <?= $estadoC["id"] == $estadoAplicacion ? "active" : "" ?>"
                                                        onclick="cambiarEstado(<?= $postulacion['id'] ?>, '<?= $estadoC['nombre'] ?>', 'dropdownMenuLink<?= $postulacion['id'] ?>', '<?= htmlspecialchars($estadoC['color']) ?>', '<?= $estadoC['id'] ?>')">
                                                        <i class="fas fa-circle" style="color: <?= htmlspecialchars($estadoC['color']) ?>"></i>
                                                        <?= htmlspecialchars($estadoC['nombre']) ?>
                                                    </a>
                                                </li>
                                            <?php } ?>
                                        </ul>
                                    </div>

                                    <i class="fas fa-eye d-inline-block me-2" title="Ver detalle"
                                        onclick="verCandidato(<?= $postulacion['idCandidato'] ?>)"></i>
                                    <i class="fas fa-handshake d-inline-block me-2" title="Pasar a entrevista"
                                        onclick="citarEntrevista('<?= $postulacion['idCandidato'] ?>','<?= $postulacion['id'] ?>', '<?= $datosPuesto['titulo'] ?>' ,'<?= $nombrePuesto ?>')"></i>
                                    <i class="fas fa-file-signature d-inline-block" title="Contratar"
                                        onclick="contratar(<?= $postulacion['idCandidato'] ?>)"></i>
                                </td>

                            </tr>
                        <?php } ?>
                    </tbody>
                </table>

            </div>
        </div>
    </div>
</div>

<div class="mb-8 px-4 animate__fadeInUp" id="sub-content-entrevistas">
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">

                <table class="table tableDataTableSearch" id="" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Candidato</th>
                            <th>Cargo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        foreach ($datosEntrevistas as $index => $entrevista) {
                            $idCandidato = intval($entrevista["idCandidato"]);
                            $datosCandidato = $ControllerTrabajadores->obtenerPorId($idCandidato);
                            $nombreCandidato = $datosCandidato["nombre"] . " " . $datosCandidato["apellido"];

                            $postulacionId = intval($entrevista["postulacionId"]);
                            $datosPostulacion = $ControllerPostulaciones->obtenerPorId($postulacionId);

                            $idPuesto = intval($datosPostulacion["idPuesto"]);
                            $datosPuesto = $ControllerPuestosTrabajo->obtenerPorId($idPuesto);

                            ?>
                            <tr>
                                <input type="hidden" id="data_entrevista_<?= $entrevista['id'] ?>"
                                    value='<?= htmlspecialchars(json_encode($entrevista), ENT_QUOTES) ?>'>
                                <input type="hidden" id="data_parametros_entrevista_<?= $entrevista['id'] ?>"
                                    value='<?= $datosPuesto["parametros"] ?>'>
                                <td><?= $entrevista["id"] ?></td>
                                <td><?= $entrevista["fecha"] ?></td>
                                <td><?= $entrevista["hora"] ?></td>
                                <td><?= $nombreCandidato ?></td>
                                <td><?= $entrevista["cargoAplica"] ?></td>
                                <td>
                                    <div class="col-md-12 d-flex justify-content-around">
                                        <i class="fas fa-star" title="Puntuar entrevista"
                                            onclick="puntuarEntrevista(<?= $entrevista['id'] ?>, <?= $idCandidato ?> , <?= $postulacionId ?> , <?= $idPuesto ?>)"></i>
                                        <i class="fas fa-pen" title="Editar"
                                            onclick="editarEntrevista(<?= $entrevista['id'] ?>)"></i>
                                        <i class="fas fa-trash" title="Eliminar"
                                            onclick="eliminarEntrevista(<?= $entrevista['id'] ?>)"></i>
                                    </div>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>


            </div>
        </div>
    </div>
</div>


<div class="mb-8 px-4" id="sub-content-contratos">
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                <div class="row gx-3">
                    <div class="col-12">
                        <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Trabajador</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                    <th>Duracion</th>
                                    <th>Salario</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($datosContratos as $index => $contrato) {

                                    $arrayTrabajador = $ControllerTrabajadores->obtenerPorId($contrato['idTrabajador']);
                                    // var_dump($arrayTrabajador);
                                    $nombreTrabajador = $arrayTrabajador['nombre'] . ' ' . $arrayTrabajador['apellido'];
                                    ?>
                                    <tr id="rowcontrato-<?= $contrato['id'] ?>">
                                        <input type="hidden" id="data_contrato_<?= $contrato['id'] ?>"
                                            value='<?= htmlspecialchars(json_encode($contrato), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $contrato['id'] ?></td>
                                        <td class="align-middle"><?= $nombreTrabajador ?></td>
                                        <!-- <td class="align-middle"><?= date("Y-m-d") ?></td> -->
                                        <td class="align-middle"><?= $contrato['fechaContrato'] ?></td>
                                        <td class="align-middle"><?= $contrato['fechaFinContrato'] ?></td>
                                        <td class="align-middle"><?= $contrato['duracionContrato'] ?></td>
                                        <td class="align-middle">
                                            <?= "$ " . number_format($contrato['salario']) . " " . $ConfigNominaUser["moneda"] ?>
                                        </td>
                                        <td class="align-middle">
                                            <div class="col-md-12" style="display: flex; justify-content: space-around">
                                                <i class="fas fa-pencil" title="Editar Contrato"
                                                    onclick="editarContrato('<?= htmlspecialchars($contrato['id']) ?>', '<?= $contrato['id'] ?>')"></i>
                                                <i class="fas fa-trash" title="Eliminar Contrato"
                                                    onclick="borrarContrato('<?= $contrato['id'] ?>')"></i>
                                                <i class="fas fa-print" title="Imprimir"
                                                    onclick="window.open(href='FE_ImprimirContrato?i=<?= base64_encode($contrato['id']) ?>', '_blank')"></i>
                                            </div>
                                        </td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="mb-8 px-4 animate__fadeInUp" id="sub-content-configweb">
    <div class=" col-12 row mb-4">
        <div class="col-6">
            <h4 class="mb-1">Sitio web</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">

                <div class="col-md-12 row">
                    <div class="col-md-12">
                        <label for="">Encabezado </label>
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" type="text" id="encabezado">
                    </div>

                    <div class="col-md-12">
                        <label for="">Descripcion corta</label>
                        <textarea style="height: 100px"
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" id="descripcion"></textarea>
                    </div>

                    <!-- <div class="col-md-12">
                        <label for="">Descripcion detallada</label>
                        <textarea style="height: 100px" onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="editorJR" id="descripcion"></textarea>
                    </div> -->

                    <div class="col-md-6">
                        <label for="">Color primario</label>
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" type="color" id="colorPrimario">
                    </div>

                    <div class="col-md-6">
                        <label for="">Color secundario</label>
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" type="color" id="colorSecundario">
                    </div>

                    <div class="col-md-12 mt-2">
                        <label for="">Datos de contacto</label>
                    </div>

                    <div class="col-md-6">
                        <label for="">Direccion</label>
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" type="text" id="direccion">
                    </div>

                    <div class="col-md-6">
                        <label for="">Correo</label>
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" type="text" id="email">
                    </div>

                    <div class="col-md-6">
                        <label for="">Telefono</label>
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-control" type="text" id="telefono">
                    </div>

                    <div class="col-md-6">
                        <input
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.checked ? '1' : '0', 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            class="form-input" type="checkbox" id="habilitarContactanos">
                        <label for="">Habilitar Formulario de contactanos</label>
                    </div>



                    <div class="col-md-12 mt-2">
                        <label for="">Redes sociales</label>
                    </div>

                    <div class="col-md-6">
                        <label for=""><i class="fab fa-facebook"></i> Facebook</label>
                        <input placeholder="https://www.facebook.com/..."
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            id="facebook" class="form-control" type="text">
                    </div>

                    <div class="col-md-6">
                        <label for=""><i class="fab fa-instagram"></i> Instagram</label>
                        <input placeholder="https://www.instagram.com/..."
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            id="instagram" class="form-control" type="text">
                    </div>

                    <div class="col-md-6">
                        <label for=""> <i class="fa-brands fa-x-twitter"></i> X</label>
                        <input placeholder="https://x.com/..."
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            id="x" class="form-control" type="text">
                    </div>

                    <div class="col-md-6">
                        <label for=""><i class="fab fa-linkedin"></i> LinkedIn</label>
                        <input placeholder="https://co.linkedin.com/..."
                            onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)"
                            id="linkedIn" class="form-control" type="text">
                    </div>
                </div>


            </div>
        </div>
    </div>
</div>



<?php

require_once "./Reclutamiento/ModalDetalleCandidato.php";
require_once "./Reclutamiento/ModalEntrevista.php";
require_once "./Reclutamiento/ModalPuestoTrabajo.php";
require_once "./Reclutamiento/ModalPuntuacionEntrevista.php";

?>

<script>
    function cambiarEstado(index, nombreEstado, dropdownId, colorEstado, estadoId) {
        // Cambiar el texto del botón a el nuevo estado
        // $('#' + dropdownId).html(`<i class="fas fa-circle" style="color: ${colorEstado}"></i> ${nombreEstado}`);
        // console.log("Estado cambiado a:", nombreEstado);
        // Aquí puedes agregar lógica adicional, como una llamada AJAX

        changeAjaxFast('REC_Postulacion', 'estadoAplicacion', estadoId, 'id', index, true);
        window.location.reload();

    }


    function contratar(candidatoId) {
        // $("#modalNuevoTrabajador #idCandidato").val(candidatoId).change();
        // TODO  => MOSTRAR LOS DATOS DEL CANDIDATO EN LA SECCION DEL USUARIO
        let jsonCandidato = document.getElementById(`data_cargopublicado_candidato_${candidatoId}`).value
        let datosCandidato = JSON.parse(jsonCandidato);
        for (const key in datosCandidato) {
            if (key == 'id' || key == 'usuarioId') continue;

            $("#modalNuevoTrabajador #" + key).val(datosCandidato[key]).change();
        }

        $("#modalNuevoTrabajador #id").val(candidatoId);
        $("#modalNuevoTrabajador").modal('show');
    }

    function consultarDatosWeb() {
        console.log("Funcion activada de consulta de datos web");

        $.ajax({
            url: "<?= $BASE ?>Nomina/Reclutamiento/Ajax/AjaxConfigWeb.php", // URL del servidor
            type: "POST",
            data: {
                action: "consultar",
                idUsuario: "<?= $_SESSION['ID'] ?>"
            },
            success: function (response) {
                let { data } = JSON.parse(response);

                console.log("Consultando datos web");
                console.log("data", data);

                if (!data) {
                    crearOActualizarDatosWeb();
                    return;
                };

                for (const key in data) {
                    let elemento = document.querySelector(`#sub-content-configweb #${key}`);
                    if (elemento) {
                        if (elemento.tagName == "INPUT" || elemento.tagName == "SELECT") {
                            elemento.value = data[key];
                        } else if (elemento.tagName == "TEXTAREA") {
                            elemento.innerHTML = data[key];
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                // Acción en caso de error
                console.error("Error:", status, error);
            }
        });

    }

    function crearOActualizarDatosWeb() {
        let data = {};

        $("#sub-content-configweb textarea, #sub-content-configweb input, #sub-content-configweb select").each(function () {
            let elemento = $(this);
            if (elemento.attr("id")) {
                data[elemento.attr("id")] = elemento.val();
            }
        })

        data.idUsuario = "<?= $_SESSION['ID'] ?>";
        data.action = "decisionAction";
        data.id = "<?= $_SESSION['ID'] ?>";

        // console.log("data => " ,data);
        // return;

        $.ajax({
            url: "<?= $BASE ?>Nomina/Reclutamiento/Ajax/AjaxConfigWeb.php", // URL del servidor
            type: "POST",
            data,
            success: function (response) {
                // console.log("response recibida:", response);
            },
            error: function (xhr, status, error) {
                // Acción en caso de error
                console.error("Error:", status, error);
            }
        });
    }

    function abrirPDF(archivo) {
        let url = "<?= $BASE ?>NominaA/ArchivosWeb/" + archivo;
        window.open(url, '_blank');
    }


    $(document).ready(function () {
        consultarDatosWeb();
        // crearOActualizarDatosWeb();
    })

</script>