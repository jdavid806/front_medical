<?php  

include '../../funciones/conn3.php';

mysqli_set_charset($conn3, 'utf8');

// var_dump($_GET);

// recibimos los valores

$informe = $_GET['informe'];
$Nombre = $_GET['Nombre'];
$Numero = $_GET['Numero'];
$clienteID = $_GET['clienteID'];

// tabla
// create table medicaso_dev_baseGeneral.DC_Informes(
//     id int not null auto_increment
//     , usuario_id int null default 0
//     , cliente_id int null default 0
//     , Fecha_Registro timestamp null default current_timestamp
//     , Carpeta text null default null
//     , Numero text null default null
//     , Informe text null default null
//     , primary key (id)
//     );

// Verificar si existe

$sql = "SELECT count(id) from DC_Informes where Carpeta = '$Nombre' and Numero = '$Numero' and cliente_id = '$clienteID'";
$result = mysqli_query($conn3, $sql);
if ($result) {
    $row = mysqli_fetch_array($result);

    if ($row[0] > 0) {
        // se actualiza
        $query = "UPDATE DC_Informes set Informe = '$informe' where Carpeta = '$Nombre' and Numero = '$Numero' and cliente_id = '$clienteID' limit 1";
        $result = mysqli_query($conn3, $query);
    }else{
        // se inserta
        $query = "INSERT into DC_Informes set Carpeta = '$Nombre', Numero = '$Numero', Informe = '$informe', cliente_id = '$clienteID'";
        $result = mysqli_query($conn3, $query);
    }

}




?>