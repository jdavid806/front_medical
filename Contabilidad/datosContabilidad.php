<?php 

require "../Models/Contabilidad/index.php";
require "../Controllers/Contabilidad/index.php";

$ControllerTerceros = new TercerosController($conn3);
$datosTerceros = $ControllerTerceros->index();

$ControllerRecibosPago = new RecibosPagoController($conn3);
$datosRecibosPago = $ControllerRecibosPago->index();

$ControllerRecibosCaja = new RecibosCajaController($conn3);
$datosRecibosCaja = $ControllerRecibosCaja->index();


require "../Models/Facturacion/index.php";
require "../Controllers/Facturacion/index.php";

$ControllerCentrosCosto = new CentrosCostoController($conn3);
$datosCentrosCosto = $ControllerCentrosCosto->index();
// echo "<br><br><h1>datosCentrosCosto";
// var_dump($datosCentrosCosto);
// echo "</h1><br><br>";

$ControllerCuentasContables = new CuentasContablesController($conn3);
$datosCuentasContables = $ControllerCuentasContables->index();

$ControllerComprobantesContables = new ComprobantesContablesController($conn3);
$datosComprobanteContables = $ControllerComprobantesContables->index();

$ControllerComprobanteContableDetalle = new CContableDetalleController($conn3);


$ControllerMetodosPago = new MetodosPagoController($conn3);
$datosMetodosPago = $ControllerMetodosPago->index();


?>