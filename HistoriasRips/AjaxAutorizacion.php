<?php
session_start();
include "../funciones/conn3.php";


$datosRecibidos = json_decode(file_get_contents('php://input'), true);



foreach ($datosRecibidos['detalle'] as $FacturasSeleccionadas) {

    $clienteId = $conn3->real_escape_string($datosRecibidos['clienteId']);
    $CitasId = $conn3->real_escape_string($datosRecibidos['CitasId']);
    $cod = $conn3->real_escape_string($datosRecibidos['cod']);
    $cantidad = $conn3->real_escape_string($FacturasSeleccionadas['cantidad']);
    $copago = $conn3->real_escape_string($FacturasSeleccionadas['copago']);
    $cuotaModeradora = $conn3->real_escape_string($FacturasSeleccionadas['cuotaModeradora']);
    $id = $conn3->real_escape_string($FacturasSeleccionadas['id']);
    $idCups = $conn3->real_escape_string($FacturasSeleccionadas['idCups']);
    $nombreCups = $conn3->real_escape_string($FacturasSeleccionadas['nombreCups']);
    $total = $conn3->real_escape_string($FacturasSeleccionadas['total']);
    $valor = $conn3->real_escape_string($FacturasSeleccionadas['valor']);
    $entidadFacturar = $conn3->real_escape_string($datosRecibidos['entidadFacturar']);
    $fecha = $conn3->real_escape_string($datosRecibidos['fecha']);
    $fechaConsulta = $conn3->real_escape_string($datosRecibidos['fechaConsulta']);
    $formaPago = $conn3->real_escape_string($datosRecibidos['formaPago']);
    $idUsuario = $conn3->real_escape_string($datosRecibidos['idUsuario']);
    $identificacion = $conn3->real_escape_string($datosRecibidos['identificacion']);
    $nitTercero = $conn3->real_escape_string($datosRecibidos['nitTercero']);
    $numAutorizacion = $conn3->real_escape_string($datosRecibidos['numAutorizacion']);
    $numRegistro = $conn3->real_escape_string($datosRecibidos['numRegistro']);
    $profesionalRealizo = $conn3->real_escape_string($datosRecibidos['profesionalRealizo']);
    $regimenPaciente = $conn3->real_escape_string($datosRecibidos['regimenPaciente']);
    $sede = $conn3->real_escape_string($datosRecibidos['sede']);
    $sgsss = $conn3->real_escape_string($datosRecibidos['sgsss']);

    $healthtypeuser = $conn3->real_escape_string($datosRecibidos['healthtypeuser']);
    $tipopagohealt = $conn3->real_escape_string($datosRecibidos['tipopagohealt']);
    $tipocobertura = $conn3->real_escape_string($datosRecibidos['tipocobertura']);
    $tipodocumento = $conn3->real_escape_string($datosRecibidos['tipodocumento']);
    $tipopersona = $conn3->real_escape_string($datosRecibidos['tipopersona']);
    $tipoempresa = $conn3->real_escape_string($datosRecibidos['tipoempresa']);
    $mipres = $conn3->real_escape_string($datosRecibidos['mipres']);
    $mipresdireccion = $conn3->real_escape_string($datosRecibidos['mipresdireccion']);
    $numeropoliza = $conn3->real_escape_string($datosRecibidos['numeropoliza']);

  

  

    // Inserción en la tabla de facturas
    $sql = "INSERT INTO sAdmision(clienteId,usuarioId,fechaRealizacion,numeroRegistro,fecha_Admision,identificacion_admision,numeroOrden,regimen,fechaConsulta,sucursal,profesionalRealizo,entidadFacturar,formaPago,tipoUsuario_admision,cod,idCups,nombreCups,cantidad,copago,cuotaModeradora,total,valor,sgsss,CitasId,healthtypeuser,tipopagohealt,tipocobertura,tipodocumento,tipopersona,tipoempresa,mipres,mipresdireccion,numeropoliza)
VALUES ('$clienteId','$idUsuario','$fecha','$numRegistro','$fecha','$identificacion','$numAutorizacion','$regimenPaciente','$fechaConsulta','$sede','$profesionalRealizo','$entidadFacturar','$formaPago','$regimenPaciente','$cod','$idCups','$nombreCups','$cantidad','$copago','$cuotaModeradora','$total','$valor','$sgsss','$CitasId','$healthtypeuser','$tipopagohealt','$tipocobertura','$tipodocumento','$tipopersona','$tipoempresa','$mipres','$mipresdireccion','$numeropoliza')";
    if ($conn3->query($sql) === TRUE) {

        $sqlCitas = "UPDATE citas SET Admision = 1 WHERE idCitas = '$CitasId'";
        $connMedical->query($sqlCitas);
        
      echo "Admision Exitosa".  $facturaId = $conn3->insert_id; // Obtener el ID de la factura insertada

    } else {
        echo "Error: " . $sql . "<br>" . $conn3->error;
    }
}



$conn3->close();
