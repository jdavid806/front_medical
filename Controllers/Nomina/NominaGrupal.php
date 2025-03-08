<?php

class NominaGrupalController
{
    private $model;

    public function __construct($db, $data = [])
    {
        $this->model = new NominaGrupalModel($db);
    }

    public function index()
    {
        $respuesta = $this->model->obtener();
        return $respuesta;
    }

    public function obtenerMax()
    {
        $respuesta = $this->model->obtenerPersonalizado("max(id) as id", "");
        $respuesta = $respuesta == null || $respuesta == false ? 0 : $respuesta[0]["id"];
        $respuesta = is_array($respuesta) ? $respuesta[0] : $respuesta;
        return $respuesta;
    }

    public function obtenerUltimaLiquidacionTrabajador($idTrabajador)
    {
        //$WhereCliente = "AND Json_Trabajadores LIKE '%\"$cliente_id\"%'";
        $respuesta = $this->model->obtenerPersonalizado("fechaRegistro as fecha", " AND trabajadores LIKE '%\"$idTrabajador\"%' ORDER BY fechaRegistro DESC LIMIT 1");
        $respuesta = $respuesta == null || $respuesta == false ? 0 : $respuesta[0]["fecha"];
        return $respuesta;
    }

    public function getFecha()
    {
        return date("Y-m-d");
    }

    public function obtenerPorId($id)
    {
        $respuesta = $this->model->obtenerPorId($id);
        return $respuesta;
    }

    public function obtenerColumnasDBDia($dia)
    {

        $arrayColumnas = [
            "Monday" => ["lunesHabilitado", "lunesInicio", "lunesFin"],
            "Tuesday" => ["martesHabilitado", "martesInicio", "martesFin"],
            "Wednesday" => ["miercolesHabilitado", "miercolesInicio", "miercolesFin"],
            "Thursday" => ["juevesHabilitado", "juevesInicio", "juevesFin"],
            "Friday" => ["viernesHabilitado", "viernesInicio", "viernesFin"],
            "Saturday" => ["sabadoHabilitado", "sabadoInicio", "sabadoFin"],
            "Sunday" => ["domingoHabilitado", "domingoInicio", "domingoFin"],
        ];

        return $arrayColumnas[$dia];
    }

    public function obtenerNominaPorFechas($fechaInicio, $fechaFin, $arrayFechas, $trabajadores, $Controllers, $formulas, $idUsuario)
    {
        list(
            $ControllerMarcacion,
            $ControllerCargo,
            $ControllerDescuentos,
            $ControllerRecargos,
            $ControllerBeneficios,
            $ControllerDeducciones,
            $ControllerRetenciones,
            $ControllerDeduccionesGrupales,
            $ControllerAdiciones,
            $ControllerIncapacidades
        ) = $Controllers;

        $formulaCalculoIncapacidad = $formulas["formulaCalculoIncapacidad"];
        $DeduccionesGrupalesActiva = $ControllerDeduccionesGrupales->obtenerPorUsuario($idUsuario);
        $AdicionesGrupalesPorUsuario = $ControllerAdiciones->obtenerPorUsuario($idUsuario);

        $datosNomina = [];
        foreach ($trabajadores as $trabajador) {
            $idTrabajador = $trabajador["id"];
            $nombreTrabajador = "{$trabajador["nombre"]} {$trabajador["apellido"]}";
            $cargoTrabajador = $ControllerCargo->obtenerPorCondicion(" AND id = " . $trabajador["cargo"]);

            $inasistencias = $asistencias = $diasLibres = 0;

            foreach ($arrayFechas as $fechaI) {
                $diaColumn = $this->obtenerColumnasDBDia(date('l', strtotime($fechaI)))[0];
                if ($trabajador[$diaColumn] === 'on') {
                    $asistencia = $ControllerMarcacion->obtenerPorCondicion(
                        " AND idTrabajador = $idTrabajador AND fechaMarcacion = '$fechaI' AND inasistencia = 'No'"
                    );
                    $asistencias += count($asistencia) > 0 ? 1 : 0;
                    $inasistencias += count($asistencia) === 0 ? 1 : 0;
                } else {
                    $diasLibres++;
                }
            }

            $salarioDiarioEmpleado = $this->calcularSalarioDiario($trabajador["salario"], $formulaCalculoIncapacidad["formulaSalarioDiario"]);
            $totalDiasLiquidar = $asistencias + $diasLibres;
            $totalSalarioObtenido = intval($trabajador["salario"]) * $totalDiasLiquidar / 30;

            $nominaTrabajador = [
                "id" => $idTrabajador,
                "nombre" => $nombreTrabajador,
                "cargo" => $cargoTrabajador["nombre"],
                "salario_base" => $trabajador["salario"],
                "salario_calculado" => $totalSalarioObtenido,
                "inasistencias" => $inasistencias,
                "asistencias" => $asistencias,
                "diasLibres" => $diasLibres,
                "descuentos" => $this->procesarDescuentos($ControllerDescuentos, $idTrabajador, $fechaInicio, $fechaFin),
                "bonificaciones" => $this->procesarBonificaciones($ControllerRecargos, $ControllerBeneficios, $idTrabajador, $fechaInicio, $fechaFin),
                "adicionesEmpresa" => $this->procesarAdiciones($AdicionesGrupalesPorUsuario, $trabajador, "Empresa"),
                "adicionesTrabajador" => $this->procesarAdiciones($AdicionesGrupalesPorUsuario, $trabajador, "Trabajador"),
                "incapacidades" => $this->procesarIncapacidades($ControllerIncapacidades, $idTrabajador, $fechaInicio, $fechaFin, $formulaCalculoIncapacidad, $salarioDiarioEmpleado),
                "deducciones" => $this->procesarDeducciones($DeduccionesGrupalesActiva, $trabajador, $totalSalarioObtenido, $ControllerRetenciones),
            ];

            $datosNomina[] = $nominaTrabajador;
        }

        return $datosNomina;
    }

