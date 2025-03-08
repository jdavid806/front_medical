<?php 

require "../Controllers/Facturacion/index.php";
require "../Models/Facturacion/index.php";

// include "../Controllers/Nomina/index.php";
// include "../Models/Nomina/index.php";


$ControllerMetodosP = new MetodosPagoController($conn3);
$DatosMetodosPago = $ControllerMetodosP->index();

$ControllerProcedimientos = new ProcedimientosController($conn3);
$DatosProcedimientos = $ControllerProcedimientos->index();

$ControllerEntidades = new EntidadesController($conn3);
$DatosEntidades = $ControllerEntidades->index("AND idUsuario = {$_SESSION['ID']}");

$ControllerProcedimientosEntidades = new ProcedimientosEntidadController($conn3);
// $DatosEntidades = $ControllerProcedimientosEntidades->index();

$ControllerSedes = new SedeController($conn3);
$DatosSedes = $ControllerSedes->index();


function obtenerDatosClientes()
{
    include "../funciones/conn3.php";
    $clientesMedical = mysqli_query($connMedical, "SELECT * FROM cliente limit 1500");
    $datosClientes = [];

    while ($row = mysqli_fetch_assoc($clientesMedical)) {
        $datosClientes[] = [
            "cliente_id" => $row['cliente_id'],
            "CODI_CLIENTE" => $row['CODI_CLIENTE'],
            "nombre_cliente" => $row['nombre_cliente'],
        ];
    }

    return json_encode($datosClientes);
}
function obtenerDatosUsuarios()
{
    include "../funciones/conn3.php";
    $MedicalMedical = mysqli_query($connMedical, "SELECT * FROM usuarios where ACTIVO = 1");
    $datosMedical = [];

    while ($row = mysqli_fetch_assoc($MedicalMedical)) {
        $datosMedical[] = [
            "ID" => $row['ID'],
            "nit" => $row['nit'],
            "NOMBRE_USUARIO" => $row['NOMBRE_USUARIO'],
        ];
    }

    return json_encode($datosMedical);
}
function obtenerDatosHistorias()
{
    include "../funciones/conn3.php";
    $HitoriasMedical = mysqli_query($connMedical, "SELECT * FROM Rips");
    $datosHitorias = [];

    while ($row = mysqli_fetch_assoc($HitoriasMedical)) {
        $datosHitorias[] = [
            "cliente_id" => $row['cliente_id'],
            "CODI_CLIENTE" => $row['CODI_CLIENTE'],
            "nombre_cliente" => $row['nombre_cliente'],
        ];
    }

    return json_encode($datosHistorias);
}


function obtenerDatosFacturas()
{
    include "../funciones/conn3.php";
    $Admision = mysqli_query($conn3, "SELECT * FROM sAdmision WHERE usuarioId=$_SESSION[ID] AND Activo=1");
    $dataJsonSimuladaAdmision = [];

    while ($row = mysqli_fetch_assoc($Admision)) {
        $queryCliente = mysqli_query($connMedical, "SELECT * FROM cliente WHERE cliente_id = '$row[clienteId]'");
        while ($rowcliente = mysqli_fetch_assoc($queryCliente)) {
            $nombre_cliente = $rowcliente['nombre_cliente'];
            $documento_cliente = $rowcliente['CODI_CLIENTE'];
        }
        $queryProcedimiento = mysqli_query($conn3, "SELECT * FROM FE_Procedimientos WHERE id = '$row[idCups]' AND activo=1");
        while ($rowprocedimiento = mysqli_fetch_assoc($queryProcedimiento)) {
            $cups_procedimiento = $rowprocedimiento['codigo_cups'];
        }
        $queryProfesional = mysqli_query($connMedical, "SELECT * FROM usuarios WHERE id = '$row[profesionalRealizo]'");
        while ($rowprofesional = mysqli_fetch_assoc($queryProfesional)) {
            $profesionalRealizo = $rowprofesional['codigo_cups'];
        }
        
       
        $dataJsonSimuladaAdmision[] = [
            "ID" =>  $row['ID'],
            "fecha_Admision" =>  $row['fecha_Admision'],
            "fechaConsulta" =>  $row['fechaConsulta'],
            "nombre_paciente" => $nombre_cliente,
            "documento_cliente" => $documento_cliente,
            "procedimiento" =>  $row['nombreCups'],
            "cups" => $cups_procedimiento,
            "HistoriaId" => $row['HistoriaId'],
            "profesionalRealizo" => $profesionalRealizo,
            "autorizacion" => $row['numeroOrden'],

        ];
    }

    return json_encode($dataJsonSimuladaAdmision);
}

function datosRegimen()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM type_regimes ORDER BY id ASC");
    $DatosRegimen = [];
    while ($row = $query->fetch_assoc()) {
        $DatosRegimen[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($DatosRegimen);


}
function datosTiposUsuarios()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM health_type_users ORDER BY id ASC");
    $datosTipoUsuarios = [];
    while ($row = $query->fetch_assoc()) {
        $datosTipoUsuarios[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($datosTipoUsuarios);


}
function datosTiposPagos()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM health_contracting_payment_methods ORDER BY id ASC");
    $datosTiposPagos = [];
    while ($row = $query->fetch_assoc()) {
        $datosTiposPagos[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($datosTiposPagos);


}
function datosTiposCoberturas()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM health_coverages ORDER BY id ASC");
    $datosTiposCoberturas = [];
    while ($row = $query->fetch_assoc()) {
        $datosTiposCoberturas[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($datosTiposCoberturas);


}
function datosTiposIdentificacion()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM type_document_identifications ORDER BY id ASC");
    $datosTiposIdentificacion = [];
    while ($row = $query->fetch_assoc()) {
        $datosTiposIdentificacion[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($datosTiposIdentificacion);


}
function datosTiposPersonas()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM type_organizations ORDER BY id ASC");
    $datosTiposPersonas = [];
    while ($row = $query->fetch_assoc()) {
        $datosTiposPersonas[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($datosTiposPersonas);


}
function datosTiposEmpresas()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");
    $query =mysqli_query($connApi, "SELECT * FROM type_liabilities ORDER BY id ASC");
    $datosTiposEmpresas = [];
    while ($row = $query->fetch_assoc()) {
        $datosTiposEmpresas[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
        ];
    }
    return json_encode($datosTiposEmpresas);


}
?>