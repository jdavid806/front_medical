<?php

 

function funcionMaster($filtro, $campoFiltrar, $campoImprimir, $tabla)
{
  include "../funciones/conn3.php";
	$query = mysqli_query($connMedical, "SELECT * FROM $tabla where $campoFiltrar = '$filtro'");

	$nrowl = mysqli_num_rows($query);
	while ($row = mysqli_fetch_array($query)) {

		$text = $row[$campoImprimir];
	}

	return  $text;
}


// $arraytest_ventas = [
//     [
//         "Nombre" => "Juan Perez",
//         "Factura" => rand(10000, 100000),
//         "Encargado" => "Vendedor #" .  rand(1, 10),
//         "Cliente" => "Comprador #" .  rand(1000, 10000),
//         "Identificacion" => rand(4517000, 45170000),
//         "Tipo" => "Factura",
//     ],
//     [
//         "Nombre" => "Jhon Gutierrez",
//         "Factura" => rand(10000, 100000),
//         "Encargado" => "Vendedor #" .  rand(1, 10),
//         "Cliente" => "Comprador #" .  rand(1000, 10000),
//         "Identificacion" => rand(4517000, 45170000),
//         "Tipo" => "Factura",
//     ],
//     [
//         "Nombre" => "Laura Cortes",
//         "Factura" => rand(10000, 100000),
//         "Encargado" => "Vendedor #" .  rand(1, 10),
//         "Cliente" => "Comprador #" .  rand(1000, 10000),
//         "Identificacion" => rand(4517000, 45170000),
//         "Tipo" => "Factura",
//     ],
// ];


function obtenerVentas() {
  include "../funciones/conn3.php";
  $QueryFacturas = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idEmpresa = $_SESSION[ID]");
  $arraytest_ventas= [];

  while ($factura = mysqli_fetch_assoc($QueryFacturas)) {
    $idCliente = $factura['idCliente'];
    $idEntidad = $factura['entidad_id'];
    $Tipo_Operacion = $factura['Tipo_Operacion'];
    if($Tipo_Operacion == 1){
      $Factura ='Factura Individual';
      $nombreCliente = funcionMaster($idCliente, 'cliente_id', 'nombre_cliente', 'cliente');
    $identificacionCliente = funcionMaster($idCliente, 'cliente_id', 'CODI_CLIENTE', 'cliente');

    }elseif($Tipo_Operacion == 2){
      $Factura ='Factura Entidad';
      $queryentidad = mysqli_query($conn3, "SELECT * FROM  FE_Entidades WHERE id = $idEntidad");
      $rowentidad = mysqli_fetch_assoc($queryentidad);
      $nombreCliente = $rowentidad['nombreEntidad'];
      $identificacionCliente = $rowentidad['nit'];
      
    }
     $vendedor_id = $factura['vendedor_id'];
     //$vendedor = $ControllerVendedores->obtenerPorId($vendedor_id);
  $nombre_vendedor = $vendedor['nombre'];
    
    $encargado = 'Vendedor #' . $factura['vendedor_id'];

    $venta = [
      "Nombre" => $nombreCliente,
      "Fecha" => $factura['fechaOperacion'],
      "idOperacion" => $factura['idOperacion'],
      "Factura" => $factura['numeroDoc'],
      "Encargado" => $encargado,
      "Cliente" => $nombreCliente,
      "Identificacion" => $identificacionCliente,
      "Tipo" => "$Factura",
    ];

     $arraytest_ventas[] = $venta;
  }

  return $arraytest_ventas;
}
function obtenerVentasEntidad() {
  include "../funciones/conn3.php";
  //include "../Models/Facturacion/Vendedores.php";
  //include "../Controllers/Facturacion/Vendedores.php";
  //$ControllerVendedores = new VendedoresController($conn3);
  $QueryFacturas = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idEmpresa = $_SESSION[ID]");
  $arraytest_ventas= [];

  while ($factura = mysqli_fetch_assoc($QueryFacturas)) {
    $idCliente = $factura['idCliente'];
     $vendedor_id = $factura['vendedor_id'];
     //$vendedor = $ControllerVendedores->obtenerPorId($vendedor_id);
  $nombre_vendedor = $vendedor['nombre'];
    $nombreCliente = funcionMaster($idCliente, 'cliente_id', 'nombre_cliente', 'cliente');
    $identificacionCliente = funcionMaster($idCliente, 'cliente_id', 'CODI_CLIENTE', 'cliente');
    $encargado = 'Vendedor #' . $factura['vendedor_id'];

    $venta = [
      "Nombre" => $nombreCliente,
      "Fecha" => $factura['fechaOperacion'],
      "Factura" => $factura['numeroDoc'],
      "Encargado" => $encargado,
      "Cliente" => $nombreCliente,
      "Identificacion" => $identificacionCliente,
      "Tipo" => "Factura",
    ];

     $arraytest_ventas[] = $venta;
  }

  return $arraytest_ventas;
}


