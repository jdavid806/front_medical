<?php
session_start();
include "../funciones/conn3.php";

function obtenerFacturasAdmision($cliente_id)
{
    include "../funciones/conn3.php";
    $Facturas = mysqli_query($conn3, "SELECT * FROM sAdmision WHERE clienteId= '$cliente_id' AND Facturado = 0 AND Activo=1");
    $dataJsonFacturasAdmision = [];

    while ($row = mysqli_fetch_assoc($Facturas)) {
        $queryCliente = mysqli_query($connMedical, "SELECT * FROM cliente WHERE cliente_id = '$row[clienteId]'");
        while ($rowcliente = mysqli_fetch_assoc($queryCliente)) {
            $nombre_cliente = $rowcliente['nombre_cliente'];
        }
    
        $queryUsuario = mysqli_query($conn3, "SELECT * FROM usuarios WHERE ID = '$row[usuarioId]'");
        while ($rowUsuario = mysqli_fetch_assoc($queryUsuario)) {

            $NOMBRE_USUARIO = $rowUsuario['NOMBRE_USUARIO'];
        }
        $dataJsonFacturasAdmision[] = [
            "clienteId" =>  $row['clienteId'],
            "nombreCliente" => $nombre_cliente,
       
            "fecha" => $row['fecha_Admision'],
            "id" => $row['ID'],
            "nombreProcedimiento" => $row['nombreCups'],
            "usuarioId" => $row['usuarioId'],
            "precio" =>  $row['valor'],
            "cantidad" =>  $row['cantidad'],
            "descuento" => 0

        ];
    }

    return json_encode($dataJsonFacturasAdmision);
}

if (isset($_POST['cliente_id'])) {
    $cliente_id = $_POST['cliente_id'];
    echo obtenerFacturasAdmision($cliente_id);
}