    private function calcularSalarioDiario($salario, $formulaSalarioDiario)
    {
        $formula = str_replace("salarioEmpleado", $salario, $formulaSalarioDiario);
        $resultado = eval('return ' . $formula . ';');
        return number_format(round(floatval($resultado), 2), 2, '.', '');
    }

    public function procesarDescuentos($ControllerDescuentos, $idTrabajador, $fechaInicio, $fechaFin)
    {
        $descuentos = $ControllerDescuentos->obtenerPorCondicion(
            " AND idTrabajador = $idTrabajador AND descontado = 'No' AND fechaRegistro BETWEEN '$fechaInicio' AND '$fechaFin'"
        );
        return array_map(function ($descuento) {
            [$fecha, $hora] = explode(" ", $descuento["fechaRegistro"]);
            return [
                "idDescuento" => $descuento["id"],
                "fecha" => $fecha,
                "hora" => $hora,
                "motivo" => $descuento["motivo"],
                "detalle" => $descuento["detalles"],
                "valor_descuento" => $descuento["valorDescuento"],
            ];
        }, $descuentos);
    }

    public function procesarBonificaciones($ControllerRecargos, $ControllerBeneficios, $idTrabajador, $fechaInicio, $fechaFin)
    {
        $recargos = $ControllerRecargos->obtenerPorCondicion(
            " AND idTrabajador = $idTrabajador AND pagado = 'No' AND fechaRegistro BETWEEN '$fechaInicio' AND '$fechaFin'"
        );
        $bonificaciones = array_map(function ($recargo) {
            [$fecha, $hora] = explode(" ", $recargo["fechaRegistro"]);
            return [
                "idRecargo" => $recargo["id"],
                "fecha" => $fecha,
                "hora" => $hora,
                "motivo" => $recargo["motivo"],
                "detalle" => $recargo["observaciones"],
                "valor" => $recargo["valorRecargo"],
                "esSalarial" => $recargo["esSalarial"],
            ];
        }, $recargos);

        $beneficios = $ControllerBeneficios->obtenerPorCondicion(" AND idTrabajador = $idTrabajador");
        foreach ($beneficios as $beneficio) {
            $bonificaciones[] = [
                "idRecargo" => null,
                "fecha" => date("Y-m-d"),
                "hora" => date("H:i:s"),
                "motivo" => $beneficio["Beneficio"],
                "detalle" => "",
                "valor" => $beneficio["Valor"],
            ];
        }

        return $bonificaciones;
    }

