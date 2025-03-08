<?php 

    include "../../funciones/conn3.php";
    include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
    include "../../Models/Facturacion/MetodosPago.php";
    include "../../Controllers/Facturacion/MetodosPago.php";

    try {
        $Controller = new MetodosPagoController($conn3);
        $name = "Metodo de pago";
        if (!isset($_POST['action'])) {
            $response = [
                "icon" => "error",
                "title" => "Error interno",
                "text" => "No se ha especificado una acción"
            ];
            echo json_encode($response);
        }

        $action = $_POST['action'];
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
