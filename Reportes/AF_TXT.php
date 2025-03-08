<?php

header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
header('Content-Disposition: attachment; filename=RipsAF.txt');
include "../funciones/conn3.php";
//include 'funciones/funciones.php';
function reem_alreves($texto1) 
{

//Rememplazamos caracteres especiales latinos minusculas
$repl = array('á', 'é', 'í', 'ó', 'ú', 'ñ', '\"', '€', 'ü');
$find = array('&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', '&ntilde;', '&quot;', '&euro;', '&uuml;');
$texto1 = str_replace ($find, $repl, $texto1);


//Rememplazamos caracteres especiales latinos mayusculas
$repl = array('Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ', 'Ü', 'ç', 'Ç');
$find = array('&Aacute;', '&Eacute;', '&Iacute;', '&Oacute;', '&Uacute;', '&Ntilde;', '&Uuml;', '&ccedil;', '&Ccedil;');
$texto1 = str_replace ($find, $repl, $texto1);

return $texto1;

}
function funcionMaster($filtro, $campoFiltrar, $campoImprimir, $tabla, $config = null)
{
    // $config resive un arreglo con la configuracion que quieran usar
    // tu puedes poner lo que quieras hacer, la meta la pones tu :v
    if ($config && !empty($config)) { // valores para configurar
        $arrayAccept = [ // funciones a utilizar
            "like",  // deja filtrar valores con un like teniendo en cuenta que solo va a devolver un valor
            "order", // para indicar el orden de la consulta for example: order => "id asc"
            "returnConsult", // en el caso de que no se ejecute la consulta devuelve la consulta para validación
            "notResult" // para personalizar el mensaje en el caso de que este vacio
        ];
        $arrayConfig = [];
        foreach ($config as $key => $value) {
            if (!in_array($key, $arrayAccept)) { // si no se envia un valor que no este configurado lo devuelve para que sepa que no esta configurado
                return "Invalid configuration parameter $key"; // en ingles pa que sepa que ta mal
            } else {
                $arrayConfig[$key] = $value;
            }
        }
        $order = ($arrayConfig["order"] && !empty($arrayConfig["order"]) ? $arrayConfig["order"] : "");
        $condicion = ($arrayConfig["like"] && ($arrayConfig["like"] == true) ? "$campoFiltrar like '%$filtro%'" : "$campoFiltrar = '$filtro'");
        $return = ($arrayConfig["returnConsult"] && ($arrayConfig["returnConsult"] == true) ? 1 : 0);
    } else { // valores por defecto
        $order = "";
        $condicion = "$campoFiltrar = '$filtro'";
        $return = 0;
    }

    include "../funciones/conn3.php";
    $query = mysqli_query($connMedical, "SELECT $campoImprimir FROM $tabla where $condicion " . (!empty($order) ? "order by $order" : "") . " limit 1");
    $row = mysqli_fetch_array($query);
    if (!empty(mysqli_num_rows($query))) {
        return $row[$campoImprimir];
    } else {
        if (!empty($return)) {
            return "SELECT $campoImprimir FROM $tabla where $condicion " . (!empty($order) ? "order by $order" : "") . " limit 1";
        } else {
            // return ($arrayConfig["notResult"] ? $arrayConfig["notResult"] : "not result");
            return ($arrayConfig["notResult"] ? $arrayConfig["notResult"] : ""); // jaja sorry
        }
    }
}

$desde = $_POST['desde'];
$hasta = $_POST['hasta'];

$entidadSalud = $_POST['entidadSalud'];
$fechaRemision = $_POST['fechaRemision'];

$tipoUsuario = $_POST['tipoUsuario'];
$paciente =  $_POST['paciente'];
$Numero_Factura = $_POST["Numero_Factura"];

$cantidadRegistros = 0;
$fechaHoy = date("Y-m-d");
// consulta para datos de usuario rips

$doctor = $_POST['doctor'];

$queryU = mysqli_query($connMedical, "SELECT * FROM usuarios where ID=$doctor");
$nrowU = mysqli_num_rows($queryU);
while ($rowListaU = mysqli_fetch_array($queryU)) {
    $NOMBRE_USUARIO = reem_alreves($rowListaU['NOMBRE_USUARIO']);
    $NOMBRE_USUARIO = trim($NOMBRE_USUARIO, " ");
    $codigoPrestador = $rowListaU['codigoPrestador'];
    $nit = $rowListaU['nit'];
    $factura = $rowListaU['factura'];
}

$cod_entidad  = 'SDS001';
$entidadSalud = 'PARTICULAR';


if ($paciente == '1') {

    $queryU = mysqli_query($connMedical, "SELECT * FROM cliente where tipo_cliente in ('CC','RC','TI')");
    while ($rowListaU = mysqli_fetch_array($queryU)) {
        $ArregloCliente[] = $rowListaU['cliente_id'];
    }
} else if ($paciente == '0') {

    $queryU = mysqli_query($connMedical, "SELECT * FROM cliente where tipo_cliente not in ('CC','RC','TI')");
    while ($rowListaU = mysqli_fetch_array($queryU)) {
        $ArregloCliente[] = $rowListaU['cliente_id'];
    }
}




