<?php
include "./Utils.php";

function generarFormatoReceta($id)
{
  $urlApi = getHost() . "/medical/recipes/{$id}";
  $dataReceta = consultarApi($urlApi);
  // var_dump($dataReceta);


  $contenido = "
  <div class=\"container border rounded shadow-sm text-start\">
    <h3 class=\"text-primary text-center\">Receta Médica</h3>
    <h4 class=\"text-secondary\">Detalles de la receta:</h4>
";

  // Generamos el contenido en formato horizontal y agrupado
  if (count($dataReceta['data']['recipe_items']) > 0) {
    foreach ($dataReceta['data']['recipe_items'] as $index => $item) {
      $contenido .= "
      <div class=\"mb-2\">
        <h5 class=\"text-primary\">Medicamento " . ($index + 1) . ":</h5>
        <p><strong>Nombre:</strong> " .
        $item['medication'] .
        " - <strong>Concentración:</strong> " .
        $item['concentration'] .
        " - <strong>Tipo:</strong> " . $item['medication_type'] . "</p>
        <p><strong>Frecuencia:</strong> " .
        $item['frequency'] .
        " - <strong>Duración:</strong> " .
        $item['duration'] .
        " días - <strong>Toma cada:</strong> " . $item['take_every_hours'] . " horas</p>
        <p><strong>Cantidad:</strong> " . $item['quantity'] . "</p>
        <p><strong>Observaciones:</strong> " .
        (isset($item['observations']) ? $item['observations'] : "Sin observaciones") .
        "</p>
      </div>
      <hr>";
    }
  } else {
    $contenido .= "
    <p class=\"text-muted fst-italic\">No hay medicamentos en esta receta</p>";
  }

  $contenido .= "
  </div>";

  $datosPaciente = consultarDatosPaciente($dataReceta['data']['patient']['id']);
  $datosDoctor = consultarDatosDoctor($dataReceta['data']['prescriber']['id']);
  $datosEmpresa = consultarDatosEmpresa();
  $resultado = [
    'paciente' => $datosPaciente,
    'doctor' => $datosDoctor,
    'consultorio' => $datosEmpresa,
    'contenido' => $contenido
  ];

  return json_encode($resultado);
}

function generarFormatoIncapacidad($id)
{
  $urlApi = getHost() . "/medical/patients/{$id}/disabilities";
  $dataIncapacidad = consultarApi($urlApi);
  // var_dump($dataIncapacidad);

  $contenido = "
  <div class=\"container p-3 border rounded shadow-sm\">
    <h3 class=\"text-primary\">Certificado de Incapacidad</h3>
    <hr>
    <div class=\"mb-3\">
      <h5 class=\"fw-bold\">Motivo de Incapacidad:</h5>
      <p class=\"text-muted\">" . $dataIncapacidad[0]['reason'] . "</p>
    </div>
    <div class=\"row\">
      <div class=\"col-md-6\">
        <p><strong>Desde:</strong> " . $dataIncapacidad[0]['start_date'] . "</p>
      </div>
      <div class=\"col-md-6\">
        <p><strong>Hasta:</strong> " . $dataIncapacidad[0]['end_date'] . "</p>
      </div>
    </div>
  </div>";

  $datosPaciente = consultarDatosPaciente($dataIncapacidad['data'][0]['patient']['id']);
  $datosDoctor = consultarDatosDoctor($dataIncapacidad['data'][0]['user']['id']);
  $datosEmpresa = consultarDatosEmpresa();
  $resultado = [
    'paciente' => $datosPaciente,
    'doctor' => $datosDoctor,
    'consultorio' => $datosEmpresa,
    'contenido ' => $contenido
  ];

  return json_encode($resultado);
}

