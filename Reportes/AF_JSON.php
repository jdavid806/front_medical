<?php
// header('Content-Type: application/json');
// header('Content-Disposition: attachment; filename="Reporte_AF.json"');
include "../funciones/conn3.php";
//include 'funciones/funciones.php';

function funcionMaster($filtro, $campoFiltrar, $campoImprimir, $tabla)
    {
        include "../funciones/conn3.php";
        $query = mysqli_query($connMedical, "SELECT * FROM $tabla where $campoFiltrar = '$filtro'");
        $nrowl = mysqli_num_rows($query);
        while ($row = mysqli_fetch_array($query)) {

            $text = $row[$campoImprimir];
        }
        return  $text;
    }
$desde = $_POST['desde'];
$hasta = $_POST['hasta'];
$factura= $_POST['factura'];
$num_contrato= $_POST['contrato'];

//$entidadSalud = $_POST['entidadSalud'];
$fechaRemision = $_POST['fechaRemision'];

$tipoUsuario = $_POST['tipoUsuario'];

 $convenio = $_POST['convenio'];

function reem1($texto1) 
{

//Rememplazamos caracteres especiales latinos minusculas
$find = array('á', 'é', 'í', 'ó', 'ú', 'ñ', '\"', '€', 'ü');
//$repl = array('&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', 'n', '&quot;', '&euro;', '&uuml;');
$repl = array('a', 'e', 'i', 'o', 'u', 'n', ' ', ' ', 'u');
$texto1 = str_replace ($find, $repl, $texto1);


//Rememplazamos caracteres especiales latinos mayusculas
$find = array('Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ', 'Ü');
//$repl = array('&Aacute;', '&Eacute;', '&Iacute;', '&Oacute;', '&Uacute;', 'N', '&Uuml;', '&ccedil;', '&Ccedil;');
$repl = array('A', 'E', 'I;', 'O', 'U', 'N', 'U');
$texto1 = str_replace ($find, $repl, $texto1);

return $texto1;

}  
 
 

  if ($convenio > 0) {
  $where = 'and convenio_id = '. $convenio.' ';
} else {
  $where = '';
}

$data = array();


$queryE = mysqli_query($connMedical, "SELECT * FROM Rips_Convenio where id='$convenio'");

$nrowE = mysqli_num_rows($queryE);
while ($rowListaE = mysqli_fetch_array($queryE)) {
    $entidadSalud = $rowListaE['codigo'];
    $entidadSaludN = $rowListaE['Nombre'];
    //$copago = $rowListaE['Copago'];
    //$consulta = $rowListaE['Consulta'];
   // $neto = $rowListaE['Valor_Empresa'];
    $total = $rowListaE['fe_valor_convenio'];
    $contrato = $rowListaE['Tipo_Contrato'];

}



$entidadSalud= funcionMaster($tipoUsuario,'id', 'Codigo' ,'Rips_Entidades');
$entidadSaludN= funcionMaster($tipoUsuario,'id', 'Nombre' ,'Rips_Entidades');


if ($tipoUsuario == 0)
 { $entidadSalud ='SDS001';
$entidadSaludN= 'PARTICULAR';

$whereentidad = '(entidad_id = '.$tipoUsuario. ' or entidad_id = "" or entidad_id = "NULL")';
}else{
    $whereentidad = 'entidad_id = '.$tipoUsuario.'';
}



$paciente =  $_POST['paciente'];


$cantidadRegistros = 0;
$fechaHoy = date("Y-m-d");
// consulta para datos de usuario rips

$doctor = $_POST['doctor'];

$queryU = mysqli_query($connMedical, "SELECT * FROM usuarios where ID=$doctor");
$nrowU = mysqli_num_rows($queryU);
while ($rowListaU = mysqli_fetch_array($queryU)) {
    $NOMBRE_USUARIO = reem1($rowListaU['NOMBRE_USUARIO']);
    $NOMBRE_USUARIO = trim($NOMBRE_USUARIO, " ");
    $codigoPrestador = $rowListaU['codigoPrestador'];
    $nit = $rowListaU['nit'];
    //$factura=$rowListaU['factura'];
}




