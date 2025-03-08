<?php 
    ini_set('session.gc_maxlifetime', 43200); 
    ini_set('session.cookie_lifetime', 43200);

    session_start();
    include "funciones/funciones.php";
    include "funciones/conn3.php";

    try {
        $user = base64_decode($_POST['user']);
        $pass = base64_decode($_POST['pass']);

        $user = mysqli_real_escape_string($conn3, $user);
        $pass = mysqli_real_escape_string($conn3, $pass);


        $QueryUser = "SELECT * FROM usuarios WHERE USUARIO = '$user' AND PASS = '$pass'";
        $ResultQuery  = mysqli_query($conn3, $QueryUser);
        if (mysqli_num_rows($ResultQuery) > 0) {
            $RowUser = mysqli_fetch_array($ResultQuery);
            if ($RowUser['ACTIVO'] == 1) {
                $_SESSION['ID'] = $RowUser['ID'];
                
                echo json_encode([
                    "icon" => "success",
                    "text" => "Usuario validado correctamente , redireccionando...",
                    "title" => "Bienvenido " . $RowUser['NOMBRE_USUARIO']
                ]);
            }else{
                session_destroy();
                echo json_encode([
                    "icon" => "warning",
                    "text" => "Usuario inactivo",
                    "title" => "Error"
                ]);
            }

        }else{
            session_destroy();
            echo json_encode([
                "icon" => "error",
                "text" => "Usuario o contraseña incorrectos",
                "title" => "Error"
            ]);
        }

    } catch (\Throwable $th) {
        session_destroy();
        echo json_encode([
            "icon" => "error",
            "text" => "Ocurrio un error inesperado",
            "title" => "Error",
            "error" => $th
        ]);
    }

?>