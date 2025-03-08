<?php
session_start();
// function CrearFactura($data)
// {
//     $apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/invoice';
//     $token ='71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
  
//     $dataPost = json_encode($data);

//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, $apiUrl);

//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//     curl_setopt($ch, CURLOPT_HEADER, FALSE);
//     curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
//     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
//     // curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
//     curl_setopt($ch, CURLOPT_HTTPHEADER,
//     array('Authorization: Bearer '.$token, 'Content-Type: application/json','Accept: application/json')
// );
    


// try {
//     $response = curl_exec($ch);
//     $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
//     $error = curl_error($ch);

//     if ($error) {
//         echo "Error en la petición: $error";
//     } else {
//         $location = curl_getinfo($ch, CURLINFO_REDIRECT_URL);
//         if ($location) {
//             echo "Redirección a: $location";
//         } else {
//             echo "Código de estado HTTP: $httpCode";
//             echo "Respuesta: ";
//             //var_dump($response);
//             $response = json_decode($response);
            
//         }
//     }

//     curl_close($ch);
// } catch (HttpException $ex) {
//     echo "Excepción: " . $ex->getMessage();
// }
// }
function CrearFactura($data)
{
    $apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/invoice';
    $token = '71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
    // Verificar la estructura de $data antes de enviarla
    // echo "<pre>Datos a enviar:\n";
    // var_dump($data); // Esto muestra el contenido de $data para ver si tiene arrays anidados inesperados
    // echo "</pre>";
    // Codificar el arreglo a JSON
    $dataPost = json_encode($data);
    echo "<pre>Datos a enviar:\n";
    var_dump($dataPost); // Esto muestra el contenido de $data para ver si tiene arrays anidados inesperados
    echo "</pre>";
    // Verificar si hubo un problema con la codificación JSON
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Error de JSON: " . json_last_error_msg();
        return;
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer '.$token,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    try {
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        if ($error) {
            echo "Error en la petición: $error";
        } else {
            echo "Código de estado HTTP: $httpCode\n";
            echo "Respuesta: ";
            var_dump($response); // Muestra la respuesta de la API sin decodificar aún
            // Decodificar la respuesta JSON
            $responseDecoded = json_decode($response, true);
            // Verificar si hubo un error en la decodificación JSON
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo "Error al decodificar la respuesta JSON: " . json_last_error_msg();
            } else {
                var_dump($responseDecoded); // Muestra la respuesta decodificada
            }
        }
        curl_close($ch);
    } catch (Exception $ex) {
        echo "Excepción: " . $ex->getMessage();
    }
}

// function CrearFactura($data)
// {
//     $apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/invoice';
//     $token = '71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
//     // Codificar el arreglo a JSON
//     $dataPost = json_encode($data);
//     // Verificar si hubo un problema con la codificación JSON
//     if (json_last_error() !== JSON_ERROR_NONE) {
//         return (object) [
//             'success' => false,
//             'error' => 'Error de JSON: ' . json_last_error_msg()
//         ];
//     }
//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, $apiUrl);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//     curl_setopt($ch, CURLOPT_HEADER, FALSE);
//     curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
//     curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
//     curl_setopt($ch, CURLOPT_HTTPHEADER, [
//         'Authorization: Bearer ' . $token,
//         'Content-Type: application/json',
//         'Accept: application/json'
//     ]);
//     try {
//         $response = curl_exec($ch);
//         $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
//         $error = curl_error($ch);
//         curl_close($ch);
//         if ($error) {
//             return (object) [
//                 'success' => false,
//                 'error' => "Error en la petición cURL: $error",
//                 'http_code' => $httpCode
//             ];
//         }
//         // Decodificar la respuesta JSON
//         $responseDecoded = json_decode($response, true);
//         // Verificar si hubo un error en la decodificación JSON
//         if (json_last_error() !== JSON_ERROR_NONE) {
//             return (object) [
//                 'success' => false,
//                 'error' => 'Error al decodificar la respuesta JSON: ' . json_last_error_msg(),
//                 'http_code' => $httpCode,
//                 'response' => $response // Respuesta sin decodificar para referencia
//             ];
//         }
//         // Retornar la respuesta decodificada como objeto
//         return (object) [
//             'success' => true,
//             'http_code' => $httpCode,
//             'response' => $responseDecoded
//         ];
//     } catch (Exception $ex) {
//         return (object) [
//             'success' => false,
//             'error' => "Excepción: " . $ex->getMessage()
//         ];
//     }
// }
function CrearNC($data)
{
    $apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/credit-note';
    $token ='71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
  
    $dataPost = json_encode($data);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    // curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_HTTPHEADER,
    array('Authorization: Bearer '.$token, 'Content-Type: application/json','Accept: application/json')
);
    


try {
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    if ($error) {
        echo "Error en la petición: $error";
    } else {
        $location = curl_getinfo($ch, CURLINFO_REDIRECT_URL);
        if ($location) {
            echo "Redirección a: $location";
        } else {
            $response = json_decode($response);
            echo "Código de estado HTTP: $httpCode";
            echo "Respuesta: ";
            var_dump($response);
        }
    }

    curl_close($ch);
} catch (HttpException $ex) {
    echo "Excepción: " . $ex->getMessage();
}
}

