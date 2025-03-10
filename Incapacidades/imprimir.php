<?php
include "../funciones/funcionesEncrypt/encriptar.php";
include "../funciones/conectividad/consultas.php";

if (isset($_GET['id'])) {
  $id = decryptData($_GET['id']);
  parse_str($id, $params);

  if (isset($params['fk']) && isset($params['sk'])) {
    $fk = decryptData($params['fk']);
    $sk = decryptData($params['sk']);

    $sk = mb_convert_encoding($sk, 'UTF-8', 'auto');

    if ($sk !== "Anti?eros") {
      accesoNoPermitido();
      exit;
    }

    $incapacidad = obtenerDatos("disabilities", $fk);
    $paciente = obtenerDatos("patients", $incapacidad['patient_id']);

    $documentoPaciente = $paciente['document_number'];

    if (isset($_POST['documento'])) {
      $documentoIngresado = $_POST['documento'];

      $response = [
        "success" => $documentoIngresado === $documentoPaciente,
        "message" => $documentoIngresado === $documentoPaciente ? "Documento correcto" : "Documento incorrecto",
      ];

      if ($documentoIngresado === $documentoPaciente) {
        $response["incapacidad"] = $incapacidad;
      }

      echo json_encode($response);
      exit;
    }
    ?>

    <!DOCTYPE html>
    <html lang="es">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Validación de Documento</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <script>
        function validarDocumento() {
          let documentoIngresado = document.getElementById("documento").value;

          fetch("", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "documento=" + encodeURIComponent(documentoIngresado)
          })
            .then(response => response.json())
            .then(data => {
              console.log("Respuesta del servidor:", data);
              if (data.success) {
                crearImpresionCopia(data.incapacidad, "Completo");
                document.getElementById("mensaje").innerHTML = "<div class='alert alert-success'>" + data.message + "</div>";
              } else {
                document.getElementById("mensaje").innerHTML = "<div class='alert alert-danger'>" + data.message + "</div>";
              }
            })
            .catch(error => console.error("Error en la validación:", error));
        }
      </script>
    </head>

    <body class="bg-light">
      <div class="container mt-5">
        <h2>Validación de Documento del Paciente</h2>
        <p>Ingrese el número de documento del paciente para continuar:</p>
        <input type="text" id="documento" class="form-control" placeholder="Ingrese el documento">
        <button class="btn btn-primary mt-3" onclick="validarDocumento()">Validar</button>
        <div id="mensaje" class="mt-3"></div>
      </div>
    </body>

    <!-- ===============================================-->

    <!-- crear impresiones -->
    <script src="../PlantillasImpresion/FuncionExtra.js"></script>
    <script src="../PlantillasImpresion/CrearImpresion.js"></script>


    <!-- consultar información impresiones -->
    <script src="../funciones/funcionesJS/ConsultasDinamicas.js"></script>
    <script src="../funciones/funcionesJS/utils.js"></script>
    <script src="../funciones/funcionesJS/CrearFormatoImpresion.js"></script>

    </html>
    <?php
  } else {
    accesoNoPermitido();
    exit;
  }
} else {
  accesoNoPermitido();
  exit;
}

function accesoNoPermitido()
{
  http_response_code(405);
  echo '<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso No Permitido</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div class="container vh-100 d-flex justify-content-center align-items-center">
            <div class="text-center p-5 bg-white shadow rounded">
                <h1 class="text-danger">🚫 Acceso Denegado</h1>
                <p class="lead">No tienes permiso para acceder a esta página.</p>
            </div>
        </div>
    </body>
    </html>';
  exit;
}
