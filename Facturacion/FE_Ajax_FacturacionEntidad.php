<?php
session_start();
include "../funciones/conn3.php";


$datosRecibidos = json_decode(file_get_contents('php://input'), true);
$usuario_id = $conn3 ->real_escape_string($datosRecibidos['usuario_id']);
$queryFERESOLUCION = mysqli_query($conn3, "SELECT * FROM  FE_Resoluciones where usuario_id = $usuario_id");
while ($rowMotorizadoFERESOLUCION = mysqli_fetch_array($queryFERESOLUCION)) {
    //$ResolucionFE = $rowMotorizadoFERESOLUCION['Resolucion'];
    $numeroDoc = $rowMotorizadoFERESOLUCION['NumeroDocFE'];
}
$numeroDoc++;
$tipoComprobante = $conn3->real_escape_string($datosRecibidos['tipoComprobante']);
    $centroCosto = $conn3->real_escape_string($datosRecibidos['centro_costo']);
    $vendedorId = $conn3->real_escape_string($datosRecibidos['vendedor_id']);
    $entidad_id = $conn3->real_escape_string($datosRecibidos['entidadId']);

    $totalNeto = $conn3->real_escape_string($datosRecibidos['total-neto']);
    $numeroAutorizacion = $conn3->real_escape_string($datosRecibidos['numeroAutorizacion']);
    $totalPagado = $conn3->real_escape_string($datosRecibidos['total-pagado']);

    $fechaElaboracion = $conn3->real_escape_string($datosRecibidos['fechaElaboracion']);
    $fechaVencimiento = $conn3->real_escape_string($datosRecibidos['fechaVencimiento']);
    $sql = "INSERT INTO FacturaOperacion (numeroDoc,idCliente,idEmpresa,fechaOperacion,fechaVencimiento, totalNeto, numero_automatizacion, montoPagado,Tipo_Operacion,entidad_id,vendedor_id,numero_autorizacionI,centro_costo)
    VALUES ('$numeroDoc','0','$usuario_id','$fechaElaboracion','$fechaVencimiento','$totalNeto', '$numeroAutorizacion', '$totalPagado','2','$entidad_id','$vendedorId','$numeroAutorizacionI','$centroCosto')";
        if ($conn3 ->query($sql) === TRUE) {
            $facturaId = $conn3 ->insert_id; // Obtener el ID de la factura insertada
            foreach ($datosRecibidos['metodosPago'] as $metodoPago) {
                $metodo = $conn3 ->real_escape_string($metodoPago['metodoPago']);
                $valor = $conn3 ->real_escape_string($metodoPago['valorMetodo']);
                $comprobante = $conn3 ->real_escape_string($metodoPago['numeroComprobante']);
        
                $sqlMP = "INSERT INTO Medios_Pagos (factura_id, metodo_id, valor, numero_comprobante)
                          VALUES ('$facturaId', '$metodo', '$valor', '$comprobante')";
                $conn3 ->query($sqlMP);
            }

            foreach ($datosRecibidos['facturasSeleccionadas'] as $FacturasSeleccionadas) {

                $clienteId = $conn3->real_escape_string($FacturasSeleccionadas['clienteId']);
              
                $facturaIdo = $conn3->real_escape_string($FacturasSeleccionadas['facturaId']);
                $numeroAutorizacionI = $conn3->real_escape_string($FacturasSeleccionadas['numeroAutorizacion']);
                
        $idProducto = $conn3->real_escape_string($FacturasSeleccionadas['procedimientoId']);
        $descripcionproducto = mysqli_query($conn3, "SELECT * FROM FE_Procedimientos WHERE id = $idProducto");
        while ($row = mysqli_fetch_array($descripcionproducto)) {
            $descripcion = $row['nombreProcedimiento'];
        }
        $queryFacturaV = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion = '$facturaIdo'");
        while ($row = mysqli_fetch_assoc($queryFacturaV)) {
            $cantidad = $row['cantidad'];
            $valorUnitario = $row['base'];
            $porcentajeDesc = $row['descuento'];
            $impuestoCargo = $row['impuesto'];
            $impuestoRetencion = $row['impuesto'];
            $total = $row['totalbase'];
            $descripcion = $row['descripcion'];
            $impuestoCargo = $row['impuestoCargo'];
            $impuestoRetencion = $row['impuestoRetencion'];
            if($impuestoCargo != ''){
                $impuestoCargo = $row['impuestoCargo'];
            }else{
                $impuestoCargo = 0;
            }
        }

        $sqlF = "INSERT INTO FacturaDetalle (idOperacion, idProducto, cantidad, base, descuento, impuesto, totalbase,descripcion,impuestoCargo,impuestoRetencion)
        VALUES ('$facturaId','$idProducto','$cantidad','$valorUnitario','$porcentajeDesc', '$impuestoCargo', '$total','$descripcion','$impuestoCargo','$impuestoRetencion')";
            $conn3->query($sqlF);
          //  echo "Error: " . $sqlF . "<br>" . $conn3 ->error;
    
    $queryUpdate = "UPDATE FacturaOperacion SET  FacturaMarcada = 1 WHERE idOperacion = '$facturaIdo' limit 1";
            $conn3->query($queryUpdate);
    $queryUpdate1 = "UPDATE FacturaOperacion SET idCliente ='$clienteId',idFacturaorigen = '$facturaIdo' WHERE idOperacion = '$facturaId' limit 1";
            $conn3->query($queryUpdate1);
            $queryNumeroDoc = "UPDATE FE_Resoluciones SET NumeroDocFE = '$numeroDoc' WHERE usuario_id = '$usuario_id' limit 1";
      $conn3->query($queryNumeroDoc);

        }
        } else {
            echo "Error: " . $sql . "<br>" . $conn3->error;
        }
           
     

