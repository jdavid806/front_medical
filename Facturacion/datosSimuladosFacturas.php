<?php

// ? IMPUESTOS CARGO
include "../Models/Facturacion/ImpuestosCargo.php";
include "../Controllers/Facturacion/ImpuestosCargo.php";
$ControllerImpuestosC = new ImpuestosCargoController($conn3);
//$datosImpuestosC = $ControllerImpuestosC->index();
$datosImpuestosC = $ControllerImpuestosC->index("AND idUsuario = {$_SESSION['ID']}");
//var_dump($datosImpuestosC);
// ? IMPUESTOS CARGO

// ? IMPUESTOS CARGO
include "../Models/Facturacion/ImpuestosRetencion.php";
include "../Controllers/Facturacion/ImpuestosRetencion.php";
$ControllerImpuestosR = new ImpuestosRetencionController($conn3);
//$datosImpuestosR = $ControllerImpuestosR->index();
$datosImpuestosR = $ControllerImpuestosR->index("AND idUsuario = {$_SESSION['ID']}");
//var_dump($datosImpuestosR);
// ? IMPUESTOS CARGO

include "../Models/Facturacion/Vendedores.php";
include "../Controllers/Facturacion/Vendedores.php";
$ControllerVendedores = new VendedoresController($conn3);
$dataJsonVendedores = $ControllerVendedores->index("AND idUsuario = {$_SESSION['ID']}");
//$dataJsonVendedores = $ControllerVendedores->index();
//var_dump($dataJsonVendedores);
include "../Models/Facturacion/CentrosCosto.php";
include "../Controllers/Facturacion/CentrosCosto.php";
$ControllerCentrosDeCosto = new CentrosCostoController($conn3);
//$datosSimuladosCentrosDeCosto = $ControllerCentrosDeCosto->index();
$datosSimuladosCentrosDeCosto = $ControllerCentrosDeCosto->index("AND idUsuario = {$_SESSION['ID']}");
//var_dump($datosSimuladosCentrosDeCosto);
include "../Models/Facturacion/MetodosPago.php";
include "../Controllers/Facturacion/MetodosPago.php";
$ControllerCentrosDeCosto = new MetodosPagoController($conn3);
//$metodosPago = $ControllerCentrosDeCosto->index();
$metodosPago = $ControllerCentrosDeCosto->index("AND idUsuario = {$_SESSION['ID']}");
//var_dump($metodosPago);
include "../Models/Facturacion/Entidades.php";
include "../Controllers/Facturacion/Entidades.php";
$ControllerEntidades = new EntidadesController($conn3);
//$datosSimuladosEntidades = $ControllerEntidades->index();
$datosSimuladosEntidades = $ControllerEntidades->index("AND idUsuario = {$_SESSION['ID']}");
// var_dump($datosSimuladosEntidades);

include "../Models/Facturacion/Procedimientos.php";
include "../Controllers/Facturacion/Procedimientos.php";
$ControllerProductos = new ProcedimientosController($conn3);
//$dataJsonProcedimientos = $ControllerProductos->index();
$dataJsonProcedimientos = $ControllerProductos->index("AND usuarioId = {$_SESSION['ID']}");

// ? FACTURAS
include "../Models/Facturacion/Factura.php";
include "../Controllers/Facturacion/Factura.php";
$ControllerFacturas = new FacturasController($conn3);
$dataJsonfacturas = $ControllerFacturas->index();
// ? FACTURAS

// ? DETALLE DE FACTURA
include "../Models/Facturacion/FacturaDetalle.php";
include "../Controllers/Facturacion/FacturaDetalle.php";
$ControllerProductos = new FacturaDetallesController($conn3);
$dataJsonDetalleFactura = $ControllerProductos->index();
// ? DETALLE DE FACTURA


 //$dataJsonProcedimientos = json_encode($datosProductos);
 

$tiposDocumento = [
    "RC" => "Registro civil de nacimiento",
    "TI" => "Tarjeta de Indentidad",
    "CC" => "Cedula de Ciudadania",
    "TE" => "Tarjeta de extranjeria",
    "CE" => "Cedula de Extranjeria",
    "NIT" => " NIT",
    "PA" => "Pasaporte",
    "TDE" => " Tipo de documento Extranejro",
    "DIAN" => "> Uso definido por la DIAN"
];