function generarFormatoConsulta($consulta_id)
{
  $urlApi = getHost() . "/medical/clinical-records/{$consulta_id}";
  $dataConsulta = consultarApi($urlApi);
  // var_dump($dataConsulta);

  $idTipoHistoria = $dataConsulta['clinical_record_type_id'];
  // echo $idTipoHistoria;
  $urlTipoHistoria = getHost() . "/medical/clinical-record-types/{$idTipoHistoria}";
  $tipoHistoria = consultarApi($urlTipoHistoria);
  // echo "<br>url ".$urlTipoHistoria;
  // echo "<br>Tipo historia ".$tipoHistoria['id'];
  // var_dump($tipoHistoria['name']);

  $contenido = "
<div class=\"container p-3 border rounded shadow-sm text-start\">
  <h3 class=\"text-primary text-center\">" . $tipoHistoria['name'] . "</h3>
  <hr>
  <h4 class=\"text-secondary\">Descripción:</h4>
  <p>" . (isset($dataConsulta['description']) ? $dataConsulta['description'] : "Sin descripción") . "</p>
  <hr>";
  $estructura = [
    "Información de la Consulta" => [
      ["titulo" => "Motivo de la consulta", "campos" => ["motivoConsulta"]],
      ["titulo" => "Evolución de los síntomas", "campos" => ["evolucionSintomas"]],
      ["titulo" => "Contexto de los síntomas", "campos" => ["contextoSintoma"]],
      ["titulo" => "¿Qué ha tomado?", "campos" => ["manejoSintoma"]],
    ],
    "Signos vitales" => [
      [
        "titulo" => "Medidas corporales",
        "campos" => ["peso", "altura", "imc", "porcentajeGrasaCorporal"]
      ],
      [
        "titulo" => "Presión y saturación",
        "campos" => [
          "presionArterialDiastolica",
          "presionArterialSistolica",
          "tensionArterialMedia",
          "saturacion"
        ]
      ],
      [
        "titulo" => "Circunferencias",
        "campos" => [
          "circunferenciaAbdominal",
          "circunferenciaCintura",
          "perimetroCefalico"
        ]
      ],
      [
        "titulo" => "Frecuencia y temperatura",
        "campos" => ["frecuenciaRespiratoria", "frecuenciaCardiaca", "temperatura"]
      ]
    ]
  ];
  // Función para capitalizar la primera letra de cada palabra
  function capitalizar($str)
  {
    return preg_replace_callback('/\b\w/', function ($matches) {
      return strtoupper($matches[0]);
    }, $str);
  }
  // Función para verificar si un campo ya está en la estructura
  function campoEnEstructura($campo, $estructura)
  {
    foreach ($estructura as $seccion) {
      foreach ($seccion as $grupo) {
        if (in_array($campo, $grupo['campos'])) {
          return true;
        }
      }
    }
    return false;
  }
  // Recorrer la estructura y generar el contenido
  foreach ($estructura as $seccion => $grupos) {
    $contenido .= "<h3 class=\"text-primary mt-2\">$seccion</h3><hr>";
    foreach ($grupos as $grupo) {
      $contenido .= "<h4 class=\"fw-bold text-secondary\">" . $grupo['titulo'] . "</h4><div class=\"row\">";
      foreach ($grupo['campos'] as $campo) {
        // En PHP, verificamos si existe y no es null
        if (!isset($dataConsulta['data'][$campo]) || $dataConsulta['data'][$campo] === null) {
          continue;
        }
        $valor = $dataConsulta['data'][$campo];
        $tituloCampo = capitalizar(preg_replace('/([A-Z])/', ' $1', strtolower($campo)));
        // Evitar mostrar el título redundante
        if (
          $grupo['titulo'] == "Motivo de la consulta" ||
          $grupo['titulo'] == "Evolución de los síntomas" ||
          $grupo['titulo'] == "Contexto de los síntomas"
        ) {
          $contenido .= "
                <div class=\"col-md-6\">
                  $valor
                </div>";
        } else {
          $contenido .= "
                <div class=\"col-md-6\">
                  <strong>$tituloCampo</strong>: $valor
                </div>";
        }
      }
      $contenido .= "</div>";
    }
  }
  // Mostrar datos adicionales no mapeados
  foreach ($dataConsulta['data'] as $campo => $valor) {
    if (!campoEnEstructura($campo, $estructura)) {
      // Omitir campos con valor null
      if ($valor === null) {
        continue;
      }
      $tituloCampo = capitalizar(preg_replace('/([A-Z])/', ' $1', strtolower($campo)));
      $contenido .= "
        <div class=\"col-md-6\">
          <strong>$tituloCampo</strong>: $valor
        </div>";
    }
  }
  $contenido .= "</div>";
  $contenido .= "</div>";

  // echo $contenido;
  $datosPaciente = consultarDatosPaciente($dataConsulta['patient_id']);
  $datosDoctor = consultarDatosDoctor($dataConsulta['created_by_user_id']);
  $datosEmpresa = consultarDatosEmpresa();
  $resultado = [
    'paciente' => $datosPaciente,
    'doctor' => $datosDoctor,
    'consultorio' => $datosEmpresa,
    'contenido' => $contenido
  ];

  return json_encode($resultado);
}
