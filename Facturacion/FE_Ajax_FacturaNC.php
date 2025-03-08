<?php
session_start();
include "../funciones/conn3.php";


$datosRecibidos = json_decode(file_get_contents('php://input'), true);



foreach ($datosRecibidos['facturasSeleccionadas'] as $FacturasSeleccionadas) {

    $clienteId = $conn3->real_escape_string($FacturasSeleccionadas['clienteId']);
    //$procedimientoId = $conn3 ->real_escape_string($FacturasSeleccionadas['procedimientoId']);
    $facturaIdo = $conn3->real_escape_string($FacturasSeleccionadas['idDetalle']);
    $queryEntidad = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idOperacion = $facturaIdo");
    while ($row = mysqli_fetch_array($queryEntidad)) {
        $entidad_id = $row['entidad_id'];
        $idCliente = $row['idCliente'];
        $fechaElaboracion = $row['fechaOperacion'];
        $fechaVencimiento = $row['fechaVencimiento'];
       
        $numeroAutorizacion = $row['numero_automatizacion'];
       
    }
    $numeroAutorizacionI = $conn3->real_escape_string($FacturasSeleccionadas['numeroAutorizacion']);
    $tipoComprobante = $conn3->real_escape_string($datosRecibidos['tipoComprobante']);
    $centroCosto = $conn3->real_escape_string($datosRecibidos['centrocosto']);
    $vendedorId = $conn3->real_escape_string($datosRecibidos['idVendedor']);
    $entidad_id = $conn3->real_escape_string($datosRecibidos['entidadId']);

    $totalNeto = $conn3->real_escape_string($datosRecibidos['total-neto']);
    
    $totalPagado = $conn3->real_escape_string($datosRecibidos['total-pagado']);

  
    // Inserción en la tabla de facturas
    $sql = "INSERT INTO FacturaOperacion (numeroDoc,idCliente,idEmpresa,fechaOperacion,fechaVencimiento, totalNeto, numero_automatizacion, montoPagado,Tipo_Operacion,entidad_id,vendedor_id,numero_autorizacionI,IdFacturaorigen,centro_costo)
VALUES ('1','$idCliente','1','$fechaElaboracion','$fechaVencimiento','$totalNeto', '$numeroAutorizacion', '$totalPagado','3','$entidad_id','$vendedorId','0','$facturaIdo','$centroCosto')";
    if ($conn3->query($sql) === TRUE) {
        $facturaId = $conn3->insert_id; // Obtener el ID de la factura insertada

        // Inserción en la tabla de medios de pago
        foreach ($datosRecibidos['metodosPago'] as $metodoPago) {
            $metodo = $conn3->real_escape_string($metodoPago['metodoPago']);
            $valor = $conn3->real_escape_string($metodoPago['valorMetodo']);
            $comprobante = $conn3->real_escape_string($metodoPago['numeroComprobante']);

            $sqlMP = "INSERT INTO Medios_Pagos (factura_id, metodo_id, valor, numero_comprobante)
                  VALUES ('$facturaId', '1', '$totalPagado', '0')";
            $conn3->query($sqlMP);
        }
        //insercion en la tbala de detalles facturas

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
        }

        $sqlF = "INSERT INTO FacturaDetalle (idOperacion, idProducto, cantidad, base, descuento, impuesto, totalbase,descripcion,impuestoCargo,impuestoRetencion)
    VALUES ('$facturaId', '$idProducto', '$cantidad', '$valorUnitario', '$porcentajeDesc', $impuestoCargo, '$total','$descripcion','$impuestoCargo','$impuestoRetencion')";
        $conn3->query($sqlF);
        //echo "Error: " . $sqlF . "<br>" . $conn3 ->error;


        echo "Factura insertada correctamente";
    } else {
        echo "Error: " . $sql . "<br>" . $conn3->error;
    }
}



$conn3->close();
