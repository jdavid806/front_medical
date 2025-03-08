<?php 

require_once __DIR__ . "/../../funciones/conn3.php";
require_once __DIR__ . "/../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
require_once __DIR__ . "/../../Models/Nomina/index.php";
require_once __DIR__ . "/../../Controllers/Nomina/index.php";

try {
    $Controller = new TipoRecargoController($conn3);
    $name = "Tipo de recargo";
    if (!isset($_POST['action'])) {
        responseError("No se ha especificado una acción");
    }

    $action = $_POST['action'];
    unset($_POST['action']);

    if ($action == "crear") {
        unset($_POST['id']);
        $Crear = $Controller->crear($_POST);
        if ($Crear["status"]) {
            responseSuccess("$name creado correctamente");
        } else {
            responseError("$name no pudo ser creado", $Crear["message"]);
        }
    } else if ($action == "actualizar") {
        $id = $_POST['id'];
        unset($_POST['id']);
        $Actualizar = $Controller->editar($id, $_POST);
        if ($Actualizar["status"]) {
            responseSuccess("$name actualizado correctamente");
        } else {
            responseError("$name no pudo ser actualizado", $Actualizar["message"]);
        }
    } else if ($action == "eliminar") {
        $id = $_POST['id'];
        $Eliminar = $Controller->eliminar($id);
        if ($Eliminar["status"]) {
            responseSuccess("$name eliminado correctamente");
        } else {
            responseError("$name no pudo ser eliminado", $Eliminar["message"]);
        }
    } else {
        responseError("Acción desconocida: $action");
    }
} catch (\Throwable $th) {
    responseError("Ocurrió un error inesperado", $th->getMessage());
}




?>