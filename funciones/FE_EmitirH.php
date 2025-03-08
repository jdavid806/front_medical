<?php
$facturaId = 109;

$queryList = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idOperacion = $facturaId ");

//echo "SELECT * FROM FacturaOperacion WHERE idOperacion = $facturaId";
//echo'<br>';
while ($rowMotorizado = mysqli_fetch_array($queryList)) {

    // $queryList1 = mysqli_query($conn3, "SELECT * FROM  usuarios where idUsuario = 1");
    // $nrowl = mysqli_num_rows($queryList);
    // while ($rowMotorizado1 = mysqli_fetch_array($queryList1)) {
    //     //$resolucion            = $rowMotorizado1['resolucion'];
    //     $resolucion = 18760000001;
    // }

    $resolucion = 18764083417781;
    $queryList2 = mysqli_query($connApi, "SELECT * FROM  resolutions where resolution = $resolucion");
    $nrowl = mysqli_num_rows($queryList2);
    while ($rowMotorizado2 = mysqli_fetch_array($queryList2)) {
        $type_document_id        = $rowMotorizado2['type_document_id'];
        $prefix                  = $rowMotorizado2['prefix'];
        //$resolution              = $rowMotorizado2['resolution'];
    }
//echo "SELECT * FROM  resolutions where resolution = $resolucion";
//echo'<br>';
    $idOperacion = $rowMotorizado['idOperacion'];
    //$numeroDoc = $rowMotorizado['numeroDoc'];
    $numeroDoc = 3;
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
//echo "SELECT * FROM  FacturaDetalle WHERE idOperacion=$idOperacion";
//echo'<br>';

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
        echo "SELECT * FROM  cliente WHERE cliente_id = $id_cliente";
        $nrowl = mysqli_num_rows($QueryCliente);
        while ($row = mysqli_fetch_array($QueryCliente)) {

            $health_type_operation_id = $row['tipo_cliente'];
            $nit = 1004719946;
            $dv = '';
            $NombreCliente = 'Miguel Castro';
            $direccion_cliente = 'Direccion';
            $emailfe = 'miguelangel052@gmail.com';
            $telefono_cliente = 3502462970;
            $fac_identificacion =13;
            $fac_tipodepersona = 'N';
            $fac_tipodeempresa = 4;

            $primer_nombre = $row['primer_nombre'];
            $segundo_nombre = $row['segundo_nombre'];
            $primer_apellido = $row['primer_apellido'];
            $segundo_apellido = $row['segundo_apellido'];
            $primer_nombre = 'Miguel';
            $segundo_nombre = 'Miguel';
            $primer_apellido = 'Castro';
            $segundo_apellido = 'Castro';
        }

        $QueryAdmisionDatos = mysqli_query($conn3, "SELECT * FROM  sAdmision WHERE ID = 22");
        while ($row = mysqli_fetch_array($QueryAdmisionDatos)) {
            $health_type_operation_id = $row['healthtipo'];
            $health_type_user_id = $row['healthtypeuser'];
            $health_contracting_payment_method_id = $row['tipopagohealt'];
            $health_coverage_id = $row['tipocobertura'];
            $health_type_document_identification_id = $row['tipodocumento'];
            $tipopersona = $row['tipopersona'];
            $tipoempresa = $row['tipoempresa'];
            $mipres = $row['mipres'];
            $mipresdireccion = $row['mipresdireccion'];
            $numeropoliza = $row['numeropoliza'];
            $numeroOrden = $row['numeroOrden'];
            $copago = $row['copago'];

            $co_payment = $copago / 100;

            $moderating_fee = $row['cuotaModeradora'];

        
        }

        // $QueryHealthType = mysqli_query($conn3, "SELECT * FROM  health_type_document_identifications WHERE code = $health_type_operation_id");

        // while ($row = mysqli_fetch_array($QueryHealthType)) {
        //     $health_type_document_identification_id = $row['id'];
        // }
      
        if ($dv == '') {
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
            "resolution_number" => $resolucion,
            "prefix" => "$prefix",
            "notes" => "$nota",

"health_fields" => array( 
        "invoice_period_start_date" =>  "$fechaOperacion",
        "invoice_period_end_date"=> "$fechaVencimiento",
        "health_type_operation_id"=> 1,
        "users_info"=> array( 
            [
                "provider_code"=> "$provider_code",
                "health_type_document_identification_id"=> "$health_type_document_identification_id",
                "identification_number"=> "$nit",
                "surname"=> "$primer_apellido",
                "second_surname"=> "$segundo_apellido",
                "first_name"=> "$primer_nombre",
                "health_type_user_id"=> "$health_type_user_id",
                "health_contracting_payment_method_id"=> $health_contracting_payment_method_id,
                "health_coverage_id"=> $health_coverage_id,
                "autorization_numbers"=> "$numeroOrden",
                "mipres"=> "$mipres",
                "mipres_delivery"=> "$mipres_delivery",
                "contract_number"=> "$contract_number",
                "policy_number"=> "$policy_number",
                "co_payment"=> "$co_payment",
                "moderating_fee"=> "$moderating_fee",
                "recovery_fee"=> "$recovery_fee",
                "shared_payment"=> "$shared_payment",
            ],
            // [
            //     "provider_code"=> "AF-0000500-85-XX-002",
            //     "health_type_document_identification_id"=> 3,
            //     "identification_number"=> "41946692",
            //     "surname"=> "CARDONA",
            //     "second_surname"=> "VILLADA",
            //     "first_name"=> "ELIZABETH",
            //     "health_type_user_id"=> 2,
            //     "health_contracting_payment_method_id"=> 3,
            //     "health_coverage_id"=> 3,
            //     "autorization_numbers"=> "A12345;604567;AX-2345",
            //     "mipres"=> "RNA3D345;664FF04567;ARXXX-2765345",
            //     "mipres_delivery"=> "RN6645G-345;6-064XX54FF04567;XXX-2-OO-987D65345",
            //     "contract_number"=> "1000-2021-0005698",
            //     "policy_number"=> "1045-2FG01-0567228",
            //     "co_payment"=> "3300.00",
            //     "moderating_fee"=> "5800.00",
            //     "recovery_fee"=> "105000.00",
            //     "shared_payment"=> "225000.00"
            // ]
        )
        ),



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

