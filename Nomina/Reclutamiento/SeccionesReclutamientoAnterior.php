<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script> -->

<div class="mb-8 px-4 animate__fadeInUp" id="sub-content-apertura">
    <div class=" col-12 row mb-4"
        >
        <div class="col-6">
            <h4 class="mb-1" >Puestos</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body col-md-12 row">

                <?php
                foreach ($datosCargosPublicados as $cargosApertura) { ?>
                    <input type="hidden" id="data_puesto_<?= $cargosApertura['id'] ?>" value='<?= htmlspecialchars(json_encode($cargosApertura), ENT_QUOTES) ?>'>
                    <div class="col-md-4" >
                    <div class="card mb-3 position-relative">
                        <!-- Icono de la "X" sobresaliendo de la esquina superior derecha -->
                        <a class="position-absolute" onclick="eliminarPuesto(<?= $cargosApertura['id'] ?>)" style="top: -10px; right: -10px; padding: 5px; color: black">
                            <i class="fas fa-times"></i>
                        </a>
                        <div class="card-body" onclick="editarPuesto(<?= $cargosApertura['id'] ?>, <?= $cargosApertura['id'] ?>)">
                            <a class="dropdown-indicator-icon position-absolute text-body-tertiary" href="#collapseWidthDeals-1" role="button" data-bs-toggle="collapse" aria-expanded="false" aria-controls="collapseWidthDeals-1">
                                <svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                    <path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                                </svg>
                            </a>
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div class="d-flex">
                                    <p class="mb-0 fs-9 fw-semibold text-body-tertiary date"> 
                                        <i class="fas fa-clock"></i> <?= date("Y-m-d") ?><span class="text-body-quaternary"> <?= date("H:i:s") ?></span>
                                    </p>
                                </div>
                                <span class="badge badge-phoenix badge-phoenix-primary"><?= $cargosApertura['estadoPublicado'] ?></span>
                            </div>
                            <div class="deals-items-head d-flex align-items-center mb-2">
                                <a class="text-primary fw-bold me-1 mb-0 fs-8"><?= $ControllerCargo->obtenerPorId($cargosApertura['titulo'])["nombre"] ?></a>
                                <p class="ms-auto fs-9 text-body-emphasis fw-semibold mb-0 deals-revenue"><?= $cargosApertura['numPosiciones'] ?> vacante(s)</p>
                            </div>
                            <div class="deals-company-agent d-flex flex-between-center">
                                <div class="d-flex align-items-center">
                                    <span class="fas fa-user-clock"></span> &nbsp;
                                    <p class="text-body-secondary fw-bold fs-9 mb-0"><?= $cargosApertura['experienciaMinima'] ?></p>
                                </div>
                                <div class="d-flex align-items-center">
                                    <span class="fas fa-hourglass-end"></span> &nbsp;
                                    <p class="text-body-secondary fw-bold fs-9 mb-0"><?= $cargosApertura['fechaCierre'] ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <?php } ?>


            </div>
        </div>
    </div>
</div>