function ConsultarPDF($data)
{


    $apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/download/'.$data.'';
    $token ='71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
   //echo $apiUrl;
   //var_dump($data);
    $dataGET =$data;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, $dataGET);
    // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    // curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_HTTPHEADER,
    array('Authorization: Bearer '.$token, 'Content-Type: application/json','Accept: application/json','Accept-Encoding: gzip, deflate','cache-control: no-cache','Connection: keep-alive',)
);
   // si demora mucho cancelar la peticion
   curl_setopt($ch, CURLOPT_TIMEOUT, 30);
   curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);


   try {
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);

    if ($error) {
        echo "Error en la petición: $error";
    } else {
        $location = curl_getinfo($ch, CURLINFO_REDIRECT_URL);
        if ($location) {
            echo "Redirección a: $location";
        } else {
            $response = json_decode($response);
           // echo "Código de estado HTTP: $httpCode";
           // echo "Respuesta: ";
            var_dump($response);
        }
    }

    curl_close($ch);
} catch (HttpException $ex) {
    echo "Excepción: " . $ex->getMessage();
}
}
// function CrearNotaCreditoSiigo($data)
// {
//     $url = "https://api.siigo.com/v1/invoices";
//     $siigo_access_token = $_SESSION['siigo_access_token'];
//     // $header = array(
//     //     "Content-Type: application/json",
//     //     "Authorization: $siigo_access_token",
//     //     "Partner-ID: medicalsolftplus"
//     // );
//     $dataPost = json_encode($data);

//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, "https://api.siigo.com/v1/credit-notes");
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//     curl_setopt($ch, CURLOPT_HEADER, FALSE);
//     curl_setopt($ch, CURLOPT_POST, TRUE);
//     curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
//     // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
//     //curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
//     curl_setopt($ch, CURLOPT_HTTPHEADER, array(
//         "Content-Type: application/json",
//         "Authorization: $siigo_access_token",
//         "Partner-ID: medicalsolftplus"
//     ));
//     curl_setopt($ch, CURLOPT_HTTPHEADER,
//     array('Authorization: Bearer '.$token, 'Content-Type: application/json'));

//     try {
//         $response = curl_exec($ch);
//         $response = json_decode($response);
//         curl_close($ch);
//         return $response;
//     } catch (HttpException $ex) {
//         return null;
//     }
// }






function CrearPersonaApi($data)
{
    $apiUrl = 'https://apidian.monaros.com.co/api/ubl2.1/register-update-customer';
    $token ='71d06897daba07f4d20b7921e63994fc670824a7aa44bd3d904456288e213a1d';
    $dataPost = json_encode($data);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_HTTPHEADER,
        array('Authorization: Bearer '.$token, 'Content-Type: application/json','Accept: application/json')
    );
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    try {
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        if ($error) {
            echo "Error en la petición: $error";
        } else {
            $location = curl_getinfo($ch, CURLINFO_REDIRECT_URL);
            if ($location) {
                echo "Redirección a: $location";
            } else {
                $response = json_decode($response);
                echo "Código de estado HTTP: $httpCode";
                echo "Respuesta: ";
                var_dump($response);
            }
        }

        curl_close($ch);
    } catch (HttpException $ex) {
        echo "Excepción: " . $ex->getMessage();
    }
}






function TipoPago()
{


    $url = "https://api.siigo.com/v1/payment-types?document_type=FV";
    $siigo_access_token = $_SESSION['siigo_access_token'];
    $header = array(
        "Content-Type: application/json",
        "Authorization: $siigo_access_token",
        "Partner-ID: medicalsolftplus"
    );
    $dataPost = json_encode($data);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
    // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

    // si demora mucho cancelar la peticion
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);




    try {
        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);
        return $response;
    } catch (HttpException $ex) {
        return null;
    }
}
function TipoComprobante()
{


    $url = "https://api.siigo.com/v1/document-types?type=FV";
    $siigo_access_token = $_SESSION['siigo_access_token'];
    $header = array(
        "Content-Type: application/json",
        "Authorization: $siigo_access_token",
        "Partner-ID: medicalsolftplus"
    );
    $dataPost = json_encode($data);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
    // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

    // si demora mucho cancelar la peticion
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);




    try {
        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);
        return $response;
    } catch (HttpException $ex) {
        return null;
    }
}
function TipoComprobante1()
{


    $url = "https://api.siigo.com/v1/document-types?type=NC";
    $siigo_access_token = $_SESSION['siigo_access_token'];
    $header = array(
        "Content-Type: application/json",
        "Authorization: $siigo_access_token",
        "Partner-ID: medicalsolftplus"
    );
    $dataPost = json_encode($data);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, $dataPost);
    // curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);

    // si demora mucho cancelar la peticion
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);




    try {
        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);
        return $response;
    } catch (HttpException $ex) {
        return null;
    }
}









function funcionMasterAoi($search = "")
{
    $url = "https://api.siigo.com/v1/{$search}";
    $siigo_access_token = $_SESSION['siigo_access_token'];
    $header = array(
        "Content-Type: application/json",
        "Authorization: $siigo_access_token",
        "Partner-ID: medicalsolftplus"
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);


    try {
        $response = curl_exec($ch);
        $response = json_decode($response);
        curl_close($ch);
        return $response;
    } catch (HttpException $ex) {
        return null;
    }
}
