<?php
date_default_timezone_set('America/Bogota');
// include 'header.php';
// include 'menu.php';

include("funciones/funciones.php");


include "FE_Api.php";

$idOperacion = $_GET['idOperacion'];

$queryList = mysqli_query($conn3, "SELECT * FROM sOperacionInv WHERE idOperacion = $idOperacion");
$nrowl = mysqli_num_rows($queryList);
while ($rowMotorizado = mysqli_fetch_array($queryList)) {

    $queryList1 = mysqli_query($conn3, "SELECT * FROM fe_sucursales where idUsuario = 1");
    $nrowl = mysqli_num_rows($queryList1);
    while ($rowMotorizado1 = mysqli_fetch_array($queryList1)) {
        
        $consecutivonc = $rowMotorizado1['consecutivonc'];
    }

    $idOperacion = $rowMotorizado['idOperacion'];
    $numeroDoc = $rowMotorizado['numeroDoc'];
    $fechaOperacion = $rowMotorizado['fechaOperacion'];
    $fechaVencimiento = $rowMotorizado['fechaVencimiento'];
    $fechaVencimiento1 = $rowMotorizado['fechaVencimiento'];
    $subTotal = $rowMotorizado['subTotal'];
    $subTotalsii = $rowMotorizado['subTotal'];
    //$id_cliente = $rowMotorizado['idCliente'];
    $nota = $rowMotorizado['nota'];
    $pago = $rowMotorizado['pago'];
    $metodopago = $rowMotorizado['metodopago'];
    $refPago - $rowMotorizado['refPago'];

   $ref_num    = $rowMotorizado['docOrigen'];

    $query2 = mysqli_query($conn3, "SELECT * FROM  sOperacionInv where numeroDoc ='$ref_num' AND pago != ''");
   // echo "SELECT * FROM  sOperacionInv where numeroDoc ='$ref_num'";
$nrowl = mysqli_num_rows($query2);
while ($row2 = mysqli_fetch_array($query2)) {
  $idOperacionCufe      = $row2['idOperacion'];
  $ref_fecha           = $row2['fechaOperacion'];
   $id_cliente = $row2['idCliente'];
}


    $queryList11 = mysqli_query($conn3, "SELECT * FROM cliente where cliente_id = '$id_cliente'"); 
   
    $nrowl = mysqli_num_rows($queryList11);
    while ($rowMotorizado11 = mysqli_fetch_array($queryList11)) {
        $NombreCliente = $rowMotorizado11['nombre_cliente'];
        $direccion_cliente = $rowMotorizado11['direccion_cliente'];
        $emailfe = $rowMotorizado11['email_fe'];
        $telefono_cliente = $rowMotorizado11['telefono_cliente'];
        $fac_identificacion = $rowMotorizado11['fac_identificacion'];
        $fac_tipodepersona = $rowMotorizado11['fac_tipodepersona'];
        $fac_tipodeempresa = $rowMotorizado11['fac_tipodeempresa'];
        $nit = $rowMotorizado11['nit'];
        $dv = $rowMotorizado11['dv'];
        
    }
    $queryList2 = mysqli_query($connApi, "SELECT * FROM  documents where prefix = 'FEV' AND number='$ref_num'");
    $nrowl = mysqli_num_rows($queryList2);
    while ($rowMotorizado2 = mysqli_fetch_array($queryList2)) {
        $cufe        = $rowMotorizado2['cufe'];
       
    }
    $itemDetalles = array(); // almacena los items de la factura
    $queryListDetalle = mysqli_query($conn3, "SELECT * FROM  sDetalleOper WHERE idOperacion=$idOperacion");


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

            $price = funcionMaster($idProducto, 'ID', 'precio', 'sinvetrios');
            $referencia = funcionMaster($idProducto, 'ID', 'referencia', 'sinvetrios');
            if($referencia == ''){
                $referencia = 'Sin Codigo';
            }else{
                $referencia = $referencia;
            }
            $des = funcionMaster($idProducto, 'ID', 'des', 'sinvetrios');

            array_push($itemDetalles, array( // cada item en un array
                "code" => "$referencia", // referencia del producto
                "description" => "$descripcion", // descripcion del producto
                "base_quantity" => $cantidad, // cantidad
                "price_amount" => $base,
                "unit_measure_id" => 70,
                             "invoiced_quantity" => "$cantidad",
                             "line_extension_amount" => "$subTotal",
                             "free_of_charge_indicator" => false,
                             "type_item_identification_id" => 4,
            ));
        }

        // $nit = funcionMaster($id_cliente, 'cliente_id', 'nit', 'cliente');
        // $dv = funcionMaster($id_cliente, 'cliente_id', 'dv', 'cliente');
        if ($dv == '') {
            $dv = NULL;
        } else {
            $dv = $dv;
        }
        // $NombreCliente = funcionMaster($id_cliente, 'cliente_id', 'nombre_cliente', 'cliente');
        // $direccion_cliente = funcionMaster($id_cliente, 'cliente_id', 'direccion_cliente', 'cliente');
        // $emailfe = funcionMaster($id_cliente, 'cliente_id', 'email_fe', 'cliente');
        // $telefono_cliente = funcionMaster($id_cliente, 'cliente_id', 'telefono_cliente', 'cliente');
        // $fac_identificacion = funcionMaster($id_cliente, 'cliente_id', 'fac_identificacion', 'cliente');
        // $fac_tipodepersona = funcionMaster($id_cliente, 'cliente_id', 'fac_tipodepersona', 'cliente');
        // $fac_tipodeempresa = funcionMaster($id_cliente, 'cliente_id', 'fac_tipodeempresa', 'cliente');
