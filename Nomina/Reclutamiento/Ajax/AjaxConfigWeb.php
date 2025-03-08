<?php
    require_once __DIR__. "/../../../funciones/conn3.php";
    require_once __DIR__. "/../../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
    require_once __DIR__. "/../../../Models/Reclutamiento/ConfigWeb.php";
    require_once __DIR__. "/../../../Controllers/Reclutamiento/ConfigWeb.php";

    try {
        $Controller = new ConfigWebController($conn3);
        $name = "Configuracion";
        if (!isset($_POST['action'])) {
            $response = [
                "icon" => "error",
                "title" => "Error interno",
                "text" => "No se ha especificado una acción"
            ];
            echo json_encode($response);
        }

        $action = $_POST['action'];
        if ($action == "decisionAction") {
            $idUsuario = $_POST['idUsuario'];
            $datosConfigUsuario = $Controller->obtenerPorUsuario($idUsuario);
            if ($datosConfigUsuario["id"]) {
                $action = "actualizar";
            }else{
                $action = "crear";
            }
        }
        
        
        unset($_POST['action']);
        
        if ($action == "crear") {
            unset($_POST['id']);
            $Crear = $Controller->crear($_POST);
            if ($Crear["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} creado correctamente"
                ];
                echo json_encode($response);
            } else {
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser creado",
                    "error" => $Crear["message"]
                ];
                echo json_encode($response);
            }

        } else if ($action == "actualizar") {
            $id = $_POST['id'];
            unset($_POST['id']);
            $Actualizar = $Controller->editar($id, $_POST);
            if ($Actualizar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} actualizado correctamente"
                ];
                echo json_encode($response);
            } else {
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser creado",
                    "error" => $Actualizar["message"]
                ];
                echo json_encode($response);
            }
        } else if ($action == "eliminar") {
            $id = $_POST['id'];
            $Eliminar = $Controller->eliminar($id);
            if ($Eliminar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} eliminado correctamente"
                ];
                echo json_encode($response);
            } else {
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser eliminado",
                    "error" => $Eliminar["message"]
                ];
                echo json_encode($response);
            }
        }else if ($action == "consultar") {
            $idUsuario = $_POST['idUsuario'];
            $Consultar = $Controller->obtenerPorUsuario($idUsuario);
            if ($Consultar["id"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} eliminado correctamente",
                    "data" => $Consultar
                ];
                echo json_encode($response);
            } else {
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser eliminado",
                    "error" => $Consultar["message"],
                    "data" => null
                ];
                echo json_encode($response);
            }
        }
    } catch (\Throwable $th) {
        $response = [
            "icon" => "error",
            "title" => "Error",
            "text" => "Ocurrió un error inesperado",
            "error" => $th->getMessage()
        ];
        echo json_encode($response);
    }
