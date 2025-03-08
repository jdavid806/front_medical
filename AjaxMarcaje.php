<?php

function obtenerColumnas($dia){

    $arrayColumnas = [
        "Monday" => ["lunesHabilitado", "lunesInicio", "lunesFin"],
        "Tuesday" => ["martesHabilitado", "martesInicio", "martesFin"],
        "Wednesday" => ["miercolesHabilitado", "miercolesInicio", "miercolesFin"],
        "Thursday" => ["juevesHabilitado", "juevesInicio", "juevesFin"],
        "Friday" => ["viernesHabilitado", "viernesInicio", "viernesFin"],
        "Saturday" => ["sabadoHabilitado", "sabadoInicio", "sabadoFin"],
        "Sunday" => ["domingoHabilitado", "domingoInicio", "domingoFin"],
    ];

    return $arrayColumnas[$dia];
}

function obtenerFilaConfigHorario($dia){

    $arrayColumnas = [
        "Monday" => "Lunes",
        "Tuesday" => "Martes",
        "Wednesday" => "Miercoles",
        "Thursday" => "Jueves",
        "Friday" => "Viernes",
        "Saturday" => "Sabado",
        "Sunday" => "Domingo",
    ];

    return $arrayColumnas[$dia];
}

function enviarRespuesta($msg, $clase, $isDisabled, $tipoMarcaje, $text) {
    echo json_encode([
        "msg" => $msg,
        "clase" => $clase,
        "isDisabled" => $isDisabled,
        "tipoMarcaje" => $tipoMarcaje,
        "text" => $text
    ]);
    exit();
}

function obtenerUbicacionPorIP($ipCliente) {
    $apiUrl = "http://ipinfo.io/{$ipCliente}/json";
    $datosUbicacion = file_get_contents($apiUrl);
    return json_decode($datosUbicacion, true);
}


function calcularDescuento($tipoDescuento, $valorDescuento, $salario, $salarioMinimo) {
    if ($tipoDescuento == 'salarioMinimo') {
        return $valorDescuento * $salarioMinimo / 100;
    } elseif ($tipoDescuento == 'salarioTrabajador') {
        return $valorDescuento * $salario / 100;
    } elseif ($tipoDescuento == 'montoFijo') {
        return $valorDescuento;
    }
    return 0;
}


function procesarDescuento($configuracionUsuario, $minutosRetardo, $salarioEmpleado, $salarioMinimo, $idTrabajador, $idUsuario, $tipoDescuento) {
    $dataDescuento = [];

    $esInasistencia = ($minutosRetardo > $configuracionUsuario['minutosMargenInasistencia']);
    $esRetardo = ($minutosRetardo > $configuracionUsuario['minutosMargenRetardo']);

    if ($tipoDescuento == 'inasistencia' && $esInasistencia && $configuracionUsuario['aplicaDescuentoInasistencia'] != 'No') {

        $valorDescuento = calcularDescuento($configuracionUsuario['descuentoInasistenciaSegun'], intval($configuracionUsuario['valorDescuentoInasistencia']), $salarioEmpleado, $salarioMinimo);
        $dataDescuento = [
            "idTrabajador" => $idTrabajador,
            "idUsuario" => $idUsuario,
            "valorDescuento" => $valorDescuento,
            "descontado" => "No",
            "motivo" => "Inasistencia por retardo del día " . date('Y-m-d'),
            "detalles" => "Existe un retardo de {$minutosRetardo} minuto(s), se procede a marcar como inasistencia",
            "tabla" => "marcacion",
        ];
    } elseif ($tipoDescuento == 'retardo' && $esRetardo && $configuracionUsuario['aplicaDescuentoRetardo'] != 'No') {
        $valorDescuento = calcularDescuento($configuracionUsuario['descuentoRetardoSegun'], intval($configuracionUsuario['valorDescuentoRetardo']), $salarioEmpleado, $salarioMinimo);
        $dataDescuento = [
            "idTrabajador" => $idTrabajador,
            "idUsuario" => $idUsuario,
            "valorDescuento" => $valorDescuento,
            "descontado" => "No",
            "motivo" => "Retardo del día " . date('Y-m-d'),
            "detalles" => "Existe un retardo de {$minutosRetardo} minuto(s)",
            "tabla" => "marcacion",
        ];
    }

    return $dataDescuento;
}


