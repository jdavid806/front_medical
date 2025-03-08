<?php 
    include "../../funciones/conn3.php";
    include "../../funciones/funciones.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
    include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS

    include "../../Models/Nomina/Contratos.php";
    include "../../Controllers/Nomina/Contratos.php";

    $BASE = "https://erp.medicalsoftplus.com/FE/";


    try {
        $Controller = new ContratosController($conn3);
        $name = "Contrato";
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
            $Crear = $Controller->crear($_POST);
            if ($Crear["status"] == true) {
                $idContrato = $Controller->obtenerMax();

                $jsonUrl = json_encode(["idContrato" => $idContrato, "idUsuario" => $_POST['idUsuario']]);
                $jsonUrl = base64_encode($jsonUrl);


                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    // "text" => "{$name} creado correctamente y enviado, para visualizar el contenido puedes acceder al siguiente enlace: " . $BASE . "verContrato/" . base64_encode($idContrato)
                    "text" => "{$name} creado correctamente y enviado, para visualizar el contenido puedes acceder al siguiente enlace: " . $BASE . "verContrato/" . $jsonUrl
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
            $Actualizar = $Controller->editar($id, $_POST);
            if ($Actualizar["status"] == true) {
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} actualizado correctamente, para visualizar el contenido puedes acceder al siguiente enlace: " . $BASE . "verContrato/". base64_encode($id)
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
            $Eliminar = $Controller->eliminar($id);
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