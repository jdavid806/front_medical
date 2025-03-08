<?php
date_default_timezone_set('America/Bogota');
//echo $facturaId;
$queryList = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idOperacion = $facturaId");

//echo "SELECT * FROM FacturaOperacion WHERE idOperacion = $facturaId";
//echo'<br>';
while ($rowMotorizado = mysqli_fetch_array($queryList)) {

    $idEmpresa = $rowMotorizado['idEmpresa'];

    //$resolucion = 18764083417781;
    $queryFERESOLUCION = mysqli_query($conn3, "SELECT * FROM  FE_Resoluciones where usuario_id = $idEmpresa");
while ($rowMotorizadoFERESOLUCION = mysqli_fetch_array($queryFERESOLUCION)) {
    $ResolucionFE = $rowMotorizadoFERESOLUCION['Resolucion'];
}
    $queryList2 = mysqli_query($connApi, "SELECT * FROM  resolutions where resolution = $ResolucionFE");
    $nrowl = mysqli_num_rows($queryList2);
    while ($rowMotorizado2 = mysqli_fetch_array($queryList2)) {
        $type_document_id        = $rowMotorizado2['type_document_id'];
        $prefix                  = $rowMotorizado2['prefix'];
        $company_id              = $rowMotorizado2['company_id'];
       
    }

//     $queryCompany = mysqli_query($connApi, "SELECT * FROM  companies where id = $company_id");
//     while ($rowMotorizadoCompany = mysqli_fetch_array($queryCompany)) {
//         $identification_number = $rowMotorizadoCompany['identification_number'];
//     }

//     // $queryDocuments = mysqli_query($connApi, "SELECT * FROM  documents where identification_number = $identification_number");
//     // while ($rowMotorizadoDocuments = mysqli_fetch_array($queryDocuments)) {
//     //     $number = $rowMotorizadoDocuments['number'];
//     // }
//     $queryDocuments = mysqli_query($connApi, "SELECT * FROM  documents where identification_number = $identification_number ORDER BY number DESC LIMIT 1");
// $rowMotorizadoDocuments = mysqli_fetch_array($queryDocuments);
// $ultimoNumero = $rowMotorizadoDocuments['number'];

    $idOperacion = $rowMotorizado['idOperacion'];
  
    $numeroDoc = $rowMotorizado['numeroDoc'];
    //$numeroDoc = 2;
    $fechaOperacion = $rowMotorizado['fechaOperacion'];
    $fechaVencimiento = $rowMotorizado['fechaVencimiento'];
    $fechaVencimiento1 = $rowMotorizado['fechaVencimiento'];
    $subTotal = $rowMotorizado['totalNeto'];
    $subTotalsii = $rowMotorizado['totalNeto'];
    $id_cliente = $rowMotorizado['idCliente'];
    $nota = $rowMotorizado['nota'];
    //$pago = $rowMotorizado['pago'];
   // $metodopago = $rowMotorizado['metodopago'];
    $pago = 1;
    $metodopago = 10;
    $itemDetalles = array(); // almacena los items de la factura
    $queryListDetalle = mysqli_query($conn3, "SELECT * FROM  FacturaDetalle WHERE idOperacion=$idOperacion");
// echo "SELECT * FROM  FacturaDetalle WHERE idOperacion=$idOperacion";
// echo'<br>';

    $nrowl = mysqli_num_rows($queryListDetalle);
    if ($nrowl > 0) {

        while ($rowMotorizadoDetalle = mysqli_fetch_array($queryListDetalle)) {
            $idProducto = $rowMotorizadoDetalle['idProducto'];
            //$id_cliente = $rowMotorizadoDetalle['id_cliente'];
            $cantidad = $rowMotorizadoDetalle['cantidad'];
            $descripcion = $rowMotorizadoDetalle['descripcion'];
            $descuento = $rowMotorizadoDetalle['descuento'];
            $base = $rowMotorizadoDetalle['base'];
            $subSi = $rowMotorizadoDetalle['totalbase'];

            $descuentofinal = $cantidad * (($base * ($descuento / 100)));
$sqlProcedimiento = mysqli_query($conn3, "SELECT * FROM  FE_Procedimientos WHERE id = $idProducto AND activo=1");

//echo "SELECT * FROM  FE_Procedimientos WHERE id = $idProducto";
//echo'<br>';
            while ($row = mysqli_fetch_array($sqlProcedimiento)) {
                $price = $row['precio'];
                $referencia = $row['nombreProcedimiento'];
                $codigo_cups = $row['codigo_cups'];
            }
            // $price = funcionMaster($idProducto, 'ID', 'precio', 'sinvetrios');
            // $referencia = funcionMaster($idProducto, 'ID', 'referencia', 'sinvetrios');
            // $des = funcionMaster($idProducto, 'ID', 'des', 'sinvetrios');

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

        $QueryCliente = mysqli_query($connMedical, "SELECT * FROM  cliente WHERE cliente_id = $id_cliente");
        //echo "SELECT * FROM  cliente WHERE cliente_id = $id_cliente";
        $nrowl = mysqli_num_rows($QueryCliente);
        while ($row = mysqli_fetch_array($QueryCliente)) {
            $nit = $row['CODI_CLIENTE'];
            $dv = $row['dv'];
            $NombreCliente = $row['nombre_cliente'];
            $direccion_cliente = $row['direccion_cliente'];
            $emailfe = $row['correo_cliente'];
            $telefono_cliente = $row['celular_cliente'];
            // $nit = 1004719946;
            // $dv = '';
            // $NombreCliente = 'Miguel Castro';
            // $direccion_cliente = 'Direccion';
            // $emailfe = 'miguelangel052@gmail.com';
            // $telefono_cliente = 3502462970;
            // $fac_identificacion =13;
            // $fac_tipodepersona = 'N';
            // $fac_tipodeempresa = 4;
        }

      
        if ($dv == '' or $dv == null) {
            $dv = NULL;
        } else {
            $dv = $dv;
        }
      
        
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


        $CrearFactura = CrearFactura($data); // enviamos factura

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

