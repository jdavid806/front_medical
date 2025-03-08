<?php 
// ? MODELS Y CONTROLLERS DE RECLUTAMIENTO
require "../Models/Reclutamiento/index.php";
require "../Controllers/Reclutamiento/index.php";
// ? MODELS Y CONTROLLERS DE RECLUTAMIENTO



// ? PUESTOS DE TRABAJO
$ControllerPuestosTrabajo = new PuestosTrabajoController($conn3);
$datosCargosPublicados = $ControllerPuestosTrabajo->index();
// ? PUESTOS DE TRABAJO

$ControllerPostulaciones = new PostulacionController($conn3);
$datosPostulaciones = $ControllerPostulaciones->obtenerPorUsuario($_SESSION["ID"], $ControllerTrabajadores);

$datosCandidatos = $ControllerTrabajadores->indexCandidatos();

$ControllerEntrevistas = new EntrevistasController($conn3);
$datosEntrevistas = $ControllerEntrevistas->index();

// ? ESTADOS DE RECLUTAMIENTO
$ControllerEstadoR = new EstadoReclutamientoController($conn3);
$datosEstadosCandidato = $ControllerEstadoR->index();
// ? ESTADOS DE RECLUTAMIENTO

$ControllerExperiencia = new TiposExperienciaController($conn3);
$tiposExperiencia = $ControllerExperiencia->obtenerPorUsuario($_SESSION['ID']);


?>