<?php
include "../../funciones/conn3.php";
include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS

// * PARA TRABAJADORES [INICIO]
include "../../Models/Nomina/Trabajadores.php";
include "../../Controllers/Nomina/Trabajadores.php";
// * PARA TRABAJADORES [FIN]

// * PARA TRABAJADORES [INICIO]
include "../../Models/Nomina/InformacionBancaria.php";
include "../../Controllers/Nomina/InformacionBancaria.php";
// * PARA TRABAJADORES [FIN]

// * PARA CONFIGURACIONES DE HORARIO [INICIO]
include "../../Models/Nomina/ConfiguracionHorario.php";
include "../../Controllers/Nomina/ConfiguracionHorario.php";
// * PARA CONFIGURACIONES DE HORARIO [FIN]

// * PARA BENEFICIARIOS [INICIO]
include "../../Models/Nomina/BeneficiariosTrabajadores.php";
include "../../Controllers/Nomina/BeneficiariosTrabajadores.php";
// * PARA BENEFICIARIOS [FIN]


try {

    $Controller = new TrabajadoresController($conn3);
    $ControllerBeneficiarios = new BeneficiariosTrabajadoresController($conn3);
    $ControllerHorarios = new ConfiguracionHorarioController($conn3);
    $ControllerInformacionBancaria = new InformacionBancariaController($conn3);

    // Funciones auxiliares
    function guardarOActualizarHorario($dia, $configDia, $idTrabajador)
    {
        global $ControllerHorarios;
        $ConfiguracionDiaTrabajador = $ControllerHorarios->obtenerPorCondicion("AND idTrabajador = '{$idTrabajador}' AND dia = '{$dia}'");
        $idConfiguracion = $ConfiguracionDiaTrabajador[0]['id'] ?? null;

        $guardarConfiguracionDia = $idConfiguracion
            ? $ControllerHorarios->editar($idConfiguracion, $configDia)
            : $ControllerHorarios->crear($configDia);

        if (!$guardarConfiguracionDia["status"]) {
            responseError("Error al guardar configuración de horario", $guardarConfiguracionDia["message"]);
        }
    }

    function guardarOActualizarInformacionBancaria($idTrabajador, $informacionBancaria)
    {
        global $ControllerInformacionBancaria;
        $InformacionBancariaActual = $ControllerInformacionBancaria->obtenerPorCondicion("AND idTrabajador = '{$idTrabajador}'");
        $idInfoBancaria = $InformacionBancariaActual[0]['id'] ?? null;

        return $idInfoBancaria
            ? $ControllerInformacionBancaria->editar($idInfoBancaria, $informacionBancaria)
            : $ControllerInformacionBancaria->crear($informacionBancaria);
    }

    

    $name = "Trabajador";
    if (!isset($_POST['action'])) {
        $response = [
            "icon" => "error",
            "title" => "Error interno",
            "text" => "No se ha especificado una accion"
        ];
        echo json_encode($response);
    }

    $action = $_POST['action'];
    unset($_POST['action']);

    if ($action == "crear") {
        $datosBeneficiarios = $_POST['beneficiarios'];
        $informacionBancaria = $_POST['informacionBancaria'];
        $configuracionHorario = $_POST['configuracionHorario'];

        // Eliminar claves específicas de $_POST
        unset($_POST['id'], $_POST['beneficiarios'], $_POST['informacionBancaria'], $_POST['configuracionHorario']);

        // Crear trabajador
        $Crear = $Controller->crear($_POST);
        if (!$Crear["status"]) {
            responseError("{$name} no pudo ser creado", $Crear["message"]);
        }

        // Obtener ID del trabajador recién creado
        $idTrabajador = $Controller->obtenerMax();

        // Crear configuración de horario
        foreach ($configuracionHorario as $dia => $configDia) {
            $configDia["idTrabajador"] = $idTrabajador;
            $configDia["usuarioId"] = $_POST['usuarioId'];
            $configDia["dia"] = $dia;

            $CrearConfiguracionDia = $ControllerHorarios->crear($configDia);
            if (!$CrearConfiguracionDia["status"]) {
                responseError("Error al guardar configuración de horario", $CrearConfiguracionDia["message"]);
            }
        }

        // Crear información bancaria
        $informacionBancaria["idTrabajador"] = $idTrabajador;
        $informacionBancaria["usuarioId"] = $_POST['usuarioId'];

        $CrearInformacionBancaria = $ControllerInformacionBancaria->crear($informacionBancaria);
        if (!$CrearInformacionBancaria["status"]) {
            responseError("Error al guardar datos de información bancaria", $CrearInformacionBancaria["message"]);
        }

        // Crear o actualizar beneficiarios
        $AccionBeneficiarios = $ControllerBeneficiarios->guardaroActualizar($idTrabajador, $datosBeneficiarios);
        if (!$AccionBeneficiarios["status"]) {
            responseWarning("{$name} creado correctamente, pero uno o más beneficiarios no pudieron ser guardados", $AccionBeneficiarios["message"]);
        } else {
            responseSuccess("{$name} y beneficiario(s) creado correctamente");
        }
    } else if ($action == "actualizar") {
        $id = $_POST['id'];
        $datosBeneficiarios = $_POST['beneficiarios'];
        $informacionBancaria = $_POST['informacionBancaria'];
        $configuracionHorario = $_POST['configuracionHorario'];

        // Eliminar claves específicas de $_POST
        unset($_POST['id'], $_POST['beneficiarios'], $_POST['informacionBancaria'], $_POST['configuracionHorario']);

        // Actualizar datos generales
        $Actualizar = $Controller->editar($id, $_POST);
        if (!$Actualizar["status"]) {
            responseError("{$name} no pudo ser creado", $Actualizar["message"]);
        }

        // Guardar configuración de horario
        foreach ($configuracionHorario as $dia => $configDia) {
            $configDia["idTrabajador"] = $id;
            $configDia["dia"] = $dia;
            $configDia["usuarioId"] = $_POST['usuarioId'];
            guardarOActualizarHorario($dia, $configDia, $id);
        }

        // Guardar información bancaria
        $ActualizarInformacionBancaria = guardarOActualizarInformacionBancaria($id, $informacionBancaria);
        if (!$ActualizarInformacionBancaria["status"]) {
            responseError("Error al guardar información bancaria", $ActualizarInformacionBancaria["message"]);
        }

        // Guardar beneficiarios
        $AccionBeneficiarios = $ControllerBeneficiarios->guardaroActualizar($id, $datosBeneficiarios);
        if (!$AccionBeneficiarios["status"]) {
            responseWarning("{$name} actualizado correctamente, pero uno o más beneficiarios no pudieron ser guardados", $AccionBeneficiarios["message"]);
        } else {
            responseSuccess("{$name} y beneficiario(s) creado correctamente");
        }

    } else if ($action == "eliminar") {
        $id = $_POST['id'];
        $Eliminar = $Controller->eliminar($id);

        if ($Eliminar["status"]) {
            responseSuccess("{$name} eliminado correctamente");
        } else {
            responseError("{$name} no pudo ser eliminado", $Eliminar["message"]);
        }
    }
} catch (\Throwable $th) {
    $response = [
        "icon" => "error",
        "title" => "Error",
        "text" => "Ocurrio un error inesperado",
        "error" => $th->getMessage()
    ];
    echo json_encode($response);
}
