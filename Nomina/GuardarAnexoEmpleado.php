<?php
include "../funciones/conn3.php";
include "../funciones/funcionesModels.php";
include "../Models/Nomina/Anexos.php";
include "../Controllers/Nomina/Anexos.php";


try {
    $Controller = new AnexosController($conn3);

    // Verifica si se ha enviado un archivo
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['archivo'])) {
        $nombreArchivo = date('YmdHis') . "_" . $_FILES['archivo']['name']; /// hora y fecha actual concatenada para evitar duplicados
        $rutaTemporal = $_FILES['archivo']['tmp_name'];
        $carpetaDestino = '../NominaAnexos/';
        
        // Verificar si la carpeta existe, si no, crearla
        if (!is_dir($carpetaDestino)) {
            mkdir($carpetaDestino, 0755, true);
        }
        
        // Mover el archivo a la carpeta de destino
        if (move_uploaded_file($rutaTemporal, $carpetaDestino . $nombreArchivo)) {
            $_POST["nombreArchivo"] = $nombreArchivo;
            $GuardarAnexo = $Controller->crear($_POST);
            var_dump($GuardarAnexo);
            
            if ($GuardarAnexo["status"] == true) {
                echo "Anexo guardado correctamente.";
                echo "<script>history.back();</script>";
            }else{
                echo "Error al guardar el archivo.";

            }

        } else {
            echo "Error al mover el archivo.";
        }
    }
    
} catch (\Throwable $th) {
    echo "Ocurrio un error inseperado: " . $th->getMessage();
}


?>
