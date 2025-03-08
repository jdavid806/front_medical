<?php
header("Content-Type: application/json");

// $host = "localhost";
// $port = "5432";
// $dbname = "tu_base_de_datos";
// $user = "tu_usuario";
// $password = "tu_contraseña";

// $conexion = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

// if (!$conexion) {
//   echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
//   exit;
// }

$tabla = $_POST['tabla'] ?? '';
$condicion = $_POST['condicion'] ?? '';

echo json_encode(["success" => true, "message" => $tabla . " donde c:" . $condicion]);

// if (empty($tabla) || empty($condicion)) {
//   echo json_encode(["success" => false, "message" => "Parámetros inválidos"]);
//   exit;
// }

// $query = "SELECT * FROM $tabla WHERE $condicion";
// $result = pg_query($conexion, $query);

// if (!$result) {
//   echo json_encode(["success" => false, "message" => "Error en la consulta"]);
//   exit;
// }

// $data = pg_fetch_all($result);

// echo json_encode(["success" => true, "data" => $data]);

// pg_close($conexion);
?>