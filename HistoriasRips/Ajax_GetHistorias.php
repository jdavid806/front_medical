<?php
session_start();
include "../funciones/conn3.php";

function obtenerDatosHistorias($cliente_id)
{
    include "../funciones/conn3.php";
    $HistoriasMedical = mysqli_query($connMedical, "SELECT * FROM citas WHERE idCliente = '$cliente_id' AND Admision = 0 ");

    
    $datosHitorias = [];

    while ($row = mysqli_fetch_assoc($HistoriasMedical)) {
        $queryList = mysqli_query($connMedical, "SELECT * FROM Motivos_Consulta where id='$row[motivoConsulta]'");
        //$nrowl = mysqli_num_rows($queryList);
        while ($row_recordset32A = mysqli_fetch_array($queryList)) {
            $cod = $row_recordset32A['codigo'];
            $nombre = utf8_encode($row_recordset32A['descripcion']);
        }
        $datosHistorias[] = [
            "id" => $row['idCitas'],
            "cliente_id" => $row['idCliente'],
            "Nombre_Historia" => $nombre,
            "Fecha_Cita" => $row['fecha'],
        ];
    }

    return json_encode($datosHistorias);
}

if (isset($_POST['cliente_id'])) {
    $cliente_id = $_POST['cliente_id'];
    echo obtenerDatosHistorias($cliente_id);
}