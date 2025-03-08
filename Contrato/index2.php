<?php

include "./../funciones/conn3.php";
include "./../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS

// ? CONTRATOS
include "./../Models/Nomina/Contratos.php";
include "./../Controllers/Nomina/Contratos.php";
// ? CONTRATOS

// ? PLANTILLAS CONTRATOS
include "./../Models/Nomina/PlantillaContrato.php";
include "./../Controllers/Nomina/PlantillaContrato.php";
// ? PLANTILLAS CONTRATOS

// $data = [ "idContrato" => 1, "idUsuario" => 1 ];

$json = base64_decode($_GET['json']);
$data = json_decode($json, true);
$idContrato = $data['idContrato'];
$idUsuario = $data['idUsuario'];
// $idContrato = base64_decode($_GET['json']);

$ControllerContrato = new ContratosController($conn3);
$ControllerPlantillasContrato = new PlantillasContratoController($conn3);

$datosContrato = $ControllerContrato->obtenerPorId($idContrato);
$datosContrato = $datosContrato[0];
$plantillaContrato = $datosContrato['plantillaContrato'];

$datosPlantillaContrato = $ControllerPlantillasContrato->obtenerPorId($plantillaContrato);

$requerimientosContrato = [
    "Firma" => $datosPlantillaContrato["aplicaFirma"],
    "Foto" => $datosPlantillaContrato["aplicaFoto"],
    "Documento" => $datosPlantillaContrato["aplicaDocumento"]
];

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Bootstrap  -->

    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <!-- jQuery -->

    <!-- SWEET ALERT -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
    <!-- SWEET ALERT -->

    <!-- FONT AWESOME -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- FONT AWESOME -->

    <!-- NUNITO -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
    <!-- NUNITO -->

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="https://erp.medicalsoftplus.com/pseudoiconomedical.png" type="image/x-icon">
    <title>Contrato #<?= $idContrato ?></title>
    <style>
        * {
            font-family: 'Nunito', sans-serif;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #F6F6F6;
        }

        .card {
            width: 100%;
            max-width: 900px;
            /* Limitar el ancho máximo de la tarjeta */
        }

        /*ALUSIVOS A LOS COLORES DE MONAROS*/
        .text-primary {
            color: #132030 !important;
        }

        .active {
            color: #132030 !important;
        }

        .btn-primary {
            background-color: #132030 !important;
        }

        .btn-info {
            background-color: #274161 !important;
            color: white !important;
        }

        p {
            text-align: justify;
        }

        .mobile {
            width: 250px;
            height: 500px;
            border: 16px solid #132030;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            background-color: #fff;
        }

        .screen {
            width: 100%;
            height: 100%;
            background-color: #000;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            position: relative;
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .notch {
            width: 100px;
            height: 20px;
            background: #000;
            position: absolute;
            top: 0;
            left: calc(50% - 50px);
            border-radius: 10px;
        }

        .img-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            /* Cambia el ancho si quieres limitarlo */
            height: 100%;
            /* Se asegura de ocupar el espacio completo del div */
            object-fit: cover;
            display: none;
            /* Ocultamos la imagen por defecto */
            z-index: 5;
            /* Mantiene la imagen por debajo del botón */
        }

        .capture-button {
            position: absolute;
            bottom: 20px;
            /* Coloca el botón en la parte inferior */
            left: calc(50% - 30px);
            /* Centra horizontalmente */
            background: rgba(0, 0, 0, 0.7);
            /* Fondo oscuro */
            border-radius: 50%;
            /* Botón redondo */
            padding: 10px;
            cursor: pointer;
            /* Cambia el cursor al pasar por encima */
            z-index: 10;
            /* Asegura que el botón esté por encima de la imagen */
        }

        #signature-pad {
            border: 2px dashed #132030;
            /* Color y estilo del borde */
            border-radius: 10px;
            /* Bordes redondeados */
            width: 100%;
            /* Ancho completo */
            height: 200px;
            /* Altura fija */
            position: relative;
            /* Para posicionar elementos hijos */
            margin-top: 20px;
            /* Margen superior */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            /* Sombra ligera */
            overflow: hidden;
            /* Para evitar que el canvas se desborde */
        }

        canvas {
            border-radius: 10px;
            /* Bordes redondeados en el canvas */
            position: absolute;
            /* Posicionamiento absoluto dentro del div */
            top: 0;
            /* Alineación superior */
            left: 0;
            /* Alineación izquierda */
        }
    </style>

