<?php

require_once __DIR__ . "/../../funciones/conn3.php";
require_once __DIR__ . "/../../funciones/funciones.php";
require_once __DIR__ . "/../../funciones/funcionesModels.php";

require_once __DIR__ . "/../../Models/Nomina/index.php";
require_once __DIR__ . "/../../Controllers/Nomina/index.php";


$ControllerCargo = new CargoController($conn3);
$datosCargos = $ControllerCargo->index();

$ControllerMarcacion = new CargoController($conn3);
$datosMarcacion = $ControllerMarcacion->index();

$ControllerTrabajadores = new TrabajadoresController($conn3);
$trabajadores = $ControllerTrabajadores->index();

$ControllerDescuentos = new DescuentosController($conn3);
$datosDescuentos = $ControllerDescuentos->index();

$ControllerRecargos = new RecargoController($conn3);
$datosRecargos = $ControllerRecargos->index();

$ControllerBeneficios = new BeneficioController($conn3);

$ControllerDeducciones = new DeduccionesController($conn3);

$ControllerNominaIndividual = new NominaIndividualController($conn3);

$ControllerNominaGrupal = new NominaGrupalController($conn3);

$ControllerRetenciones = new RetencionSalarioController($conn3);

$ControllerDeduccionesGrupales = new DeduccionesGrupalesController($conn3);

$ControllerAdiciones = new AdicionesGrupalesController($conn3);

$ControllerIncapacidades = new IncapacidadesController($conn3);

$ControllerCalculoIncapacidades = new CalculoIncapacidadController($conn3);

$name = "Nomina Grupal";


// var_dump($_POST);
// die();


