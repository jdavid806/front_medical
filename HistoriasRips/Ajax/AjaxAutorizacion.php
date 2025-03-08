<?php
session_start();
include "../funciones/conn3.php";


$datosRecibidos = json_decode(file_get_contents('php://input'), true);



foreach ($datosRecibidos['detalle'] as $FacturasSeleccionadas) {

    $clienteId = $conn3->real_escape_string($FacturasSeleccionadas['clienteId']);
    $cod = $conn3->real_escape_string($FacturasSeleccionadas['cod']);
    $cantidad = $conn3->real_escape_string($FacturasSeleccionadas['cantidad']);
    $copago = $conn3->real_escape_string($FacturasSeleccionadas['copago']);
    $cuotaModeradora = $conn3->real_escape_string($FacturasSeleccionadas['cuotaModeradora']);
    $id = $conn3->real_escape_string($FacturasSeleccionadas['id']);
    $idCups = $conn3->real_escape_string($FacturasSeleccionadas['idCups']);
    $nombreCups = $conn3->real_escape_string($FacturasSeleccionadas['nombreCups']);
    $total = $conn3->real_escape_string($FacturasSeleccionadas['total']);
    $valor = $conn3->real_escape_string($FacturasSeleccionadas['valor']);
    $entidadFacturar = $conn3->real_escape_string($FacturasSeleccionadas['entidadFacturar']);
    $fecha = $conn3->real_escape_string($FacturasSeleccionadas['fecha']);
    $fechaConsulta = $conn3->real_escape_string($FacturasSeleccionadas['fechaConsulta']);
    $formaPago = $conn3->real_escape_string($FacturasSeleccionadas['formaPago']);
    $idUsuario = $conn3->real_escape_string($FacturasSeleccionadas['idUsuario']);
    $identificacion = $conn3->real_escape_string($FacturasSeleccionadas['identificacion']);
    $nitTercero = $conn3->real_escape_string($FacturasSeleccionadas['nitTercero']);
    $numAutorizacion = $conn3->real_escape_string($FacturasSeleccionadas['numAutorizacion']);
    $numRegistro = $conn3->real_escape_string($FacturasSeleccionadas['numRegistro']);
    $profesionalRealizo = $conn3->real_escape_string($FacturasSeleccionadas['profesionalRealizo']);
    $regimenPaciente = $conn3->real_escape_string($FacturasSeleccionadas['regimenPaciente']);
    $sede = $conn3->real_escape_string($FacturasSeleccionadas['sede']);
    $sgsss = $conn3->real_escape_string($FacturasSeleccionadas['sgsss']);
    //$procedimientoId = $conn3 ->real_escape_string($FacturasSeleccionadas['procedimientoId']);
  

  

    // Inserción en la tabla de facturas
    $sql = "INSERT INTO sAdmision(clienteId,usuarioId,fechaRealizacion,numeroRegistro,fecha_Admision,identificacion_admision,numeroOrden,regimen,fechaConsulta,sucursal,profesionalRealizo,entidadFacturar,formaPago,tipoUsuario_admision,cod,idCups,nombreCups,cantidad,copago,cuotaModeradora,totalvalor,sgsss)
VALUES ('$clienteId','$idUsuario','$fecha','$numRegistro','$fecha','$identificacion','$numAutorizacion','$regimenPaciente','$fechaConsulta','$sede','$profesionalRealizo','$entidadFacturar','$formaPago','$regimenPaciente','$cod','$idCups','$nombreCups','$cantidad','$copago','$cuotaModeradora','$total','$sgsss')";
    if ($conn3->query($sql) === TRUE) {
      echo "Admision Exitosa".  $facturaId = $conn3->insert_id; // Obtener el ID de la factura insertada

    } else {
        echo "Error: " . $sql . "<br>" . $conn3->error;
    }
}



$conn3->close();