</head>

<body>
    <?php
    if (!is_numeric($idContrato)) {
        error_log("Invalid contract ID: $idContrato");
        echo "<script>Swal.fire({icon: 'error', title: 'Error', text: 'Contrato no válido'});</script>";
        die();
    }else if ($datosContrato['fechaDiligenciamiento'] <> "") {
        echo "<script>Swal.fire({icon: 'warning', title: 'Accion no válida', text: 'Este contrato ya fue diligenciado'});</script>";
        die();
    }else if ($datosContrato['activo'] <> "1") {
        echo "<script>Swal.fire({icon: 'error', title: 'Error', text: 'Este contrato ya no se encuentra disponible'});</script>";
        die();
    }

    ?>
    <form onsubmit="(event)=>event.preventDefault()" id="formContrato">

        <div class="card" style="min-height: 75vh" id="lista-contenido">
            <div class="card-header">
                <h1 class="card-title"><i class="fas fa-file-signature"></i> Contrato</h1>
            </div>
            <?php $indice = 1; ?>
            <div class="card-body">
                <div id="step-contrato-<?= $indice ?>">
                    <div class="col-md-12 row">
                        <div class="col-md-6">
                            <h3>¡Felicitaciones!</h3>
                            <p> Estás a un paso de ser parte de nuestro equipo. Para completar tu proceso de contratación, por favor realiza los siguientes pasos </p>
                            <ul>
                                <li>Descarga, lee y comprende tu contrato. En caso de duda puedes ponerte en contacto con nosotros</li>
                                <?= ($requerimientosContrato["Documento"] == 'true') ? "<li>Carga tu documento de identidad en formato PDF</li>" : "" ?>
                                <?= ($requerimientosContrato["Foto"] == 'true') ? "<li>Tomate una selfie con la camara de tu dispositivo</li>" : "" ?>
                                <?= ($requerimientosContrato["Firma"] == 'true') ? "<li>Diligencia la firma de tu contrato</li>" : "" ?>
                            </ul>
                            <p>Tu compromiso es fundamental y estamos emocionados de tenerte a bordo. ¡Gracias por formar parte de esta aventura!</p>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center flex-column">
                            <img src="../../logo_monaros_sinbg.png" style="width: 50%; margin-bottom: 10px;">
                            <h6>&</h6>
                            <img src="../../logo_monaros_sinbg.png" style="width: 50%;">
                        </div>
                    </div>
                </div>

                <?php $indice += 1; ?>
                <div id="step-contrato-<?= $indice ?>">
                    <div class="col-md-12 row">
                        <div class="col-md-6">
                            <h3>Paso <?= $indice - 1 ?>. Lee tu contrato</h3>
                            <p>En esta sección, te invitamos a revisar detenidamente el contrato que se te presenta. Es fundamental que comprendas todos los términos y condiciones establecidos, ya que este documento formaliza tu relación con nuestra empresa. Asegúrate de prestar especial atención a las cláusulas relacionadas con tus derechos y obligaciones, así como a cualquier información pertinente sobre tu rol y beneficios.<br><br>

                                <a class="" target="_blank" href="https://erp.medicalsoftplus.com/FE/Contrato/descargar.php?i=<?= base64_encode($idContrato) ?>"><i class="fas fa-file-arrow-down"></i>Descargar contrato</a>
                            </p>

                            <input type="checkbox" required name="autorizarContrato" required id="autorizarContrato">
                            <label for="">Confirmo que leo y comprendo el presente contrato</label>

                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center">
                            <h1 class="text-center"><i class="fas fa-book fa-5x"></i></h1>
                        </div>
                    </div>
                </div>
                <?php
                if ($requerimientosContrato["Documento"] == 'true') {
                    $indice += 1; ?>
                    <div id="step-contrato-<?= $indice ?>">
                        <div class="col-md-12 row">
                            <div class="col-md-6">
                                <h3>Paso <?= $indice - 1 ?>. Cargue de documento</h3>
                                <p>Por favor carga tu documento de identidad en formato PDF. Asegúrate de que el archivo sea legible y esté en buenas condiciones. Esto es fundamental para validar tu información. El archivo debe tener un tamaño máximo de 5 MB</p>
                                <input type="file" id="documento" class="form-control mt-3" accept="application/pdf">
                            </div>
                            <div class="col-md-6 d-flex justify-content-center align-items-center">
                                <h1 class="text-center"><i class="fas fa-upload fa-5x"></i></h1>
                            </div>
                        </div>
                    </div>
                <?php } ?>

                <?php
                if ($requerimientosContrato["Foto"] == 'true') {
                    $indice += 1; ?>
                    <div id="step-contrato-<?= $indice ?>">
                        <div class="col-md-12 row">
                            <div class="col-md-6">
                                <h3>Paso <?= $indice - 1 ?>. Tomate una foto</h3>
                                <p>¡Es momento de capturar tu esencia! En esta sección, te pedimos que te tomes una selfie con la cámara de tu dispositivo. Esto es importante para verificar tu identidad.
                                    <br><br>
                                    Cuando estés listo presiona en el icono de la camara <i class="fas fa-camera"></i>
                                    <br><br>
                                    O puedes.
                                </p>
                                <button class="btn btn-primary" id="capture" type="button" onclick="takePhoto()"><i class="fas fa-camera"></i>&nbsp;Tomar capturar</button>


                            </div>
                            <div class="col-md-6 d-flex justify-content-center align-items-center flex-column">
                                <input type="hidden" id="fotoBase64">
                                <div class="mobile">
                                    <div class="notch"></div>
                                    <div class="screen">
                                        <video id="video" autoplay playsinline></video>
                                        <img id="photo" class="img-preview" alt="Captured Photo" />
                                        <h3 class="text-light mt-3 mb-3" style="padding: 10px; border-radius:100%; border: 1px solid white" onclick="takePhoto()"><i class="fas fa-camera fa-1x"></i></h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php } ?>

                <?php
                if ($requerimientosContrato["Firma"] == 'true') {
                    $indice += 1; ?>
                    <div id="step-contrato-<?= $indice ?>">
                        <div class="col-md-12 row">
                            <div class="col-md-6">
                                <h3>Paso <?= $indice - 1 ?>. Ingresa una firma</h3>
                                <p>Asegúrate de que tu firma sea clara y legible, ya que representa tu conformidad con los términos y condiciones establecidos. Tómate tu tiempo para firmar con calma y precisión.</p>
                            </div>
                            <div class="col-md-6 d-flex justify-content-center align-items-center flex-column">
                                <h3>Firma aqui</h3>
                                <div id="signature-pad">
                                    <canvas id="canvas"></canvas> <!-- Canvas para la firma -->
                                </div>
                                <input type="hidden" id="contentFirma" name="contentFirma"> <!-- Input oculto para guardar la firma -->
                                <button type="button" class="btn btn-danger mt-3" id="clear"><i class="fas fa-eraser"></i>&nbsp;Reiniciar Firma</button> <!-- Botón para reiniciar -->
                            </div>
                        </div>
                    </div>
                <?php } ?>
            </div>
            <div class="card-footer">
                <div class="col-md-12 row">
                    <div class="col-md-6 text-start mt-3 mb-3">
                        <div id="paginacionModal"></div>
                    </div>
                    <div class="col-md-6 text-end mt-3 mb-3">
                        <button class="btn btn-primary" type="button" onclick="guardarContrato()"><i class="fas fa-bookmark"></i>&nbsp;Guardar y Finalizar</button> <!-- Botón para reiniciar -->

                    </div>
                </div>
            </div>
        </div>
    </form>

