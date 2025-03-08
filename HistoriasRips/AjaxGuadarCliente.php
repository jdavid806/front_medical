<?php
session_start();
include "../funciones/connMedical.php";

$datosRecibidos = json_decode(file_get_contents('php://input'), true);

// Función para validar y agregar columnas si no existen
function verificarOCrearColumna($conn, $tabla, $columna, $tipo) {
    $query = "SHOW COLUMNS FROM `$tabla` LIKE '$columna'";
    $resultado = $conn->query($query);

    if ($resultado->num_rows == 0) {
        // Si la columna no existe, se crea
        $alterQuery = "ALTER TABLE `$tabla` ADD `$columna` $tipo";
        if ($conn->query($alterQuery) === TRUE) {
            echo "Columna '$columna' agregada exitosamente en la tabla '$tabla'.<br>";
        } else {
            echo "Error al agregar la columna '$columna': " . $conn->error . "<br>";
        }
    }
}

// Verificar y crear las columnas necesarias en la tabla cliente
$columnasCliente = [
    'nombre_cliente' => 'VARCHAR(255)',
    'celular_cliente' => 'VARCHAR(20)',
    'whatsapp' => 'VARCHAR(20)',
    'correo_cliente' => 'VARCHAR(255)',
    'CODI_CLIENTE' => 'VARCHAR(50)',
    'tipoDocFe' => 'VARCHAR(10)',
    'dv' => 'VARCHAR(5)',
    'tipoPersonaFe' => 'VARCHAR(50)',
    'tipoempresaFe' => 'VARCHAR(50)',
    'primer_apellido' => 'VARCHAR(255)',
    'segundo_apellido' => 'VARCHAR(255)',
    'primer_nombre' => 'VARCHAR(255)',
    'segundo_nombre' => 'VARCHAR(255)',
    'codigo_departamento' => 'VARCHAR(50)',
    'codigo_ciudad' => 'VARCHAR(50)'
];

foreach ($columnasCliente as $columna => $tipo) {
    verificarOCrearColumna($conn3, 'cliente', $columna, $tipo);
}

foreach ($datosRecibidos['detalle'] as $FacturasSeleccionadas) {
    $tipoDocumento = $conn3->real_escape_string($datosRecibidos['tDocumento']);
    $numeroDocumento = $conn3->real_escape_string($datosRecibidos['numeroDocumento']);
    $numeroDocumentoE = $conn3->real_escape_string($datosRecibidos['numeroDocumentoE']);
    $dv = $conn3->real_escape_string($datosRecibidos['dv']);
    $tipoPersona = $conn3->real_escape_string($FacturasSeleccionadas['tipoPersona']);
    $tipoEmpresa = $conn3->real_escape_string($FacturasSeleccionadas['tipoEmpresa']);
    $primerApellido = $conn3->real_escape_string($FacturasSeleccionadas['primerApellido']);
    $segundoApellido = $conn3->real_escape_string($FacturasSeleccionadas['segundoApellido']);
    $primerNombre = $conn3->real_escape_string($FacturasSeleccionadas['primerNombre']);
    $segundoNombre = $conn3->real_escape_string($FacturasSeleccionadas['segundoNombre']);
    $departamento = $conn3->real_escape_string($FacturasSeleccionadas['departamento']);
    $municipio = $conn3->real_escape_string($FacturasSeleccionadas['municipio']);
    $telefono = $conn3->real_escape_string($datosRecibidos['telefono']);
    $email = $conn3->real_escape_string($datosRecibidos['email']);

    $nombreCompleto = $primerNombre . " " . $segundoNombre . " " . $primerApellido . " " . $segundoApellido;
    $whatsapp = '57' . $telefono;

    $numeroDocumento = $numeroDocumento . $numeroDocumentoE;
    
    // Inserción en la tabla cliente
    $sql = "INSERT INTO cliente (
        nombre_cliente, celular_cliente, whatsapp, correo_cliente, CODI_CLIENTE, tipoDocFe, dv, tipoPersonaFe, tipoempresaFe, 
        primer_apellido, segundo_apellido, primer_nombre, segundo_nombre, codigo_departamento, codigo_ciudad
    ) VALUES (
        '$nombreCompleto', '$telefono', '$whatsapp', '$email', '$numeroDocumento', '$tipoDocumento', '$dv', '$tipoPersona', '$tipoEmpresa',
        '$primerApellido', '$segundoApellido', '$primerNombre', '$segundoNombre', '$departamento', '$municipio'
    )";

    if ($conn3->query($sql) === TRUE) {
        // Capturar el ID del cliente creado
        include "../funciones/conn3.php";

        $clienteId = $conn3->insert_id;

        // Datos adicionales para sAdmision
        $idUsuario = $_SESSION['usuarioId'];
        $fecha = date('Y-m-d');
        $identificacion = $numeroDocumento; 
        $fechaConsulta = date('Y-m-d');
        $cantidad = 1;
        $copago = 0;

        $sqlAdmision = "INSERT INTO sAdmision (
            clienteId, usuarioId, fecha_Admision, identificacion_admision, fechaConsulta, cantidad, copago
        ) VALUES (
            '$clienteId', '$idUsuario', '$fecha', '$identificacion', '$fechaConsulta', '$cantidad', '$copago'
        )";

        if ($conn3->query($sqlAdmision) === TRUE) {
            echo "Admision Exitosa. Cliente ID: $clienteId<br>";
        } else {
            echo "Error al insertar en sAdmision: " . $conn3->error . "<br>";
        }
    } else {
        echo "Error al insertar en cliente: " . $conn3->error . "<br>";
    }
}

$conn3->close();
?>
