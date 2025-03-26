<?php
require_once '../dompdf/autoload.inc.php';
include "./formatos.php";
include "./funcionesEncrypt/encriptar.php";

// $id = $_GET['id'] ?? 'desconocido';
// $tipo = $_GET['tipo'] ?? 'ninguno';
$id = decryptData($_GET['id']) ?? 'desconocido';
$tipo = decryptData($_GET['tipo']) ?? 'ninguno';

use Dompdf\Dompdf;
$dompdf = new Dompdf();

$resultado = "";
$titulo = "";
switch ($tipo) {
    case 'receta':
        $resultado = generarFormatoReceta($id);
        $titulo = "Receta Medica";
        break;
    case 'incapacidad':
        $resultado = generarFormatoIncapacidad($id);
        $titulo = "Incapacidad";
        break;
    case 'consulta':
        $resultado = generarFormatoConsulta($id);
        $titulo = "Consulta";
        break;
    case 'orden':
        $resultado = generarFormatoOrden($id);
        $titulo = "Orden medica";
        break;
    default:
        # code...
        break;
}
// var_dump($resultado);
$data = json_decode($resultado, true);

$consultorio = $data['consultorio'];
// $logo_consultorio = $consultorio['logo_consultorio'];
$logo_consultorio = "https://monaros.co/sistema/p/cenode.jpeg";
$nombre_consultorio = $consultorio['nombre_consultorio'];
// $marca_agua = $consultorio['marca_agua'];
$marca_agua = "https://monaros.co/sistema/p/cenode.jpeg";
$datos_consultorio = $consultorio['datos_consultorio'];

$datos_paciente = $data['paciente'];

$contenido = $data['contenido'];

$doctor = $data['doctor'];
$nombre_doctor = $doctor['nombre'];
$especialidad_doctor = $doctor['especialidad'];
$firma_doctor = $doctor['firma'];

$sin_logo = empty($logo_consultorio) || in_array(strtolower(trim($logo_consultorio)), ["vacío", "No especificado", "null", ""]);
$sin_marca_agua = empty($marca_agua) || in_array(strtolower(trim($marca_agua)), ["vacío", "No especificado", "null", ""]);
$sin_firma = empty($firma_doctor) || in_array(strtolower(trim($firma_doctor)), ["vacío", "No especificado", "null", ""]);

if (!$sin_firma) {
    $firmaDigital = "<p><strong>Firmado Digitalmente</strong></p>";
} else {
    $firmaDigital = "";
}

$documento = $datos_paciente['datos_basicos']['documento'];
$contraseña = strpos($documento, '-') !== false ? substr($documento, strpos($documento, '-') + 1) : $documento;
$nombrePdf = $titulo . "_" . $datos_paciente['datos_basicos']['documento'] . "_" . $datos_paciente['datos_generales']['fecha_consulta'] . ".pdf";

ob_start();
include "../PlantillasImpresion/PDescargaCarta.php";
$html = ob_get_clean();

$options = $dompdf->getOptions();
$options->set(array('isRemoteEnabled' => true));
$options->set('defaultPaperSize', 'letter');
$options->set('isHtml5ParserEnabled', true);
$dompdf->setOptions($options);

$dompdf->loadHtml($html);

$dompdf->render();

$canvas = $dompdf->getCanvas();
$canvas->get_cpdf()->setEncryption(
    $contraseña,     // Contraseña maestra (desbloquea todo)
    '',     // Contraseña de usuario (abre el PDF)
    ['copy', 'print'] // Bloquea copiar e imprimir
);

header('Content-Type: application/pdf');
$dompdf->stream($nombrePdf, array("Attachment" => false));