</body>

</html>

<script>
    $(document).ready(function() {
        let indice = <?= $indice ?>;
        indice = Number(indice);
        paginacionModal("lista-contenido", "step-contrato-", indice); // Cambia a 4 ya que hay 4 secciones
    });

    function guardarContrato() {
    let autorizarContrato = $("#autorizarContrato").is(":checked");
    let documento = document.getElementById('documento').files[0]; // Solo el archivo
    let foto = document.getElementById('fotoBase64').value; // Base64 de la foto
    let firma = document.getElementById('contentFirma').value; // Base64 de la firma
    let id = <?= $idContrato ?>;

    if (!autorizarContrato) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor marcar el check de confirmación de lectura del contrato'
        });
        return;
    }

    // Validar que se hayan llenado los campos necesarios
    if (!documento) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor insertar el documento'
        });
        return;
    }
    
    if (!foto) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor tómate la foto'
        });
        return;
    }

    if (!firma) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor realizar el trazado de la firma'
        });
        return;
    }

    // Crear un objeto con los datos
    let data = {
        autorizarContrato: autorizarContrato,
        idContrato: id,
        fotoBase64: foto,
        contentFirma: firma,
    };

    // Convertir el objeto a JSON
    let jsonData = JSON.stringify(data);

    // Crear un FormData para el archivo
    let formData = new FormData();
    formData.append('documento', documento); // Añadir el archivo
    formData.append('data', jsonData); // Añadir el objeto JSON

    // Enviar los datos mediante AJAX
    $.ajax({
        type: 'POST',
        url: 'https://erp.medicalsoftplus.com/FE/Contrato/AjaxContrato2.php',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
            

            response = JSON.parse(response);
            const {icon, text, title} = response
            Swal.fire({icon,title,text})

            
            if (response.error) {
                console.log(response.error);
                
            }

            if (response.icon == 'success') {
                setTimeout(() => {
                    location.reload();
                }, 1000);
                
            }
        },
        error: function(xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar los datos.'
            });
        }
    });
}




    function irASeccion(indice, idModal, idComun, numSections) {
        let seccionActual = parseInt($(`#${idModal}`).data('seccionActual')) || 1;

        if (indice == '+') {
            seccionActual += 1;
        } else if (indice == '-') {
            seccionActual -= 1;
        } else if (typeof indice == 'number') {
            seccionActual = indice;
        } else {
            alert("No cumple");
        }

        // Ensure the section number is within bounds
        if (seccionActual < 1) {
            seccionActual = 1;
        } else if (seccionActual > numSections) {
            seccionActual = numSections;
        }

        $(`#${idModal}`).data('seccionActual', seccionActual); // Store the current section in data

        for (let i = 1; i <= numSections; i++) {
            if (i == seccionActual) {
                $(`#${idModal} #${idComun}${i}`).css("display", "block");
                $(`#${idModal} #btn-paginacion-${i}`).addClass("btn-info").removeClass("btn-primary");
            } else {
                $(`#${idModal} #${idComun}${i}`).css("display", "none");
                $(`#${idModal} #btn-paginacion-${i}`).addClass("btn-primary").removeClass("btn-info");
            }
        }
    }

    function paginacionModal(idModal, idComun, numSections) {
        let seccionActual = 1;
        $(`#${idModal}`).data('seccionActual', seccionActual); // Store the current section

        let contenidoPaginacion = `<div style='display:flex; flex-direction:row; justify-content: center;'>
                                <button type="button" style="margin-right:5px" onclick="irASeccion('-', '${idModal}', '${idComun}', ${numSections})" class='btn btn-primary btn-sm'> <i class='fas fa-angle-left'></i> Anterior </button>`;
        for (let i = 1; i <= numSections; i++) {
            contenidoPaginacion += `<button type="button" id="btn-paginacion-${i}" style="margin-right:5px" onclick="irASeccion(${i}, '${idModal}', '${idComun}', ${numSections})" class='btn btn-primary btn-sm'>${i}</button>`;
        }
        contenidoPaginacion += `<button type="button" style="margin-right:5px" onclick="irASeccion('+', '${idModal}', '${idComun}', ${numSections})" class='btn btn-primary btn-sm'>Siguiente <i class='fas fa-angle-right'></i> </button>
                            </div>`;

        $(`#${idModal} #paginacionModal`).html(contenidoPaginacion);
        irASeccion(seccionActual, idModal, idComun, numSections);
    }

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const fileInput = document.getElementById('fileInput');
        const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

        if (fileInput.files[0].size > maxSizeInBytes) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El archivo excede el tamaño máximo permitido (5 MB).',
            });
            event.preventDefault(); // Evitar el envío del formulario
        }
    });
