<?php 

require_once __DIR__ . "/../../funciones/conn3.php";
require_once __DIR__ . "/../../funciones/funcionesModels.php"; 

// * MODELS Y CONTROLLERS

require_once __DIR__ . "/../../Models/Nomina/index.php";
require_once __DIR__ . "/../../Controllers/Nomina/index.php";

require_once __DIR__ . "/../../Models/Reclutamiento/index.php";
require_once __DIR__ . "/../../Controllers/Reclutamiento/index.php";

// * MODELS Y CONTROLLERS

try {

    // FECHAS DE CONSULTA 
    $ControllerTrabajadores = new TrabajadoresController($conn3);
    $ControllerEntrevistas = new EntrevistasController($conn3);

    if (!isset($_POST['action'])) {
        $response = [
            "icon" => "error",
            "title" => "Error interno",
            "text" => "No se ha especificado una acción, no es posible cargar los eventos del calendario"
        ];
        echo json_encode($response);
    }

    $action = $_POST['action'];
    unset($_POST['action']);
    
    if ($action == "consultar") {
        $idUsuario = $_POST['idUsuario'];

        $fechaActual = date("Y-m-d");
        $fechaActualMasUnMes = date("Y-m-d", strtotime("+1 months"));
        $fechaActualMasDosMeses = date("Y-m-d", strtotime("+2 months"));
        $fechaActualMenosUnMes = date("Y-m-d", strtotime("-1 months"));
        $fechaActualMenosDosMeses = date("Y-m-d", strtotime("-2 months"));

        $mesActual = date("m", strtotime($fechaActual));
        $mesMasUnMes = date("m", strtotime($fechaActualMasUnMes));
        $mesMasDosMeses = date("m", strtotime($fechaActualMasDosMeses));
        $mesMenosUnMes = date("m", strtotime($fechaActualMenosUnMes));
        $mesMenosDosMeses = date("m", strtotime($fechaActualMenosDosMeses));

        $datos = [];
        
        $arraymeses = [$mesActual, $mesMasUnMes, $mesMasDosMeses, $mesMenosUnMes, $mesMenosDosMeses];
        $trabajadoresCumpleTresMeses = $ControllerTrabajadores->obtenerPorMesesDeNacimiento($arraymeses);
        foreach ($trabajadoresCumpleTresMeses as $trabajador) {
            
            $fechaAjustada = ajustarFechaAlAnoActual($trabajador["fecha_nacimiento"]);
            
            $datos[] = [
                "title" => "Cumpleaños de " . $trabajador["nombre"] . " " . $trabajador["apellido"] ,
                "start" => $fechaAjustada,
                "end" => $fechaAjustada,
                "icon" => 'fas fa-bell',
                "description" => $trabajador["nombre"] . " " . $trabajador["apellido"] . " cumple ". calcularEdadPorFechaNacimiento($fechaNacimiento) ." años de edad. No olvides felicitarlo"
            ];
        }

        $entrevistasPorMeses = $ControllerEntrevistas->obtenerPorMesesParaFullCalendar($arraymeses, $idUsuario); 
        foreach ($entrevistasPorMeses as $entrevista) {
            $datos[] = $entrevista;
        }

        $response = [
            "icon" => "success",
            "title" => "Consulta exitosa",
            "text" => "Consulta exitosa",
            "data" => $datos
        ];

        echo json_encode($response);

    } 
} catch (\Throwable $th) {
    $response = [
        "icon" => "error",
        "title" => "Error",
        "text" => "Ocurrió un error inesperado",
        "error" => $th->getMessage(),
        "data" => null,
    ];
    echo json_encode($response);
}
