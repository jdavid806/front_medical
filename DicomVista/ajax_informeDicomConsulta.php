<?php  

include '../../funciones/conn3.php';
include '../../funciones/funciones.php';

mysqli_set_charset($conn3, 'utf8');

// recibimos los valores
// $Nombre_P = funcionMaster($clienteID, 'cliente_id', 'Nombre_P', 'DC_Informes');
// $Fecha_N = funcionMaster($clienteID, 'cliente_id', 'Fecha_N', 'DC_Informes');
$informe = $_GET['informe'];
$Nombre = $_GET['Nombre'];
$Numero = $_GET['Numero'];
$clienteID = $_GET['clienteID'];




$sql = "SELECT inf.*, cli.CODI_CLIENTE, cli.nombre_cliente, cli.fechaNacimiento from DC_Informes inf 
inner join cliente cli on inf.cliente_id = cli.cliente_id
where inf.Carpeta = '$Nombre' and inf.Numero = '$Numero' and inf.cliente_id = '$clienteID'";
$result = mysqli_query($conn3, $sql);


// $rta = ['Query' , $sql];
// echo json_encode($rta);

if ($result && mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_array($result);
    $row['query'] = $sql;
    // echo $sql;
    echo json_encode($row);
    // if ($row[0] > 0) {
    //     echo json_encode($row);
    // }

}else{
    echo json_encode( array('Informe' => '' , 'nombre_cliente' => '', 'fechaNacimiento' => '', 'query' => $sql) );
}



?>