// $metodosPago = [
//     "1" => "Efectivo",
//     "2" => "Nequi",
//     "3" => "Tarjeta de Credito",
// ];




function obtenerDatosFacturas()
{
    include "../funciones/conn3.php";
    $Facturas = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idEmpresa = $_SESSION[ID] AND FacturaMarcada = 0 AND Tipo_Operacion=1");
    $dataJsonSimuladaFacturas = [];

    while ($row = mysqli_fetch_assoc($Facturas)) {
        $queryCliente = mysqli_query($connMedical, "SELECT * FROM cliente WHERE cliente_id = '$row[idCliente]'");
        while ($rowcliente = mysqli_fetch_assoc($queryCliente)) {
            $nombre_cliente = $rowcliente['nombre_cliente'];
        }
        $queryDetalle = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion='$row[idOperacion]'");
        while ($rowDetalle = mysqli_fetch_assoc($queryDetalle)) {
            $idProducto = $rowDetalle['idProducto'];
            $descripcion = $rowDetalle['descripcion'];
            $cantidad = $rowDetalle['cantidad'];
            $descuento = $rowDetalle['descuento'];
        }
        $queryUsuario = mysqli_query($conn3, "SELECT * FROM usuarios WHERE ID = '$row[idEmpresa]'");
        while ($rowUsuario = mysqli_fetch_assoc($queryUsuario)) {

            $NOMBRE_USUARIO = $rowUsuario['NOMBRE_USUARIO'];
        }
        $dataJsonSimuladaFacturas[] = [
            "clienteId" =>  $row['idCliente'],
            "nombreCliente" => $nombre_cliente,
            "facturaId" =>  $row['idOperacion'],
            "fecha" => $row['fechaOperacion'],
            "procedimientoId" => $idProducto,
            "procedimientoNombre" => $descripcion,
            "empresaId" => $row['entidad_id'],
            "valor" =>  $row['totalNeto'],
            "cantidad" =>  $cantidad,
            "descuento" =>  $descuento,
            "especialistaId" => $row['idEmpresa'],
            "especialistaNombre" => $NOMBRE_USUARIO

        ];
    }

    return json_encode($dataJsonSimuladaFacturas);
}
function obtenerFacturasAdmision()
{
    include "../funciones/conn3.php";
    $Facturas = mysqli_query($conn3, "SELECT * FROM sAdmision WHERE usuarioId = $_SESSION[ID] AND Facturado = 0 AND Activo=1");
    $dataJsonFacturasAdmision = [];

    while ($row = mysqli_fetch_assoc($Facturas)) {
        $queryCliente = mysqli_query($connMedical, "SELECT * FROM cliente WHERE cliente_id = '$row[clienteId]'");
        while ($rowcliente = mysqli_fetch_assoc($queryCliente)) {
            $nombre_cliente = $rowcliente['nombre_cliente'];
        }
        // $queryDetalle = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion='$row[idOperacion]'");
        // while ($rowDetalle = mysqli_fetch_assoc($queryDetalle)) {
        //     $idProducto = $rowDetalle['idProducto'];
        //     $descripcion = $rowDetalle['descripcion'];
        //     $cantidad = $rowDetalle['cantidad'];
        //     $descuento = $rowDetalle['descuento'];
        // }
        $queryUsuario = mysqli_query($conn3, "SELECT * FROM usuarios WHERE ID = '$row[usuarioId]'");
        while ($rowUsuario = mysqli_fetch_assoc($queryUsuario)) {

            $NOMBRE_USUARIO = $rowUsuario['NOMBRE_USUARIO'];
        }
        $dataJsonFacturasAdmision[] = [
            "clienteId" =>  $row['clienteId'],
            "nombreCliente" => $nombre_cliente,
       
            "fecha" => $row['fecha_Admision'],
            "id" => $row['ID'],
            "nombreProcedimiento" => $row['nombreCups'],
            "usuarioId" => $row['usuarioId'],
            "precio" =>  $row['valor'],
            "cantidad" =>  $row['cantidad'],
            "descuento" => 0

        ];
    }

    return json_encode($dataJsonFacturasAdmision);
}