//         $fechaOperacion = strtotime($fechaOperacion);
// $fechaVencimiento = strtotime($fechaVencimiento);

// $diferencia = abs($fechaOperacion - $fechaVencimiento);

// $dias = floor($diferencia / 86400);
        
        ///////////////////////////////////////////
        $data = array( // preparamos estructura
            // cada item es un array, cada array se llama objeto
            // aca tenemos el objeto documento, el cual es un array y tiene en su interior
        "billing_reference"=> array( 
		"number"=> "$ref_num",
		"uuid"=> "$cufe",
		"issue_date"=> "$ref_fecha",
            ),
            "number" => "$consecutivonc",
            "type_document_id" => 4,
            "date" => "$ref_fecha", // fecha de emisión
            "time" => date('H:i:s'), // hora de emisión
            "discrepancyresponsecode" => 2,
	        "discrepancyresponsedescription" => "$nota",
            "prefix" => "NC",
            "notes" => "$nota",
            "customer" => array( // objeto de cliente
            "identification_number" => "$nit",
       
            "name" => "$NombreCliente",
            "phone" => "$telefono_cliente",
            "address" => "$direccion_cliente",
            "email" => "$emailfe",
            "merchant_registration" => "0000000-00",
            "type_document_identification_id" => $fac_identificacion,
            "type_organization_id" => $fac_tipodepersona,
            "type_liability_id" => $fac_tipodeempresa,
            "municipality_id" => 1,
            "type_regime_id" => 2,
            ),
        
             "legal_monetary_totals" => array(
              "line_extension_amount" => $subTotal,
              "tax_exclusive_amount" => "0.00",
              "tax_inclusive_amount" => "$subTotal",
              "allowance_total_amount" => "0.00",
              "payable_amount" => "$subTotal",
            ),
              "credit_note_lines" => $itemDetalles,

           
        );


        $CrearNC = CrearNC($data); // enviamos NC

        // //cambiar de objeto a arreglo
        $CrearNC = json_decode(json_encode($CrearNC), true);
        // echo "<pre> ----------------------";
        // var_dump($CrearNC);
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

        foreach ($CrearNC as $key => $value) {
            if ($key == "urlinvoicepdf") {
               
                    // Accede a los valores de urlinvoicepdf y NitFac
                    $urlinvoicepdf = $CrearNC["urlinvoicepdf"];
                    $qrStr = $CrearNC["QRStr"];
                    $nitFac = trim(substr(explode("\n", $qrStr)[3], strpos(explode("\n", $qrStr)[3], ":") + 1));
                    
                   // echo "URL de la NC en PDF: " . $urlinvoicepdf;
                   // echo "NitFac: " . $nitFac;
                    $PDF =$nitFac.'/'.$urlinvoicepdf;
                    $ConsultarPDF = ConsultarPDF($PDF);
                    if ($ConsultarPDF !== null) {
                        echo '<iframe src="data:application/pdf;base64,' . base64_encode($ConsultarPDF) . '" width="100%" height="100%"></iframe>';
                    } else {
                        echo 'Error al descargar el PDF';
                    }
                
            }
        }
    }
}

