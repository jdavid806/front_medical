<?php

require_once __DIR__ .  "/../funciones/conn3.php";
require_once __DIR__ .  "/../funciones/funciones.php";

require_once __DIR__ .  "/../Models/Nomina/index.php";
require_once __DIR__ .  "/../Controllers/Nomina/index.php";

$idUsuario = decrypt($_GET["i"]);

if (!is_numeric($idUsuario)) { ?>
    <script>
        alert("Url no válida");
    </script>
<?php
    die();
}

$controllerConfiguracion = new ConfiguracionesController($conn3);
$configuracionUsuario = $controllerConfiguracion->obtenerPorIdUsuario($idUsuario)[0];
if (!$configuracionUsuario || empty($configuracionUsuario)) { ?>
    <script>
        alert("Usuario no configurado");
    </script>
<?php
    die();
} ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marcaje</title>
    <link rel="icon" href="https://erp.medicalsoftplus.com/pseudoiconomedical.png" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- JQUERY -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <!-- JQUERY -->


    <!-- FUENTE DIGITAL -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" rel="stylesheet">
    <!-- FUENTE DIGITAL -->

    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- FontAwesome CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">



    <style>
        #clock {
            background-color: #132030;
            border: 0 solid #D4D4D4;
            border-radius: 50%;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
        }

        body {
            margin: 0;
            height: 100vh;
            overflow: hidden;
            background: #121212;
        }

        .background::before,
        .background::after {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            top: 0;
            left: 0;
            background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 2.5px, transparent 2.5px);
            background-size: 50px 50px;
            animation: move 20s linear infinite;
        }

        .background::after {
            animation-delay: 5s;
            opacity: 0.5;
        }

        @keyframes move {
            from {
                transform: translateY(0);
            }

            to {
                transform: translateY(-100%);
            }
        }
    </style>
</head>

<body style="background-color: #F6F6F6;">
    <div class="background"></div>
    <!-- <div class="container d-flex justify-content-center align-items-center" style="height: 100vh;"> -->
    <center>
        <!-- <div class="container col-md-9 row mt-5" style="height: 100vh;"> -->
        <div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
            <div class="col-md-5 col-xs-12 d-none d-xl-block">
                <canvas id="clock" width="400" height="400"></canvas>
            </div>
            <div class="col-md-7 col-xs-12">
                <div class="card col-md-11">
                    <div class="card-body">
                        <h3 class="card-title mt-3 mb-3"> <i class="fas fa-user-clock"></i>&nbsp;Registro de marcaje</h3>
                        <img src="<?= $configuracionUsuario["logoBase64"] <> '' ? $configuracionUsuario["logoBase64"] : '../../logo_monaros_sinbg.png' ?>" alt="medical" style="max-height: 115px">
                        <h1 class="card-title mt-3 mb-3" id="hora-digital" style="font-family: 'Orbitron', sans-serif;"></h1>

                        <input type="number" onkeyup="consultarDocumento(this.value, <?= $idUsuario ?>)" placeholder="Numero de Documento" id="numero_documento" class="form-control" style="height: 80px; font-size: 50px;">
                        <input type="hidden" id="tipoMarcaje" value="0">
                        <button class="btn btn-lg mt-2" id="buttonStatus" onclick="guardarMarcaje()" style="width:100%" disabled><i class="fas fa-info"></i>&nbsp;Ingresa el Documento</button>
                        <label id="labelStatus"></label>
                    </div>
                </div>
            </div>

        </div>
    </center>
</body>

</html>

