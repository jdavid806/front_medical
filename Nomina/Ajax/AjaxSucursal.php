<?php 
    include "../../funciones/conn3.php";
    include "../../funciones/funcionesModels.php";
    include "../../Models/Nomina/Sedes.php";
    include "../../Controllers/Nomina/Sedes.php";


    try {
        $ControllerSede = new SedeController($conn3);
        $name = "Sede";
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
            $Crear = $ControllerSede->crear($_POST);
            if ($Crear["status"] == true) {
                $dataSucursal = $ControllerSede->obtenerMaxRegistro();
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} creada correctamente",
                    "data" => $dataSucursal
                ];
                echo json_encode($response);
            }else{
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser creada",
                    "error" => $Crear["message"]
                ];
                echo json_encode($response);
            }

        }else if ($action == "actualizar") {
            $id = $_POST['id'];
            unset($_POST['id']);
            $Actualizar = $ControllerSede->editar($id, $_POST);
            if ($Actualizar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} actualizada correctamente"
                ];
                echo json_encode($response);
            }else{
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser creada",
                    "error" => $Actualizar["message"]

                ];
                echo json_encode($response);
            }
        }else if ($action == "eliminar") {
            $id = $_POST['id'];
            $Eliminar = $ControllerSede->eliminar($id);
            if ($Eliminar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} eliminada correctamente"
                ];
                echo json_encode($response);
            }else{
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} no pudo ser eliminada",
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
            "error" => $th
            // "error" => $th->getMessage()
        ];
        echo json_encode($response);
    }



?>