<div class="mb-8 px-4 animate__fadeInUp" id="sub-content-candidatos">
    <div class=" col-12 row mb-4" >
        <div class="col-6">
            <h4 class="mb-1" >Postulaciones / Candidatos</h4>
        </div>
    </div>
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
                            <th>Estado</th>
                            <th>Archivo</th>
                            <th>Detalle</th>
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
                        ?>
                            <tr>
                                <input type="hidden" id="data_cargopublicado_<?= $postulacion['idCandidato'] ?>" value='<?= htmlspecialchars(json_encode($postulacion), ENT_QUOTES) ?>'>
                                <input type="hidden" id="data_cargopublicado_candidato_<?= $postulacion['idCandidato'] ?>" value='<?= htmlspecialchars(json_encode($datosCandidato), ENT_QUOTES) ?>'>
                                <td><?= $postulacion["fechaRegistro"] ?></td>
                                <td><?= $nombrePuesto ?></td>
                                <td><?= $datosCandidato["nombre"] . " " .$datosCandidato["apellido"] ?></td>
                                <td><?= $datosCandidato["email"] ?></td>
                                <td>
                                    <div class="dropdown show">
                                        <a class="btn btn-light dropdown-toggle" role="button" id="dropdownMenuLink<?= $postulacion['idCandidato'] ?>" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fas fa-circle" style="color: <?= htmlspecialchars($datosEstadoCandidato['color']) ?>"></i>
                                            <?= htmlspecialchars($datosEstadoCandidato['nombre']) ?>
                                        </a>

                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink<?= $postulacion['id'] ?>">
                                            <a class="dropdown-item <?= $estadoAplicacion == '0' ? "active" : "" ?>" onclick="cambiarEstado(<?= $postulacion['id'] ?>, 'Sin estado', 'dropdownMenuLink<?= $postulacion['id'] ?>', 'black', '0')">
                                                <i class="fas fa-circle" style="color: black"></i> Sin estado
                                            </a>
                                            <?php foreach ($datosEstadosCandidato as $i => $estadoC) {  ?>
                                            <a class="dropdown-item <?= $estadoC["id"] == $estadoAplicacion ? "active" : "" ?>" onclick="cambiarEstado(<?= $postulacion['id'] ?>, '<?= $estadoC['nombre'] ?>', 'dropdownMenuLink<?= $postulacion['id'] ?>', '<?= htmlspecialchars($estadoC['color']) ?>', '<?=$estadoC['id']?>')">
                                                <i class="fas fa-circle" style="color: <?= htmlspecialchars($estadoC['color']) ?>"></i> <?= htmlspecialchars($estadoC['nombre']) . " Comparando " . $estadoC["id"] . " con " . $estadoAplicacion ?>
                                            </a>
                                            <?php } ?>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-center"><?= $postulacion["archivo"] ? "<i class='fas fa-file-pdf' onclick='abrirPDF(\"" . $postulacion["archivo"] . "\")'></i>" : "" ?></i></td>
                                <td>
                                    <i class="fas fa-eye" title="Ver detalle" onclick="verCandidato(<?= $postulacion['idCandidato'] ?>)"></i>
                                    <i class="fas fa-handshake" title="Pasar a entrevista" onclick="citarEntrevista('<?= $postulacion['idCandidato'] ?>','<?=$postulacion['id']?>', '<?=$datosPuesto['titulo']?>' ,'<?=$nombrePuesto?>')"></i>
                                    <i class="fas fa-file-signature" title="Contratar" onclick="contratar(<?= $postulacion['idCandidato'] ?>)"></i>
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
    <div class=" col-12 row mb-4"
        >
        <div class="col-6">
            <h4 class="mb-1" >Entrevistas</h4>
        </div>
    </div>
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
                            $nombreCandidato = $datosCandidato["nombre"] . " " . $datosCandidato["apellido"] ;

                            $postulacionId = intval($entrevista["postulacionId"]);
                            $datosPostulacion = $ControllerPostulaciones->obtenerPorId($postulacionId);

                            $idPuesto = intval($datosPostulacion["idPuesto"]);
                            $datosPuesto = $ControllerPuestosTrabajo->obtenerPorId($idPuesto);

                            ?>
                            <tr>
                                <input type="hidden" id="data_entrevista_<?= $entrevista['id'] ?>" value='<?= htmlspecialchars(json_encode($entrevista), ENT_QUOTES) ?>'>
                                <input type="hidden" id="data_parametros_entrevista_<?= $entrevista['id'] ?>" value='<?= $datosPuesto["parametros"] ?>'>
                                <td><?= $entrevista["id"] ?></td>
                                <td><?= $entrevista["fecha"] ?></td>
                                <td><?= $entrevista["hora"] ?></td>
                                <td><?= $nombreCandidato ?></td>
                                <td><?= $entrevista["cargoAplica"] ?></td>
                                <td>
                                    <div class="col-md-12 d-flex justify-content-around">
                                        <i class="fas fa-star" title="Puntuar entrevista" onclick="puntuarEntrevista(<?= $entrevista['id'] ?>, <?= $idCandidato ?> , <?= $postulacionId ?> , <?= $idPuesto ?>)"></i>
                                        <i class="fas fa-pen" title="Editar" onclick="editarEntrevista(<?= $entrevista['id'] ?>)"></i>
                                        <i class="fas fa-trash" title="Eliminar" onclick="eliminarEntrevista(<?= $entrevista['id'] ?>)"></i>
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
    <div class=" col-12 row mb-4"
        id="scrollspyContratos">
        <div class="col-6">
            <h4 class="mb-1" id="scrollspyContratos">Contratos</h4>
        </div>
    </div>
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
                                        <input type="hidden" id="data_contrato_<?= $contrato['id'] ?>" value='<?= htmlspecialchars(json_encode($contrato), ENT_QUOTES) ?>'>
                                        <td class="align-middle"><?= $contrato['id'] ?></td>
                                        <td class="align-middle"><?= $nombreTrabajador  ?></td>
                                        <!-- <td class="align-middle"><?= date("Y-m-d") ?></td> -->
                                        <td class="align-middle"><?= $contrato['fechaContrato'] ?></td>
                                        <td class="align-middle"><?= $contrato['fechaFinContrato'] ?></td>
                                        <td class="align-middle"><?= $contrato['duracionContrato'] ?></td>
                                        <td class="align-middle"><?= "$ " . number_format($contrato['salario']) . " " . $ConfigNominaUser["moneda"] ?></td>
                                        <td class="align-middle" >
                                            <div class="col-md-12" style="display: flex; justify-content: space-around">
                                                <i class="fas fa-pencil" title="Editar Contrato" onclick="editarContrato('<?= htmlspecialchars($contrato['id']) ?>', '<?= $contrato['id'] ?>')"></i>
                                                <i class="fas fa-trash" title="Eliminar Contrato" onclick="borrarContrato('<?= $contrato['id'] ?>')"></i>
                                                <i class="fas fa-print" title="Imprimir" onclick="window.open(href='FE_ImprimirContrato?i=<?= base64_encode($contrato['id']) ?>', '_blank')"></i>
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