if($paciente == '1'){

    $queryU = mysqli_query($connMedical, "SELECT * FROM cliente where tipo_cliente in ('CC','RC','TI') ");
    while($rowListaU=mysqli_fetch_array($queryU))
    {
        $ArregloCliente[] = $rowListaU['cliente_id'];
    }

}else if($paciente == '0'){
    
    $queryU = mysqli_query($connMedical, "SELECT * FROM cliente where tipo_cliente not in ('CC','RC','TI') ");
    while($rowListaU=mysqli_fetch_array($queryU))
    {
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
$Valor_Cuota=0;
$ValorNeto=0; 
foreach ($ArregloCliente as $key => $value) {


if ($doctor == 0) {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59' ");
}
else {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and (Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor");

    //echo "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and (Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor";
}


$desde1 = date("d/m/Y", strtotime($desde));
$hasta1 = date("d/m/Y", strtotime($hasta));

$fechaRemision1 = date("d/m/Y", strtotime($fechaRemision));

$data = array();
while ($rowListaH = mysqli_fetch_array($queryListaH)){

    $cliente_id = $rowListaH["cliente_id"];
       // $Numero_Factura = $rowListaH["Numero_Factura"];
        
            $queryultimo = mysqli_query($connMedical, "SELECT numeroDoc FROM sOperacionInv where idCliente='$cliente_id'  ORDER BY numeroDoc DESC LIMIT 1");
            while ($rowultimo = mysqli_fetch_array($queryultimo)) {
                $factura1 = $rowultimo['numeroDoc'];
            }
          
        
            $Valor_Neto =funcionMaster($factura1, 'numeroDoc', 'totalNeto', 'sOperacionInv');
            $Valor_R =funcionMaster($factura1, 'numeroDoc', 'montoPagado', 'sOperacionInv');
        
            $Valor_R = $Valor_R - $Valor_Neto;
    $Numero_Factura = $rowListaH["Numero_Factura"];
    $Fecha_Expedicion_Factura = $rowListaH["Fecha_Expedicion_Factura"];


    $Codigo_Entidad_Administradora = $rowListaH["Codigo_Entidad_Administradora"];
    $Nombre_Entidad_Administradora = reem1($rowListaH["Nombre_Entidad_Administradora"]);
    $Numero_Contrato = $rowListaH["Numero_Contrato"];
    $Plan_Beneficios = $rowListaH["Plan_Beneficios"];
    $Numero_Poliza = $rowListaH["Numero_Poliza"];
//    $Valor_Consulta = $rowListaH["Valor_Consulta"];
//     $Valor_Cuota_Moderadora = $rowListaH["Valor_Cuota_Moderadora"];
//     if($Valor_Cuota_Moderadora == ""){
//         $Valor_Cuota_Moderadora = 0;
//     }
   // $Valor_Neto = $rowListaH["Valor_Neto"];

    $total_Convenio = $rowListaH["total_Convenio"];

    $Valor_Cuota = $Valor_Cuota + $Valor_Cuota_Moderadora;
     //$ValorNeto+=$Valor_Neto;

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
    $queryListaCliente = mysqli_query($connMedical, "SELECT * FROM cliente where cliente_id = '$cliente_id'");
    while ($rowListaC = mysqli_fetch_array($queryListaCliente)){


        $tipoUsuarioSistema = $rowListaC["entidad_id"];

        


    }


 
    
    if ($contrato == 4) {
    $data = array(
        "codigo Prestador" => $codigoPrestador,
        "Nobre Usuario" => $NOMBRE_USUARIO,
        "CC" => $nit,
        "Factura" => $factura,
        "Fecha Remision" => $fechaRemision1,
        "Desde" => $desde1,
        "Hasta" => $hasta1,
        "Entidad Salud" => $entidadSalud,
        "Entidad Salud Nombre" => $entidadSaludN,
        "Contrato" => $num_contrato,
        "Plan" => $Plan_Beneficios,
        "Poliza" => $Numero_Poliza,
        "Valor Consulta" => $Valor_Consulta,
        "Valor Cuota" => $Valor_Cuota_Moderadora,
        "Valor Neto" => $Valor_Neto
    );
    $dataArray[] = $data;
     //echo "$codigoPrestador,$NOMBRE_USUARIO,CC,$nit,$factura,$fechaRemision1,$desde1,$hasta1,$entidadSalud,$entidadSaludN,$num_contrato,,,$Valor_Cuota_Moderadora,0,0,$Valor_Neto" . "\n";
    
   
    $cantidadRegistros = $cantidadRegistros + 1;
  }
} }

if ($contrato == 1) {
    $data = array(
        "codigo Prestador" => $codigoPrestador,
        "Nobre Usuario" => $NOMBRE_USUARIO,
        "CC" => $nit,
        "Factura" => $factura,
        "Fecha Remision" => $fechaRemision1,
        "Desde" => $desde1,
        "Hasta" => $hasta1,
        "Entidad Salud" => $entidadSalud,
        "Entidad Salud Nombre" => $entidadSaludN,
        "Contrato" => $num_contrato,
        "Plan" => $Plan_Beneficios,
        "Poliza" => $Numero_Poliza,
        "Valor Consulta" => $Valor_Consulta,
        "Valor Cuota" => $Valor_Cuota,
        "Valor Neto" => $Valor_Neto
    );
    $dataArray[] = $data;
     //echo "$codigoPrestador,$NOMBRE_USUARIO,CC,$nit,$factura,$fechaRemision1,$desde1,$hasta1,$entidadSalud,$entidadSaludN,$num_contrato,,,$Valor_Cuota,0,0,$total" . "\n";

 $cantidadRegistros = 1; 
}else{
    $data = array(
        "codigo Prestador" => $codigoPrestador,
        "Nobre Usuario" => $NOMBRE_USUARIO,
        "CC" => $nit,
        "Factura" => $factura,
        "Fecha Remision" => $fechaRemision1,
        "Desde" => $desde1,
        "Hasta" => $hasta1,
        "Entidad Salud" => $entidadSalud,
        "Entidad Salud Nombre" => $entidadSaludN,
        "Contrato" => $num_contrato,
        "Plan" => $Plan_Beneficios,
        "Poliza" => $Numero_Poliza,
        "Valor Consulta" => $Valor_Consulta,
        "Valor Cuota" => $Valor_Cuota,
        "Valor Neto" => $Valor_Neto
    );
    $dataArray[] = $data;
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
    codArchivo='AF' and
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
        ('$doctor','$fechaHoy','$NOMBRE_USUARIO','$codigoPrestador','CC','$nit','$fechaRemision','AF','$cantidadRegistros','$entidadSalud' , '$paciente' , '$convenio');");
} elseif ($existe > 0) {
    mysqli_query($connMedical, "UPDATE  informacion_rips2 set
    usuario_id='$doctor' ,
    Fecha='$fechaHoy' ,
    nombrePrestador='$NOMBRE_USUARIO' ,
    codigoPrestador='$codigoPrestador' ,
    TipoId='CC' ,
    numeroId='$nit' ,
    fechaRemision='$fechaRemision' ,
    codArchivo='AF' ,
    paciente='$paciente',
    convenio='$convenio',
    totalRegistros='$cantidadRegistros' ,
    codigoEntidad='$entidadSalud'
    where ID='$id_rips';");
}
$jsonData = json_encode($dataArray, JSON_PRETTY_PRINT);
echo $jsonData;
