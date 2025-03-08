<?php
$Datos =  $_POST["valordatos"];

$cliente_id =  $_POST["cliente_id"];
$Nombre =  $_POST["Nombre"];
$current = date("Y-m-d H:i:s");
    // Abrir el archivo, creándolo si no existe:
    $archivo = fopen("../../ArchivosDicom/{$cliente_id}/{$Nombre}/state_dicom.json","w+b");
    if( $archivo == false ) {
      echo "Error al crear el archivo";
    }
    else
    {
        // Escribir en el archivo:
         fwrite($archivo, "{$Datos}");
        // Fuerza a que se escriban los datos pendientes en el buffer:
         fflush($archivo);

         echo "Archivo Creado";
    }
    // Cerrar el archivo:
    fclose($archivo);

?>