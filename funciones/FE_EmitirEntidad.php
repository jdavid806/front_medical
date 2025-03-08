<?php
date_default_timezone_set('America/Bogota');


//include("funciones/funciones.php");


//include "FE_Api.php";

//$facturaId = $_GET['idOperacion'];



$queryList = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE  idOperacion = $facturaId");
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

    $idOperacion = $rowMotorizado['idOperacion'];
    $numeroDoc = $rowMotorizado['numeroDoc'];
    $fechaOperacion = $rowMotorizado['fechaOperacion'];
    $fechaVencimiento = $rowMotorizado['fechaVencimiento'];
    $fechaVencimiento1 = $rowMotorizado['fechaVencimiento'];
    $subTotal = $rowMotorizado['subTotal'];
    $subTotalsii = $rowMotorizado['subTotal'];
   $id_cliente = $rowMotorizado['entidad_id'];


    $queryList21 = mysqli_query($conn3, "SELECT * FROM  Rips_Entidades where id = $id_cliente");
    $nrowl = mysqli_num_rows($queryList);
    while ($rowMotorizado21 = mysqli_fetch_array($queryList21)) {
        $nit = $rowMotorizado21[ 'nit'];
        $dv = $rowMotorizado21[ 'dv'];
        $NombreCliente = $rowMotorizado21['Nombre'];
        $direccion_cliente = $rowMotorizado21['direccion_cliente'];
        $emailfe = $rowMotorizado21['email_fe'];
        $telefono_cliente = $rowMotorizado21['telefono_cliente'];
        $fac_identificacion = $rowMotorizado21['fac_identificacion'];
        $fac_tipodepersona = $rowMotorizado21['fac_tipodepersona'];
        $fac_tipodeempresa = $rowMotorizado21['fac_tipodeempresa'];
       
        if ($dv == '') {
            $dv = NULL;
        } else {
            $dv = $dv;
        }
    }
    $nota = $rowMotorizado['nota'];
    $pago = $rowMotorizado['pago'];
    $metodopago = $rowMotorizado['metodopago'];
    $itemDetalles = array(); // almacena los items de la factura
    $queryListDetalle = mysqli_query($conn3, "SELECT * FROM  FacturaDetalle WHERE idOperacion=$idOperacion");


    $nrowl = mysqli_num_rows($queryListDetalle);
    if ($nrowl > 0) {

        while ($rowMotorizadoDetalle = mysqli_fetch_array($queryListDetalle)) {
            $idProducto = $rowMotorizadoDetalle['idProducto'];
            $id_cliente = $rowMotorizadoDetalle['id_cliente'];
            $cantidad = $rowMotorizadoDetalle['cantidad'];
            $descripcion = $rowMotorizadoDetalle['descripcion'];
            $descuento = $rowMotorizadoDetalle['descuento'];
            $base = $rowMotorizadoDetalle['base'];
            $subSi = $rowMotorizadoDetalle['subSi'];

            $descuentofinal = $cantidad * (($base * ($descuento / 100)));

            $sqlProcedimiento = mysqli_query($conn3, "SELECT * FROM  FE_Procedimientos WHERE id = $idProducto AND activo=1");

//echo "SELECT * FROM  FE_Procedimientos WHERE id = $idProducto";
//echo'<br>';
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

     

        
        ///////////////////////////////////////////
        $data = array( // preparamos estructura
            // cada item es un array, cada array se llama objeto
            // aca tenemos el objeto documento, el cual es un array y tiene en su interior
            "number" => "$numeroDoc",
            "type_document_id" => $type_document_id,
            "date" => "$fechaOperacion", // fecha de emisión
            "time" => date('H:i:s'), // hora de emisión
            "resolution_number" => $resolucion,
            "prefix" => $prefix,
            "notes" => "$nota",
            "customer" => array( // objeto de cliente
                "identification_number" => "$nit",
                "dv" => "$dv",
                "name" => "$NombreCliente",
                "phone" => "$telefono_cliente",
                "address" => "$direccion_cliente",
                "email" => "$emailfe",
                "merchant_registration" => "0000000-00",
                "type_document_identification_id" => $fac_identificacion,
        "type_organization_id" => $fac_tipodepersona,
        "type_liability_id" => $fac_tipodeempresa,
        "municipality_id" => 1,
        "type_regime_id" => 2
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
       // $CrearFactura = json_decode(json_encode($CrearFactura), true);
        // echo "<pre> ----------------------";
        // var_dump($CrearFactura);
        // echo '<br>';



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
         //var_dump($data);
        // echo '</pre>';
        // exit('ok');

        foreach ($CrearFactura as $key => $value) {
            if ($key == "success") {
                if ($value == true) {
                    // Accede a los valores de urlinvoicepdf y NitFac
                //     $urlinvoicepdf = $CrearFactura["urlinvoicepdf"];
                //     $qrStr = $CrearFactura["QRStr"];
                //     $nitFac = trim(substr(explode("\n", $qrStr)[3], strpos(explode("\n", $qrStr)[3], ":") + 1));
                    
                //    // echo "URL de la factura en PDF: " . $urlinvoicepdf;
                //    // echo "NitFac: " . $nitFac;
                //     $PDF =$nitFac.'/'.$urlinvoicepdf;
                //     $ConsultarPDF = ConsultarPDF($PDF);
                //     if ($ConsultarPDF !== null) {
                //         echo '<iframe src="data:application/pdf;base64,' . base64_encode($ConsultarPDF) . '" width="100%" height="100%"></iframe>';
                //     } else {
                //         echo 'Error al descargar el PDF';
                //     }
                echo "<script language='Javascript'> window.location='SclienteAdministracion_ControlfacturasEmpresas.php';</script>";
                }
            }else{
                echo "<pre> ----------------------";
        var_dump($CrearFactura);
        echo '<br>';



        echo "---------------------------</pre><br>";
        echo '<pre>';
       
        var_dump($data);
        echo '</pre>';
        exit('ok');
            }
        }
    }
}

