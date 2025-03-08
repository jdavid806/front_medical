<?php
include "../funciones/conn3.php";
// mysqli_set_charset($conn3, "utf8");

// recibir el post
$where = base64_decode($_POST['where']);
$campoValue = base64_decode($_POST['campoValue']);
$campoTexto = base64_decode($_POST['campoTexto']);
$tabla = base64_decode($_POST['tabla']);
$valorInput = base64_decode($_POST['valorInput']);
$selected = base64_decode($_POST['selected']);

if ($valorInput == 'undefined'){
    $valorInput = '';
}

// verificar que todo existe
if ($campoValue && $campoTexto && $tabla) {
    $query = "SELECT $campoValue, $campoTexto FROM $tabla
    " . ($where ? "WHERE $where" : " WHERE 1=1") . "
    " . ($valorInput ? " AND concat($campoValue, $campoTexto) like '%$valorInput%'  " : "") . "
    ";
    $query2 = "SELECT $campoValue, $campoTexto FROM $tabla
    " . ($where ? "WHERE $where" : " WHERE 1=1") . "
    " . ($selected <> "0" ? " and $campoValue = '$selected' " : "") . "    
    ";
    $queryUnion = $query . " UNION " . $query2 . "
    group by $campoValue
    order by $campoValue
    limit 50
    ";
    // var_dump($query);
    $result = mysqli_query($connMedical, $queryUnion);
    $response = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $encoded_row = [];
        foreach ($row as $key => $value) {
            // Codificar clave y valor en base64
            $encoded_key = base64_encode($key);
            $encoded_value = base64_encode(utf8_decode($value));
            // Agregar clave y valor codificados al array
            $encoded_row[$encoded_key] = $encoded_value;
        }
        $encoded_row['query'] = $query;
        // Agregar fila codificada al array de respuesta
        $response[] = $encoded_row;
    }
    echo json_encode($response);
}