$datosSimuladosEspecialistas = [
    [
        "id" => 1,
        "nombre" => "Dr. Juan Pérez"
    ],
    [
        "id" => 2,
        "nombre" => "Dra. Ana Torres"
    ],
    [
        "id" => 3,
        "nombre" => "Dr. Luis Gómez"
    ]
];

// $dataJsonProcedimientos = [
//     [
//         "procedimientoId" => "1",
//         "procedimientoNombre" => "CONSULTA GENERAL"
//     ],
//     [
//         "procedimientoId" => "2",
//         "procedimientoNombre" => "REVISIÓN DENTAL"
//     ],
//     [
//         "procedimientoId" => "3",
//         "procedimientoNombre" => "ANÁLISIS DE SANGRE"
//     ],
//     [
//         "procedimientoId" => "4",
//         "procedimientoNombre" => "ULTRASONIDO"
//     ],
//     [
//         "procedimientoId" => "5",
//         "procedimientoNombre" => "RADIOGRAFÍA"
//     ],
//     [
//         "procedimientoId" => "6",
//         "procedimientoNombre" => "CONSULTA DE ESPECIALISTA"
//     ],
//     [
//         "procedimientoId" => "7",
//         "procedimientoNombre" => "TERAPIA FÍSICA"
//     ],
//     [
//         "procedimientoId" => "8",
//         "procedimientoNombre" => "VACUNACIÓN"
//     ],
//     [
//         "procedimientoId" => "9",
//         "procedimientoNombre" => "CONTROL DE PESO"
//     ],
//     [
//         "procedimientoId" => "10",
//         "procedimientoNombre" => "Consulta dermatológica"
//     ],
//     [
//         "procedimientoId" => "11",
//         "procedimientoNombre" => "REVISIÓN CARDIACOS"
//     ],
//     [
//         "procedimientoId" => "12",
//         "procedimientoNombre" => "EXAMEN DE VISTA"
//     ],
//     [
//         "procedimientoId" => "13",
//         "procedimientoNombre" => "CHEQUEO GENERAL"
//     ],
//     [
//         "procedimientoId" => "14",
//         "procedimientoNombre" => "DIAGNÓSTICO IMÁGENES"
//     ],
//     [
//         "procedimientoId" => "15",
//         "procedimientoNombre" => "HORMONAS"
//     ],
//     [
//         "procedimientoId" => "16",
//         "procedimientoNombre" => "CHECK-UP ANUAL"
//     ],
//     [
//         "procedimientoId" => "17",
//         "procedimientoNombre" => "TEST DE ALERGIAS"
//     ],
//     [
//         "procedimientoId" => "18",
//         "procedimientoNombre" => "ELECTROCARDIOGRAMA"
//     ],
//     [
//         "procedimientoId" => "19",
//         "procedimientoNombre" => "MAMOGRAFÍA"
//     ],
//     [
//         "procedimientoId" => "20",
//         "procedimientoNombre" => "CITOGENÉTICA"
//     ],
//     [
//         "procedimientoId" => "21",
//         "procedimientoNombre" => "ORTODONCIA"
//     ],
//     [
//         "procedimientoId" => "22",
//         "procedimientoNombre" => "NEUROLOGÍA"
//     ],
//     [
//         "procedimientoId" => "23",
//         "procedimientoNombre" => "ONCOLOGÍA"
//     ],
//     [
//         "procedimientoId" => "24",
//         "procedimientoNombre" => "PSICOLOGÍA"
//     ],
//     [
//         "procedimientoId" => "25",
//         "procedimientoNombre" => "FISIOTERAPIA"
//     ],
//     [
//         "procedimientoId" => "26",
//         "procedimientoNombre" => "GINECOLOGÍA"
//     ],
//     [
//         "procedimientoId" => "27",
//         "procedimientoNombre" => "PEDIATRÍA"
//     ],
//     [
//         "procedimientoId" => "28",
//         "procedimientoNombre" => "OFTALMOLOGÍA"
//     ],
//     [
//         "procedimientoId" => "29",
//         "procedimientoNombre" => "CIRUGÍA GENERAL"
//     ],
//     [
//         "procedimientoId" => "30",
//         "procedimientoNombre" => "DERMATOLOGÍA"
//     ],
// ];