// foreach ($datosRecibidos['facturasSeleccionadas'] as $FacturasSeleccionadas) {

//     $clienteId = $conn3->real_escape_string($FacturasSeleccionadas['clienteId']);
//     //$procedimientoId = $conn3 ->real_escape_string($FacturasSeleccionadas['procedimientoId']);
//     $facturaIdo = $conn3->real_escape_string($FacturasSeleccionadas['facturaId']);
//     $numeroAutorizacionI = $conn3->real_escape_string($FacturasSeleccionadas['numeroAutorizacion']);
//     $tipoComprobante = $conn3->real_escape_string($datosRecibidos['tipoComprobante']);
//     $centroCosto = $conn3->real_escape_string($datosRecibidos['centro_costo']);
//     $vendedorId = $conn3->real_escape_string($datosRecibidos['vendedor_id']);
//     $entidad_id = $conn3->real_escape_string($datosRecibidos['entidadId']);

//     $totalNeto = $conn3->real_escape_string($datosRecibidos['total-neto']);
//     $numeroAutorizacion = $conn3->real_escape_string($datosRecibidos['numeroAutorizacion']);
//     $totalPagado = $conn3->real_escape_string($datosRecibidos['total-pagado']);

//     $fechaElaboracion = $conn3->real_escape_string($datosRecibidos['fechaElaboracion']);
//     $fechaVencimiento = $conn3->real_escape_string($datosRecibidos['fechaVencimiento']);
//     // Inserción en la tabla de facturas
//     $sql = "INSERT INTO FacturaOperacion (numeroDoc,idCliente,idEmpresa,fechaOperacion,fechaVencimiento, totalNeto, numero_automatizacion, montoPagado,Tipo_Operacion,entidad_id,vendedor_id,numero_autorizacionI,IdFacturaorigen,centro_costo)
// VALUES ('0','$clienteId','1','$fechaElaboracion','$fechaVencimiento','$totalNeto', '$numeroAutorizacion', '$totalPagado','2','$entidad_id','$vendedorId','$numeroAutorizacionI','$facturaIdo','$centroCosto')";
    
//     if ($conn3->query($sql) === TRUE) {
//         $facturaId = $conn3->insert_id; // Obtener el ID de la factura insertada

//         // Inserción en la tabla de medios de pago
//         foreach ($datosRecibidos['metodosPago'] as $metodoPago) {
//             $metodo = $conn3->real_escape_string($metodoPago['metodoPago']);
//             $valor = $conn3->real_escape_string($metodoPago['valorMetodo']);
//             $comprobante = $conn3->real_escape_string($metodoPago['numeroComprobante']);

//             $sqlMP = "INSERT INTO Medios_Pagos (factura_id, metodo_id, valor, numero_comprobante)
//                   VALUES ('$facturaId', '$metodo', '$valor', '$comprobante')";
//             $conn3->query($sqlMP);
//         }
//         //insercion en la tbala de detalles facturas

//         $idProducto = $conn3->real_escape_string($FacturasSeleccionadas['procedimientoId']);
//         $descripcionproducto = mysqli_query($conn3, "SELECT * FROM FE_Procedimientos WHERE id = $idProducto");
//         while ($row = mysqli_fetch_array($descripcionproducto)) {
//             $descripcion = $row['nombreProcedimiento'];
//         }
//         $queryFacturaV = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion = '$facturaIdo'");
//         while ($row = mysqli_fetch_assoc($queryFacturaV)) {
//             $cantidad = $row['cantidad'];
//             $valorUnitario = $row['base'];
//             $porcentajeDesc = $row['descuento'];
//             $impuestoCargo = $row['impuesto'];
//             $impuestoRetencion = $row['impuesto'];
//             $total = $row['totalbase'];
//             $descripcion = $row['descripcion'];
//             $impuestoCargo = $row['impuestoCargo'];
//             $impuestoRetencion = $row['impuestoRetencion'];
//         }

//         $sqlF = "INSERT INTO FacturaDetalle (idOperacion, idProducto, cantidad, base, descuento, impuesto, totalbase,descripcion,impuestoCargo,impuestoRetencion)
//     VALUES ('$facturaId', '$idProducto', '$cantidad', '$valorUnitario', '$porcentajeDesc', $impuestoCargo, '$total','$descripcion','$impuestoCargo','$impuestoRetencion')";
//         $conn3->query($sqlF);
//         //echo "Error: " . $sqlF . "<br>" . $conn3 ->error;

// $queryUpdate = "UPDATE FacturaOperacion SET FacturaMarcada = 1 WHERE idOperacion = '$facturaIdo' limit 1";
//         $conn3->query($queryUpdate);
//         $queryNumeroDoc = "UPDATE FE_Resoluciones SET numeroDocFE = '$numeroDoc' WHERE usuario_id = '$usuario_id' limit 1";
//   $conn3->query($queryNumeroDoc);
//         //echo "Factura insertada correctamente";
//     } else {
//         echo "Error: " . $sql . "<br>" . $conn3->error;
//     }
// }



$conn3->close();
