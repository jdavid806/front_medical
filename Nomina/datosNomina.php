<?php

// ? MODELS Y CONTROLLERS DE NOMINA
require "../Models/Nomina/index.php";
require "../Controllers/Nomina/index.php";
// ? MODELS Y CONTROLLERS DE NOMINA

// ? MODELS Y CONTROLLERS GENERALES
require "../Models/Generales/index.php";
require "../Controllers/Generales/index.php";
// ? MODELS Y CONTROLLERS GENERALES
// ------------------------------------------------------------------

// ? SEDES
$controllerSedes = new SedeController($conn3);
$datosSedes = $controllerSedes->index();
// ? SEDES

// ? CARGOS
$ControllerCargo = new CargoController($conn3);
$datosCargos = $ControllerCargo->index();
// ? CARGOS

// ? RETENCIONES DE SALARIO
$ControllerRetencion = new RetencionSalarioController($conn3);
$datosRetencionesSalariales = $ControllerRetencion->index();
// ? RETENCIONES DE SALARIO

// ? DEDUCCIONES GRUPALES
$ControllerDeduccionesGrupales = new DeduccionesGrupalesController($conn3);
$datosDeduccionesGrupales = $ControllerDeduccionesGrupales->obtenerPorUsuario($_SESSION['ID']);
// ? DEDUCCIONES GRUPALES

// ? TRABAJADORES
$ControllerTrabajadores = new TrabajadoresController($conn3);
$trabajadores = $ControllerTrabajadores->index();
// ? TRABAJADORES

// ? CONTRATOS
$ControllerContratos = new ContratosController($conn3);
$datosContratos = $ControllerContratos->index();
// ? CONTRATOS

// ? BENEFICIARIOS
$ControllerBeneficiarios = new BeneficiariosTrabajadoresController($conn3);
// $datosBeneficiarios = $ControllerBeneficiarios->index();
// ? BENEFICIARIOS

// ? BENEFICIOS
$ControllerBeneficios = new BeneficioController($conn3);
// $datosBeneficios = $ControllerBeneficios->index();
// ? BENEFICIOS

// ? DEDUCCIONES
$ControllerDeducciones = new DeduccionesController($conn3);
// $datosBeneficios = $ControllerBeneficios->index();
// ? DEDUCCIONES

// ? ADICIONES
$ControllerAdiciones = new AdicionesGrupalesController($conn3);
$datosAdiciones = $ControllerAdiciones->obtenerPorUsuario($_SESSION['ID']);
// ? ADICIONES

// ? DESCUENTOS
$ControllerDescuentos = new DescuentosController($conn3);
$datosDescuentos = $ControllerDescuentos->index();
// ? DESCUENTOS

// ? VACACIONES
$ControllerVacaciones = new VacacionesController($conn3);
$datosVacaciones = $ControllerVacaciones->index();
// ? VACACIONES

// ? ANEXOS
$ControlleraAnexos = new AnexosController($conn3);
$datosAnexos = $ControlleraAnexos->index();
// ? ANEXOS

// ? PLANTILLAS DE CONTRATO
$ControllerPContratos = new PlantillasContratoController($conn3);
$datosPlantillasContrato = $ControllerPContratos->index();
// ? PLANTILLAS DE CONTRATO

// ? RECARGOS
$ControllerRecargos = new RecargoController($conn3);
$datosRecargos = $ControllerRecargos->index();
// ? RECARGOS

// ? MONEDA
$ControllerMonedas = new MonedaController($conn3);
$datosMonedas = $ControllerMonedas->indexSelect();
// ? MONEDA

// ? NOMINA GRUPAL
$ControllerNominaGrupal = new NominaGrupalController($conn3);
$datosNominaGrupal = $ControllerNominaGrupal->index();
// ? NOMINA GRUPAL

// ? NOMINA INDIVIDUAL
$ControllerNominaIndividual = new NominaIndividualController($conn3);
// ? NOMINA INDIVIDUAL

// ? INFORMACION BANCARIA
$ControllerInformacionBancaria = new InformacionBancariaController($conn3);
// ? INFORMACION BANCARIA

// ? INFORMACION CONFIGURACION HORARIO
$ControllerInformacionHorario = new ConfiguracionHorarioController($conn3);
// ? INFORMACION CONFIGURACION HORARIO

// ? TIPOS DE RECARGO
$ControllerTiposRecargo = new TipoRecargoController($conn3);
$datosTiposRecargo = $ControllerTiposRecargo->obtenerPorUsuario($_SESSION['ID']);
// ? TIPOS DE RECARGO

