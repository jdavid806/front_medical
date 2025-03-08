<?php
try {
    
    include "./../funciones/conn3.php";
    include "../funciones/funciones.php";
    include "./../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS

    // ? CONTRATOS
    include "./../Models/Nomina/Contratos.php";
    include "./../Controllers/Nomina/Contratos.php";
    // ? CONTRATOS

    function obtenerUbicacionPorIP($ipCliente) {
        $apiUrl = "http://ipinfo.io/{$ipCliente}/json";
        $datosUbicacion = file_get_contents($apiUrl);
        return json_decode($datosUbicacion, true);
    }

    
    $ControllerContrato = new ContratosController($conn3);
    
    // var_dump($_POST);


    $datos = json_decode($_POST["data"], true);


    $idContrato = $datos['idContrato'];
    $fotoBase64 = $datos['fotoBase64'];
    $contentFirma = $datos['contentFirma'];

    $ipCliente = obtenerIPCliente();
    $ubicacion = obtenerUbicacionPorIP($ipCliente);
    $ciudad = $ubicacion['city'];
    $region = $ubicacion['region'];
    $pais = $ubicacion['country'];
    $coordenadas = $ubicacion['loc'];

    
    $directorioDestino = '../NominaAnexos/'; // Ajusta la ruta según tu estructura de carpetas
    
    // Verificar si el directorio existe, si no, crear
    if (!is_dir($directorioDestino)) {
        mkdir($directorioDestino, 0777, true);
    }
    
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $archivo = $_FILES['documento'];
        $nombreArchivo =  basename($archivo['name']);
        $rutaDestino = $directorioDestino . date('Ymd_His') . $nombreArchivo;
    
        $Reponse = [];
    
        // Verificar si el archivo fue subido sin errores
        if ($archivo['error'] === UPLOAD_ERR_OK) {
            // Mover el archivo al directorio destino
            if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
                
                $data = [
                    "firma" => $contentFirma,
                    "foto" => $fotoBase64,
                    "documento" => $nombreArchivo,
                    "ipDiligenciamiento" => $ipCliente,
                    "fechaDiligenciamiento" => date("Y-m-d"),
                    "horaDiligenciamiento" => date("H:i:s"),
                    "ciudadDiligenciamiento" => $ciudad,
                    "regionDiligenciamiento" => $region,
                    "paisDiligenciamiento" => $pais,
                    "coordenadasDiligenciamiento" => $coordenadas,
                ];
    
                $ActualizarCampos = $ControllerContrato->editar($idContrato , $data);
                if ($ActualizarCampos["status"] == true) {
                    $Reponse = [
                        "icon" => "success",
                        "title" => "Correcto",
                        "text" => "Datos completados correctamente"
                    ];
                }else{
                    $Reponse = [
                        "icon" => "error",
                        "title" => "Error",
                        "text" => "Error al subir el archivo.",
                        "error" => $ActualizarCampos["message"]
                    ];
                }
    
    
            } else {
                $Reponse = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "Error al subir el archivo."
                ];
            }
        } else {
            $Reponse = [
                "icon" => "error",
                "title" => "Error",
                "text" => "Error al subir el archivo."
            ];
        }
    
        echo json_encode($Reponse);
    
    }
    
} catch (\Throwable $th) {
    $Reponse = [
        "icon" => "error",
        "title" => "Error",
        "text" => "Ocurrio un error inesperado.",
        "error" => $th->getMessage()
    ];
    echo json_encode($Reponse);

}
?>
