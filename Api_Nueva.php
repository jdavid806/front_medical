<?php
date_default_timezone_set('America/Bogota');

include("funciones/funciones.php");
include("funciones/funcionesUtilidades.php");





// $queryList = mysqli_query($conn3, "SELECT idOperacion, numeroDoc, pago, fechaOperacion, fechaVencimiento, subTotal,idCliente,descuento_valor FROM sOperacionInv WHERE idOperacion=$idOperacion 
// ");


// while ($rowMotorizado = mysqli_fetch_array($queryList)) {
//     $idOperacion = $rowMotorizado['idOperacion'];
//     $numeroDoc = $rowMotorizado['numeroDoc'];
//     $fechaOperacion = $rowMotorizado['fechaOperacion'];
//     $fechaVencimiento = $rowMotorizado['fechaVencimiento'];
//     $subTotal = $rowMotorizado['subTotal'];

//     $id_cliente = $rowMotorizado['idCliente'];
//     // $descuento_valor = $rowMotorizado['descuento_valor'];

//     $itemDetalles = array(); // almacena los items de la factura
    
//     $queryListDetalle = mysqli_query($conn3, "SELECT descripcion,idProducto,base,id_cliente,cantidad,descuento,subTotal AS subSi FROM  sDetalleOper WHERE idOperacion=$idOperacion");

    
//     $nrowl = mysqli_num_rows($queryListDetalle);
//     if ($queryListDetalle) {

//         while ($rowMotorizadoDetalle = mysqli_fetch_array($queryListDetalle)) {
//             $idProducto = $rowMotorizadoDetalle['idProducto'];
//             $id_cliente = $rowMotorizadoDetalle['id_cliente'];
//             $cantidad = $rowMotorizadoDetalle['cantidad'];
//             $descripcion = $rowMotorizadoDetalle['descripcion'];
//             $descuento = $rowMotorizadoDetalle['descuento'];
//             $base = $rowMotorizadoDetalle['base'];
//             $subSi = $rowMotorizadoDetalle['subSi'];

//             $descuentofinal = $cantidad * (($base * ($descuento / 100)));
       
           
//             $price = funcionMaster($idProducto, 'ID', 'precio', 'sinvetrios');
//             $des = funcionMaster($idProducto, 'ID', 'des', 'sinvetrios');

//             array_push($itemDetalles, array( // cada item en un array
//                 "code" => "$codigo", // referencia del producto
//                 "description" => "$descripcion", // descripcion del producto
//                 "quantity" => $cantidad, // cantidad
//                 "price" => $base, // precio unitario
//                 "discount" => $descuentofinal, // descuento
//                 //"discount" => 0, // descuento
//             ));
//         }

 
      
      
 // Configuración del documento electrónico de facturación
 $time = date("H:i:s");
 $documento = array(
    "number" => 52866623,
    "type_document_id" => 1,
    "date" => 2024-10-21,
    "time" => "$time",
    "resolution_number" => "18760000001",
    "prefix" => "SETP",
    "notes" => "Prueba de Documento",
     "disable_confirmation_text" => true,
     "establishment_name" => "MARIA CAROLINA ARENAS RODRIGUEZ",
     "establishment_address" => "CENTRO MEDICO JAVERIANO CS 213 BRR PIEDRA PINTADA",
     "establishment_phone" => "2655178",
     "establishment_municipality" => 600,
     "establishment_email" => "c.arenasgestamos@hotmail.com",
     "sendmail" => true,
     "sendmailtome" => true,
     "send_customer_credentials" => false,
     "seze" => "2021-2024",

 
    "customer" => array(
        "identification_number" => 901841973,
        "dv" => 6,
        "name" => "MONAROS SAS",
        "phone" => "3209560321",
        "address" => "CALLE 71SUR 35 340",
        "email" => "gerencia@monaros.co",
        "merchant_registration" => "0000000-00",
        "type_document_identification_id" => 6,
        "type_organization_id" => 1,
        "type_liability_id" => 112,
        "municipality_id" => 1,
        "type_regime_id" => 2
    ),
    "payment_form" => array(
        "payment_form_id" => 2,
        "payment_method_id" => 30,
        "payment_due_date" => 2024-10-01,
        "duration_measure" => "30"
    ),
    // "legal_monetary_totals" => array(
    //     "line_extension_amount" => $subTotal_Operacion,
    //     "tax_exclusive_amount" => $subTotal_Operacion,
    //     "tax_inclusive_amount" => $totalNeto,
    //     "payable_amount" => $totalNeto
    // ),
 
    // "invoice_lines" => array(
    //     "unit_measure_id" => 70,
    //     "invoiced_quantity" => 1,
    //     "line_extension_amount" => 10,
    //     "free_of_charge_indicator" => false,
    //     // "tax_totals" => array(
    //     //     array(
    //     //         "tax_id" => 1,
    //     //         "tax_amount" => (($iva > 0) ? number_format(($base * $iva) / 100, 2, '.', '') : 0),
    //     //         "taxable_amount" => $base,
    //     //         "percent" => (($iva > 0) ? $iva : 0)
    //     //     )
    //     // ),
       
    // )
    "description" => "Prodcuto prueba",
    "notes" => "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
    "code" => "COMISION",
    "type_item_identification_id" => 4,
    "price_amount" => 10,
    "base_quantity" => "1"
);
      

      
    //}
$apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/invoice';
$token ='71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
      // Enviar el documento electrónico de facturación a la API de FacturaLátam
      $ch = curl_init($apiUrl);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $documento);
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $token, 'Content-Type: application/json'));
      $response = curl_exec($ch);
      curl_close($ch);
      echo'<pre>';
      var_dump($response);
      echo '</pre>';

      // Verificar si la respuesta es exitosa
      if ($response !== false) {
          $respuesta = json_decode($response, true);
          if ($respuesta['estado'] == 'OK') {
              // La factura se generó correctamente
              echo "La factura se generó correctamente con el número " . $respuesta['numero'];
          } else {
              // Ocurrió un error al generar la factura
              echo "Ocurrió un error al generar la factura: " . $respuesta['mensaje'];
          }
      } else {
          // Ocurrió un error al enviar la solicitud
          echo "Ocurrió un error al enviar la solicitud: " . curl_error($ch);
      }
//}