    private function procesarAdiciones($Adiciones, $trabajador, $tipo){
        $resultado = [];

        foreach ($Adiciones as $adicion) {
            if ($adicion["aplicableA"] === $tipo) {
                $valor = $adicion["descuentoSegun"] === 'porcentajeSalario' ? intval($trabajador["salario"]) * $adicion["valor"] / 100 : $adicion["valor"];
                $resultado[] = [
                    "fecha" => date("Y-m-d"),
                    "hora" => date("H:i:s"),
                    "motivo" => $adicion["nombre"],
                    "detalle" => "",
                    "valor" => $valor,
                ];
            }
        }

        return $resultado;
    }


    private function procesarIncapacidades($ControllerIncapacidades, $idTrabajador, $fechaInicio, $fechaFin, $formula, $salarioDiarioEmpleado)
    {
        $incapacidades = $ControllerIncapacidades->obtenerPorIdTrabajadorYRangoFecha($idTrabajador, [$fechaInicio, $fechaFin]);
        $resultado = [];
        foreach ($incapacidades as $incapacidad) {
            $dias = floor((strtotime($incapacidad["fechaFin"]) - strtotime($incapacidad["fechaIncio"])) / 86400);
            $diasEmpleador = min($formula["maximoDiasEmpleador"], $dias);
            $diasEPS = $dias - $diasEmpleador;

            if ($diasEmpleador > 0) {
                $resultado[] = $this->crearRegistroIncapacidad($incapacidad, "Empleador", $salarioDiarioEmpleado, $formula["porcentajeEmpleadorSalarioDiario"], $diasEmpleador);
            }
            if ($diasEPS > 0) {
                $resultado[] = $this->crearRegistroIncapacidad($incapacidad, "EPS", $salarioDiarioEmpleado, $formula["porcentajeEPSSalarioDiario"], $diasEPS);
            }
        }
        return $resultado;
    }

    private function crearRegistroIncapacidad($incapacidad, $tipo, $salarioDiario, $porcentaje, $dias)
    {
        return [
            "idIncapacidad" => $incapacidad["id"],
            "fecha" => date("Y-m-d"),
            "hora" => date("H:i:s"),
            // "motivo" => "Pago de Incapacidad - {$incapacidad["fechaIncio"]} a {$incapacidad["fechaFin"]}",
            "motivo" => "Pago de Incapacidad",
            "detalle" => "",
            "tipo" => $tipo,
            "valor" => $salarioDiario * ( $porcentaje / 100) * $dias,
        ];
    }

    private function procesarDeducciones($Deducciones, $trabajador, $totalSalarioObtenido, $ControllerRetenciones)
    {
        $resultado = [];
        foreach ($Deducciones as $deduccion) {
            $aplica = $this->verificarAplicacionDeduccion($deduccion, $trabajador);
            if ($aplica) {
                $valor = $deduccion["descuentoSegun"] === 'porcentajeSalario'
                    ? $trabajador["salario"] * $deduccion["valor"] / 100
                    : $deduccion["valor"];
                $resultado[] = [
                    "idDeduccion" => null,
                    "fecha" => date("Y-m-d"),
                    "hora" => date("H:i:s"),
                    "motivo" => "{$deduccion["nombre"]} ({$deduccion["valor"]})",
                    "detalle" => "",
                    "porcentaje" => $deduccion["valor"],
                    "valor" => $valor,
                ];
            }
        }

        $retencion = $ControllerRetenciones->obtenerPorSalario($trabajador["salario"]);
        if (!empty($retencion)) {
            $resultado[] = [
                "idDeduccion" => null,
                "fecha" => date("Y-m-d"),
                "hora" => date("H:i:s"),
                "motivo" => "{$retencion["nombreRetencion"]} ({$retencion["porcentajeRetencion"]}%)",
                "detalle" => "Retencion de salario",
                "porcentaje" => $retencion["porcentajeRetencion"],
                "valor" => $totalSalarioObtenido * $retencion["porcentajeRetencion"] / 100,
            ];
        }

        return $resultado;
    }

    private function verificarAplicacionDeduccion($deduccion, $trabajador)
    {
        if ($deduccion["aplicableA"] === "todos") {
            return true;
        }

        if ($deduccion["aplicableA"] === "empleados") {
            return in_array($trabajador["id"], json_decode($deduccion["listaTrabajadores"], true));
        }

        if ($deduccion["aplicableA"] === "segunrangosalarial") {
            return intval($trabajador["salario"]) >= $deduccion["rangoSalarioInicio"] && intval($trabajador["salario"]) <= $deduccion["rangoSalarioFin"];
        }

        return false;
    }