<!-- <div class="mb-8 px-4 animate__fadeInUp" id="sub-content-promociones">
    <div class=" col-12 row mb-4"
        >
        <div class="col-6">
            <h4 class="mb-1" >Promociones</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">




            </div>
        </div>
    </div>
</div> -->


<div class="mb-8 px-4 animate__fadeInUp" id="sub-content-configweb">
    <div class=" col-12 row mb-4"
        >
        <div class="col-6">
            <h4 class="mb-1" >Sitio web</h4>
        </div>
    </div>
    <div class="col-12 row">
        <div class="card mb-3">
            <div class="card-body">
                
                <div class="col-md-12 row">
                    <div class="col-md-12">
                        <label for="">Encabezado </label>
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" type="text" id="encabezado">
                    </div>

                    <div class="col-md-12">
                        <label for="">Descripcion corta</label>
                        <textarea style="height: 100px" onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" id="descripcion"></textarea>
                    </div>

                    <!-- <div class="col-md-12">
                        <label for="">Descripcion detallada</label>
                        <textarea style="height: 100px" onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="editorJR" id="descripcion"></textarea>
                    </div> -->
                    
                    <div class="col-md-6">
                        <label for="">Color primario</label>
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" type="color" id="colorPrimario">
                    </div>

                    <div class="col-md-6">
                        <label for="">Color secundario</label>
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" type="color" id="colorSecundario">
                    </div>
                    
                    <div class="col-md-12 mt-2">
                        <label for="">Datos de contacto</label>
                    </div>

                    <div class="col-md-6">
                        <label for="">Direccion</label>
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" type="text" id="direccion">
                    </div>

                    <div class="col-md-6">
                        <label for="">Correo</label>
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" type="text" id="email">
                    </div>

                    <div class="col-md-6">
                        <label for="">Telefono</label>
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-control" type="text" id="telefono">
                    </div>

                    <div class="col-md-6">
                        <input onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.checked ? '1' : '0', 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" class="form-input" type="checkbox" id="habilitarContactanos">
                        <label for="">Habilitar Formulario de contactanos</label>
                    </div>



                    <div class="col-md-12 mt-2">
                        <label for="">Redes sociales</label>
                    </div>

                    <div class="col-md-6">
                        <label for=""><i class="fab fa-facebook"></i> Facebook</label>
                        <input placeholder="https://www.facebook.com/..." onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" id="facebook" class="form-control" type="text">
                    </div>
                    
                    <div class="col-md-6">
                        <label for=""><i class="fab fa-instagram"></i> Instagram</label>
                        <input placeholder="https://www.instagram.com/..." onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" id="instagram" class="form-control" type="text">
                    </div>

                    <div class="col-md-6">
                        <label for=""> <i class="fa-brands fa-x-twitter"></i> X</label>
                        <input placeholder="https://x.com/..." onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" id="x" class="form-control" type="text">
                    </div>
                    
                    <div class="col-md-6">
                        <label for=""><i class="fab fa-linkedin"></i> LinkedIn</label>
                        <input placeholder="https://co.linkedin.com/..." onchange="changeAjaxFast('REC_ConfiguracionWeb', this.id, this.value, 'idUsuario' , '<?= $_SESSION['ID'] ?>' , true)" id="linkedIn" class="form-control" type="text">
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
        $('#' + dropdownId).html(`<i class="fas fa-circle" style="color: ${colorEstado}"></i> ${nombreEstado}`);
        console.log("Estado cambiado a:", nombreEstado);
        // Aquí puedes agregar lógica adicional, como una llamada AJAX

        changeAjaxFast('REC_Postulacion', 'estadoAplicacion', estadoId, 'id' , index , true);


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
            url: "<?=$BASE?>Nomina/Reclutamiento/Ajax/AjaxConfigWeb.php", // URL del servidor
            type: "POST",
            data:{
                action: "consultar",
                idUsuario: "<?= $_SESSION['ID'] ?>"
            },
            success: function (response) {
                let { data } = JSON.parse(response);

                console.log("Consultando datos web");
                console.log("data" , data);
                
                if ( !data ) {
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
        
        $("#sub-content-configweb textarea, #sub-content-configweb input, #sub-content-configweb select").each( function(){
            let elemento = $(this);
            if ( elemento.attr("id") ) {
                data[elemento.attr("id")] = elemento.val();
            }
        } )

        data.idUsuario = "<?=$_SESSION['ID']?>";
        data.action = "decisionAction";
        data.id = "<?=$_SESSION['ID']?>";

        // console.log("data => " ,data);
        // return;

        $.ajax({
            url: "<?=$BASE?>Nomina/Reclutamiento/Ajax/AjaxConfigWeb.php", // URL del servidor
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
        let url = "<?=$BASE?>NominaA/ArchivosWeb/" + archivo;
        window.open(url, '_blank');
    }


    $(document).ready( function () {
        consultarDatosWeb();
        // crearOActualizarDatosWeb();
    } )

</script>