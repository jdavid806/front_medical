<?php
session_start();
include "../funciones/conn3.php";
include "../funciones/connApi";
include "../funciones/FE_Api.php";



$datosRecibidos = json_decode(file_get_contents('php://input'), true);

$usuario_id = $conn3 ->real_escape_string($datosRecibidos['usuario_id']);

$queryFERESOLUCION = mysqli_query($conn3, "SELECT * FROM  FE_Resoluciones where usuario_id = $usuario_id");
while ($rowMotorizadoFERESOLUCION = mysqli_fetch_array($queryFERESOLUCION)) {
    //$ResolucionFE = $rowMotorizadoFERESOLUCION['Resolucion'];
    $numeroDoc = $rowMotorizadoFERESOLUCION['NumeroDocFE'];
}
    // $queryList2 = mysqli_query($connApi, "SELECT * FROM  resolutions where resolution = $ResolucionFE");
    // $nrowl = mysqli_num_rows($queryList2);
    // while ($rowMotorizado2 = mysqli_fetch_array($queryList2)) {
    //     $type_document_id        = $rowMotorizado2['type_document_id'];
    //     $prefix                  = $rowMotorizado2['prefix'];
    //     $company_id              = $rowMotorizado2['company_id'];
       
    // }

    // $queryCompany = mysqli_query($connApi, "SELECT * FROM  companies where id = $company_id");
    // while ($rowMotorizadoCompany = mysqli_fetch_array($queryCompany)) {
    //     $identification_number = $rowMotorizadoCompany['identification_number'];
    // }

    // $queryDocuments = mysqli_query($connApi, "SELECT * FROM  documents where identification_number = $identification_number");
    // while ($rowMotorizadoDocuments = mysqli_fetch_array($queryDocuments)) {
    //     $number = $rowMotorizadoDocuments['number'];
    // }
//     $queryDocuments = mysqli_query($connApi, "SELECT * FROM  documents where prefix = '$prefix' and identification_number = $identification_number ORDER BY number DESC LIMIT 1");
// $rowMotorizadoDocuments = mysqli_fetch_array($queryDocuments);
// $numeroDoc = $rowMotorizadoDocuments['number'];


$numeroDoc++;
$tipoComprobante = $conn3 ->real_escape_string($datosRecibidos['tipoComprobante']);
$centroCosto = $conn3 ->real_escape_string($datosRecibidos['centroCosto']);
$vendedorId = $conn3 ->real_escape_string($datosRecibidos['vendedorId']);
$clienteId = $conn3 ->real_escape_string($datosRecibidos['clienteId']);
$TipoFactura = $conn3 ->real_escape_string($datosRecibidos['TipoFactura']);

// $queryEntidad = mysqli_query($connMedical, "SELECT * FROM cliente WHERE cliente_id = $clienteId");
// $nrowl = mysqli_num_rows($queryEntidad);
// while ($row = mysqli_fetch_array($queryEntidad)) {
//     $entidad_id = $row['entidad_id'];
// }
$entidad_id = $conn3 -> real_escape_string($datosRecibidos['entidadId']);
$totalNeto = $conn3 ->real_escape_string($datosRecibidos['totalNeto']);
$numeroAutorizacion = $conn3 ->real_escape_string($datosRecibidos['numeroAutorizacion']);
$totalPagado = $conn3 ->real_escape_string($datosRecibidos['total-pagado']);

$fechaElaboracion = $conn3 ->real_escape_string($datosRecibidos['fechaElaboracion']);
$fechaVencimiento = $conn3 ->real_escape_string($datosRecibidos['fechaVencimiento']);
// Inserción en la tabla de facturas
$sql = "INSERT INTO FacturaOperacion (numeroDoc,idCliente,idEmpresa,fechaOperacion,fechaVencimiento, totalNeto, numero_automatizacion, montoPagado,Tipo_Operacion,entidad_id,vendedor_id,centro_costo,TipoFactura)
        VALUES ('$numeroDoc','$clienteId','$usuario_id','$fechaElaboracion','$fechaVencimiento','$totalNeto', '$numeroAutorizacion', '$totalPagado','1','$entidad_id','$vendedorId','$centroCosto','$TipoFactura')";

if ($conn3 ->query($sql) === TRUE) {
    $facturaId = $conn3 ->insert_id; // Obtener el ID de la factura insertada

    // Inserción en la tabla de medios de pago
    foreach ($datosRecibidos['metodosPago'] as $metodoPago) {
        $metodo = $conn3 ->real_escape_string($metodoPago['metodoPago']);
        $valor = $conn3 ->real_escape_string($metodoPago['valorMetodo']);
        $comprobante = $conn3 ->real_escape_string($metodoPago['numeroComprobante']);

        $sqlMP = "INSERT INTO Medios_Pagos (factura_id, metodo_id, valor, numero_comprobante)
                  VALUES ('$facturaId', '$metodo', '$valor', '$comprobante')";
        $conn3 ->query($sqlMP);
    }
//insercion en la tbala de detalles facturas
   foreach ($datosRecibidos['DatosF'] as $Datosf){
    $idProducto = $conn3 ->real_escape_string($Datosf['idProducto']);
    $sqlAdmision = mysqli_query($conn3, "SELECT * FROM sAdmision WHERE ID = $idProducto");
    while ($row = mysqli_fetch_array($sqlAdmision)) {
        $idCups = $row['idCups'];
    }
    $descripcionproducto = mysqli_query($conn3, "SELECT * FROM FE_Procedimientos WHERE ID = $idCups");
    while ($row = mysqli_fetch_array($descripcionproducto)) {
        $descripcion = $row['nombreProcedimiento'];
    }
    $cantidad = $conn3 ->real_escape_string($Datosf['cantidad']);
    $valorUnitario = $conn3 ->real_escape_string($Datosf['valorUnitario']);
    $porcentajeDesc = $conn3 ->real_escape_string($Datosf['porcentajeDesc']);
    $impuestoCargo = $conn3 ->real_escape_string($Datosf['impuestoCargo']);
    $impuestoRetencion = $conn3 ->real_escape_string($Datosf['impuestoRetencion']);
    $total = $conn3 ->real_escape_string($Datosf['total']);
    $sqlF = "INSERT INTO FacturaDetalle (idOperacion, idProducto, cantidad, base, descuento, impuesto, totalbase,descripcion,impuestoCargo,impuestoRetencion)
    VALUES ('$facturaId', '$idCups', '$cantidad', '$valorUnitario', '$porcentajeDesc', 0, '$total','$descripcion','$impuestoCargo','$impuestoRetencion')";
    $conn3 ->query($sqlF);
   
   }
   

  $sqlAdmision = "UPDATE sAdmision SET idOperacion=$facturaId,Facturado = 1 WHERE ID = '$idProducto'";
  $conn3 ->query($sqlAdmision);
  $queryNumeroDoc = "UPDATE FE_Resoluciones SET NumeroDocFE = '$numeroDoc' WHERE usuario_id = '$usuario_id' limit 1";
  $conn3->query($queryNumeroDoc);
//   if($TipoFactura ==1){
//  include "../funciones/FE_Emitir.php";
//   }else{
//      include "../funciones/FE_EmitirH.php";
//   }
  //include "../funciones/FE_Emitir.php";
 
    echo "Factura insertada correctamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn3 ->error;
}

$conn3 ->close();

?>