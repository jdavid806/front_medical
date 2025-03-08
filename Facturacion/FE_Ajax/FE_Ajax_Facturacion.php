<?php
session_start();
include "../funciones/conn3.php";

// Obtener los datos enviados por AJAX
$data = $_POST;
$fechaRegistro = date('Y-m-d H:i:s');
// Validar y sanitizar los datos según sea necesario
$tipoComprobante = $conn3 ->real_escape_string($data['tipoComprobante']);
$centroCosto = $conn3 ->real_escape_string($data['centroCosto']);
$vendedorId = $conn3 ->real_escape_string($data['vendedorId']);
$clienteId = $conn3 ->real_escape_string($data['clienteId']);
$totalNeto = $conn3 ->real_escape_string($data['total-neto']);
$numeroAutorizacion = $conn3 ->real_escape_string($data['numeroAutorizacion']);
$totalPagado = $conn3 ->real_escape_string($data['total-pagado']);

$fechaElaboracion = $conn3 ->real_escape_string($data['fechaElaboracion']);
$fechaVencimiento = $conn3 ->real_escape_string($data['fechaVencimiento']);
// Inserción en la tabla de facturas
$sql = "INSERT INTO OperacionFactura (numeroDoc,idCliente,idEmpresa,fechaOperacion,fechaVencimiento,docOrigen, totalNeto, numero_automatizacion, montoPagado)
        VALUES ('0','$clienteId ','1','$fechaElaboracion','$fechaVencimiento','0', '$totalNeto', '$numeroAutorizacion', '$totalPagado')";

if ($conn3 ->query($sql) === TRUE) {
    $facturaId = $conn3 ->insert_id; // Obtener el ID de la factura insertada

    // Inserción en la tabla de medios de pago
    foreach ($data['metodosPago'] as $metodoPago) {
        $metodo = $conn3 ->real_escape_string($metodoPago['metodoPago']);
        $valor = $conn3 ->real_escape_string($metodoPago['valorMetodo']);
        $comprobante = $conn3 ->real_escape_string($metodoPago['numeroComprobante']);

        $sqlMP = "INSERT INTO Medios_Pagos (factura_id, metodo_id, valor, numero_comprobante)
                  VALUES ('$facturaId', '$metodo', '$valor', '$comprobante')";
        $conn3 ->query($sqlMP);
    }

   foreach ($data['DatosF'] as $Datosf){
    $idProducto = $conn3 ->real_escape_string($Datosf['idProducto']);
    $cantidad = $conn3 ->real_escape_string($Datosf['cantidad']);
    $valorUnitario = $conn3 ->real_escape_string($Datosf['valorUnitario']);
    $porcentajeDesc = $conn3 ->real_escape_string($Datosf['porcentajeDesc']);
    $impuestoCargo = $conn3 ->real_escape_string($Datosf['impuestoCargo']);
    $impuestoRetencion = $conn3 ->real_escape_string($Datosf['impuestoRetencion']);
    $total = $conn3 ->real_escape_string($Datosf['total']);
    $sqlF = "INSERT INTO DetalleFactura (idOperacion,fechaRegistro, idProducto, cantidad, base, descuento, impuesto, totalbase)
    VALUES ('$facturaId','$fechaRegistro', '$idProducto', '$cantidad', '$valorUnitario', '$porcentajeDesc', '$impuestoCargo', '$total')";
    $conn3 ->query($sqlF);
   }

    echo "Factura insertada correctamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn3 ->error;
}

$conn3 ->close();
?>