<?php 

$idUsuario = $_SESSION['ID'];
$server = 'localhost';
$user = 'medicaso_rootBase';
$pass = '5qA?o]t6d-h25qA?o]t6d-h2';
$dbname = 'medicaso_ms_facturacion';
$conn3 = mysqli_connect($server, $user, $pass, $dbname) or die('Ha fallado la conexion MySQL: ' . mysqli_error($conn3)) ;

$queryBD = mysqli_query($conn3,"SELECT baseDatos FROM  usuarios where ID = '{$idUsuario}'");

while ($rowBD = mysqli_fetch_array($queryBD)) {
    $baseDatos = $rowBD['baseDatos'];
}   
if($baseDatos != ''){
    // conexión a medical
 $connMedical = mysqli_connect('localhost', 'medicaso_rootBase', '5qA?o]t6d-h25qA?o]t6d-h2', $baseDatos)  ;

}
//
// var_dump($conn3);

$hostApi = '154.38.165.62';
$userdbApi = 'apidian24';
$passApi = 'EL9u;UC)b!AY';
$DBApi = 'apidian24';
$connApi = mysqli_connect($hostApi, $userdbApi, $passApi, $DBApi) or die('Ha fallado la conexion MySQL: ' . mysqli_error($connApi));


?> 