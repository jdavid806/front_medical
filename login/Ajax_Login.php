<?php
session_start();

// Definir usuario y contraseña mockeados
$mockUser = "master";
$mockPass = "1234";

try {
    // Obtener el usuario y contraseña desde el formulario
    $user = base64_decode($_POST['user']);
    $pass = base64_decode($_POST['pass']);

    // Validar el usuario y contraseña mockeados
    if ($user === $mockUser && $pass === $mockPass) {
        // Si el usuario y la contraseña son correctos, crear la sesión
        $_SESSION['ID'] = 1; // Asignar un ID ficticio de usuario

        echo json_encode([
            "icon" => "success",
            "text" => "Usuario validado correctamente, redireccionando...",
            "title" => "Bienvenido " . $mockUser
        ]);
    } else {
        // Si el usuario o la contraseña son incorrectos
        session_destroy();
        echo json_encode([
            "icon" => "error",
            "text" => "Usuario o contraseña incorrectos",
            "title" => "Error"
        ]);
    }

} catch (\Throwable $th) {
    session_destroy();
    echo json_encode([
        "icon" => "error",
        "text" => "Ocurrió un error inesperado",
        "title" => "Error",
        "error" => $th->getMessage()
    ]);
}
?>