function obtenerDatosClientes()
{
    include "../funciones/conn3.php";
    $clientesMedical = mysqli_query($connMedical, "SELECT * FROM cliente limit 1500");
    $datosSimuladosClientes = [];

    while ($row = mysqli_fetch_assoc($clientesMedical)) {
        $datosSimuladosClientes[] = [
            $row['cliente_id'],
            $row['primer_nombre'],
            $row['segundo_nombre'],
            $row['primer_apellido'],
            $row['segundo_apellido'],
            $row['tipo_cliente'],
            $row['CODI_CLIENTE'],
            $row['correo_cliente'],
            $row['whatsapp'],
            $row['entidad_id'],
            $row['direccion_cliente']
        ];
    }

    return json_encode($datosSimuladosClientes);
}

// function obtenerDatosClientes() {
//     $cacheKey = 'clientes';
//     $cacheTime = 3600; // 1 hora

//     // Verificar si la caché existe
//     if (isset($_SESSION[$cacheKey]) && $_SESSION[$cacheKey]['timestamp'] > time() - $cacheTime) {
//         // Devolver los datos de la caché
//         return json_encode($_SESSION[$cacheKey]['data']);
//     }

//     // Realizar la consulta SQL
//     include "../funciones/conn3.php";
//     $clientesMedical = mysqli_query($connMedical, "SELECT * FROM cliente limit 1500");
//     $datosSimuladosClientes = [];

//     while ($row = mysqli_fetch_assoc($clientesMedical)) {
//         $datosSimuladosClientes[] = [
//             $row['cliente_id'],
//             $row['primer_nombre'],
//             $row['segundo_nombre'],
//             $row['primer_apellido'],
//             $row['segundo_apellido'],
//             $row['tipo_cliente'],
//             $row['CODI_CLIENTE'],
//             $row['correo_cliente'],
//             $row['whatsapp'],
//             $row['entidad_id'],
//             $row['direccion_cliente']
//         ];
//     }

//     // Almacenar los datos en la caché
//     $_SESSION[$cacheKey] = [
//         'timestamp' => time(),
//         'data' => $datosSimuladosClientes
//     ];

//     // Actualizar la caché automáticamente cuando se realizan cambios en la base de datos
//     $trigger = new Trigger();
//     $trigger->actualizarCaché($cacheKey);

//     // Devolver los datos
//     return json_encode($datosSimuladosClientes);
// }

class Trigger {
    public function actualizarCaché($cacheKey) {
        // Verificar si se han realizado cambios en la base de datos
        $changes = $this->verificarCambiosEnBaseDeDatos();

        if ($changes) {
            // Actualizar la caché
            $this->actualizarCachéManualmente($cacheKey);
        }
    }

    private function verificarCambiosEnBaseDeDatos() {
        // Realizar una consulta para verificar si se han realizado cambios en la base de datos
        include "../funciones/conn3.php";
        $query = "SELECT COUNT(*) as cambios FROM cliente WHERE fecha_modificacion > DATE_SUB(NOW(), INTERVAL 1 HOUR)";
        $result = mysqli_query($connMedical, $query);
        $row = mysqli_fetch_assoc($result);

        if ($row['cambios'] > 0) {
            return true;
        } else {
            return false;
        }
    }

