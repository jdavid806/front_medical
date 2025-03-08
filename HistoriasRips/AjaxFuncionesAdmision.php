<?php
session_start();
include "../funciones/conn3.php";


if ($_POST["id"]) {
    $id = $_POST["id"];

    $sql = "UPDATE sAdmision
            SET Activo = '0'
            WHERE ID = {$id};";
    if ($conn3->query($sql) === TRUE) {

        echo "Admision Exitosa" .  $facturaId = $conn3->insert_id; // Obtener el ID de la factura insertada

    } else {
        echo "Error: " . $sql . "<br>" . $conn3->error;
    }
}
