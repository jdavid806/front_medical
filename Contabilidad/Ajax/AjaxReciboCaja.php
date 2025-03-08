<?php 

    include "../../funciones/conn3.php";
    include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
    include "../../Models/Contabilidad/index.php";
    include "../../Controllers/Contabilidad/index.php";


    // var_dump($_FILES);
    // die();

    try {
        $_POST["data"] = json_decode($_POST["data"], true);

        $Controller = new RecibosCajaController($conn3);
        $name = "Recibo de caja";
        if (!isset($_POST["data"]['action'])) {
            $response = [
                "icon" => "error",
                "title" => "Error interno",
                "text" => "No se ha especificado una acción"
            ];
            echo json_encode($response);
        }

        $action = $_POST["data"]['action'];
        unset($_POST["data"]['action']);
        
        if ($action == "crear") {
            unset($_POST["data"]['id']);
            $Crear = $Controller->crear($_POST["data"]);
            if ($Crear["status"] == true) {
                $idRecibo = $Controller->obtenerMax();

                if ($_FILES['archivoInput']['name'] != "") {
                    $directorioDestino = "../../ContabilidadCComprobantes/";
                    if (!file_exists($directorioDestino)) {
                        mkdir($directorioDestino, 0777, true);
                    }

                    $nameFile = date("YmdHis") . "_" .$_FILES['archivoInput']['name'];
                    $tmp_name = $_FILES['archivoInput']['tmp_name'];
                    $size = $_FILES['archivoInput']['size'];
                    $type = $_FILES['archivoInput']['type'];

                    $destino = $directorioDestino . $nameFile;
                    move_uploaded_file($tmp_name, $destino);

                    $ActualizarArchivo = $Controller->editar($idRecibo, ["archivo" => $nameFile] );

                    if ($ActualizarArchivo["status"] == false) {
                        $response = [
                            "icon" => "error",
                            "title" => "Error",
                            "text" => "{$name} creado correctamente, ocurrio un error al intentar subir el archivo",
                            "error" => $ActualizarArchivo["message"],
                        ];
                        echo json_encode($response);
                        exit();                        
                    }
                }


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
            $id = $_POST["data"]['id'];
            unset($_POST["data"]['id']);
            $Actualizar = $Controller->editar($id, $_POST["data"]);
            if ($Actualizar["status"] == true) {
                if ($_FILES['archivoInput']['name'] != "") {
                    $directorioDestino = "../../ContabilidadCComprobantes/";
                    if (!file_exists($directorioDestino)) {
                        mkdir($directorioDestino, 0777, true);
                    }

                    $nameFile = date("YmdHis") . "_" .$_FILES['archivoInput']['name'];
                    $tmp_name = $_FILES['archivoInput']['tmp_name'];
                    $size = $_FILES['archivoInput']['size'];
                    $type = $_FILES['archivoInput']['type'];

                    $destino = $directorioDestino . $nameFile;
                    move_uploaded_file($tmp_name, $destino);

                    $ActualizarArchivo = $Controller->editar($id, ["archivo" => $nameFile] );

                    if ($ActualizarArchivo["status"] == false) {
                        $response = [
                            "icon" => "error",
                            "title" => "Error",
                            "text" => "{$name} creado correctamente, ocurrio un error al intentar subir el archivo",
                            "error" => $ActualizarArchivo["message"],
                        ];
                        echo json_encode($response);
                        exit();                        
                    }
                }

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
            $id = $_POST["data"]['id'];
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
