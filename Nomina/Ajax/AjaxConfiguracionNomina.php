<?php 
include "../../funciones/conn3.php";


$Tabla = "NOM_Configuracion";

if ($_POST["action"] == "CrearTabla") {
    unset($_POST['action']);
    $CamposTabla = "";
    $CamposTablaInsert = "";
    foreach ($_POST as $key => $value) {
        $CamposTabla .= $key . " TEXT NULL,";
        $CamposTablaInsert .= $key . " = '" . $value . "',";
    }
    $CamposTablaInsert = substr($CamposTablaInsert, 0, -1);

    $CreateTableConfig = "CREATE TABLE IF NOT EXISTS {$Tabla} (
      id INT(11) PRIMARY KEY AUTO_INCREMENT,
      fechaRegistro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      {$CamposTabla}
      activo TINYINT(1) NOT NULL DEFAULT 1
    )";

    mysqli_query($conn3, $CreateTableConfig);

    $validarConfig = "SELECT idUsuario FROM {$Tabla} WHERE idUsuario = '{$_POST['idUsuario']}'";
    // echo $validarConfig;
    $validarConfig = mysqli_query($conn3, $validarConfig);

    $actions = [];
    if (mysqli_num_rows($validarConfig) <> 0) {
        $actions = ["UPDATE", " WHERE idUsuario = '{$_POST['idUsuario']}' LIMIT 1"];
    }else{
        $actions = ["INSERT INTO ", ""];
    }

    $Query = "{$actions[0]} {$Tabla} SET {$CamposTablaInsert} {$actions[1]}";
    mysqli_query($conn3, $Query) or die(mysqli_error($conn3));

}else if ($_POST["action"] == "ConsultarDatos") {
    $Query = "SELECT * FROM {$Tabla} WHERE idUsuario = '{$_POST['idUsuario']}'";
    $Result = mysqli_query($conn3, $Query);
    if ($Result) {
        $Rows = mysqli_fetch_assoc($Result);
    }else{
        $Rows = [];
    }
    echo json_encode($Rows);  
}



?>