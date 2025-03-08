<?php 

    include "../../funciones/conn3.php";
    include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS

    // * ENTIDADES
    include "../../Models/Facturacion/Entidades.php";
    include "../../Controllers/Facturacion/Entidades.php";
    // * ENTIDADES

    // * PROCEDIMIENTOS DE ENTIDAD
    include "../../Models/Facturacion/ProcedimientosEntidad.php";
    include "../../Controllers/Facturacion/ProcedimientosEntidad.php";
    // * PROCEDIMIENTOS DE ENTIDAD
    
    try {
        $Controller = new EntidadesController($conn3);
        $ControllerProcedimientosEntidad = new ProcedimientosEntidadController($conn3);
        $name = "Entidad";
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
            $procedimientos = $_POST['procedimientos'];
            // var_dump($procedimientos);
            // die();  


            unset($_POST['id']);
            unset($_POST['procedimientos']);
            $Crear = $Controller->crear($_POST);
            if ($Crear["status"] == true) {
                $idEntidad = $Controller->obtenerMax();
                foreach ($procedimientos as $procedimiento) {
                    $procedimiento["idEntidad"] = $idEntidad;
                    $procedimiento["idUsuario"] = intval($_POST['idUsuario']);
                    $CrearProcedimientosEntidad = $ControllerProcedimientosEntidad->crear($procedimiento);
                    if ($CrearProcedimientosEntidad["status"] == false) {
                        $response = [
                            "icon" => "error",
                            "title" => "Error",
                            "text" => "Entidad creada correctamente, uno o mas procedimientos no pudieron ser agregados",
                        ];
                        echo json_encode($response);
                        exit();
                    }
                }                
                
                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} y procedimientos creados correctamente"
                ];
                echo json_encode($response);
                exit();
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
            $procedimientosPost = $_POST['procedimientos'];

            unset($_POST['id']);
            unset($_POST['procedimientos']);
            $Actualizar = $Controller->editar($id, $_POST);

            // CONSULTAMOS LOS PROCEDIMIENTOS ACTUALES DE LA ENTIDAD PARA VALIDAR CUALES NECESITAN SER MODIFICADOS
            // $procedimientosEntidadDB = $ControllerProcedimientosEntidad->obtenerPorEntidad($id);


            if ($Actualizar["status"] == true) {

                $WhereNotIn = "";

                // var_dump($procedimientosPost);
                // exit();
                foreach ($procedimientosPost as $procedimientoPost) {
                    $idProcedimientoPost = $procedimientoPost["idProcedimiento"];
                    $WhereNotIn .= $idProcedimientoPost.",";

                    $BuscarProcedimiento = $ControllerProcedimientosEntidad->obtenerPorCondicion(" AND idProcedimiento = {$idProcedimientoPost} AND idEntidad = {$id}");

                    // echo "Obteniendo procedimiento por id {$idProcedimientoPost}";
                    // echo "Resultado";
                    // var_dump($BuscarProcedimiento);
                    // exit();

                    if ($BuscarProcedimiento[0]["id"]) { // verificamos que exista el procedimiento
                        // echo "Se obtuvo el id {$idProcedimientoPost}";
                        
                        
                        $idProcedimientoDB = $BuscarProcedimiento[0]["id"];
                        $ActualizarProcedimiento = $ControllerProcedimientosEntidad->editar($idProcedimientoDB, $procedimientoPost);
                        if ($ActualizarProcedimiento["status"] == false) {
                            $response = [
                                "icon" => "error",
                                "title" => "Error",
                                "text" => "Entidad actualizada correctamente, uno o mas procedimientos no pudieron ser guardados",
                            ];
                            echo json_encode($response);
                            exit();
                        }
                    }else{
                        // echo "No se obtuvo el id {$idProcedimientoPost}";
                        $procedimientoPost["idEntidad"] = $id;
                        $procedimientoPost["idUsuario"] = intval($_POST['idUsuario']);
                        $CrearProcedimientosEntidad = $ControllerProcedimientosEntidad->crear($procedimientoPost);
                        if ($CrearProcedimientosEntidad["status"] == false) {
                            $response = [
                                "icon" => "error",
                                "title" => "Error",
                                "text" => "Entidad actualizada correctamente, uno o mas procedimientos no pudieron ser guardados",
                            ];
                            echo json_encode($response);
                            exit();
                        }
                    }
                    
                }
                
                $WhereNotIn = substr($WhereNotIn, 0, -1);
                
                // echo "WhereNotIn => ".  $WhereNotIn;
                // exit();

                // ELEMENTOS O PROCEDIMIENTOS QUE FUERON BORRADOS DESDE EL DOM
                $procedimientosNoEnviados = $ControllerProcedimientosEntidad->obtenerPorCondicion(" AND idProcedimiento NOT IN ({$WhereNotIn}) AND idEntidad = {$id}");
                // echo " AND idProcedimiento NOT IN ({$WhereNotIn}) AND idEntidad = {$id}";
                // echo "procedimientosNoEnviados";
                // var_dump($procedimientosNoEnviados);
                // exit();

                foreach ($procedimientosNoEnviados as $procedimientoDB) {
                    $idProcedimientoDB = $procedimientoDB["id"];
                    $DesactivarProcedimiento = $ControllerProcedimientosEntidad->editar($idProcedimientoDB, ["activo" => 0]);

                }

                $response = [
                    "icon" => "success",
                    "title" => "Correcto",
                    "text" => "{$name} y procedimientos actualizados correctamente"
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