    private function actualizarCachéManualmente($cacheKey) {
        // Eliminar la caché actual
        unset($_SESSION[$cacheKey]);

        // Realizar la consulta SQL nuevamente
        include "../funciones/conn3.php";
        $clientesMedical = mysqli_query($connMedical, "SELECT * FROM cliente");
        $datosSimuladosClientes = [];

        while ($row = mysqli_fetch_assoc($clientesMedical)) {
            $datosSimuladosClientes[] = [
                $row['cliente_id'],
                $row['primer_nombre'],
                $row['segundo_nombre'],
                $row['primer_apellido'],
                $row['segundo_apellido'],
                $row['tipo_cliente'],
                $row['CODI_CLIENTE'],
                $row['correo_cliente'],
                $row['whatsapp'],
                $row['entidad_id'],
                $row['direccion_cliente']
            ];
        }

        // Almacenar los datos en la caché
        $_SESSION[$cacheKey] = [
            'timestamp' => time(),
            'data' => $datosSimuladosClientes
        ];
    }
}
function obtenerDatosEntidades()
{
    include "../funciones/conn3.php";
    $EntidadesMedical = mysqli_query($conn3, "SELECT * FROM FE_Entidades WHERE idUsuario = $_SESSION[ID] AND activo = 1");
    $datosSimuladosEntidades = [];

    while ($row = mysqli_fetch_assoc($EntidadesMedical)) {
        $datosSimuladosEntidades[] = [
            $row['id'],
            $row['nombreEntidad'],

        ];
    }

    return $datosSimuladosEntidades;
}

function cargarOptionsEntidades()
{
  $datosEntidades = obtenerDatosEntidades();
    $optionsHtml = '';

    foreach ($datosEntidades as $dato) {
        $optionsHtml .= '<option value="' . $dato[0] . '">' . $dato[1] . '</option>';
    }

    return $optionsHtml;
}

// function cargarOptionsImpuestoCargo()
// {
//     include "../funciones/conn3.php";
//     $OptionsImpuestosCargos = mysqli_query($conn3, "SELECT * FROM FE_ImpuestosCargo WHERE activo = 1");
//     $datosSimulados = [];

//     while ($row = mysqli_fetch_assoc($OptionsImpuestosCargos)) {
//         $datosSimulados[] = [
//             $row['id'],
//             $row['nombre'],
//             $row['tasaImpuesto']
//         ];
        
//     }
//     return $datosSimulados;
// }

// function obtenerOptionsImpuestoCargo()
// {
//     $datosEntidades = cargarOptionsImpuestoCargo();
//     $optionsHtml = '';
//     foreach ($datosEntidades as $dato) {
//         $optionsHtml .= '<option value="' . $dato[0] . '">' . $dato[1] . '</option>';
        
//     }
    
// }

$datosSimuladosPersonasJuridicas = [
    ["1", rand(0, 2), "900112233", "Tech Solutions SAS", rand(0, 2), "Calle 123 #45-67", "3101234567", "info@techsolutions.com"],
    ["2", rand(0, 2), "800223344", "Innovative Software SA", rand(0, 2), "Avenida 56 #78-90", "3102345678", "contact@innovativesoftware.com"],
    ["3", rand(0, 2), "700334455", "Consulting & Solutions LTDA", rand(0, 2), "Carrera 9 #12-34", "3103456789", "support@consultingandsolutions.com"],
    ["4", rand(0, 2), "600445566", "Digital Innovators SAS", rand(0, 2), "Diagonal 89 #65-43", "3104567890", "hello@digitalinnovators.com"],
    ["5", rand(0, 2), "500556677", "Global Business RUC", rand(0, 2), "Calle 45 #23-89", "3105678901", "sales@globalbusiness.com"],
    ["6", rand(0, 2), "400667788", "Enterprise Solutions CIF", rand(0, 2), "Transversal 32 #54-76", "3106789012", "info@enterprisesolutions.com"],
    ["7", rand(0, 2), "300778899", "Next Level Technologies LTDA", rand(0, 2), "Carrera 17 #22-55", "3107890123", "contact@nextleveltech.com"],
    ["8", rand(0, 2), "200889900", "Innovative Builders SAS", rand(0, 2), "Avenida 68 #12-90", "3108901234", "builders@innovativebuilders.com"],
    ["9", rand(0, 2), "100990011", "Synergy Development RUC", rand(0, 2), "Calle 77 #30-40", "3109012345", "contact@synergydev.com"],
    ["10", rand(0, 2), "011001122", "Tech Giants SA", rand(0, 2), "Avenida 12 #90-88", "3100123456", "support@techgiants.com"],
    ["11", rand(0, 2), "123456789", "Global Enterprises LTDA", rand(0, 2), "Carrera 56 #34-12", "3101234560", "info@globalenterprises.com"],
    ["12", rand(0, 2), "223344556", "Alpha Innovations SAS", rand(0, 2), "Avenida 100 #50-67", "3102345670", "sales@alphainnovations.com"],
    ["13", rand(0, 2), "334455667", "Digital World SA", rand(0, 2), "Calle 9 #99-88", "3103456780", "contact@digitalworld.com"],
    ["14", rand(0, 2), "445566778", "Tech Savvy RUC", rand(0, 2), "Carrera 7 #20-30", "3104567890", "hello@techsavvy.com"],
    ["15", rand(0, 2), "556677889", "Strategic Solutions CIF", rand(0, 2), "Transversal 20 #10-67", "3105678900", "contact@strategicsolutions.com"],
    ["16", rand(0, 2), "667788990", "Enterprise Builders LTDA", rand(0, 2), "Carrera 30 #45-23", "3106789010", "info@enterprisebuilders.com"],
    ["17", rand(0, 2), "778899001", "Corporate Solutions SAS", rand(0, 2), "Calle 80 #10-40", "3107890120", "support@corporatesolutions.com"],
    ["18", rand(0, 2), "889900112", "Innovative Engineering RUC", rand(0, 2), "Avenida 68 #30-60", "3108901230", "sales@innovativeengineering.com"],
    ["19", rand(0, 2), "990011223", "Business Leaders CIF", rand(0, 2), "Calle 57 #45-90", "3109012340", "contact@businessleaders.com"],
    ["20", rand(0, 2), "001122334", "Tech Innovations SA", rand(0, 2), "Carrera 15 #5-34", "3100123450", "info@techinnovations.com"]
];