$arraytest_compra = [
    [
        "Nombre" => "Monaros SAS",
        "Factura" => rand(10000, 100000),
        "Encargado" => "Vendedor #" .  rand(1, 10),
        "Identificacion" => rand(4517000, 45170000),
        "Tipo" => "Compra",
    ],
    [
        "Nombre" => "Seven Global Company",
        "Factura" => rand(10000, 100000),
        "Encargado" => "Vendedor #" .  rand(1, 10),
        "Identificacion" => rand(4517000, 45170000),
        "Tipo" => "Compra",
    ],
    [
        "Nombre" => "Norteamericana del Sur SAS",
        "Factura" => rand(10000, 100000),
        "Encargado" => "Vendedor #" .  rand(1, 10),
        "Identificacion" => rand(4517000, 45170000),
        "Tipo" => "Compra",
    ],
];


$arraytest_nd = [
    [
        "Nombre" => "Interamericana Local SAS",
        "Factura" => rand(10000, 100000),
        "Nota" => rand(5654, 55764455),
        "Encargado" => "Vendedor #" .  rand(1, 10),
        "Identificacion" => rand(4517000, 45170000),
        "Tipo" => "Nota de crédito",
    ],
    [
        "Nombre" => "Importaciones Internacionales SA",
        "Factura" => rand(10000, 100000),
        "Nota" => rand(5654, 55764455),
        "Encargado" => "Vendedor #" .  rand(1, 10),
        "Identificacion" => rand(4517000, 45170000),
        "Tipo" => "Nota de crédito",
    ],
    [
        "Nombre" => "Eficiencia Caótica Ltda",
        "Factura" => rand(10000, 100000),
        "Nota" => rand(5654, 55764455),
        "Encargado" => "Vendedor #" .  rand(1, 10),
        "Identificacion" => rand(4517000, 45170000),
        "Tipo" => "Nota de crédito",
    ],
];


$arraytest_nc = [
    [
      "Nombre" => "Interamericana Local SAS",
      "Factura" => rand(10000, 100000),
      "Nota" => rand(5654, 55764455),
      "Encargado" => "Vendedor #" .  rand(1, 10),
      "Identificacion" => rand(4517000, 45170000),
      "Tipo" => "Nota de crédito",
    ],
    [
      "Nombre" => "Importaciones Internacionales SA",
      "Factura" => rand(10000, 100000),
      "Nota" => rand(5654, 55764455),
      "Encargado" => "Vendedor #" .  rand(1, 10),
      "Identificacion" => rand(4517000, 45170000),
      "Tipo" => "Nota de crédito",
    ],
    [
      "Nombre" => "Eficiencia Caótica Ltda",
      "Factura" => rand(10000, 100000),
      "Nota" => rand(5654, 55764455),
      "Encargado" => "Vendedor #" .  rand(1, 10),
      "Identificacion" => rand(4517000, 45170000),
      "Tipo" => "Nota de crédito",
    ],
  ];
  function obtenerVentasNC() {
    include "../funciones/conn3.php";
    //include "../Models/Facturacion/Vendedores.php";
    //include "../Controllers/Facturacion/Vendedores.php";
    //$ControllerVendedores = new VendedoresController($conn3);
    $QueryFacturas = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idEmpresa = $_SESSION[ID] AND Tipo_Operacion=3");
    $arraytest_nc= [];
  
    while ($factura = mysqli_fetch_assoc($QueryFacturas)) {
      $idCliente = $factura['idCliente'];
       $vendedor_id = $factura['vendedor_id'];
       //$vendedor = $ControllerVendedores->obtenerPorId($vendedor_id);
    $nombre_vendedor = $vendedor['nombre'];
      $nombreCliente = funcionMaster($idCliente, 'cliente_id', 'nombre_cliente', 'cliente');
      $identificacionCliente = funcionMaster($idCliente, 'cliente_id', 'CODI_CLIENTE', 'cliente');
      $encargado = 'Vendedor #' . $factura['vendedor_id'];
  
      $venta = [
        "Nombre" => $nombreCliente,
        "Fecha" => $factura['fechaOperacion'],
        "Factura" => $factura['numeroDoc'],
        "Encargado" => $encargado,
        "Cliente" => $nombreCliente,
        "Identificacion" => $identificacionCliente,
        "Tipo" => "Factura",
      ];
  
       $arraytest_nc[] = $venta;
    }
  
    return $arraytest_nc;
  }
  $arraytest_ds = [
    [
      "Nombre" => "Interamericana Local SAS",
      "Factura" => rand(10000, 100000),
      "Nota" => rand(5654, 55764455),
      "Encargado" => "Vendedor #" .  rand(1, 10),
      "Identificacion" => rand(4517000, 45170000),
      "Tipo" => "Documento soporte",
    ],
    [
      "Nombre" => "Importaciones Internacionales SA",
      "Factura" => rand(10000, 100000),
      "Nota" => rand(5654, 55764455),
      "Encargado" => "Vendedor #" .  rand(1, 10),
      "Identificacion" => rand(4517000, 45170000),
      "Tipo" => "Documento soporte",
    ],
    [
      "Nombre" => "Eficiencia Caótica Ltda",
      "Factura" => rand(10000, 100000),
      "Nota" => rand(5654, 55764455),
      "Encargado" => "Vendedor #" .  rand(1, 10),
      "Identificacion" => rand(4517000, 45170000),
      "Tipo" => "Documento soporte",
    ],
  ];