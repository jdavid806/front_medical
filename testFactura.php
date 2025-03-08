<?php
date_default_timezone_set('America/Bogota');
//echo $facturaId;
include "./funciones/conn3.php";
$queryList = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idOperacion = 124");
$connMedical = mysqli_connect('localhost', 'medicaso_rootBase', '5qA?o]t6d-h25qA?o]t6d-h2', 'medicaso_ms_facturacion')  ;


while ($rowMotorizado = mysqli_fetch_array($queryList)) {

    $idEmpresa = $rowMotorizado['idEmpresa'];

    $queryReesoluciones = mysqli_query($conn3, "SELECT * FROM  FE_Resoluciones where usuario_id = $idEmpresa");
    while ($rowResoluciones = mysqli_fetch_array($queryReesoluciones)) {
        $ResolucionFE = $rowResoluciones['Resolucion'];
    }

    $queryList2 = mysqli_query($connApi, "SELECT * FROM  resolutions where resolution = $ResolucionFE");
    $nrowl = mysqli_num_rows($queryList2);
    while ($rowMotorizado2 = mysqli_fetch_array($queryList2)) {
        $type_document_id        = $rowMotorizado2['type_document_id']; //1
        $prefix                  = $rowMotorizado2['prefix'];   // FE 
        $company_id              = $rowMotorizado2['company_id']; // 1
       
    }

    $idOperacion = $rowMotorizado['idOperacion']; //124
  
    $numeroDoc = $rowMotorizado['numeroDoc']; // 5

    $fechaOperacion = $rowMotorizado['fechaOperacion']; //16/11/24
    $fechaVencimiento = $rowMotorizado['fechaVencimiento']; //1/12/24
    $fechaVencimiento1 = $rowMotorizado['fechaVencimiento'];
    $subTotal = $rowMotorizado['totalNeto']; //5
    $subTotalsii = $rowMotorizado['totalNeto'];
    $id_cliente = $rowMotorizado['idCliente']; //3
 
    $nota = "Fe test"; 
 
    $pago = 1;
    $metodopago = 10;
    $itemDetalles = array(); // almacena los items de la factura
    $queryListDetalle = mysqli_query($conn3, "SELECT * FROM  FacturaDetalle WHERE idOperacion=$idOperacion");

    $nrowl = mysqli_num_rows($queryListDetalle);
    if ($nrowl > 0) {

        while ($rowMotorizadoDetalle = mysqli_fetch_array($queryListDetalle)) {
            $idProducto = $rowMotorizadoDetalle['idProducto']; //4
            //$id_cliente = $rowMotorizadoDetalle['id_cliente'];
            $cantidad = $rowMotorizadoDetalle['cantidad']; //1
            $descripcion = $rowMotorizadoDetalle['descripcion']; // odontologia
            $descuento = $rowMotorizadoDetalle['descuento']; // 0
            $base = $rowMotorizadoDetalle['base'];  // 5
            $subSi = $rowMotorizadoDetalle['totalbase']; 

            $descuentofinal = $cantidad * (($base * ($descuento / 100)));
            $sqlProcedimiento = mysqli_query($conn3, "SELECT * FROM  FE_Procedimientos WHERE id = $idProducto AND activo=1");


            while ($row = mysqli_fetch_array($sqlProcedimiento)) {
                $price = $row['precio'];
                $referencia = $row['nombreProcedimiento'];
                $codigo_cups = $row['codigo_cups'];
            }

            array_push($itemDetalles, array( // cada item en un array
                "code" => "$referencia", // referencia del producto
                "description" => "$codigo_cups - $referencia", // descripcion del producto
                "base_quantity" => $cantidad, // cantidad
                "price_amount" => $base,
                "unit_measure_id" => 70,
                             "invoiced_quantity" => "$cantidad",
                             "line_extension_amount" => "$subTotal",
                             "free_of_charge_indicator" => false,
                             "type_item_identification_id" => 4,
            ));
        }

        echo $id_cliente;

        $QueryCliente = mysqli_query($connMedical, "SELECT * FROM  cliente WHERE cliente_id = $id_cliente");
        $nrowl = mysqli_num_rows($QueryCliente);
        while ($row = mysqli_fetch_array($QueryCliente)) {
            $nit = $row['CODI_CLIENTE'];
            $dv = $row['dv'];
            $NombreCliente = $row['nombre_cliente'];
            $direccion_cliente = $row['direccion_cliente'];
            $emailfe = $row['correo_cliente'];
            $telefono_cliente = $row['celular_cliente'];
        }

        if ($dv == '' or $dv == null) {
            $dv = NULL;
        } else {
            $dv = $dv;
        }

        echo $nit . "<br>";
        


        ///////////////////////////////////////////
        $data = array( // preparamos estructura
            // cada item es un array, cada array se llama objeto
            // aca tenemos el objeto documento, el cual es un array y tiene en su interior
            "number" => "$numeroDoc",
            "type_document_id" => $type_document_id,
            "date" => "$fechaOperacion", // fecha de emisión
            "time" => date('H:i:s'), // hora de emisión
            "resolution_number" => $ResolucionFE,
            "prefix" => "$prefix",
            "notes" => "$nota",
            "customer" => array( // objeto de cliente
                "identification_number" => "$nit",
                "dv" => "$dv",
                "name" => "$NombreCliente",
                "phone" => "$telefono_cliente",
                "address" => "$direccion_cliente",
                "email" => "$emailfe",
                "merchant_registration" => "0000000-00",
             
            ),
           "payment_form" => array(
                    "payment_form_id" => $pago,
                    "payment_method_id" => $metodopago,
                    "payment_due_date" => "$fechaOperacion",
                    "duration_measure" => 0
                ),
        //    "allowance_charges" => array(
        //             "discount_id" => 12,
        //             "charge_indicator" => false,
        //             "allowance_charge_reason" => "DESCUENTO",
        //             "amount" => "$descuento",
        //             "base_amount" => "$subTotal"
        //         ),

            "legal_monetary_totals" => array(
              "line_extension_amount" => $subTotal,
              "tax_exclusive_amount" => "0.00",
              "tax_inclusive_amount" => "$subTotal",
              "allowance_total_amount" => "0.00",
              "payable_amount" => "$subTotal",
            ),
              "invoice_lines" => $itemDetalles,

        
        );
        
        echo json_encode($data, JSON_PRETTY_PRINT);


        // $CrearFactura = CrearFactura($data); // enviamos factura

        // //cambiar de objeto a arreglo
        // $CrearFactura = json_decode($CrearFactura, true);
        // echo "<pre> ----------------------\n";
        // var_dump($CrearFactura);
        // echo "</pre><br>";


        // echo "---------------------------</pre><br>";
        // echo '<pre>';
        // $nitFac= 98541865;
        // $urlinvoicepdf = 'FES-FEV5.pdf';
        // $PDF =$nitFac.'/'.$urlinvoicepdf;
        // $ConsultarPDF = ConsultarPDF($PDF);
        // if ($ConsultarPDF !== null) {
        //     echo '<iframe src="data:application/pdf;base64,' . base64_encode($ConsultarPDF) . '" width="100%" height="500"></iframe>';
        // } else {
        //     echo 'Error al descargar el PDF';
        // }
        // var_dump($data);
        // echo '</pre>';
        // exit('ok');

        // foreach ($CrearFactura as $key => $value) {
        //     if ($key == "success") {
        //         if ($value == true) {
        //             // Accede a los valores de urlinvoicepdf y NitFac
        //         //     $urlinvoicepdf = $CrearFactura["urlinvoicepdf"];
        //         //     $qrStr = $CrearFactura["QRStr"];
        //         //     $nitFac = trim(substr(explode("\n", $qrStr)[3], strpos(explode("\n", $qrStr)[3], ":") + 1));
                    
        //         //    // echo "URL de la factura en PDF: " . $urlinvoicepdf;
        //         //    // echo "NitFac: " . $nitFac;
        //         //     $PDF =$nitFac.'/'.$urlinvoicepdf;
        //         //     $ConsultarPDF = ConsultarPDF($PDF);
        //         //     if ($ConsultarPDF !== null) {
        //         //         echo '<iframe src="data:application/pdf;base64,' . base64_encode($ConsultarPDF) . '" width="100%" height="100%"></iframe>';
        //         //     } else {
        //         //         echo 'Error al descargar el PDF';
        //         //     }
        //         echo "<script language='Javascript'> window.location='SclienteAdministracion_Controlfacturas';</script>";
        //         }
        //     }
        // }
    }
}