// ? DATOS SIMULADOS PARA NOTA DE CREDITO Y NOTA DE DEBITO
function obtenerDatosFacturasNC()
{
    include "../funciones/conn3.php";
    $Facturas = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idEmpresa = $_SESSION[ID] AND Tipo_Operacion=1");
    $facturasMedicasParaNc = [];

    while ($row = mysqli_fetch_assoc($Facturas)) {
        $queryCliente = mysqli_query($connMedical, "SELECT * FROM cliente WHERE cliente_id = '$row[idCliente]'");
        while ($rowcliente = mysqli_fetch_assoc($queryCliente)) {
            $nombre_cliente = $rowcliente['nombre_cliente'];
        }
        $queryDetalle = mysqli_query($conn3, "SELECT * FROM FacturaDetalle WHERE idOperacion='$row[idOperacion]'");
        while ($rowDetalle = mysqli_fetch_assoc($queryDetalle)) {
            $idProducto = $rowDetalle['idProducto'];
            $descripcion = $rowDetalle['descripcion'];
            $cantidad = $rowDetalle['cantidad'];
            $descuento = $rowDetalle['descuento'];
            $idDetalle = $row['idOperacion'];
        }
        $queryUsuario = mysqli_query($conn3, "SELECT * FROM usuarios WHERE ID = '$row[idEmpresa]'");
        while ($rowUsuario = mysqli_fetch_assoc($queryUsuario)) {

            $NOMBRE_USUARIO = $rowUsuario['NOMBRE_USUARIO'];
        }
        $facturasMedicasParaNc[] = [
            "idFactura" =>  $row['idOperacion'],
            "fecha" => $row['fechaOperacion'],
            "clienteId" =>  $row['idCliente'],
            "nombreCliente" => $nombre_cliente,
            "tipoCliente" => "Entidad",
            "detalle" => [
                [
                    "idDetalle" => $idDetalle,
                    "procedimientoId" => $idProducto,
                    "nombreProcedimiento" => $descripcion,
                    "valor" =>  $row['totalNeto'],
                    "fecha" => $row['fechaOperacion'],
                    "porcentajeDescuento" => $descuento,
                    "impuestoCargo" => "IVA",
                "impuestoId" => "1",
                "porcentajeImpuestoCargo" => 19,
                "impuestoCargo" => "IVA",
                "impuestoId" => "1",
                "porcentajeImpuestoCargo" => 19,
                "valorImpuestoCargo" => 28.5,
                "impuestoRetencion" => "0",
                "porcentajeImpuestoRetencion" => 0,
                "valorImpuestoRetencion" => 0,
                "descuento" => $descuento,
                "total" => $row['totalNeto'],
                "cantidad" => $cantidad

                ]
            ]
            

        ];
    }

    return $facturasMedicasParaNc;
}
// $facturasMedicasParaNc = [
//     [
//         "idFactura" => rand(1000, 9999),
//         "fecha" => "2024-01-01",
//         "clienteId" => rand(1, 5),
//         "nombreCliente" => "Cliente A",
//         "tipoCliente" => "Entidad",
//         "detalle" => [
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Consulta Médica",
//                 "valor" => 150,
//                 "fecha" => "2024-01-01",
//                 "porcentajeDescuento" => 10,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 28.5,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 15,
//                 "total" => 163.5,
//             ],
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Radiografía",
//                 "valor" => 100,
//                 "fecha" => "2024-01-01",
//                 "porcentajeDescuento" => 5,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 19,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 5,
//                 "total" => 114,
//             ],
//         ],
//     ],
//     [
//         "idFactura" => rand(1000, 9999),
//         "fecha" => "2024-01-05",
//         "clienteId" => rand(1, 5),
//         "nombreCliente" => "Cliente B",
//         "tipoCliente" => "Persona",
//         "detalle" => [
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Exámenes de Laboratorio",
//                 "valor" => 200,
//                 "fecha" => "2024-01-05",
//                 "porcentajeDescuento" => 15,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 38,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 30,
//                 "total" => 208,
//             ],
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Consulta Especialista",
//                 "valor" => 250,
//                 "fecha" => "2024-01-05",
//                 "porcentajeDescuento" => 10,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 47.5,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 25,
//                 "total" => 272.5,
//             ],
//         ],
//     ],
//     [
//         "idFactura" => rand(1000, 9999),
//         "fecha" => "2024-01-10",
//         "clienteId" => rand(1, 5),
//         "nombreCliente" => "Cliente C",
//         "tipoCliente" => "Entidad",
//         "detalle" => [
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Ultrasonido",
//                 "valor" => 180,
//                 "fecha" => "2024-01-10",
//                 "porcentajeDescuento" => 0,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 34.2,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 0,
//                 "total" => 214.2,
//             ],
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Consulta Médica General",
//                 "valor" => 120,
//                 "fecha" => "2024-01-10",
//                 "porcentajeDescuento" => 5,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 22.8,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 6,
//                 "total" => 136.8,
//             ],
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Toma de Muestra",
//                 "valor" => 50,
//                 "fecha" => "2024-01-10",
//                 "porcentajeDescuento" => 0,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 9.5,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 0,
//                 "total" => 59.5,
//             ],
//         ],
//     ],
//     [
//         "idFactura" => rand(1000, 9999),
//         "fecha" => "2024-01-15",
//         "clienteId" => rand(1, 5),
//         "nombreCliente" => "Cliente D",
//         "tipoCliente" => "Persona",
//         "detalle" => [
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Consulta de Medicina Interna",
//                 "valor" => 300,
//                 "fecha" => "2024-01-15",
//                 "porcentajeDescuento" => 20,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 57,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 60,
//                 "total" => 297,
//             ],
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Chequeo General",
//                 "valor" => 80,
//                 "fecha" => "2024-01-15",
//                 "porcentajeDescuento" => 10,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 15.2,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 8,
//                 "total" => 87.2,
//             ],
//         ],
//     ],
//     [
//         "idFactura" => rand(1000, 9999),
//         "fecha" => "2024-01-20",
//         "clienteId" => rand(1, 5),
//         "nombreCliente" => "Cliente E",
//         "tipoCliente" => "Entidad",
//         "detalle" => [
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Consulta de Psicología",
//                 "valor" => 200,
//                 "fecha" => "2024-01-20",
//                 "porcentajeDescuento" => 0,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 38,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 0,
//                 "total" => 238,
//             ],
//             [
//                 "idDetalle" => rand(10000, 99999),
//                 "procedimientoId" => rand(1, 20),
//                 "nombreProcedimiento" => "Terapia de Grupo",
//                 "valor" => 150,
//                 "fecha" => "2024-01-20",
//                 "porcentajeDescuento" => 10,
//                 "impuestoCargo" => "IVA",
//                 "impuestoId" => "1",
//                 "porcentajeImpuestoCargo" => 19,
//                 "valorImpuestoCargo" => 28.5,
//                 "impuestoRetencion" => "0",
//                 "porcentajeImpuestoRetencion" => 0,
//                 "valorImpuestoRetencion" => 0,
//                 "descuento" => 15,
//                 "total" => 163.5,
//             ],
//         ],
//     ],
// ];


