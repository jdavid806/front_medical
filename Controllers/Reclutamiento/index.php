<?php 
//? ARCHIVO DE BARRIL, AQUI VAN TODOS LOS INCLUDES DE CONTROLLERS DE RECLUTAMIENTO
//? SOLO ES VALIDO PARA REALIZAR EL INCLUDE EN ARCHIVOS EN CARPETAS DE UN NIVEL DE LA RAIZ
//? EJ => RAIZ = MEDICAL/FE
//? VALIDO PARA MEDICAL/FE/NOMINA
//! NO SERA INCLUIDO EN ARCHIVOS DE SUBCARPETAS POSTERIORES MEDICAL/FE/NOMINA/OTRA/CARPETA

// require "../Controllers/Reclutamiento/index.php";
require_once __DIR__ .  "/ConfigWeb.php";
require_once __DIR__ .  "/Entrevistas.php";
require_once __DIR__ .  "/EstadosReclutamiento.php";
require_once __DIR__ .  "/MensajesWeb.php";
require_once __DIR__ .  "/ParametrosEvaluacion.php";
require_once __DIR__ .  "/Postulacion.php";
require_once __DIR__ .  "/PuestoTrabajo.php";
require_once __DIR__ .  "/PuntuacionEntrevista.php";
require_once __DIR__ .  "/TiposExperiencia.php";