if ($_POST["action"] == "Consultar_Por_Fecha") {

    $fechaInicio = base64_decode($_POST['fechaInicio']);
    $fechaFin = base64_decode($_POST['fechaFin']);
    $moneda = base64_decode($_POST['moneda']);
    $idUsuario = base64_decode($_POST['idUsuario']);

    // $datosAdiciones = $ControllerAdiciones->obtenerPorUsuario($idUsuario);

    $monedasParametrizadas = ["COP", "DOP"];
    if (!in_array($moneda, $monedasParametrizadas)) {
        $response = ["icon"  =>  "error", "text"  =>  "Moneda {$moneda} no parametrizada o no disponible", "title" =>  "Error"];
        echo json_encode($response);
        die();
    }


    $formulaCalculoIncapacidad = $ControllerCalculoIncapacidades->obtenerPorMoneda($moneda);
    // die( json_encode($formulaCalculoIncapacidad) );


    $datosNomina = [];
    if ($moneda == 'COP' || $moneda == 'DOP') {
        $arrayFechas = obtenerFechasEnRango($fechaInicio, $fechaFin);

        // Para las personas o desarrolladores del futuro les pido disculpas por el jzo
        // Att: Deivyd R.
        $Controllers = [
            $ControllerMarcacion,
            $ControllerCargo,
            $ControllerDescuentos,
            $ControllerRecargos,
            $ControllerBeneficios,
            $ControllerDeducciones,
            $ControllerRetenciones,
            $ControllerDeduccionesGrupales,
            $ControllerAdiciones,
            $ControllerIncapacidades,
        ];

        $formulas = [
            "formulaCalculoIncapacidad" => $formulaCalculoIncapacidad
        ];

        $datosNomina = $ControllerNominaGrupal->obtenerNominaPorFechas($fechaInicio, $fechaFin, $arrayFechas, $trabajadores, $Controllers, $formulas, $idUsuario);
    }

    echo json_encode($datosNomina);
} else if ($_POST["action"] == "consultarId") {

    $id = base64_decode($_POST['id']);
    $Nomina = $ControllerNominaGrupal->obtenerPorId($id);
    $idsNomina = json_decode($Nomina["idsNomina"], true);
    $fechaInicio =  $Nomina["fechaInicio"];
    $fechaFin =  $Nomina["fechaFin"];

    $datosNomina = [];
    foreach ($idsNomina as $idNominaIndividual) {

        $datosNominaIndividual = $ControllerNominaIndividual->obtenerPorId($idNominaIndividual);

        $descuentosAdd = $ControllerNominaGrupal->procesarDescuentos($ControllerDescuentos, $datosNominaIndividual["idTrabajador"], $fechaInicio, $fechaFin);
        $bonificacionesAdd = $ControllerNominaGrupal->procesarBonificaciones($ControllerRecargos, $ControllerBeneficios, $datosNominaIndividual["idTrabajador"], $fechaInicio, $fechaFin);

        $datosTrabajador = $ControllerTrabajadores->obtenerPorId($datosNominaIndividual["idTrabajador"]);
        $datosCargoTrabajador = $ControllerCargo->obtenerPorId($datosTrabajador["cargo"]);

        $descuentosIndividuales = json_decode($datosNominaIndividual["descuentos"], true);
        $extrasIndividuales = json_decode($datosNominaIndividual["extras"], true);
        $adicionesIndividuales = json_decode($datosNominaIndividual["adiciones"], true);
        $incapacidadesIndividuales = json_decode($datosNominaIndividual["incapacidades"], true);
        $deduccionesIndividuales = json_decode($datosNominaIndividual["deducciones"], true);

        // ----------------------------------------------
        $descuentosIndividuales1 = [];
        foreach ($descuentosIndividuales as $descuentos) {
            $nuevo = $descuentos;
            $nuevo["checked"] = true;
            $descuentosIndividuales1[] = $nuevo;
        }


        // var_dump($descuentosAdd);

        foreach ($descuentosAdd as $descuento) {
            $descuento["cheked"] = false;
            $descuentosIndividuales1[] = $descuento;
        }
        // ----------------------------------------------

        // ----------------------------------------------
        $extrasIndividuales1 = [];
        foreach ($extrasIndividuales as $extras) {
            $nuevo = $extras;
            $nuevo["checked"] = true;
            $extrasIndividuales1[] = $nuevo;
        }

        foreach ($bonificacionesAdd as $bonificacion) {
            $bonificacion["cheked"] = false;
            $extrasIndividuales1[] = $bonificacion;
        }
        // ----------------------------------------------


        // ----------------------------------------------
        $adicionesIndividuales1 = [];
        foreach ($adicionesIndividuales as $adiciones) {
            $nuevo = $adiciones;
            $nuevo["checked"] = true;
            $adicionesIndividuales1[] = $nuevo;
        }
        // ----------------------------------------------

        // ----------------------------------------------
        $incapacidadesIndividuales1 = [];
        foreach ($incapacidadesIndividuales as $incapacidades) {
            $nuevo = $incapacidades;
            $nuevo["checked"] = true;
            $incapacidadesIndividuales1[] = $nuevo;
        }
        // ----------------------------------------------

        // ----------------------------------------------
        $deduccionesIndividuales1 = [];
        foreach ($deduccionesIndividuales as $deducciones) {
            $nuevo = $deducciones;
            $nuevo["checked"] = true;
            $deduccionesIndividuales1[] = $nuevo;
        }
        // ----------------------------------------------


        $datosNominaIndividual["descuentos"] = json_encode($descuentosIndividuales1);
        $datosNominaIndividual["extras"] = json_encode($extrasIndividuales1);
        $datosNominaIndividual["adiciones"] = json_encode($adicionesIndividuales1);
        $datosNominaIndividual["incapacidades"] = json_encode($incapacidadesIndividuales1);
        $datosNominaIndividual["deducciones"] = json_encode($deduccionesIndividuales1);

        $nominaTrabajador = [
            "idNomina" => $idNominaIndividual,
            "id" => $datosNominaIndividual["idTrabajador"],
            "nombre" => $datosTrabajador["nombre"] . " " . $datosTrabajador["apellido"],
            "cargo" => $datosCargoTrabajador["nombre"],
            "salario_base" => $trabajador["salario"],
            "salario_calculado" => $datosNominaIndividual["totalBase"],
            "descuentos" => $datosNominaIndividual["descuentos"],
            "bonificaciones" => $datosNominaIndividual["extras"],
            "adicionesEmpresa" => $datosNominaIndividual["adiciones"],
            "incapacidades" => $datosNominaIndividual["incapacidades"],
            "deducciones" => $datosNominaIndividual["deducciones"],
            "notas" => $datosNominaIndividual["notas"],
        ];

        array_push($datosNomina, $nominaTrabajador);
    }

    echo json_encode($datosNomina);

    // var_dump($id);
    // var_dump($idsNomina);

} else if ($_POST["action"] == "crear") {
    unset($_POST["action"]);
    unset($_POST["id"]);
    $json = json_encode($_POST);
    $detalle = $_POST["detalle"];
    unset($_POST["detalle"]);

    $_POST["trabajadores"] =  array_map(function ($trabajador) {
        return $trabajador['idTrabajador'];
    }, $detalle);

    $_POST["trabajadores"] = json_encode($_POST["trabajadores"]);

    // ? SE OCUPARA MAS ADELANTE, GUARDARA LOS ID DE LAS NOMINAS INDIVIDUALES
    $_POST["idsNomina"] = "";
    $_POST["jsonNomina"] = $json;

    $Crear = $ControllerNominaGrupal->crear($_POST);
    if ($Crear["status"] == true) {
        $idNominaGrupal = $ControllerNominaGrupal->obtenerMax();
        $idsNominaGrupales = [];
        // * DILIGENCIAR CADA NOMINA DE TRABAJADOR DE MANERA INDIVIDUAL
        foreach ($detalle as $key => $detalleIndividual) {

            $descuentosTrabajador = $detalleIndividual["descuentos"];
            $extrasTrabajador = $detalleIndividual["extras"];
            $incapacidadesTrabajador = $detalleIndividual["incapacidades"];

            $detalleIndividual["fechaInicio"] = $_POST["fechaInicio"];
            $detalleIndividual["fechaFin"] = $_POST["fechaFin"];
            $detalleIndividual["idPrincipal"] = $idNominaGrupal;
            $detalleIndividual["deducciones"] = json_encode(empty($detalleIndividual["deducciones"]) ? [] : $detalleIndividual["deducciones"]);
            $detalleIndividual["extras"] = json_encode(empty($detalleIndividual["extras"]) ? [] : $detalleIndividual["extras"]);
            $detalleIndividual["descuentos"] = json_encode(empty($detalleIndividual["descuentos"]) ? [] : $detalleIndividual["descuentos"]);
            $detalleIndividual["adiciones"] = json_encode(empty($detalleIndividual["adiciones"]) ? [] : $detalleIndividual["adiciones"]);
            $detalleIndividual["incapacidades"] = json_encode(empty($detalleIndividual["incapacidades"]) ? [] : $detalleIndividual["incapacidades"]);


            $CrearIndividual = $ControllerNominaIndividual->crear($detalleIndividual);
            if ($CrearIndividual["status"] == false) {
                $response = [
                    "icon" => "error",
                    "title" => "Error",
                    "text" => "{$name} creada correctamente, ocurrio un error al procesar las nominas individuales",
                    "error" => $CrearIndividual["message"]
                ];
                echo json_encode($response);
                exit();
            }


            foreach ($descuentosTrabajador as $desc) {
                if (is_numeric($desc["idDescuento"])) {
                    $ControllerDescuentos->editar($desc["idDescuento"], ["descontado" => "Si"]);
                }
            }

            foreach ($extrasTrabajador as $extra) {
                if (is_numeric($extra["idRecargo"])) {
                    $ControllerRecargos->editar($extra["idRecargo"], ["pagado" => "Si"]);
                }
            }

            foreach ($incapacidadesTrabajador as $incapacidad) {
                if (is_numeric($incapacidad["idIncapacidad"])) {
                    $ControllerIncapacidades->editar($incapacidad["idIncapacidad"], ["pagado" => "Si"]);
                }
            }

            $idNominaIndividual = $ControllerNominaIndividual->obtenerMax();
            array_push($idsNominaGrupales, $idNominaIndividual);
        }

        $idsNominaGrupales = json_encode($idsNominaGrupales);
        $ControllerNominaGrupal->editar($idNominaGrupal, ["idsNomina" => $idsNominaGrupales]);

        $response = [
            "icon" => "success",
            "title" => "Correcto",
            "text" => "{$name} creado correctamente"
        ];
        echo json_encode($response);
        exit();
    }
} else if ($_POST["action"] == "actualizar") {

    $idNominaGrupal = $_POST["id"];
    $idNominaGrupal = base64_decode($idNominaGrupal);

    $datosNominaGrupal = $ControllerNominaGrupal->obtenerPorId($idNominaGrupal);


    unset($_POST["action"]);
    unset($_POST["id"]);


    $json = json_encode($_POST);
    $detalle = $_POST["detalle"];
    unset($_POST["detalle"]);

    // ? SE OCUPARA MAS ADELANTE, GUARDARA LOS ID DE LAS NOMINAS INDIVIDUALES
    // $_POST["idsNomina"] = "";
    $_POST["jsonNomina"] = $json;

    $idsNominaGrupales = [];
    // * DILIGENCIAR CADA NOMINA DE TRABAJADOR DE MANERA INDIVIDUAL
    foreach ($detalle as $key => $detalleIndividual) {


        $idTrabajador = $detalleIndividual["idTrabajador"];
        $idIndividualEditar = $ControllerNominaIndividual->obtenerPorIdPrincipalYTrabajador($idNominaGrupal, $idTrabajador);

        /// OBTENIENDO DATOS ANTERIORES PARA COMPARAR 
        $datosAntiguos = $ControllerNominaIndividual->obtenerPorId($idIndividualEditar);

        $descuentosTrabajadorAntiguos = json_decode($datosAntiguos["descuentos"], true);
        $extrasTrabajadorAntiguos = json_decode($datosAntiguos["extras"], true);
        $incapacidadesTrabajadorAntiguos = json_decode($datosAntiguos["incapacidades"], true);

        $IDS_descuentosTrabajadorAntiguos = array_column($descuentosTrabajadorAntiguos, "idDescuento");
        $IDS_extrasTrabajadorAntiguos = array_column($extrasTrabajadorAntiguos, "idRecargo");
        // $IDS_incapacidadesTrabajadorAntiguos = array_column($incapacidadesTrabajadorAntiguos, "idIncapacidad");

        /// OBTENIENDO DATOS ACTUALES ENVIADOS PARA COMPARAR 
        $descuentosTrabajador = $detalleIndividual["descuentos"];
        $extrasTrabajador = $detalleIndividual["extras"];
        $incapacidadesTrabajador = $detalleIndividual["incapacidades"];

        $IDS_descuentosTrabajador = array_column($descuentosTrabajador, "idDescuento");
        $IDS_extrasTrabajador = array_column($extrasTrabajador, "idRecargo");
        /// OBTENIENDO DATOS ACTUALES ENVIADOS PARA COMPARAR 

        $idsComunesDescuentos = array_intersect($IDS_descuentosTrabajadorAntiguos, $IDS_descuentosTrabajador);

        // **Corrección: Realizar array_diff en ambas direcciones**
        $idsNoComunesDescuentos = array_merge(
            array_diff($IDS_descuentosTrabajadorAntiguos, $IDS_descuentosTrabajador), // IDs en antiguos pero no en actuales
            array_diff($IDS_descuentosTrabajador, $IDS_descuentosTrabajadorAntiguos)  // IDs en actuales pero no en antiguos
        );

        $idsComunesExtras = array_intersect($IDS_extrasTrabajadorAntiguos, $IDS_extrasTrabajador);

        // **Corrección: Realizar array_diff en ambas direcciones**
        $idsNoComunesExtras = array_merge(
            array_diff($IDS_extrasTrabajadorAntiguos, $IDS_extrasTrabajador), // IDs en antiguos pero no en actuales
            array_diff($IDS_extrasTrabajador, $IDS_extrasTrabajadorAntiguos)  // IDs en actuales pero no en antiguos
        );

        // $resTemp = [
        //     "IDS_descuentosTrabajadorAntiguos" => $IDS_descuentosTrabajadorAntiguos,
        //     "IDS_descuentosTrabajador" => $IDS_descuentosTrabajador,
        //     "idsComunesDescuentos" => $idsComunesDescuentos,
        //     "idsNoComunesDescuentos" => $idsNoComunesDescuentos,
        //     "IDS_extrasTrabajadorAntiguos" => $IDS_extrasTrabajadorAntiguos,
        //     "IDS_extrasTrabajador" => $IDS_extrasTrabajador,
        //     "idsComunesExtras" => $idsComunesExtras,
        //     "idsNoComunesExtras" => $idsNoComunesExtras,
        // ];

        // var_dump($resTemp);
        // die();


        $detalleIndividual["fechaInicio"] = $datosNominaGrupal["fechaInicio"];
        $detalleIndividual["fechaFin"] = $datosNominaGrupal["fechaFin"];
        $detalleIndividual["idPrincipal"] = $idNominaGrupal;
        $detalleIndividual["deducciones"] = json_encode(empty($detalleIndividual["deducciones"]) ? [] : $detalleIndividual["deducciones"]);
        $detalleIndividual["extras"] = json_encode(empty($detalleIndividual["extras"]) ? [] : $detalleIndividual["extras"]);
        $detalleIndividual["descuentos"] = json_encode(empty($detalleIndividual["descuentos"]) ? [] : $detalleIndividual["descuentos"]);
        $detalleIndividual["adiciones"] = json_encode(empty($detalleIndividual["adiciones"]) ? [] : $detalleIndividual["adiciones"]);
        $detalleIndividual["incapacidades"] = json_encode(empty($detalleIndividual["incapacidades"]) ? [] : $detalleIndividual["incapacidades"]);





        $CrearIndividual = $ControllerNominaIndividual->editar($idIndividualEditar, $detalleIndividual);
        if ($CrearIndividual["status"] == false) {
            $response = [
                "icon" => "error",
                "title" => "Error",
                "text" => "{$name} creada correctamente, ocurrio un error al procesar las nominas individuales",
                "error" => $CrearIndividual["message"]
            ];
            echo json_encode($response);
            exit();
        }


        /// SE ITERAN LOS IDS QUE NO SON COMUNES DEBIDO A QUE DEBEN SER DEVUELTOS COMO NO PAGADOS
        foreach ($idsNoComunesDescuentos as $idDescuentos) {
            $descontado = "";
            if ( in_array($idDescuentos, $IDS_descuentosTrabajadorAntiguos)  ) {
                $descontado = 'No';
            }else if (in_array($idDescuentos, $IDS_descuentosTrabajador)) {
                $descontado = 'Si';
            }

            $ControllerDescuentos->editar($idDescuentos, ["descontado" => $descontado]);
        }
        
        /// SE ITERAN LOS IDS QUE NO SON COMUNES DEBIDO A QUE DEBEN SER DEVUELTOS COMO NO PAGADOS    
        foreach ($idsNoComunesExtras as $idExtras) {
            $pagado = "";
            if ( in_array($idExtras, $IDS_extrasTrabajadorAntiguos)  ) {
                $pagado = 'No';
            }else if (in_array($idExtras, $IDS_extrasTrabajador)) {
                $pagado = 'Si';
            }

            $ControllerRecargos->editar($idExtras, ["pagado" => $pagado]);
        }
    }

    // $idsNominaGrupales = json_encode($idsNominaGrupales);
    $ControllerNominaGrupal->editar($idNominaGrupal, $_POST);

    $response = [
        "icon" => "success",
        "title" => "Correcto",
        "text" => "{$name} actualizada correctamente"
    ];
    echo json_encode($response);
    exit();
}
