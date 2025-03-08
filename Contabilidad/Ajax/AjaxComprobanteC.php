<?php

include "../../funciones/conn3.php";
include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
include "../../Models/Contabilidad/index.php";
include "../../Controllers/Contabilidad/index.php";

// var_dump($_FILES);
// die();


try {
    $Controller = new ComprobantesContablesController($conn3);
    $ControllerDetalle = new CContableDetalleController($conn3);
    $_POST["data"] = json_decode($_POST["data"], true);
    // var_dump($_POST);
    // die();

    $name = "Comprobante contable";
    if (!isset($_POST['data']['action'])) {
        $response = [
            "icon" => "error",
            "title" => "Error interno",
            "text" => "No se ha especificado una acción"
        ];
        echo json_encode($response);
        exit();
    }

    $action = $_POST['data']['action'];
    unset($_POST['data']['action']);

    if ($action == "crear") {
        $detalleFactura = $_POST['data']['detalle'];

        unset($_POST['data']['id']);
        unset($_POST['data']['detalle']);

        $Crear = $Controller->crear($_POST["data"]);
        if ($Crear["status"] == true) {

            // ? OBTENER EL ID DEL COMPROBANTE QUE SE INGRESO
            $idComprobante = $Controller->obtenerMax();

            // ? PROCESAR EL DETALLE DEl COMPROBANTE CONTABLE [INICIO]
            foreach ($detalleFactura as $detalle) {
                unset($detalle["id"]);
                $detalle["idComprobante"] = $idComprobante;
                $CrearDetalle = $ControllerDetalle->crear($detalle);
                if ($CrearDetalle["status"] == false) {
                    $response = [
                        "icon" => "error",
                        "title" => "Error",
                        "text" => "{$name} creado correctamente, uno o mas detalles no se pudieron crear",
                        "error" => $CrearDetalle["message"]
                    ];
                    echo json_encode($response);
                    exit();
                }
            }
            // ? PROCESAR EL DETALLE DEl COMPROBANTE CONTABLE [FIN]


            // ? PROCESAR ARCHIVO [INICIO]
            if (!empty($_FILES["archivoFile"]["name"])) {
                $directorioDestino = "../../ContabilidadCComprobantes/";
                $nombreArchivo = date("YmdHis") . "_" .  $_FILES["archivoFile"]["name"];
                $directorioDestinoCompleto = $directorioDestino . $nombreArchivo;

                if (move_uploaded_file($_FILES["archivoFile"]["tmp_name"], $directorioDestinoCompleto)) {
                    $Actualizar = $Controller->editar($idComprobante, ["archivo" => $nombreArchivo]);
                    if ($Actualizar["status"] == false) {
                        throw new Exception("Comprobante creado correctamente, no se pudo actualizar el archivo" . $Actualizar["mensaje"]);
                        // exit();
                    }
                } else {
                    throw new Exception("Error al procesar archivo", 1);
                    exit();
                }
            }
            // ? PROCESAR ARCHIVO [FIN]

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
        $detalleFactura = $_POST['data']['detalle'];
        unset($_POST["data"]['id']);
        unset($_POST['data']['detalle']);
        $Actualizar = $Controller->editar($id, $_POST["data"]);
        if ($Actualizar["status"] == true) {

            $idsDetalleEnviados = [];

            // ? PROCESAR EL DETALLE DEl COMPROBANTE CONTABLE [INICIO]
            foreach ($detalleFactura as $detalle) {
                $idDetalle = intval($detalle["id"]);
                $detalle["idComprobante"] = $id;

                if ($idDetalle <> 0 ) {
                    $AccionDetalle  = $ControllerDetalle->editar($idDetalle, $detalle);
                    array_push($idsDetalleEnviados, intval($id));
                    // $idsDetalleEnviados .= $id . ",";
                }else{
                    $AccionDetalle  = $ControllerDetalle->crear($detalle);
                }

                if ($AccionDetalle ["status"] == false) {
                    $response = [
                        "icon" => "error",
                        "title" => "Error",
                        "text" => "{$name} creado correctamente, uno o mas detalles no se pudieron guardar",
                        "error" => $AccionDetalle ["message"]
                    ];
                    echo json_encode($response);
                    exit();
                }
            }
            // ? PROCESAR EL DETALLE DEl COMPROBANTE CONTABLE [FIN]
            
            
            // * BUSCAR LOS IDS NO ENVIADOS PARA DARLOS COMO ELIMINADOS [INICIO]
            $resultsDetalleActuales = $ControllerDetalle->obtenerPorComprobante($id);   
            foreach ($resultsDetalleActuales as $detalleActual) {
                if (!in_array($detalleActual["id"], $idsDetalleEnviados)) {
                    $Eliminar = $ControllerDetalle->eliminar($id);
                }
            }
            // * BUSCAR LOS IDS NO ENVIADOS PARA DARLOS COMO ELIMINADOS [FIN]


            // ? PROCESAR ARCHIVO [INICIO]
            if (!empty($_FILES["archivoFile"]["name"])) {
                $directorioDestino = "../../ContabilidadCComprobantes/";
                $nombreArchivo = date("YmdHis") . "_" .  $_FILES["archivoFile"]["name"];
                $directorioDestinoCompleto = $directorioDestino . $nombreArchivo;

                if (move_uploaded_file($_FILES["archivoFile"]["tmp_name"], $directorioDestinoCompleto)) {
                    $Actualizar = $Controller->editar($id, ["archivo" => $nombreArchivo]);
                    if ($Actualizar["status"] == false) {
                        throw new Exception("Comprobante creado correctamente, no se pudo actualizar el archivo" . $Actualizar["message"]);
                        // exit();
                    }
                } else {
                    throw new Exception("Error al procesar archivo");
                    exit();
                }
            }
            // ? PROCESAR ARCHIVO [FIN]

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