</script>

<script>
    const video = document.getElementById('video');
    const photo = document.getElementById('photo');
    const constraints = {
        video: {
            facingMode: "user",
            width: {
                ideal: 200
            },
            height: {
                ideal: 400
            }
        }
    };

    // Solicitar acceso a la cámara
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error al acceder a la cámara: ', error);
        });



    function takePhoto() {
        if (photo.style.display === "block") {
            // Si ya hay una imagen, la ocultamos y reiniciamos la cámara
            photo.style.display = "none";
            video.style.display = "block";
            $("#capture").html("<i class='fas fa-camera'></i>&nbsp;Tomar captura");
            $("#fotoBase64").val("");
        } else {
            // Capturar la imagen y mostrarla
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');
            photo.src = dataURL;
            $("#fotoBase64").val(dataURL);
            photo.style.display = "block"; // Mostrar la imagen
            video.style.display = "none"; // Ocultar el video
            $("#capture").html("<i class='fas fa-camera-rotate'></i>&nbsp;Tomar otra foto");
        }
    }
</script>

<script>
    // Obtener elementos del DOM
    const canvas = document.getElementById('canvas');
    const signatureInput = document.getElementById('contentFirma');
    const clearButton = document.getElementById('clear');
    const ctx = canvas.getContext('2d'); // Contexto para dibujar en el canvas

    // Configuración del canvas
    canvas.width = 600; // Ancho del canvas
    canvas.height = 200; // Altura del canvas

    let drawing = false; // Variable para saber si se está dibujando
    let lastX = 0; // Última posición X
    let lastY = 0; // Última posición Y

    // Iniciar dibujo
    canvas.addEventListener('mousedown', (e) => {
        drawing = true; // Activar el estado de dibujo
        [lastX, lastY] = [e.offsetX, e.offsetY]; // Guardar posición inicial
    });

    // Dibujar en el canvas
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return; // Si no se está dibujando, salir
        ctx.beginPath(); // Comenzar un nuevo trazo
        ctx.moveTo(lastX, lastY); // Mover a la última posición
        ctx.lineTo(e.offsetX, e.offsetY); // Dibujar hasta la nueva posición
        ctx.strokeStyle = '#132030'; // Color del trazo
        ctx.lineWidth = 2; // Grosor del trazo
        ctx.stroke(); // Dibujar el trazo
        [lastX, lastY] = [e.offsetX, e.offsetY]; // Actualizar la posición
    });

    // Finalizar dibujo
    canvas.addEventListener('mouseup', () => {
        drawing = false; // Desactivar el estado de dibujo
        // Guardar la firma como imagen en Base64 en el input oculto
        signatureInput.value = canvas.toDataURL('image/png');
    });

    // Reiniciar el canvas
    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        signatureInput.value = ''; // Vaciar el input oculto
    });
</script>