    // public function obtenerNominaPorFechas($fechaInicio, $fechaFin, $arrayFechas, $trabajadores, $Controllers, $formulas,  $idUsuario ) {
    //     // /Controllers => $ControllerMarcacion, $ControllerCargo, $ControllerDescuentos, $ControllerRecargos, $ControllerBeneficios,$ControllerDeducciones, $ControllerRetenciones
    //     $ControllerMarcacion = $Controllers[0];
    //     $ControllerCargo = $Controllers[1];
    //     $ControllerDescuentos = $Controllers[2];
    //     $ControllerRecargos = $Controllers[3];
    //     $ControllerBeneficios = $Controllers[4];
    //     $ControllerDeducciones = $Controllers[5];
    //     $ControllerRetenciones = $Controllers[6];
    //     $ControllerDeduccionesGrupales = $Controllers[7];
    //     $ControllerAdiciones = $Controllers[8];
    //     $ControllerIncapacidades = $Controllers[9];


    //     // formulaCalculoIncapacidad
    //     $formulaCalculoIncapacidad = $formulas["formulaCalculoIncapacidad"];

    //     $DeduccionesGrupalesActiva = $ControllerDeduccionesGrupales->obtenerPorUsuario($idUsuario);
    //     $AdicionesGrupalesPorUsuario = $ControllerAdiciones->obtenerPorUsuario($idUsuario);

    //     $datosNomina = [];
    //     foreach ($trabajadores as $key => $trabajador) {

    //         $inasistencias = 0;
    //         $asistencias = 0;
    //         $diasLibres = 0;

    //         foreach ($arrayFechas as $fechaI) {
    //             $dia = date('l', strtotime($fechaI));
    //             $columnas = $this->obtenerColumnasDBDia($dia);
    //             $diaColumn =  $columnas[0];
    //             $diaHabilitado = $trabajador[$diaColumn];
    //             if ($diaHabilitado == 'on') {
    //                 $asistenciaDia = $ControllerMarcacion->obtenerPorCondicion(" AND idTrabajador = " . $trabajador["id"] . " AND fechaMarcacion = '" . $fechaI . "' AND inasistencia = 'No'");
    //                 if (count($asistenciaDia) > 0) {
    //                     $asistencias += 1;
    //                 }else{
    //                     $inasistencias += 1;
    //                 }
    //             }else{
    //                 $diasLibres += 1;
    //             }
    //         }



    //         $formulaSalarioDiario = $formulaCalculoIncapacidad["formulaSalarioDiario"]; 
    //         $formulaSalarioDiario = str_replace("salarioEmpleado", $trabajador["salario"], $formulaSalarioDiario);
    //         $salarioDiarioEmpleado = eval('return ' . $formulaSalarioDiario . ';');
    //         $salarioDiarioEmpleado = floatval($salarioDiarioEmpleado);
    //         $salarioDiarioEmpleado = round($salarioDiarioEmpleado, 2);
    //         $salarioDiarioEmpleado = number_format($salarioDiarioEmpleado, 2, '.', '');


    //         // $salarioDiarioEmpleado = intval($trabajador["salario"]) / 30;

    //         $totalDias = count($arrayFechas);
    //         $totalDiasLiquidar = $asistencias + $diasLibres;
    //         $totalSalarioObtenido = intval($trabajador["salario"]) * $totalDiasLiquidar / 30;
    //         // $totalSalarioObtenido = intval($trabajador["salario"]) * $totalDiasLiquidar / 30;

    //         $nominaTrabajador = [];

    //         $idTrabajador = $trabajador["id"];
    //         $nombreTrabajador = $trabajador["nombre"] . " " . $trabajador["apellido"];
    //         $cargoTrabajador = $ControllerCargo->obtenerPorCondicion(" AND id = " . $trabajador["cargo"]); 

    //         $nominaTrabajador["id"] = $idTrabajador;
    //         $nominaTrabajador["inasistencias"] = $inasistencias;
    //         $nominaTrabajador["asistencias"] = $asistencias;
    //         $nominaTrabajador["diasLibres"] = $diasLibres;
    //         $nominaTrabajador["nombre"] = $nombreTrabajador;
    //         $nominaTrabajador["salario_base"] = $trabajador["salario"];
    //         $nominaTrabajador["salario_calculado"] = $totalSalarioObtenido;
    //         $nominaTrabajador["cargo"] = $cargoTrabajador["nombre"];

