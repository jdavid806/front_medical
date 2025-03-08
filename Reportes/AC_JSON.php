<?php
// header('Content-Type: application/json');
// header('Content-Disposition: attachment; filename=RipsAC.json');
include "../funciones/conn3.php";
//include 'funciones/funciones.php';

$desde = $_POST['desde'];
$hasta = $_POST['hasta'];
$factura= $_POST['factura'];
$contrato= $_POST['contrato'];

//$entidadSalud = $_POST['entidadSalud'];
$fechaRemision = $_POST['fechaRemision'];

$tipoUsuario = $_POST['tipoUsuario'];

 $convenio = $_POST['convenio'];
 

  if ($convenio > 0) {
  $where = 'and  convenio_id = '. $convenio. ' ';
} else {
  $where = '';
}




$queryE = mysqli_query($connMedical, "SELECT * FROM Rips_Entidades where id='$tipoUsuario'");

$nrowE = mysqli_num_rows($queryE);
while ($rowListaE = mysqli_fetch_array($queryE)) {
    $entidadSalud = $rowListaE['Codigo'];
    $entidadSaludN = $rowListaE['Nombre'];
    

}


if ($tipoUsuario == 0)
 { $entidadSalud ='SDS001';
$entidadSaludN= 'PARTICULAR';

} 

$cantidadRegistros = 0;
$fechaHoy = date("Y-m-d");
// consulta para datos de usuario rips

$doctor = $_POST['doctor'];
$paciente =  $_POST['paciente'];



if($paciente == '1'){

    $queryU=mysqli_query($connMedical,"SELECT * FROM cliente where (tipo_cliente = 'CC' OR tipo_cliente = 'TI' OR tipo_cliente = 'RC')");
 
    while($rowListaU=mysqli_fetch_array($queryU))
    {
        $ArregloCliente[] = $rowListaU['cliente_id'];
    }

}else if($paciente == '0'){
    
    $queryU=mysqli_query($connMedical,"SELECT * FROM cliente where tipo_cliente not in ('CC','RC','TI') ");
    while($rowListaU=mysqli_fetch_array($queryU))
    {
        $ArregloCliente[] = $rowListaU['cliente_id'];
    }
}

$queryU = mysqli_query($connMedical, "SELECT * FROM usuarios where ID='$doctor'");
$nrowU = mysqli_num_rows($queryU);
while ($rowListaU = mysqli_fetch_array($queryU)) {
    $NOMBRE_USUARIO = $rowListaU['NOMBRE_USUARIO'];
    $codigoPrestador = $rowListaU['codigoPrestador'];
    $nit = $rowListaU['nit'];
    //$factura=$rowListaU['factura'];
    //$factura= $factura1+1;
    $mes=$rowListaU['mes'];
}

//sacar el mes de la fecha hasta
$mesHasta=explode("-",$hasta);
$mesactual=$mesHasta[1];



//if($mesactual==$mes){$factura=$factura;} else {$factura=$factura+1;}

/*
if ($entidadSalud == 0) {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where fecha BETWEEN '$desde' and '$hasta' AND Nombre_Historia='Historia_Clinica'");
}
*/
//$doctor = $_POST['doctor'];


$dataArray = array();
foreach ($ArregloCliente as $key => $value) {



if ($doctor == 0) {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59'");
   // ECHO "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59'";
}
else {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where (Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor and  cliente_id = '{$value}' ");
//echo "SELECT * FROM Rips_Informacion where (Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor and  cliente_id = '{$value}' ";
}

/*else {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where (fecha BETWEEN '$desde' and '$hasta') AND entidad_id=$entidadSalud");
}*/

$nrow = mysqli_num_rows($queryListaH);
while ($rowListaH = mysqli_fetch_array($queryListaH)) {
    $Numero_Factura = $rowListaH["Numero_Factura"];
    
    $Tipo_Identificacion = $rowListaH["Tipo_Identificacion"];
    $Numero_Identificacion = $rowListaH["Numero_Identificacion"];

    $Fecha = $rowListaH["Fecha"];
    $FechaX = explode(" ", $Fecha);
    $Fecha = $FechaX[0];
    //cambiar - por / en la fecha
    $Fecha1 = str_replace("-", "/", $Fecha);
    //cambiar formato a dia mes año
    $Fecha1 = date("d/m/Y", strtotime($Fecha1));

    $Numero_Autorizacion = $rowListaH["Numero_Autorizacion"];
    $Tipo_Consulta = $rowListaH["Tipo_Consulta"];
    //quitarle los puntos a $Tipo_Consulta
    $Tipo_Consulta = str_replace(".", "", $Tipo_Consulta);
    $historia = $rowListaH["historia_id"];
   //$factura= funcionMaster($historia, 'id', 'idFactura', 'Historia_Clinica');
    $Finalidad_Consulta = $rowListaH["Finalidad_Consulta"];
    $Causa_Externa = $rowListaH["Causa_Externa"];
    $CIE10_1 = $rowListaH["CIE10_1"];
    $CIE10_2 = $rowListaH["CIE10_2"];
    $CIE10_3 = $rowListaH["CIE10_3"];
    $CIE10_4 = $rowListaH["CIE10_4"];
    $Tipo_Diagnostico = $rowListaH["Tipo_Diagnostico"];
    ////// campos cuando facturan rips
    $Valor_Consulta = $rowListaH["Valor_Consulta"];
    $Valor_Cuota_Moderadora = $rowListaH["Valor_Cuota_Moderadora"];
    $Valor_Neto = $rowListaH["Valor_Neto"];

    $cliente_id = $rowListaH["cliente_id"];
    $queryListaCliente = mysqli_query($connMedical, "SELECT * FROM cliente where cliente_id = '$cliente_id'");
    while ($rowListaC = mysqli_fetch_array($queryListaCliente)){
        $tipoUsuarioSistema = $rowListaC["entidad_id"];

       
    }
    
  //if($tipoUsuario==$tipoUsuarioSistema){
    $data = array(
        "Factura" => $Numero_Factura,
        "CodigoPrestador" => $codigoPrestador,
        "Tipo Identificacion" => $Tipo_Identificacion,
        "Numero Identificacion" => $Numero_Identificacion,
        "fecha 1" => $Fecha1,
        "Numero Autorizacion" => $Numero_Autorizacion,
        "Tipo Consulta" => $Tipo_Consulta,
        "Finalidad Consulta" => $Finalidad_Consulta,
        "Causa Externa" => $Causa_Externa,
        "CIE10 1" => $CIE10_1,
        "CIE10 2" => $CIE10_2,
        "CIE10 3" => $CIE10_3,
        "CIE10 4" => $CIE10_4,
        "Tipo Diagnostico" => $Tipo_Diagnostico,
        "Valor Consulta" => $Valor_Consulta,
        "Valor Cuota Moderadora" => $Valor_Cuota_Moderadora,
        "Valor Neto" => $Valor_Neto
    );
    
    $dataArray[] = $data;

    // echo "$factura,$codigoPrestador,$Tipo_Identificacion,$Numero_Identificacion,$Fecha1,$Numero_Autorizacion,$Tipo_Consulta,$Finalidad_Consulta,$Causa_Externa,$CIE10_1,$CIE10_2,$CIE10_3,$CIE10_4,$Tipo_Diagnostico,$Valor_Consulta,$Valor_Cuota_Moderadora,$Valor_Neto"."\n";

    $cantidadRegistros = $cantidadRegistros + 1;
    //} 



} }
$jsonData = json_encode($dataArray, JSON_PRETTY_PRINT);
echo $jsonData;
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

?>