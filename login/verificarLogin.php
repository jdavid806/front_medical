<?php
include "../funciones/funciones.php";
$result = ""; // Inicializamos la variable

if (isset($_GET['stm'])) {
    // La variable existe
    $sistema = decrypt(decrypt($_GET['stm']));
    $keys = decrypt($_GET['sks']);

    if ($sistema == "Factura eltronica c;") {
        include 'Ajax_LoginPortada.php';
        $result = validarKeys($keys);
    } else {
        $result = "Error";
    }
} else {
    $result = "Error";
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>

    <script>
        // Asignamos el resultado desde PHP a una variable de JavaScript
        const result = "<?php echo $result; ?>"; // Usamos addslashes para evitar problemas con comillas

        let mensaje = "";
        let title = "";
        let icon = "";
        let url = "";

        if (result.includes('Error')) {
            mensaje = "Error con credenciales de ingreso";
            title = "Error en el ingreso";
            icon = "error";
            url = "funciones/salir.php";
        } else {
            mensaje = "Bienvenido " + result;
            title = "Acceso correcto";
            icon = "success";
            url = "Dashboard";
        }

        // Comprobamos si el resultado contiene 'Error'
        Swal.fire({
            icon: icon,
            title: title,
            text: mensaje,
            allowOutsideClick: false,
            confirmButtonText: "Aceptar"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = url;
            }
        });
    </script>

</body>

</html>