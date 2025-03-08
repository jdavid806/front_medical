<?php
// header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
// header('Content-Disposition: attachment; filename=RipsAF.xml');
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

/*

$queryE = mysqli_query($connMedical, "SELECT * FROM FE_Entidades where id='$tipoUsuario'");
$nrowE = mysqli_num_rows($queryE);
while ($rowListaE = mysqli_fetch_array($queryE)) {
    $entidadSalud = $rowListaE['codigo'];
    $entidadSaludN = $rowListaE['Nombre'];
    $copago = $rowListaE['fe_copago'];
    $consulta = $rowListaE['fe_consulta'];
    $neto = $rowListaE['fe_Neto'];
   
}

 */



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

    $queryU=mysqli_query($connMedical,"SELECT * FROM cliente where (tipo_cliente = 'CC' OR tipo_cliente = 'TI' OR tipo_cliente = 'RC')");
    while($rowListaU=mysqli_fetch_array($queryU))
    {
        $ArregloCliente[] = $rowListaU['cliente_id'];
    }

}else if($paciente == '0'){
    
    $queryU=mysqli_query($connMedical,"SELECT * FROM cliente where (tipo_cliente = 'CC' OR tipo_cliente = 'TI' OR tipo_cliente = 'RC')");
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

foreach ($ArregloCliente as $key => $value) {


if ($doctor == 0) {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59' ");
}
else {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and (Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor");

   // echo "SELECT * FROM Rips_Informacion where cliente_id = '{$value}'  and (fecha BETWEEN '$desde' and '$hasta') AND usuario_id=$doctor";
}


$desde1 = date("d/m/Y", strtotime($desde));
$hasta1 = date("d/m/Y", strtotime($hasta));

$fechaRemision1 = date("d/m/Y", strtotime($fechaRemision));

$Valor_Cuota=0;
$ValorNeto=0; 

$nrow = mysqli_num_rows($queryListaH);
while ($rowListaH = mysqli_fetch_array($queryListaH)){
    $Numero_Factura = $rowListaH["Numero_Factura"];
    $Fecha_Expedicion_Factura = $rowListaH["Fecha_Expedicion_Factura"];


    $Codigo_Entidad_Administradora = $rowListaH["Codigo_Entidad_Administradora"];
    $Nombre_Entidad_Administradora = reem1($rowListaH["Nombre_Entidad_Administradora"]);
    $Numero_Contrato = $rowListaH["Numero_Contrato"];
    $Plan_Beneficios = $rowListaH["Plan_Beneficios"];
    $Numero_Poliza = $rowListaH["Numero_Poliza"];
   $Valor_Consulta = $rowListaH["Valor_Consulta"];
    $Valor_Cuota_Moderadora = $rowListaH["Valor_Cuota_Moderadora"];
    if($Valor_Cuota_Moderadora == ""){
        $Valor_Cuota_Moderadora = 0;
    }
    $Valor_Neto = $rowListaH["Valor_Neto"];

    $total_Convenio = $rowListaH["total_Convenio"];

    $Valor_Cuota = $Valor_Cuota + $Valor_Cuota_Moderadora;
    //$ValorNeto+=$Valor_Neto;

    $cliente_id = $rowListaH["cliente_id"];
    $queryListaCliente = mysqli_query($connMedical, "SELECT * FROM cliente where cliente_id = '$cliente_id'");
    while ($rowListaC = mysqli_fetch_array($queryListaCliente)){


        $tipoUsuarioSistema = $rowListaC["entidad_id"];

        


    }



    if($contrato == 4) {

    //echo "$codigoPrestador,$NOMBRE_USUARIO,CC,$nit,$factura,$fechaRemision1,$desde1,$hasta1,$entidadSalud,$entidadSaludN,$num_contrato,,,$Valor_Cuota_Moderadora,0,0,$Valor_Neto" . "\n";    
   
    $cantidadRegistros = $cantidadRegistros + 1;  
    
        /*
    <td>Código del prestador de servicios de salud</td>
        <td>Razon social o apellidos y nombre del prestador de servicios de salud</td>
        <td>Tipo de identificacion del prestador de servicios de salud </td>
        <td>Numero de identificacion del prestador </td>
        <td>Numero de la factura</td>
        <td>Fecha de expedicion de la factura</td>
        <td>Fecha de inicio </td>
        <td>Fecha final </td>
        <td>Codigo entidad administradora</td>
        <td>Nombre entidad administradora</td>
        <td>Numero del contrato</td>
        <td>Plan de beneficios</td>
        <td>Numero de la poliza</td>
        <td>Valor total del pago compartido(copago)</td>
        <td>Valor de la comision</td>
        <td>Valor total de descuentos</td>
        <td>Valor neto a pagar por la entidad contratante</td>
    */

    $Arreglo[$cantidadRegistros]["Codigo_Prestador"] = $codigoPrestador;
    $Arreglo[$cantidadRegistros]["Razon_Social"] = $NOMBRE_USUARIO;
    $Arreglo[$cantidadRegistros]["Tipo_Identificacion"] = "CC";
    $Arreglo[$cantidadRegistros]["Numero_Identificacion"] = $nit;
    $Arreglo[$cantidadRegistros]["Numero_Factura"] = $factura;
    $Arreglo[$cantidadRegistros]["Fecha_Expedicion_Factura"] = $fechaRemision1;
    $Arreglo[$cantidadRegistros]["Fecha_Inicio"] = $desde1;
    $Arreglo[$cantidadRegistros]["Fecha_Final"] = $hasta1;
    $Arreglo[$cantidadRegistros]["Codigo_Entidad_Administradora"] = $entidadSalud;
    $Arreglo[$cantidadRegistros]["Nombre_Entidad_Administradora"] = $entidadSaludN;
    $Arreglo[$cantidadRegistros]["Numero_Contrato"] = $num_contrato;
    $Arreglo[$cantidadRegistros]["Plan_Beneficios"] = "";
    $Arreglo[$cantidadRegistros]["Numero_Poliza"] = "";
    $Arreglo[$cantidadRegistros]["Valor_Copago"] = $Valor_Cuota_Moderadora;
    $Arreglo[$cantidadRegistros]["Valor_Comision"] = "0";
    $Arreglo[$cantidadRegistros]["Valor_Descuentos"] = "0";
    $Arreglo[$cantidadRegistros]["Valor_Neto"] = $Valor_Neto;

    }
} }

 if($contrato == 1) { //echo "$codigoPrestador,$NOMBRE_USUARIO,CC,$nit,$factura,$fechaRemision1,$desde1,$hasta1,$entidadSalud,$entidadSaludN,$num_contrato,,,$Valor_Cuota,0,0,$total" . "\n";

 $cantidadRegistros = 1; 

 /*
    <td>Código del prestador de servicios de salud</td>
        <td>Razon social o apellidos y nombre del prestador de servicios de salud</td>
        <td>Tipo de identificacion del prestador de servicios de salud </td>
        <td>Numero de identificacion del prestador </td>
        <td>Numero de la factura</td>
        <td>Fecha de expedicion de la factura</td>
        <td>Fecha de inicio </td>
        <td>Fecha final </td>
        <td>Codigo entidad administradora</td>
        <td>Nombre entidad administradora</td>
        <td>Numero del contrato</td>
        <td>Plan de beneficios</td>
        <td>Numero de la poliza</td>
        <td>Valor total del pago compartido(copago)</td>
        <td>Valor de la comision</td>
        <td>Valor total de descuentos</td>
        <td>Valor neto a pagar por la entidad contratante</td>
    */

    $Arreglo[$cantidadRegistros]["Codigo_Prestador"] = $codigoPrestador;
    $Arreglo[$cantidadRegistros]["Razon_Social"] = $NOMBRE_USUARIO;
    $Arreglo[$cantidadRegistros]["Tipo_Identificacion"] = "CC";
    $Arreglo[$cantidadRegistros]["Numero_Identificacion"] = $nit;
    $Arreglo[$cantidadRegistros]["Numero_Factura"] = $factura;
    $Arreglo[$cantidadRegistros]["Fecha_Expedicion_Factura"] = $fechaRemision1;
    $Arreglo[$cantidadRegistros]["Fecha_Inicio"] = $desde1;
    $Arreglo[$cantidadRegistros]["Fecha_Final"] = $hasta1;
    $Arreglo[$cantidadRegistros]["Codigo_Entidad_Administradora"] = $entidadSalud;
    $Arreglo[$cantidadRegistros]["Nombre_Entidad_Administradora"] = $entidadSaludN;
    $Arreglo[$cantidadRegistros]["Numero_Contrato"] = $num_contrato;
    $Arreglo[$cantidadRegistros]["Plan_Beneficios"] = "";
    $Arreglo[$cantidadRegistros]["Numero_Poliza"] = "";
    $Arreglo[$cantidadRegistros]["Valor_Copago"] = $Valor_Cuota;
    $Arreglo[$cantidadRegistros]["Valor_Comision"] = "0";
    $Arreglo[$cantidadRegistros]["Valor_Descuentos"] = "0";
    $Arreglo[$cantidadRegistros]["Valor_Neto"] = $total;


}else{
    $cantidadRegistros = 1; 

 /*
    <td>Código del prestador de servicios de salud</td>
        <td>Razon social o apellidos y nombre del prestador de servicios de salud</td>
        <td>Tipo de identificacion del prestador de servicios de salud </td>
        <td>Numero de identificacion del prestador </td>
        <td>Numero de la factura</td>
        <td>Fecha de expedicion de la factura</td>
        <td>Fecha de inicio </td>
        <td>Fecha final </td>
        <td>Codigo entidad administradora</td>
        <td>Nombre entidad administradora</td>
        <td>Numero del contrato</td>
        <td>Plan de beneficios</td>
        <td>Numero de la poliza</td>
        <td>Valor total del pago compartido(copago)</td>
        <td>Valor de la comision</td>
        <td>Valor total de descuentos</td>
        <td>Valor neto a pagar por la entidad contratante</td>
    */

    $Arreglo[$cantidadRegistros]["Codigo_Prestador"] = $codigoPrestador;
    $Arreglo[$cantidadRegistros]["Razon_Social"] = $NOMBRE_USUARIO;
    $Arreglo[$cantidadRegistros]["Tipo_Identificacion"] = "CC";
    $Arreglo[$cantidadRegistros]["Numero_Identificacion"] = $nit;
    $Arreglo[$cantidadRegistros]["Numero_Factura"] = $factura;
    $Arreglo[$cantidadRegistros]["Fecha_Expedicion_Factura"] = $fechaRemision1;
    $Arreglo[$cantidadRegistros]["Fecha_Inicio"] = $desde1;
    $Arreglo[$cantidadRegistros]["Fecha_Final"] = $hasta1;
    $Arreglo[$cantidadRegistros]["Codigo_Entidad_Administradora"] = $entidadSalud;
    $Arreglo[$cantidadRegistros]["Nombre_Entidad_Administradora"] = $entidadSaludN;
    $Arreglo[$cantidadRegistros]["Numero_Contrato"] = $num_contrato;
    $Arreglo[$cantidadRegistros]["Plan_Beneficios"] = "";
    $Arreglo[$cantidadRegistros]["Numero_Poliza"] = "";
    $Arreglo[$cantidadRegistros]["Valor_Copago"] = $Valor_Cuota;
    $Arreglo[$cantidadRegistros]["Valor_Comision"] = "0";
    $Arreglo[$cantidadRegistros]["Valor_Descuentos"] = "0";
    $Arreglo[$cantidadRegistros]["Valor_Neto"] = $total;
}




$data = $Arreglo;

$xml = new SimpleXMLElement('<AF/>');


function array_to_xml($data, &$xml_data) {
    foreach($data as $key => $value) {
        if(is_array($value)) {
            if(is_numeric($key)){
                $key = 'U'.$key; 
            }
            $subnode = $xml_data->addChild($key);
            array_to_xml($value, $subnode);
        } else {
           
            if($value == ""){
                $value = " ";
            }
            $xml_data->addChild("$key", htmlspecialchars("$value"));
        }
    }
}


array_to_xml($data, $xml);

$dom = dom_import_simplexml($xml)->ownerDocument;
$dom->formatOutput = true;

// Imprimir el XML
echo $dom->saveXML();


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
?>