    //         $nominaDescuentos = [];

    //         $descuentosTrabajador = $ControllerDescuentos->obtenerPorCondicion(" AND idTrabajador = " . $idTrabajador . " AND descontado = 'No' AND fechaRegistro BETWEEN '" . $fechaInicio . "' AND '" . $fechaFin . "'");
    //         foreach ($descuentosTrabajador as $key1 => $value1) {
    //             $fechaRegistro = $value1["fechaRegistro"];
    //             $fechaRegistro = explode(" ", $fechaRegistro);
    //             $fecha = $fechaRegistro[0];
    //             $hora = $fechaRegistro[1];

    //             $descuento = [
    //                 "idDescuento" => $value1["id"],
    //                 "fecha" => $fecha ,
    //                 "hora" => $hora ,
    //                 "motivo" => $value1["motivo"],
    //                 "detalle" => $value1["detalles"],
    //                 "valor_descuento" => $value1["valorDescuento"]
    //             ];
    //             array_push($nominaDescuentos, $descuento);
    //         }

    //         $nominaTrabajador["descuentos"] = $nominaDescuentos;

    //         $nominaBonificaciones = [];
    //         $recargosTrabajador = $ControllerRecargos->obtenerPorCondicion(" AND idTrabajador = " . $idTrabajador . " AND pagado = 'No' AND fechaRegistro BETWEEN '" . $fechaInicio . "' AND '" . $fechaFin . "'");
    //         foreach ($recargosTrabajador as $key1 => $value1) {
    //             $fechaRegistro = $value1["fechaRegistro"];
    //             $fechaRegistro = explode(" ", $fechaRegistro);
    //             $fecha = $fechaRegistro[0];
    //             $hora = $fechaRegistro[1];

    //             $recargo = [
    //                 "idRecargo" => $value1["id"],
    //                 "fecha" => $fecha ,
    //                 "hora" => $hora ,
    //                 "motivo" => $value1["motivo"],
    //                 "detalle" => $value1["observaciones"],
    //                 "valor" => $value1["valorRecargo"],
    //                 "esSalarial" => $value1["esSalarial"]
    //             ];
    //             array_push($nominaBonificaciones, $recargo);
    //         }

    //         $BeneficiosTrabajador = $ControllerBeneficios->obtenerPorCondicion(" AND idTrabajador = " . $idTrabajador );
    //         foreach ($BeneficiosTrabajador as $key1 => $value1) {
    //             $beneficio = [
    //                 "idRecargo" => null,
    //                 "fecha" => date("Y-m-d") ,
    //                 "hora" => date("H:i:s") ,
    //                 "motivo" => $value1["Beneficio"],
    //                 "detalle" => "",
    //                 "valor" => $value1["Valor"]
    //             ];
    //             array_push($nominaBonificaciones, $beneficio);
    //         }

    //         $adicionesEmpresa = [];
    //         $adicionesTrabajador = [];
    //         foreach ($AdicionesGrupalesPorUsuario as $AdicionGrupal) {
    //             $totalAdicion = $AdicionGrupal["descuentoSegun"] == 'porcentajeSalario' ? (intval($trabajador["salario"]) * $AdicionGrupal["valor"]) / 100  : $AdicionGrupal["valor"];
    //             $adicion = [
    //                 "fecha" => date("Y-m-d"),
    //                 "hora" => date("H:i:s"),
    //                 "motivo" => $AdicionGrupal["nombre"],
    //                 "detalle" => "",
    //                 "valor" => $totalAdicion
    //             ];

    //             if ($AdicionGrupal["aplicableA"] == "Empresa") {
    //                 $adicionesEmpresa[] = $adicion; 
    //             }else if ($AdicionGrupal["aplicableA"] == "Trabajador") {
    //                 $adicionesTrabajador[] = $adicion; 
    //             }
    //         }

    //         $nominaIncapacidades = [];
    //         $incapacidadesCliente = $ControllerIncapacidades->obtenerPorIdTrabajadorYRangoFecha($idTrabajador, [$fechaInicio, $fechaFin]);
    //         foreach ($incapacidadesCliente as $incapacidad) {

