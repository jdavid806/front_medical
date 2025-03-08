<?php
function validarKeys($keys)
{

    $pattern = '/key1(.*?)key2(.*?)key3(.*?)key4(.*)/';
    preg_match($pattern, $keys, $matches);


    if ($matches) {
        //     // Desencriptar las claves
        $key1 = decrypt(trim($matches[1]));
        $key2 = decrypt(trim($matches[2]));
        $key3 = decrypt(trim($matches[3]));
        $key4 = decrypt(trim($matches[4]));

        $missingKeys = [];

        //     // Verificar si las claves están vacías
        if (empty($key1)) {
            $missingKeys[] = 'key1';
        }
        if (empty($key2)) {
            $missingKeys[] = 'key2';
        }
        if (empty($key3)) {
            $missingKeys[] = 'key3';
        }
        if (empty($key4)) {
            $missingKeys[] = 'key4';
        }

        // Retornar si faltan claves
        if (!empty($missingKeys)) {
            return 'Falta la(s) clave(s): ' . implode(', ', $missingKeys);
        } else {
            $user = $key1;
            $pass = $key2;
            $sistema = $key3;
            $usuario = $key4;

            $conn3 = mysqli_connect('localhost', 'medicaso_rootBase', '5qA?o]t6d-h25qA?o]t6d-h2', "medicaso_ms_facturacion");
            $QueryUser = "SELECT * FROM usuarios WHERE USUARIO = '$user' AND PASS = '$pass' AND sistema = '$sistema'";
            $ResultQuery = mysqli_query($conn3, $QueryUser);
            if (mysqli_num_rows($ResultQuery) > 0) {
                $RowUser = mysqli_fetch_array($ResultQuery);
                if ($RowUser['ACTIVO'] == 1) {
                    session_start();
                    $_SESSION['ID'] = $RowUser['ID'];
                    $_SESSION['NOMBRE_USUARIO'] = $RowUser['NOMBRE_USUARIO'];
                    $_SESSION['SISTEMABASE'] = $RowUser['NOMBRE_USUARIO'];

                    auditorLogin("true", "Ingreso mediante token", $sistema, $RowUser['NOMBRE_USUARIO']);

                    return $usuario;
                } else {
                    session_destroy();
                    auditorLogin("false", "El usuario se encuentra inactivo", $user, $pass);
                    return "Error-El usuario se encuentra inactivo";
                }

            } else {
                session_destroy();
                auditorLogin("false", "El usuario y la contrasena no coinciden", $user, $pass);
                return "Error-El usuario y la contrasena no coinciden";
            }
        }

    }
}
