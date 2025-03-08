<?php

include "../../funciones/conn3.php";
include "../../funciones/funciones.php";
include "../../funciones/funcionesModels.php"; // NECESARIO PARA ALGUNAS UTILIDADES DE LOS MODELS
include "../../Models/Contabilidad/index.php";
include "../../Controllers/Contabilidad/index.php";

try {
    $ControllerCuentas = new CuentasContablesController($conn3);
    $ControllerDetalle = new CContableDetalleController($conn3);
    $name = "NombreEntidad";
    if (!isset($_POST['action'])) {
        $response = [
            "icon" => "error",
            "title" => "Error interno",
            "text" => "No se ha especificado una acción"
        ];
        echo json_encode($response);
    }

    $action = $_POST['action'];
    unset($_POST['action']);

    if ($action == "consultar") {
        $cContable = intval($_POST["cContable"]);
        $anoFiscal = $_POST["anoFiscal"];
        $incluyeDiffFiscal = $_POST["incluyeDiffFiscal"];
        $mesesFiscales = json_decode($_POST["mesFiscal"], true);
        $WhereFechas = "";
        foreach ($mesesFiscales as $mes) {
            $WhereFechas .= " AND fechaRegistro LIKE '%" . $anoFiscal . "-" . $mes . "%'";
        }

        //TODAS LAS CUENTAS
        if ($cContable == 0) {

            $response = [];
            for ($i = 1; $i <= 9; $i++) {
                $cuentasPorInicial = $ControllerCuentas->obtenerPorInicial($i);
                $array = [];
                foreach ($cuentasPorInicial as $cuenta) {


                    $condicionBuscar = " AND cuentaContable = " . $cuenta["id"] . $WhereFechas;
                    $detallesCuentas = $ControllerDetalle->obtenerPorCondicionSql($condicionBuscar);

                    $totalDebito = 0;
                    $totalCredito = 0;
                    foreach ($detallesCuentas as $detCuenta) {
                        $totalDebito += intval($detCuenta["debito"]);
                        $totalCredito += intval($detCuenta["credito"]);
                    }

                    $saldoFinal = intval($cuenta["saldoIncial"]) + intval($totalDebito) - intval($totalCredito);
                    $classColumn = "";
                    if ($saldoFinal < 0) {
                        $classColumn = "text-danger";
                    }else if ($saldoFinal > 0) {
                        $classColumn = "text-success";
                    }

                    $datosCuenta = [
                        "id" => $cuenta["id"],
                        "codigo" => $cuenta["codigo"],
                        "nombre" => $cuenta["nombre"],
                        "saldoIncial" => "$" . number_format($cuenta["saldoIncial"], 2),
                        "totalDebito" => "$" . number_format($totalDebito, 2),
                        "totalCredito" => "$" . number_format($totalCredito, 2),
                        "clase" => clasificacionDeCuentaPorLongitud($cuenta["codigo"]),
                        "claseBootstrap" => $classColumn,
                        "saldoFinal" => "$" . number_format($saldoFinal, 2),
                    ];


                    $array[] = $datosCuenta;
                }

                $response[$i] = $array;
            }

            echo json_encode($response);
            exit();

        }else{
            $response = [];
            $array = [];
            $condicionBuscar = " AND cuentaContable = " . $cContable . $WhereFechas;
            $detallesCuentas = $ControllerDetalle->obtenerPorCondicionSql($condicionBuscar);


            $cuenta = $ControllerCuentas->obtenerPorId($cContable);
            $totalDebito = 0;
            $totalCredito = 0;
            foreach ($detallesCuentas as $detCuenta) {
                $totalDebito += intval($detCuenta["debito"]);
                $totalCredito += intval($detCuenta["credito"]);
            }

            $saldoFinal = intval($cuenta["saldoIncial"]) + intval($totalDebito) - intval($totalCredito);
            $classColumn = "";
            if ($saldoFinal < 0) {
                $classColumn = "text-danger";
            }else if ($saldoFinal > 0) {
                $classColumn = "text-success";
            }

            $i = substr($cuenta["codigo"], 0, 1);


            $datosCuenta = [
                "id" => $cuenta["id"],
                "codigo" => $cuenta["codigo"],
                "nombre" => $cuenta["nombre"],
                "saldoIncial" => "$" . number_format($cuenta["saldoIncial"], 2),
                "totalDebito" => "$" . number_format($totalDebito, 2),
                "totalCredito" => "$" . number_format($totalCredito, 2),
                "clase" => clasificacionDeCuentaPorLongitud($cuenta["codigo"]),
                "claseBootstrap" => $classColumn,
                "saldoFinal" => "$" . number_format($saldoFinal, 2),
            ];


            $array[] = $datosCuenta;
            $response[$i] = $array;
            echo json_encode($response);
            exit();
        }



        // "cContable": "0",
        // "anoFiscal": "1990",
        // "incluyeDiffFiscal": "Si",
        // "mesFiscal": "[\"03\",\"05\"]",


    }
} catch (\Throwable $th) {
    $response = [
        "icon" => "error",
        "title" => "Error",
        "text" => "Ocurrió un error inesperado",
        "error" => $th->getMessage()
    ];
    echo json_encode($response);
}
