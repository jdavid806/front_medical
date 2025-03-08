<?php 

// // ? ENTIDADES
// include "../Models/Facturacion/Entidades.php";
// include "../Controllers/Facturacion/Entidades.php";
// $ControllerEntidades = new EntidadesController($conn3);
// $dataEmpresas = $ControllerEntidades->index("AND idUsuario = {$_SESSION['ID']}");
// // ? ENTIDADES

// // ? ACTIVIDAD ECONOMICA ENTIDADES
// include "../Models/Facturacion/ActividadesEconomicas.php";
// include "../Controllers/Facturacion/ActividadesEconomicas.php";
// $ControllerActividadesE = new ActividadesEconomicasController($conn3);
// $dataActividadEconomica = $ControllerActividadesE->index();
// // ? ACTIVIDAD ECONOMICA ENTIDADES

// // ? PROCEDIMIENTOS
// include "../Models/Facturacion/Procedimientos.php";
// include "../Controllers/Facturacion/Procedimientos.php";
// $ControllerProcedimientos = new ProcedimientosController($conn3);
// $dataProcedimientos = $ControllerProcedimientos->index("AND usuarioId = {$_SESSION['ID']}");
// // ? PROCEDIMIENTOS

// // ? PROCEDIMIENTOS DE ENTIDAD
// include "../Models/Facturacion/ProcedimientosEntidad.php";
// include "../Controllers/Facturacion/ProcedimientosEntidad.php";
// $ControllerProcedimientosEntidad = new ProcedimientosEntidadController($conn3);
// // ? PROCEDIMIENTOS DE ENTIDAD

// // ? VENDEDORES
// // include "../Models/Facturacion/Vendedores.php";
// // include "../Controllers/Facturacion/Vendedores.php";
// // $ControllerVendedores = new VendedoresController($conn3);
// // $dataVendedores = $ControllerVendedores->index();
// include "../Models/Facturacion/Vendedores.php";
// include "../Controllers/Facturacion/Vendedores.php";
// $ControllerVendedores = new VendedoresController($conn3);
// $dataVendedores = $ControllerVendedores->index("AND idUsuario = {$_SESSION['ID']}");
// // ? VENDEDORES

// // ? METODOS DE PAGO
// // include "../Models/Facturacion/MetodosPago.php";
// // include "../Controllers/Facturacion/MetodosPago.php";
// // $ControllerMetodosPago = new MetodosPagoController($conn3);
// // $metodosPago = $ControllerMetodosPago->index();
// include "../Models/Facturacion/MetodosPago.php";
// include "../Controllers/Facturacion/MetodosPago.php";
// $ControllerMetodosPago = new MetodosPagoController($conn3);
// $metodosPago = $ControllerMetodosPago->index("AND idUsuario = {$_SESSION['ID']}");
// // ? METODOS DE PAGO

// // ? IMPUESTOS CARGO
// // include "../Models/Facturacion/ImpuestosCargo.php";
// // include "../Controllers/Facturacion/ImpuestosCargo.php";
// // $ControllerImpuestosC = new ImpuestosCargoController($conn3);
// // $dataJsonImpuestoCargo = $ControllerImpuestosC->index();
// include "../Models/Facturacion/ImpuestosCargo.php";
// include "../Controllers/Facturacion/ImpuestosCargo.php";
// $ControllerImpuestosC = new ImpuestosCargoController($conn3);
// $dataJsonImpuestoCargo = $ControllerImpuestosC->index("AND idUsuario = {$_SESSION['ID']}");
// // ? IMPUESTOS CARGO

// // ? IMPUESTOS RETENCION
// // include "../Models/Facturacion/ImpuestosRetencion.php";
// // include "../Controllers/Facturacion/ImpuestosRetencion.php";
// // $ControllerImpuestosR = new ImpuestosRetencionController($conn3);
// // $dataJsonImpuestoRetencion = $ControllerImpuestosR->index();
// include "../Models/Facturacion/ImpuestosRetencion.php";
// include "../Controllers/Facturacion/ImpuestosRetencion.php";
// $ControllerImpuestosR = new ImpuestosRetencionController($conn3);
// $dataJsonImpuestoRetencion = $ControllerImpuestosR->index("AND idUsuario = {$_SESSION['ID']}");
// // ? IMPUESTOS RETENCION

// // ? CENTROS DE COSTO
// // include "../Models/Facturacion/CentrosCosto.php";
// // include "../Controllers/Facturacion/CentrosCosto.php";
// // $ControllerCentroCosto = new CentrosCostoController($conn3);
// // $datosCentroCosto = $ControllerCentroCosto->index();
// include "../Models/Facturacion/CentrosCosto.php";
// include "../Controllers/Facturacion/CentrosCosto.php";
// $ControllerCentroCosto = new CentrosCostoController($conn3);
// $datosCentroCosto = $ControllerCentroCosto->index("AND idUsuario = {$_SESSION['ID']}");
// // ? CENTROS DE COSTO

// // ? PAISES
// include "../Models/Generales/Paises.php";
// include "../Controllers/Generales/Paises.php";
// $ControllerPaises = new PaisesController($conn3);
// $datosPais = $ControllerPaises->index();
// // ? PAISES