/*
if($entidadSalud==0){
   $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where fecha BETWEEN '$desde' and '$hasta'"); 
}
*/
/*
else {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where (fecha BETWEEN '$desde' and '$hasta') AND entidad_id=$entidadSalud"); 
}
*/

foreach ($ArregloCliente as $key => $value) {


    if ($doctor == 0) {
        $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and fecha BETWEEN '$desde' and '$hasta' ");
    } else {
        $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and (fecha BETWEEN '$desde' and '$hasta') AND usuario_id=$doctor");

        // echo "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and (fecha BETWEEN '$desde' and '$hasta') AND usuario_id=$doctor";
    }


    $desde1 = date("d/m/Y", strtotime($desde));
    $hasta1 = date("d/m/Y", strtotime($hasta));

    $fechaRemision1 = date("d/m/Y", strtotime($fechaRemision));

   // $nrow = mysqli_num_rows($queryListaH);
    while ($rowListaH = mysqli_fetch_array($queryListaH)) {
        
        $Fecha_Expedicion_Factura = $rowListaH["Fecha_Expedicion_Factura"];

        $historia = $rowListaH["historia_id"];
        $ID_factura = funcionMaster($historia, 'id', 'idFactura', 'Historia_Clinica');

 

$cliente_id = $rowListaH["cliente_id"];
        if ($Numero_Factura == '') {

            $factura = funcionMaster($cliente_id, 'idCliente', 'numeroDoc', 'sOperacionInv');
            $Valor_Neto = funcionMaster($factura, 'numeroDoc', 'totalNeto', 'sOperacionInv');
        } else {
            $factura = $Numero_Factura;
            $Valor_Neto = funcionMaster($factura, 'numeroDoc', 'totalNeto', 'sOperacionInv');
        }


        if ($Valor_Neto == '') {
            $Valor_Neto = 0;
        }



        $Codigo_Entidad_Administradora = $rowListaH["Codigo_Entidad_Administradora"];
        $Nombre_Entidad_Administradora = $rowListaH["Nombre_Entidad_Administradora"];
        $Numero_Contrato = $rowListaH["Numero_Contrato"];
        $Plan_Beneficios = $rowListaH["Plan_Beneficios"];
        $Numero_Poliza = $rowListaH["Numero_Poliza"];
        $Copago = $rowListaH["Copago"];
        $Valor_Comision = $rowListaH["Valor_Comision"];
        $Valor_Descuentos = $rowListaH["Valor_Descuentos"];
        $Valor_Pago_Entidad = $rowListaH["Valor_Pago_Entidad"];




        echo "$codigoPrestador,$NOMBRE_USUARIO,CC,$nit,$factura,$fechaRemision1,$desde1,$hasta1,$cod_entidad,$entidadSalud,,,,0.00,0.00,0.00,$Valor_Neto" . "\n";

        $cantidadRegistros = $cantidadRegistros + 1;
    }
}

$fechaHoy = date("Y-m-d");


$QueryRipControl = mysqli_query($connMedical, "SELECT count(ID) as cuantos,ID FROM  informacion_rips2 where 
    usuario_id='$doctor' and
    Fecha='$fechaHoy' and
    nombrePrestador='$NOMBRE_USUARIO' and
    codigoPrestador='$codigoPrestador' and
    TipoId='CC' and
    numeroId='$nit' and
    fechaRemision='$fechaRemision' and
    codArchivo='AC' and
    paciente='$paciente' and
    convenio='$convenio' and

    codigoEntidad='$entidadSalud';");
while ($rowListaZ = mysqli_fetch_array($QueryRipControl)) {
    $existe = $rowListaZ['cuantos'];
    $id_rips = $rowListaZ['ID'];
}

if ($existe == 0) {
    mysqli_query($connMedical, "INSERT into informacion_rips2 
        (usuario_id, Fecha, nombrePrestador, codigoPrestador, TipoId, numeroId, fechaRemision, codArchivo, totalRegistros, codigoEntidad, paciente, convenio)
        values
        ('$doctor','$fechaHoy','$NOMBRE_USUARIO','$codigoPrestador','CC','$nit','$fechaRemision','AC','$cantidadRegistros','$entidadSalud' , '$paciente' , '$convenio');");

mysqli_query($connMedical, "UPDATE  usuarios set
factura='$factura', mes ='$mesactual'  where  ID='$doctor'  ");

} elseif ($existe > 0) {
    mysqli_query($connMedical, "UPDATE  informacion_rips2 set
    usuario_id='$doctor' ,
    Fecha='$fechaHoy' ,
    nombrePrestador='$NOMBRE_USUARIO' ,
    codigoPrestador='$codigoPrestador' ,
    TipoId='CC' ,
    numeroId='$nit' ,
    fechaRemision='$fechaRemision' ,
    codArchivo='AC' ,
    paciente='$paciente',
    convenio='$convenio',
    totalRegistros='$cantidadRegistros' ,
    codigoEntidad='$entidadSalud'
    where ID='$id_rips';");
}