<script>
    const canvas = document.getElementById('clock');
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);
    const clockRadius = radius * 0.9;

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
        drawFace(ctx, clockRadius);
        drawTicks(ctx, clockRadius);
        drawNumbers(ctx, clockRadius);
        drawTime(ctx, clockRadius);
    }

    function drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#F6F6F6'; // Fondo del reloj
        ctx.fill();
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#D4D4D4'; // Espacio entre el borde interno y externo
        ctx.stroke();
    }
    // Dibujar solo los "palitos" que marcan las horas
    function drawTicks(ctx, radius) {
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI / 6);
            ctx.beginPath();
            ctx.lineWidth = 4; // Solo los palitos de las horas
            const x1 = radius * 0.75 * Math.cos(angle);
            const y1 = radius * 0.75 * Math.sin(angle);
            const x2 = radius * 0.9 * Math.cos(angle);
            const y2 = radius * 0.9 * Math.sin(angle);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#132030'; // Color oscuro para los palitos
            ctx.stroke();
        }
    }

    function drawNumbers(ctx, radius) {
        const ang = Math.PI / 6;
        ctx.font = radius * 0.15 + "px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (let num = 1; num <= 12; num++) {
            const x = radius * 0.6 * Math.cos(num * ang - Math.PI / 2);
            const y = radius * 0.6 * Math.sin(num * ang - Math.PI / 2);
            ctx.fillText(num.toString(), x, y);
        }
    }

    function drawTime(ctx, radius) {
        const now = new Date();
        const hour = now.getHours() % 12;
        const minute = now.getMinutes();
        const second = now.getSeconds();
        // Manecilla de la hora
        const hourAng = (hour + minute / 60) * Math.PI / 6;
        drawHand(ctx, hourAng, radius * 0.5, 8, '#132030');
        // Manecilla del minuto
        const minuteAng = (minute + second / 60) * Math.PI / 30;
        drawHand(ctx, minuteAng, radius * 0.7, 6, '#132030');
        // Manecilla de los segundos
        const secondAng = second * Math.PI / 30;
        drawHand(ctx, secondAng, radius * 0.85, 4, '#BBD5E7');
    }

    function drawHand(ctx, pos, length, width, color) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round'; // Extremos redondeados para las manecillas
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    function horaDigital() {
        const ahora = new Date();

        // Obtener horas, minutos y segundos
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
        let segundos = ahora.getSeconds();

        // Formatear para que siempre tengan dos dígitos
        horas = horas < 10 ? '0' + horas : horas;
        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        // Devolver la hora en formato hh:mm:ss
        let horaCompleta = `${horas}:${minutos}:${segundos}`;
        document.getElementById('hora-digital').textContent = horaCompleta;
    }

    horaDigital();
    drawClock();


    setInterval(() => {
        horaDigital()
    }, 1000);
    setInterval(drawClock, 1000); // Actualizar cada segundo
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
<script>
    function consultarDocumento(value, idUsuario) {
        let button = $("#buttonStatus");
        let label = $("#labelStatus");
        if (value == "") {
            button.html(`<i class="fas fa-info"></i>&nbsp;Ingresa el Documento`);
            button.attr("class", `btn btn-lg mt-2`);
            button.attr("disabled", true);

            return;
        }


        button.html(`<div class="spinner-grow text-light" role="status"><span class="sr-only">Cargando...</span></div>`);


        let url = 'https://erp.medicalsoftplus.com/FE/AjaxMarcaje.php';
        console.log(`Consultando a ${url}...`);;
        
        $.ajax({
            type: "POST",
            url,
            data: {
                action: "Consultar_Documento",
                value: btoa(value),
                idUsuario,
            },
            success: function(response) {
                // console.log(response);

                const { msg, clase, isDisabled, tipoMarcaje, text} = JSON.parse(response);
                button.html(`${msg}`);
                button.attr("class", `btn btn-lg mt-2 btn-${clase}`);
                button.attr("disabled", isDisabled);
                if (tipoMarcaje != false) {
                    $("#tipoMarcaje").val(tipoMarcaje);
                } else {
                    $("#tipoMarcaje").val("0");
                }
                label.html(text);



            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        })
    }

    function guardarMarcaje() {
        let url = 'https://erp.medicalsoftplus.com/FE/AjaxMarcaje.php';

        let numero_documento = $("#numero_documento").val();
        let tipoMarcaje = $("#tipoMarcaje").val();
        let idUsuario = <?= $idUsuario ?>;

        if (tipoMarcaje == 'S') {
            tipoMarcaje = "Salida"
        } else if (tipoMarcaje == 'E') {
            tipoMarcaje = "Entrada"
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrio un error',
            })
            return;
        }


        $.ajax({
            type: "POST",
            // url: "./AjaxMarcaje.php",
            url,
            data: {
                action: "Guardar",
                numero_documento,
                tipoMarcaje,
                idUsuario
            },
            success: function(response) {
                console.log(response);
                let dataResponse = JSON.parse(response);
                const { icon, text, title } = dataResponse;
                if (dataResponse.error) {
                    console.log(dataResponse.error);
                }

                Swal.fire({ icon, title, text, })
                // if(icon == 'success') return;
                if (icon == 'success') {
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                }


                $("#numero_documento").val("");
                $("#tipoMarcaje").val("0");


            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        })

    }
</script>

<style>
    .btn-info {
        color: white
    }
</style>