// ? FORMULAS HORAS
$ControllerFormulaHora = new FormulasHorasExtraController($conn3);
$datosFormula = $ControllerFormulaHora->obtenerPorMoneda($ConfigNominaUser['moneda']);
// ? FORMULAS HORAS

// ? INCAPACIDADES
$ControllerIncapacidades = new IncapacidadesController($conn3);
// ? INCAPACIDADES

// ? LIQUIDACIONES DE EMPLEADOS
$ControllerLiquidaciones = new LiquidacionesController($conn3);
$datosLiquidaciones = $ControllerLiquidaciones->obtenerPorUsuario($_SESSION['ID']);
// ? LIQUIDACIONES DE EMPLEADOS

// var_dump($datosFormula);
// var_dump($configNominaUser['moneda']);
// die();
// ? FORMULAS HORAS


$ControllerTiposTrabajo = new TiposTrabajoController($conn3);
$tiposTrabajo = $ControllerTiposTrabajo->obtenerPorUsuario($_SESSION['ID']);


$TiposContratoController = new TiposContratoController($conn3);
$tiposC = $TiposContratoController->obtenerPorUsuario($_SESSION['ID']);
$tiposContrato = [];
foreach ($tiposC as $key => $value) {
    $tiposContrato[$value['id']] = $value['nombre'];
}


$ControllerMetodosPago = new MetodoPagoController($conn3);
$tiposMetodo = $ControllerMetodosPago->obtenerPorUsuario($_SESSION['ID']);
$tiposMetodoPago = [];
foreach ($tiposMetodo as $key => $value) {
    $tiposMetodoPago[$value['id']] = $value['nombre'];
}

$ControllerBancos = new BancosController($conn3);
$banks = $ControllerBancos->obtenerPorIdUsuario($_SESSION['ID']);
$listaBancos = [];
foreach ($banks as $key => $value) {
    $listaBancos[$value['id']] = $value['nombre'];
}

$ControllerEPS = new EPSController($conn3);
$EPSs = $ControllerEPS->obtenerPorIdUsuario($_SESSION['ID']);
$listaEps = [];
foreach ($EPSs as $key => $value) {
    $listaEps[$value['id']] = $value['nombre'];
}

$ControllerCajaCompensacion = new EPSController($conn3);
$CajasCompensacion = $ControllerCajaCompensacion->obtenerPorIdUsuario($_SESSION['ID']);
$listaCajaCompensacion = [];
foreach ($CajasCompensacion as $key => $value) {
    $listaCajaCompensacion[$value['id']] = $value['nombre'];
}

$ControllerARL = new ARLController($conn3);
$ARLs = $ControllerARL->obtenerPorIdUsuario($_SESSION['ID']);
$lista_arl = [];
foreach ($ARLs as $key => $value) {
    $lista_arl[$value['id']] = $value['nombre'];
}

$ControllerPension = new PensionController($conn3);
$FondosPension = $ControllerPension->obtenerPorIdUsuario($_SESSION['ID']);
$listaPension = [];
foreach ($FondosPension as $key => $value) {
    $listaPension[$value['id']] = $value['nombre'];
}

$tiposDiaPago = [
    "1" => "15 de cada mes",
    "2" => "30 de cada mes",
    "3" => "Semanalmente",
    "4" => "Diariamente"
];

$tipoCuenta = [
    "1" => "Cuenta de Ahorros",
    "2" => "Cuenta corriente",
];


$tiposParentesco = [ "Padre", "Madre", "Hijo(a)", "Conyuge" ];


// * ESTADISTICAS UBICADAS SOBRE EL CALENDARIO
$ControllerMarcaje = new MarcacionesController($conn3);
$retardosHoy = $ControllerMarcaje->obtenerRetardosHoy();
$inasistenciasHoy = $ControllerMarcaje->obtenerInasistenciasHoy();


$datosEstadisticas = [
    [
      "label" => "Retardos del dia de hoy",
      "number" => $retardosHoy,
      "class" => "primary",
      "icon" => "fas fa-clock",
    ],
    [
      "label" => "Eventos esta semana",
      "number" => rand(10, 100),
      "class" => "info",
      "icon" => "fas fa-calendar-days",
    ],
    [
        "label" => "Inasistencias por retardo del dia de hoy",
        "number" => $inasistenciasHoy,
        "class" => "danger",
        "icon" => "fas fa-bell-slash",
    ],
];
// * ESTADISTICAS UBICADAS SOBRE EL CALENDARIO




?>
