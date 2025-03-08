<?php 
function prepareCreateTable($data) {
    $text = "";
    foreach ($data as $key => $value) {
        $text .= $key . " TEXT NULL DEFAULT '' ,";
    }
    
    return $text;
}

function prepareSetMysql($data) {
    $text = "";
    foreach ($data as $key => $value) {
        $text .= $key . " = '" . $value . "',";
    }
    $text = substr($text, 0, -1);
    return $text;
}

function prepareSetQueryMysql($data) {
    $text = "";
    foreach ($data as $key => $value) {
        $text .= " AND " .  $key . " = '" . $value . "' ";
    }
    $text = substr($text, 0, -1);
    return $text;
}


function reem($texto1) 
{

//Rememplazamos caracteres especiales latinos minusculas
$find = array('á', 'é', 'í', 'ó', 'ú', 'ñ', '\"', '€', 'ü');
$repl = array('&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', '&ntilde;', '&quot;', '&euro;', '&uuml;');
$texto1 = str_replace ($find, $repl, $texto1);


//Rememplazamos caracteres especiales latinos mayusculas
$find = array('Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ', 'Ü', 'ç', 'Ç');
$repl = array('&Aacute;', '&Eacute;', '&Iacute;', '&Oacute;', '&Uacute;', '&Ntilde;', '&Uuml;', '&ccedil;', '&Ccedil;');
$texto1 = str_replace ($find, $repl, $texto1);

return $texto1;

}

function reem_alreves($texto1) 
{

//Rememplazamos caracteres especiales latinos minusculas
$repl = array('á', 'é', 'í', 'ó', 'ú', 'ñ', '\"', '€', 'ü');
$find = array('&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', '&ntilde;', '&quot;', '&euro;', '&uuml;');
$texto1 = str_replace ($find, $repl, $texto1);


//Rememplazamos caracteres especiales latinos mayusculas
$repl = array('Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ', 'Ü', 'ç', 'Ç');
$find = array('&Aacute;', '&Eacute;', '&Iacute;', '&Oacute;', '&Uacute;', '&Ntilde;', '&Uuml;', '&ccedil;', '&Ccedil;');
$texto1 = str_replace ($find, $repl, $texto1);

return $texto1;

}

function escaparArray($data) {
    $nuevoArray = [];
    foreach ($data as $key => $value) {
        $nuevoArray[$key] = reem($value);
    }
    return $nuevoArray;
}

function ordenarCuentasConNombre($cuentas) {
    $result = [];

    foreach ($cuentas as $codigo => $nombre) {
        // Separamos cada cuenta en sus partes, por ejemplo "1.2.3" en ["1", "2", "3"]
        $partes = explode('.', $codigo);

        // Referencia al array donde vamos a construir la jerarquía
        $current = &$result;

        // Recorremos las partes de la cuenta para crear los niveles de jerarquía
        foreach ($partes as $index => $parte) {
            // Si es la última parte, se asigna el nombre de la cuenta
            if ($index === count($partes) - 1) {
                $current[$parte] = $nombre;
            } else {
                // Si no existe esa parte de la jerarquía, la creamos como un array
                if (!isset($current[$parte])) {
                    $current[$parte] = [];
                }
                // Nos movemos más profundo en la jerarquía
                $current = &$current[$parte];
            }
        }
    }

    return $result;
}

function ordenarCuentasDesdeController($cuentas) {
    $result = [];

    foreach ($cuentas as $cuenta) {
        // Extraemos el código y el nombre de cada cuenta
        $codigo = $cuenta['codigo'];
        $nombre = $cuenta['nombre'];

        // Separamos cada cuenta en sus partes, por ejemplo "1.2.33.4" en ["1", "2", "33", "4"]
        $partes = explode('.', $codigo);

        // Referencia al array donde vamos a construir la jerarquía
        $current = &$result;

        // Recorremos las partes de la cuenta para crear los niveles de jerarquía
        foreach ($partes as $index => $parte) {
            // Si es la última parte, asignamos el nombre de la cuenta
            if ($index === count($partes) - 1) {
                $current[$parte] = $nombre;
            } else {
                // Si no existe esa parte de la jerarquía, la creamos como un array vacío
                if (!isset($current[$parte])) {
                    $current[$parte] = [];
                }
                // Nos movemos más profundo en la jerarquía
                $current = &$current[$parte];
            }
        }
    }

    return $result;
}

function ajustarFechaAlAnoActual($fechaOriginal) {
    $anioActual = date("Y");
    $fecha = new DateTime($fechaOriginal);
    $fecha->setDate($anioActual, $fecha->format("m"), $fecha->format("d"));
    return $fecha->format("Y-m-d");
}

function calcularEdadPorFechaNacimiento($fechaNacimiento) {
    $fechaNacimiento = new DateTime($fechaNacimiento);
    $fechaActual = new DateTime();
    $diferencia = $fechaActual->diff($fechaNacimiento);
    return $diferencia->y;
}

function responseError($text, $error){
    echo json_encode([
        "icon" => "error",
        "title" => "Error",
        "text" => $text,
        "error" => $error
    ]);
    exit();
}

function responseWarning($text, $error){
    echo json_encode([
        "icon" => "warning",
        "title" => "Advertencia",
        "text" => $text,
        "error" => $error
    ]);
    exit();
}

function responseSuccess($text, $data = []){
    echo json_encode([
        "icon" => "success",
        "title" => "Correcto",
        "text" => $text,
        "data" => $data
    ]);
    exit();
}


?>