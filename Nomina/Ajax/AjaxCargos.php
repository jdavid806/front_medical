<?php 
    include "../../funciones/conn3.php";
    include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
    include "../../Models/Nomina/Cargos.php";
    include "../../Controllers/Nomina/Cargos.php";


    try {
        $ControllerCargo = new CargoController($conn3);
        $name = "Cargo";
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
            unset($_POST['id']);
            $Crear = $ControllerCargo->crear($_POST);
            if ($Crear["status"] == true) {
                $dataCargo = $ControllerCargo->obtenerMaxRegistro();

                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} creado correctamente",
                    "data" => $dataCargo
                ];
                echo json_encode($response);
            }else{
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser creado",
                    "error" => $Crear["message"]
                ];
                echo json_encode($response);
            }

        }else if ($action == "actualizar") {
            $id = $_POST['id'];
            unset($_POST['id']);
            $Actualizar = $ControllerCargo->editar($id, $_POST);
            if ($Actualizar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} actualizado correctamente"
                ];
                echo json_encode($response);
            }else{
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser creado",
                    "error" => $Actualizar["message"]

                ];
                echo json_encode($response);
            }
        }else if ($action == "eliminar") {
            $id = $_POST['id'];
            $Eliminar = $ControllerCargo->eliminar($id);
            if ($Eliminar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} eliminado correctamente"
                ];
                echo json_encode($response);
            }else{
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser eliminado",
                    "error" => $Eliminar["message"]
                ];
                echo json_encode($response);
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



?>