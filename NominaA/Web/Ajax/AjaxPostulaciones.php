<?php 




try {
        require_once __DIR__ . "/../../../funciones/conn3.php";
        require_once __DIR__ . "/../../../funciones/funcionesModels.php";

        
        require_once __DIR__ . "/../../../Models/Reclutamiento/index.php";
        require_once __DIR__ . "/../../../Controllers/Reclutamiento/index.php";
        
        require_once __DIR__ . "/../../../Models/Nomina/index.php";
        require_once __DIR__ . "/../../../Controllers/Nomina/index.php";
        
        // var_dump($_POST);
        // var_dump($_FILES);
        // die();

        $Controller = new PostulacionController($conn3);
        $ControllerTrabajador = new TrabajadoresController($conn3);



        $name = "Postulacion";
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
            // $Crear = $Controller->crear($_POST, $ControllerTrabajador);
            $Crear = $Controller->crearConTrabajador($_POST, $ControllerTrabajador);
            if ($Crear["status"] == true) {
                $idPostulacion = $Controller->obtenerMax();
                if ( isset($_FILES['archivo']) ) {
                    $nombreArchivo = date("YmdHis") . "_" . $_FILES['archivo']['name'];
                    $rutaTemporal = $_FILES['archivo']['tmp_name'];
                    $rutaDestino = "../../ArchivosWeb/";
                    if (!file_exists($rutaDestino)) {
                        mkdir($rutaDestino, 0777, true);
                    }

                    if (move_uploaded_file($rutaTemporal, $rutaDestino . $nombreArchivo)) {
                        $data = [ "archivo" => $nombreArchivo ];
                        $Controller->editar($idPostulacion, $data);
                        $response = [
                            "icon" => "success",
                            "title" => "Correcto",
                            "text" => "{$name} creado correctamente"
                        ];
                        echo json_encode($response);
                        die();
                    }else{
                        $response = [
                            "icon" => "error",
                            "title" => "Error",
                            "text" => "{$name} creado correctamente, ocurrio un error al subir el archivo"
                        ];
                        echo json_encode($response);
                        die();
                    }


                }
                
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