    //             $fechaInicioIncapacidad = $incapacidad["fechaIncio"];
    //             $fechaFinIncapacidad = $incapacidad["fechaFin"];
    //             $diasIncapacidadEnSegundos =  strtotime($fechaInicioIncapacidad) + strtotime($fechaFinIncapacidad);
    //             $dias = floor($diasIncapacidadEnSegundos / 86400);

    //             $diasACargoDeEmpleador = $formulaCalculoIncapacidad["maximoDiasEmpleador"];
    //             $diasACargoDeEPS = $diasACargoDeEmpleador - $dias;

    //             $porcentajePagoEmpleador = $formulaCalculoIncapacidad["porcentajeEmpleadorSalarioDiario"];
    //             $porcentajePagoEPS = $formulaCalculoIncapacidad["porcentajeEPSSalarioDiario"];

    //             if ($dias > 0) {

    //                 $valorPagoEmpleador =  $diasACargoDeEmpleador > 0 ? ( $salarioDiarioEmpleado * $porcentajePagoEmpleador )  * $diasACargoDeEmpleador : 0;
    //                 $valorPagoEPS =  $diasACargoDeEPS > 0 ? ( $salarioDiarioEmpleado * $porcentajePagoEPS )  * $diasACargoDeEPS : 0;

    //                 // $datosPrueba = [
    //                 //     "formulaSalarioDiario" => $formulaSalarioDiario,
    //                 //     "diasACargoDeEmpleador" => $diasACargoDeEmpleador,
    //                 //     "diasACargoDeEPS" => $diasACargoDeEPS,
    //                 //     "salarioDiarioEmpleado" => $salarioDiarioEmpleado,
    //                 //     "porcentajePagoEmpleador" => $porcentajePagoEmpleador ,
    //                 //     "porcentajePagoEPS" => $porcentajePagoEPS ,
    //                 //     "valorPagoEmpleador" => $valorPagoEmpleador,
    //                 //     "valorPagoEPS" => $valorPagoEPS ,
    //                 // ];

    //                 // $datosPrueba = json_encode($datosPrueba);
    //                 // die($datosPrueba);

    //                 if ($valorPagoEmpleador > 0) {
    //                     $nominaIncapacidades[] = [
    //                         "idIncapacidad" => $incapacidad["id"],
    //                         "fecha" => date("Y-m-d") ,
    //                         "hora" => date("H:i:s") ,
    //                         "motivo" => "Pago de Incapacidad - " . $fechaInicioIncapacidad . " a " . $fechaFinIncapacidad,
    //                         "detalle" => "",
    //                         "tipo" => "Empleador",
    //                         "valor" => $valorPagoEmpleador
    //                     ];
    //                 }

    //                 if ($valorPagoEPS > 0) {
    //                     $nominaIncapacidades[] = [
    //                         "idIncapacidad" => $incapacidad["id"],
    //                         "fecha" => date("Y-m-d") ,
    //                         "hora" => date("H:i:s") ,
    //                         "motivo" => "Pago de Incapacidad ( Entidad de salud ) - " . $fechaInicioIncapacidad . " a " . $fechaFinIncapacidad,
    //                         "detalle" => "",
    //                         "tipo" => "EPS",
    //                         "valor" => $valorPagoEPS
    //                     ];
    //                 }
    //             }
    //         }

    //         $nominaDeducciones = [];
    //         // $DeduccionesTrabajador = $ControllerDeducciones->obtenerPorCondicion(" AND idTrabajador = " . $idTrabajador );
    //         // foreach ($DeduccionesTrabajador as $key1 => $value1) {
    //         //     $deduccion = [
    //         //         "idDeduccion" => $key1["id"],
    //         //         "fecha" => date("Y-m-d") ,
    //         //         "hora" => date("H:i:s") ,
    //         //         "motivo" => $value1["deduccion"],
    //         //         "detalle" => "",
    //         //         "valor" => $value1["valor"]
    //         //     ];
    //         //     array_push($nominaDeducciones, $deduccion);
    //         // }

    //         foreach ($DeduccionesGrupalesActiva as $DeduccionGrupal) {
    //             $aplicacionDeduccion = strtolower($DeduccionGrupal["aplicableA"]);
    //             $condicionDeduccion = strtolower($DeduccionGrupal["descuentoSegun"]);
    //             $listaTrabajadores = json_decode($DeduccionGrupal["listaTrabajadores"], true);

