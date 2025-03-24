<?php
include "./ConsultarApi.php";
function getHost()
{
  static $host = null;
  if ($host === null) {
    $host = $_SERVER['HTTP_HOST'];
  }
  return $host;
}

function calcularEdad($fechaNacimiento)
{
  $fechaNacimiento = new DateTime($fechaNacimiento);
  $hoy = new DateTime();
  $diferencia = $hoy->diff($fechaNacimiento);

  if ($diferencia->y > 0) {
    return $diferencia->y . " años";
  } elseif ($diferencia->m > 0) {
    return $diferencia->m . " meses";
  } else {
    return $diferencia->d . " días";
  }
}

function traducirGenero($genero)
{
  $traducciones = [
    'MALE' => 'Masculino',
    'FEMALE' => 'Femenino',
    'OTHER' => 'Otro'
  ];
  return $traducciones[$genero] ?? 'Desconocido';
}

function formatearFechaQuitarHora($fechaISO)
{
  return date('Y-m-d', strtotime($fechaISO));
}

function getSpecialtyName($value)
{
  $url = getHost() . "/medical/specialties";
  $especialidades = consultarApi($url);

  foreach ($especialidades as $especialidad) {
    if ($value === $especialidad['id']) {
      return $especialidad['name'];
    }
  }

  return null; // Retorna null si no encuentra coincidencia
}

function consultarDatosPaciente($id, $fechaConsulta = null)
{
  $url = getHost() . "/medical/patients/{$id}";
  $datosPaciente = consultarApi($url);

  // $nombreEntida = $datosPaciente['social_security']['entity_id'];

  $primerNombre = $datosPaciente["first_name"];
  $segundoNombre = $datosPaciente["middle_name"];
  $apellido = $datosPaciente["last_name"];
  $segundoApellido = $datosPaciente["second_last_name"];

  $resultado = [
    'datos_basicos' => [
      'nombre' => trim("$primerNombre $segundoNombre $apellido $segundoApellido"),
      'documento' => $datosPaciente['document_type'] . "-" . $datosPaciente['document_number'],
      'edad' => calcularEdad($datosPaciente['date_of_birth']),
      'telefono' => $datosPaciente['whatsapp'],
      'correo' => $datosPaciente['email'],
    ],
    'datos_generales' => [
      'direccion' => $datosPaciente['address'],
      'genero' => traducirGenero($datosPaciente['gender']),
      // 'entidad' => $nombreEntida,
      'tipo afiliado' => $datosPaciente['social_security']['affiliate_type'],
      'fecha Consulta' => $fechaConsulta,
    ],
  ];

  return $resultado;
}
function consultarDatosDoctor($id)
{
  $url = getHost() . "/medical/users/{$id}";
  $datosDoctor = consultarApi($url);

  $primerNombre = $datosDoctor["first_name"];
  $segundoNombre = $datosDoctor["middle_name"];
  $apellido = $datosDoctor["last_name"];
  $segundoApellido = $datosDoctor["second_last_name"];

  $especialidad = getSpecialtyName($datosDoctor['user_specialty_id']);
  $firma = $datosDoctor['firma_minio_id'];

  $resultado = [
    'nombre' => "Dr(a). " . trim("$primerNombre $segundoNombre $apellido $segundoApellido"),
    'especialidad' => $especialidad,
    'firma' => $firma,
  ];

  return $resultado;
}

function consultarDatosEmpresa()
{
  $url = getHost() . "/medical/companies/1";
  $datosEmpresa = consultarApi($url);

  $logo = $datosEmpresa['data']['logo'];
  $nombreEmpresa = $datosEmpresa['data']['name'];
  $marcaAgua = $datosEmpresa['data']['watermark'];
  $document_number = $datosEmpresa['data']['document_number'];
  $direccion = $datosEmpresa['data']['address'];
  $telefono = $datosEmpresa['data']['phone'];
  $correo = $datosEmpresa['data']['email'];

  $resultado = [
    'logo_consultorio' => $logo,
    'nombre_consultorio' => $nombreEmpresa,
    'marca_agua' => $marcaAgua,
    'datos_consultorio' => [
      ['RNC' => $document_number],
      ['Dirección' => $direccion],
      ['Teléfono' => $telefono],
      ['Correo' => $correo],
    ],
  ];
  return $resultado;
}