// $dataJsonImpuestoCargo = [
//     ["id" => 0, "nombre" => "Ninguno"],
//     ["id" => 1, "nombre" => "IVA"],
//     ["id" => 2, "nombre" => "IEPS"],
//     ["id" => 3, "nombre" => "ISR"],
// ];

// $dataJsonImpuestoRetencion = [
//     ["id" => 0, "nombre" => "Ninguno"],
//     ["id" => 1, "nombre" => "IR"],
//     ["id" => 2, "nombre" => "IVA"],
//     ["id" => 3, "nombre" => "ISR"],
//     ["id" => 4, "nombre" => "IS"],
//     ["id" => 5, "nombre" => "RT"],
//     ["id" => 6, "nombre" => "IVA-R"],
//     ["id" => 7, "nombre" => "IETU"],
//     ["id" => 8, "nombre" => "CREE"],
//     ["id" => 9, "nombre" => "ITBI"],
// ];

// $dataJsonVendedores = [
//     ["id" => 0, "nombre" => "Sofía Torres"],
//     ["id" => 1, "nombre" => "Ricardo Mendoza"],
//     ["id" => 2, "nombre" => "Valeria Salas"],
//     ["id" => 3, "nombre" => "Leonardo Serrano"],
// ];

$proveedores = [
    [
        'id' => 1,
        'nombre' => 'Proveedores Globales S.A.',
        'direccion' => 'Calle Principal 123, Ciudad Central',
        'telefono' => '+52 555 123 4567',
        'email' => 'contacto@proveedoresglobales.com',
        'producto_principal' => 'Equipos de oficina',
        'pais' => 'México',
        "tipoIndentificacionTributaria" => rand(0, 2),
        'numero_identificacion' => 'RFC1234567890'
    ],
    [
        'id' => 2,
        'nombre' => 'Distribuciones Internacionales Ltda.',
        'direccion' => 'Avenida Comercial 456, Bogotá',
        'telefono' => '+57 1 987 6543',
        'email' => 'ventas@distribucionesinternacionales.com',
        'producto_principal' => 'Electrónica',
        'pais' => 'Colombia',
        "tipoIndentificacionTributaria" => rand(0, 2),
        'numero_identificacion' => 'NIT987654321'
    ],
    [
        'id' => 3,
        'nombre' => 'Tecnología y Servicios S.L.',
        'direccion' => 'Calle Innovación 789, Madrid',
        'telefono' => '+34 91 876 5432',
        'email' => 'info@tecnologiayservicios.com',
        'producto_principal' => 'Software y hardware',
        'pais' => 'España',
        "tipoIndentificacionTributaria" => rand(0, 2),
        'numero_identificacion' => 'CIFB12345678'
    ],
    [
        'id' => 4,
        'nombre' => 'Proveedor Express Ltd.',
        'direccion' => '123 Market Street, Londres',
        'telefono' => '+44 20 1234 5678',
        'email' => 'support@proveedorexpress.com',
        'producto_principal' => 'Accesorios para computadoras',
        'pais' => 'Reino Unido',
        "tipoIndentificacionTributaria" => rand(0, 2),
        'numero_identificacion' => 'VATGB123456789'
    ],
    [
        'id' => 5,
        'nombre' => 'Fábrica de Productos Industriales',
        'direccion' => 'Carrera 21 #45-67, Buenos Aires',
        'telefono' => '+54 11 4321 8765',
        'email' => 'fabrica@productosindustriales.com',
        'producto_principal' => 'Herramientas industriales',
        'pais' => 'Argentina',
        "tipoIndentificacionTributaria" => rand(0, 2),
        'numero_identificacion' => 'CUIT20345678901'
    ],
];