    //             // Calcula el total de deducción
    //             $totalDeduccion = $condicionDeduccion == 'porcentajesalario' 
    //                 ? $trabajador["salario"] * $DeduccionGrupal["valor"] / 100 
    //                 : $DeduccionGrupal["valor"];

    //             // Verifica si la deducción debe aplicarse
    //             $aplicaDeduccion = false;

    //             if ($aplicacionDeduccion == 'todos') {
    //                 $aplicaDeduccion = true;
    //             } elseif ($aplicacionDeduccion == 'empleados' && in_array($idTrabajador, $listaTrabajadores)) {
    //                 $aplicaDeduccion = true;
    //             } elseif (
    //                 $aplicacionDeduccion == 'segunrangosalarial' && intval($trabajador["salario"]) > intval($DeduccionGrupal["rangoSalarioInicio"]) && intval($trabajador["salario"]) < intval($DeduccionGrupal["rangoSalarioFin"])
    //             ) {
    //                 $aplicaDeduccion = true;
    //             }

    //             // Si aplica la deducción, se agrega a la lista
    //             if ($aplicaDeduccion) {
    //                 $simbolo = $DeduccionGrupal["descuentoSegun"] == 'porcentajeSalario' ? '%' : '';
    //                 $deduccion = [
    //                     "idDeduccion" => null,
    //                     "fecha" => date("Y-m-d"),
    //                     "hora" => date("H:i:s"),
    //                     "motivo" => $DeduccionGrupal["nombre"] .  " (" . $DeduccionGrupal["valor"] . $simbolo . " )" ,
    //                     "detalle" => "",
    //                     "porcentajeDeduccion" => $DeduccionGrupal["valor"],
    //                     "valor" => $totalDeduccion
    //                 ];
    //                 $nominaDeducciones[] = $deduccion; // Usa la sintaxis corta para agregar al array
    //             }
    //         }

    //         $retencion = $ControllerRetenciones->obtenerPorSalario($trabajador["salario"]);
    //         $porcentajeRetencion = empty($retencion) ? 0 : $retencion["porcentajeRetencion"];
    //         if ($porcentajeRetencion <> 0) {
    //             $totalRetencion = $totalSalarioObtenido * $porcentajeRetencion / 100;
    //             $retencionSalario = [
    //                 "idDeduccion" => null,
    //                 "fecha" => date("Y-m-d") ,
    //                 "hora" => date("H:i:s") ,
    //                 "porcentajeDeduccion" => $porcentajeRetencion,
    //                 // "motivo" => "Retencion " . $porcentajeRetencion . "%",
    //                 "motivo" => $retencion["nombreRetencion"] . " (". $porcentajeRetencion . " %)",
    //                 "detalle" => "Retencion de salario",
    //                 "valor" => $totalRetencion
    //             ];
    //             array_push($nominaDeducciones, $retencionSalario);
    //         }

    //         $nominaTrabajador["bonificaciones"]         =   $nominaBonificaciones;
    //         $nominaTrabajador["deducciones"]            =   $nominaDeducciones;
    //         $nominaTrabajador["adicionesEmpresa"]       =   $adicionesEmpresa;
    //         $nominaTrabajador["adicionesTrabajador"]    =   $adicionesTrabajador;
    //         $nominaTrabajador["incapacidades"]          =   $nominaIncapacidades;

    //         array_push($datosNomina, $nominaTrabajador);
    //     }

    //     return $datosNomina;

    // }

    public function obtenerPorCondicion($condition)
    {
        $respuesta = $this->model->obtenerPorCondicion($condition);
        $respuesta = $respuesta == null || $respuesta == false ? [] : $respuesta;

        return $respuesta;
    }

    public function crear($data)
    {
        $data = escaparArray($data);
        $respuesta = $this->model->crear($data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }

    public function editar($id, $data)
    {
        $data = escaparArray($data);
        $respuesta = $this->model->actualizar($id, $data);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }

    public function eliminar($id)
    {
        $respuesta = $this->model->eliminar($id);
        return [
            "status" => $respuesta["status"],
            "message" => $respuesta["query"] . " " . $respuesta["error"]
        ];
    }
}
