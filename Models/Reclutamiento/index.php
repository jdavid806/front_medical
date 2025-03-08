
<?php 
//? ARCHIVO DE BARRIL, AQUI VAN TODOS LOS INCLUDES DE MODELS DE RECLUTAMIENTO
//? SOLO ES VALIDO PARA REALIZAR EL INCLUDE EN ARCHIVOS EN CARPETAS DE UN NIVEL DE LA RAIZ
//? EJ => RAIZ = MEDICAL/FE
//? VALIDO PARA MEDICAL/FE/NOMINA
//! NO SERA INCLUIDO EN ARCHIVOS DE SUBCARPETAS POSTERIORES MEDICAL/FE/NOMINA/OTRA/CARPETA

require_once __DIR__ . "/ConfigWeb.php";
require_once __DIR__ . "/Entrevista.php";
require_once __DIR__ . "/EstadosReclutamiento.php";
require_once __DIR__ . "/MensajeWeb.php";
require_once __DIR__ . "/ParametroEvaluacion.php";
require_once __DIR__ . "/Postulacion.php";
require_once __DIR__ . "/PuestoTrabajo.php";
require_once __DIR__ . "/PuntuacionEntrevista.php";
require_once __DIR__ . "/TipoExperiencia.php";

?>