include "./funciones/conn3.php";
include "./funciones/funciones.php";
include "./funciones/funcionesModels.php";

include "./Models/Nomina/index.php";
include "./Controllers/Nomina/index.php";

$fechaActual = date('Y-m-d');
$horaActual = new DateTime();
$diaSemana = date('l');

$Controller = new TrabajadoresController($conn3);
$ControllerMarcaje = new MarcacionesController($conn3);
$ControllerConfiguracion = new ConfiguracionesController($conn3);
$ControllerDescuentos = new DescuentosController($conn3);
$ControllerConfiguracionHorario = new ConfiguracionHorarioController($conn3);

try {
    if ($_POST['action'] == 'Consultar_Documento') {
        $value = base64_decode($_POST['value']);
        $whereDoc = " AND numero_documento = '$value' ";
        $datosTrabajador = $Controller->obtenerPorCondicion($whereDoc);
        $datosTrabajador = $datosTrabajador[0];
        // var_dump($datosTrabajador);

        $response = [];
        // if (!is_countable($datosTrabajador)) {
        // if (!is_countable($datosTrabajador)) {
        if (!is_array($datosTrabajador)) {
            $response["msg"] = "<i class='fas fa-xmark'></i>No estas registrado como trabajador";
            $response["clase"] = "danger";
            $response["isDisabled"] = true;
            $response["tipoMarcaje"] = false;
            $response["text"] = "";
            enviarRespuesta("<i class='fas fa-xmark'></i>No estas registrado como trabajador", "danger", true, false, "");
            echo json_encode($response);
            exit();
        }

        $diaBuscar = obtenerFilaConfigHorario($diaSemana);
        $configuracionDia = $ControllerConfiguracionHorario->obtenerPorCondicion(" AND dia = '$diaBuscar' AND idTrabajador = {$datosTrabajador['id']} ");
        $configuracionDia = $configuracionDia[0];

        $diaHabilitado = $configuracionDia["habilitado"];
        $horaInicio = new DateTime($configuracionDia["inicio"]);
        $horaFin = new DateTime($configuracionDia["fin"]);

        // $columnas = obtenerColumnas($diaSemana);
        // $diaHabilitado = $datosTrabajador[$columnas[0]];
        // $horaInicio = new DateTime($datosTrabajador[$columnas[1]]);
        // $horaFin = new DateTime($datosTrabajador[$columnas[2]]);
        
        if ($diaHabilitado <> 'on') {
            enviarRespuesta("<i class='fas fa-info'></i>No estas habilitado para trabajar hoy", "secondary", true, false, "");
        }

        $CondicionTrabajador = " AND tipoMarcaje = 'Entrada' AND idTrabajador = {$datosTrabajador['id']} AND fechaMarcacion = '$fechaActual' ";
        // echo $CondicionTrabajador;
        $ResultsMarcajeEntrada = $ControllerMarcaje->obtenerPorCondicion($CondicionTrabajador);
        $ResultsMarcajeEntrada = $ResultsMarcajeEntrada[0];
        // var_dump($ResultsMarcajeEntrada);
        // die();

        // * NO SE HA MARCADO ENTRADA
        // if (!array_key_exists("idTrabajador", $ResultsMarcajeEntrada) ) {
        if (!is_array($ResultsMarcajeEntrada) ) {
            if ($horaActual > $horaInicio) {
                $diferencia = $horaActual->diff($horaInicio);
                $minutosDiferencia = ($diferencia->h * 60) + $diferencia->i;
                enviarRespuesta("<i class='fas fa-check'></i> Ingresar", "info",false,"E","<span class='text-danger'>Tienes un retraso de {$minutosDiferencia} minuto(s)</span>");
            }else if ($horaActual <= $horaInicio) {
                enviarRespuesta("<i class='fas fa-user-check'></i> Ingresar", "success", false, "E", "<span class='text-success'>Felicitaciones, justo a tiempo </span>");
            }
        }
        
        $CondicionTrabajador = " AND tipoMarcaje = 'Salida' AND idTrabajador = {$datosTrabajador['id']} AND fechaMarcacion = '$fechaActual' ";
        $ResultsMarcajeSalida = $ControllerMarcaje->obtenerPorCondicion($CondicionTrabajador);
        $ResultsMarcajeSalida = $ResultsMarcajeSalida[0];
        // var_dump($ResultsMarcajeSalida);
        // die();

        // * NO SE HA MARCADO SALIDA
        // if (!array_key_exists("idTrabajador", $ResultsMarcajeSalida) ) {
        if (!is_array($ResultsMarcajeSalida) ) {
            // echo "No existe una marcaje de salida";
            if ($horaActual < $horaFin) {
                // echo "Aun no se puede salirr";
                $diferencia = $horaActual->diff($horaFin);
                $minutosDiferencia = ($diferencia->h * 60) + $diferencia->i;
                enviarRespuesta("<i class='fas fa-check'></i> Aun no es tu hora de salida", "secondary", true, "S" , "<span class='text-danger'>Faltan {$minutosDiferencia} minuto(s)</span>");
            }else if ($horaActual >= $horaInicio) {
                enviarRespuesta("<i class='fas fa-door-open'></i> Salir", "primary", false, "S", "<span class='text-primary'>Buen descanso</span>");
            }
        }

        //* SE MARCO ENTRADA Y SALIDA 
        enviarRespuesta("<i class='fas fa-thumbs-up'></i> Ya se realizaron todas las marcaciones", "primary", true, false, "<span class='text-primary'>Buen descanso</span>");
        
    }else if ($_POST['action'] == 'Guardar') {
        $Response = [];
        $numero_documento = $_POST['numero_documento'];
        $tipoMarcaje = $_POST['tipoMarcaje'];
        $idUsuario = $_POST['idUsuario'];
        $ipCliente = obtenerIPCliente();
    
        // Obtener datos del trabajador
        $whereDoc = " AND numero_documento = '$numero_documento' ";
        $datosTrabajador = $Controller->obtenerPorCondicion($whereDoc);
        $datosTrabajador = $datosTrabajador[0];
        $idTrabajador = $datosTrabajador['id'];
    
        // Obtener datos de ubicación
        $ubicacion = obtenerUbicacionPorIP($ipCliente);
        $ciudad = $ubicacion['city'];
        $region = $ubicacion['region'];
        $pais = $ubicacion['country'];
        $coordenadas = $ubicacion['loc'];
    
        // Obtener columnas correspondientes al día de la semana
        $diaBuscar = obtenerFilaConfigHorario($diaSemana);
        $configuracionDia = $ControllerConfiguracionHorario->obtenerPorCondicion(" AND dia = '$diaBuscar' AND idTrabajador = {$datosTrabajador['id']}");
        $configuracionDia = $configuracionDia[0];

        $diaHabilitado = $configuracionDia["habilitado"];
        $horaInicio = new DateTime($configuracionDia["inicio"]);
        $horaFin = new DateTime($configuracionDia["fin"]);
        // $columnas = obtenerColumnas($diaSemana);
        // $diaHabilitado = $datosTrabajador[$columnas[0]];
        // $horaInicio = new DateTime($datosTrabajador[$columnas[1]]);
        // $horaFin = new DateTime($datosTrabajador[$columnas[2]]);
    
        // Configuración de usuario
        $configuracionUsuario = $ControllerConfiguracion->obtenerPorCondicion(" AND idUsuario = $idUsuario ");
        $configuracionUsuario = $configuracionUsuario[0];
        // Variables para retardo y descuentos
        $minutosRetardo = 0;
        $dataDescuento = [];
        $inasistencia = "No";
        $retardo = "No";
    
        // Si es una marcación de entrada
        if ($tipoMarcaje == 'Entrada') {
            if ($horaActual > $horaInicio) {
                // Calcular el retardo
                $diferencia = $horaActual->diff($horaInicio);
                $minutosRetardo = ($diferencia->h * 60) + $diferencia->i;
                $salarioEmpleado = $datosTrabajador["salario"];
                $salarioMinimo = $configuracionUsuario["salarioMinimo"];
    
                // echo "diferencia => " .  $diferencia;
                // echo "minutosRetardo => " .  $minutosRetardo;
                // echo "salarioEmpleado => " .  $salarioEmpleado;
                // echo "salarioMinimo => " .  $salarioMinimo;


                // Determinar si es inasistencia o retardo
                $inasistencia = ($minutosRetardo > $configuracionUsuario['minutosMargenInasistencia']) ? "Si" : "No";
                $retardo = ($minutosRetardo > $configuracionUsuario['minutosMargenRetardo']) ? "Si" : "No";
    
                // echo "inasistencia => " . $inasistencia;
                // echo "retardo => " . $retardo;

                // var_dump($configuracionUsuario);
                // var_dump($datosTrabajador);
                // exit();

                // Aplicar descuentos por inasistencia o retardo
                if ($inasistencia == "Si") {
                    $dataDescuento = procesarDescuento($configuracionUsuario, $minutosRetardo, $salarioEmpleado, $salarioMinimo, $idTrabajador, $idUsuario, 'inasistencia'
                    );
                } elseif ($retardo == "Si") {
                    $dataDescuento = procesarDescuento($configuracionUsuario, $minutosRetardo, $salarioEmpleado, $salarioMinimo, $idTrabajador, $idUsuario, 'retardo');
                }
            }
        }
    
        // Crear la marcación
        $dataMarcaje = [
            "idTrabajador" => $idTrabajador,
            "idUsuario" => $idUsuario,
            "fechaMarcacion" => $fechaActual,
            "horaMarcacion" => $horaActual->format('H:i:s'),
            "minutosRetardo" => $minutosRetardo,
            "inasistencia" => $inasistencia,
            "retardo" => $retardo,
            "justificacion" => "",
            "numeroDocumento" => $numero_documento,
            "tipoMarcaje" => $tipoMarcaje,
            "ipRegistro" => $ipCliente,
            "ciudadRegistro" => $ciudad,
            "regionRegistro" => $region,
            "paisRegistro" => $pais,
            "coordenadasRegistro" => $coordenadas
        ];
    
        // Guardar la marcación
        $GuardarMarcaje = $ControllerMarcaje->crear($dataMarcaje);
        if ($GuardarMarcaje["status"] == false) {
            $Response = ["icon" => "error", "title" => "Error", "text" => "Ocurrió un error al registrar el marcaje", "error" => $GuardarMarcaje["message"]];
            echo json_encode($Response);
            exit();
        }
    
        // Obtener el ID de la marcación creada
        $idMarcaje = $ControllerMarcaje->obtenerMax();
    
        // Asignar el ID de la marcación al descuento si es necesario
        if (!empty($dataDescuento)) {
            $dataDescuento["idTablaDescuento"] = $idMarcaje;
            $GuardarDescuento = $ControllerDescuentos->crear($dataDescuento);
            if ($GuardarDescuento["status"] == false) {
                $Response = ["icon" => "error", "title" => "Error", "text" => "Ocurrió un error al registrar el marcaje", "error" => $GuardarDescuento["message"]];
                echo json_encode($Response);
                exit();
            }
        }

        $Response = ["icon" => "success", "title" => "Correcto", "text" =>  $datosTrabajador["nombre"] . " has sido marcado con exito"];
        echo json_encode($Response);
        exit();

    }
    



} catch (\Throwable $th) {
    echo "Error: " . $th->getMessage() . "<br>";
    echo "Archivo: " . $th->getFile() . "<br>";
    echo "Línea: " . $th->getLine() . "<br>";
    echo "Traza: " . $th->getTraceAsString() . "<br>";

    exit();
}
