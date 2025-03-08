<?php
date_default_timezone_set('America/Bogota');



function obtenerIPCliente() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }

    if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        return trim($_SERVER['HTTP_X_REAL_IP']);
    }

    if (!empty($_SERVER['REMOTE_ADDR'])) {
        return trim($_SERVER['REMOTE_ADDR']);
    }

    return 'IP no disponible';
}


function auditorLogin($estado, $motivo, $user_enter, $pass_enter) {
    include "conn3.php";

    $NameTable = "AuditorLogin";
    $QueryCreateTableLogin = "CREATE TABLE IF NOT EXISTS {$NameTable} (
        ID int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        fechaRegistro datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ipOrigen TEXT NULL,
        ingresoExitoso VARCHAR(10) NOT NULL,
        motivoRechazo VARCHAR(45) NULL,
        usuarioIngresado VARCHAR(45) NOT NULL,
        contrasenaIngresada VARCHAR(45) NOT NULL
    )";

    if (!mysqli_query($conn3, $QueryCreateTableLogin)) {
        return false;
    }


    $ipActual = obtenerIPCliente();

    $QueryInsert = "INSERT INTO {$NameTable} SET    
                                    ipOrigen = '$ipActual',
                                    ingresoExitoso = '$estado',
                                    motivoRechazo = '$motivo',
                                    usuarioIngresado = '$user_enter',
                                    contrasenaIngresada = '$pass_enter'";

    if (mysqli_query($conn3, $QueryInsert)) {
        return true;
    }else{
        throw new Exception("Error al procesar la auditoria => " . $QueryInsert, 1);
    }


}

function salt($length = 10) {
    if ($length <= 0) {
        throw new InvalidArgumentException('La longitud del salt debe ser un número positivo.');
    }

    // Genera un "salt" aleatorio usando caracteres alfanuméricos
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $charactersLength = strlen($characters);
    $randomSalt = '';
    
    for ($i = 0; $i < $length; $i++) {
        $randomSalt .= $characters[random_int(0, $charactersLength - 1)];
    }
    
    return trim($randomSalt);
}

function decrypt($dato)
{
	// el dato tiene 10 caracteres de basura y luego la clave en base64
	return base64_decode(substr($dato, 10, strlen($dato)));
}

function encrypt($dato)
{
	return salt() . base64_encode($dato);
}

function obtenerColumnasDBDia($dia)
{

    $arrayColumnas = [
        "Monday" => ["lunesHabilitado", "lunesInicio", "lunesFin"],
        "Tuesday" => ["martesHabilitado", "martesInicio", "martesFin"],
        "Wednesday" => ["miercolesHabilitado", "miercolesInicio", "miercolesFin"],
        "Thursday" => ["juevesHabilitado", "juevesInicio", "juevesFin"],
        "Friday" => ["viernesHabilitado", "viernesInicio", "viernesFin"],
        "Saturday" => ["sabadoHabilitado", "sabadoInicio", "sabadoFin"],
        "Sunday" => ["domingoHabilitado", "domingoInicio", "domingoFin"],
    ];

    return $arrayColumnas[$dia];
}


function obtenerFechasEnRango($fechaInicio, $fechaFin) {
    $fechas = [];

    $inicio = new DateTime($fechaInicio);
    $fin = new DateTime($fechaFin);

    $fin->modify('+1 day');

    while ($inicio < $fin) {
        $fechas[] = $inicio->format('Y-m-d'); // Agregar la fecha en formato deseado
        $inicio->modify('+1 day'); // Avanzar un día
    }

    return $fechas;
}

function clasificacionDeCuentaPorLongitud($codigo) {
    $longitud =  strlen($codigo);
    $tipo = "";
    if ($longitud == 1) {
        $tipo = "Clase";
    }else if ($longitud == 2) {
        $tipo = "Grupo";
    }else if ($longitud >= 3 && $longitud <= 6) {
        $tipo = "Subcuenta";
    }else if ($longitud > 6) {
        $tipo = "Auxiliar";
    }

    return $tipo;
}

function convertirNumeroALetras($numero) {
    $unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    $decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    $centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    $especiales = ['diez' => 'diez', '11' => 'once', '12' => 'doce', '13' => 'trece', '14' => 'catorce', '15' => 'quince'];

    $entero = floor($numero);
    $decimal = round(($numero - $entero) * 100);

    if ($entero == 0) {
        return 'cero';
    }

    $palabras = '';

    if ($entero >= 1000) {
        $miles = floor($entero / 1000);
        $entero %= 1000;

        if ($miles == 1) {
            $palabras .= 'mil ';
        } else {
            $palabras .= convertirNumeroALetras($miles) . ' mil ';
        }
    }

    if ($entero >= 100) {
        $cientos = floor($entero / 100);
        $entero %= 100;
        if ($cientos == 1 && $entero == 0) {
            $palabras .= 'cien ';
        } else {
            $palabras .= $centenas[$cientos] . ' ';
        }
    }

    if ($entero >= 10 && $entero <= 15) {
        $palabras .= $especiales[$entero] . ' ';
    } else {
        if ($entero >= 20) {
            $decena = floor($entero / 10);
            $entero %= 10;
            $palabras .= $decenas[$decena] . ' ';
            if ($entero > 0) {
                $palabras .= 'y ';
            }
        }
        if ($entero > 0) {
            $palabras .= $unidades[$entero] . ' ';
        }
    }

    // Manejo de decimales
    if ($decimal > 0) {
        $palabras .= 'con ' . convertirNumeroALetras($decimal) . ' centavos';
    }

    return ucfirst(trim($palabras));
}

function obtenerRangoDesde($desde) {
    $anio_inicio = intval($desde);
    $anio_actual = date('Y');
    $anios = range($anio_inicio, $anio_actual);
    return $anios;
}

?>
