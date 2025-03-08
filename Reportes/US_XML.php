<?php

header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
header('Content-Disposition: attachment; filename=RipsUS.xml');
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


$desde = $_POST['desde'];
$hasta = $_POST['hasta'];

//$doctor = $_POST['doctor'];
$fechaRemision = $_POST['fechaRemision'];
$tipoUsuario = $_POST['tipoUsuario'];
  $paciente = $_POST['paciente'];
  $convenio = $_POST['convenio'];
 

  if ($convenio > 0) {
  $where = 'and  convenio_id = '. $convenio. ' ';
} else {
  $where = '';
}


if ($tipoUsuario == 0)
 { $entidadSalud ='SDS001';
$entidadSaludN= 'PARTICULAR';

} else {
$entidadSalud= funcionMaster($tipoUsuario,'id', 'Codigo' ,'Rips_Entidades');
$entidadSaludN= funcionMaster($tipoUsuario,'id', 'Nombre' ,'Rips_Entidades');
}

$cantidadRegistros = 0;
$fechaHoy = date("Y-m-d");
// consulta para datos de usuario rips
$doctor = $_POST['doctor'];

$queryU = mysqli_query($connMedical, "SELECT * FROM usuarios where ID='$doctor'");
$nrowU = mysqli_num_rows($queryU);
while ($rowListaU = mysqli_fetch_array($queryU)) {
    $NOMBRE_USUARIO = $rowListaU['NOMBRE_USUARIO'];
    $codigoPrestador = $rowListaU['codigoPrestador'];
    $nit = $rowListaU['nit'];
}

//$doctor = $_POST['doctor'];
if ($doctor == 0) {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59'");
    //echo "SELECT * FROM Rips_Informacion where fecha BETWEEN '$desde' and '$hasta'";
}
else {
    $queryListaH = mysqli_query($connMedical, "SELECT * FROM Rips_Informacion where (Fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor");
 // echo "SELECT * FROM Rips_Informacion where (fecha BETWEEN '$desde 00:00:00' and '$hasta 23:59:59') AND usuario_id=$doctor";
}



$nrow = mysqli_num_rows($queryListaH);
while ($rowListaH = mysqli_fetch_array($queryListaH)) {
    
    $arregloCliente[$rowListaH["cliente_id"]] = $arregloCliente[$rowListaH["cliente_id"]]+1;
}

foreach ($arregloCliente as $key => $value) {



 if($paciente == 1) {

    
    $queryListaW = mysqli_query($connMedical, "SELECT * FROM cliente where cliente_id = '$key'  and  (tipo_cliente = 'CC' OR tipo_cliente = 'TI' OR tipo_cliente = 'RC') ");
  //echo  "SELECT * FROM cliente where cliente_id = '$key'  and  (tipo_cliente = 'CC' OR tipo_cliente = 'TI' OR tipo_cliente = 'RC') and fe_entidad_id='$tipoUsuario'";
}

    else  {
    $queryListW = mysqli_query($connMedical, "SELECT * FROM  cliente where cliente_id='$key' and  (tipo_cliente <> 'CC' and  tipo_cliente <> 'TI' and tipo_cliente <> 'RC')  "); 
  //echo  "SELECT * FROM  cliente where cliente_id='$value' and  (tipo_cliente <> 'CC' and  tipo_cliente <> 'TI' and tipo_cliente <> 'RC')";

}


    while ($rowListaW = mysqli_fetch_array($queryListaW)) {
        $Tipo_Identificacion = $rowListaW["tipo_cliente"];
        $Numero_Identificacion = $rowListaW["CODI_CLIENTE"];

        $Codigo_Entidad_Administradora = "SDS001";
        $Tipo_Usuario = $rowListaW["tipoUsuario"];
        // tipo usuario cambiar a 1 = Contributivo , 2 = Subsidiado ,3 = Vinculado , 4 = Particular , 5 = Otro
        if ($Tipo_Usuario == "Contributivo") {
            $Tipo_Usuario = 1;
        } elseif ($Tipo_Usuario == "Subsidiado") {
            $Tipo_Usuario = 2;
        } elseif ($Tipo_Usuario == "Vinculado") {
            $Tipo_Usuario = 3;
        } elseif ($Tipo_Usuario == "Particular") {
            $Tipo_Usuario = 4;
        } elseif ($Tipo_Usuario == "Otro") {
            $Tipo_Usuario = 5;
        }

        $Primer_Nombre = reem1($rowListaW["primer_nombre"]);
        $Segundo_Nombre =reem1($rowListaW["segundo_nombre"]);
        $Primer_Apellido = reem1($rowListaW["primer_apellido"]);
        $Segundo_Apellido =reem1($rowListaW["segundo_apellido"]);
        $fechaNacimiento = $rowListaW["fechaNacimiento"];
        list($anyo, $mes, $dia) = explode("-", $fechaNacimiento);
        $anyo_dif  = date("Y") - $anyo;
        $mes_dif = date("m") - $mes;
        $dia_dif   = date("d") - $dia;

        if (($mes_dif < 1 and $mes_dif >= 0) and ($mes_dif < 1 and $mes_dif >= 0) and ($anyo_dif < 2 and $anyo_dif >= 0)) {
            $edad =  $dia_dif;
            $unidad = 3;
        }

        if ($anyo_dif < 1 and $mes_dif > 0) {
            $edad =  $mes_dif;
            $unidad = 2;
        }
        if ($anyo_dif > 0 and $anyo_dif < 2) {
            $mes_dif2 = $mes_dif + 12;
            $edad =  $mes_dif2;
            $unidad = 2;
        }
        if ($anyo_dif >= 2) {
            if ($mes_dif < 0) {
                $mes_dif = 12 - ($mes_dif * -1);
                $anyo_dif--;
            }
            $edad =  $anyo_dif;
            $unidad = 1;
        }

        $Edad = $edad;
        $Unidad_Edad = $unidad;

        //$Edad = $rowListaW["Edad"];
        //$Unidad_Edad = $rowListaW["Unidad_Edad"];
        $Sexo = $rowListaW["genero"];
        $Codigo_Departamento = $rowListaW["codigo_departamento"];
        //$Codigo_Departamento = funcionMaster($Codigo_Departamento,'codigo','codigo','departamentos');
        // si $Codigo_Departamento tiene un solo digito agregar un cero a la izquierda
        if (strlen($Codigo_Departamento) == 1) {
            $Codigo_Departamento = "0".$Codigo_Departamento;
        }

        $Codigo_Municipio = $rowListaW["codigo_ciudad"];
        $Codigo_Municipio = funcionMaster($Codigo_Municipio,'id','Codigo_Ciudad','Ciudades');
        $Zona_Residencial = $rowListaW["zona"];

        if ($Zona_Residencial == "Urbana") {
            $Zona_Residencial = "U";
        }
        if ($Zona_Residencial == "Rural") {
            $Zona_Residencial = "R";
        }

        $cliente_id = $rowListaW["cliente_id"];
        $queryListaCliente = mysqli_query($connMedical, "SELECT * FROM cliente where cliente_id = '$cliente_id'");
        while ($rowListaC = mysqli_fetch_array($queryListaCliente)){
            $tipoUsuarioSistema = $rowListaC["tipoUsuario"];
         
        }
        
      /*  if($tipoUsuario==$tipoUsuarioSistema){

        echo "$Tipo_Identificacion,$Numero_Identificacion,$Codigo_Entidad_Administradora,$Tipo_Usuario,$Primer_Nombre,$Segundo_Nombre,$Primer_Apellido,$Segundo_Apellido,$Edad,$Unidad_Edad,$Sexo,$Codigo_Departamento,$Codigo_Municipio,$Zona_Residencial" . "\n";

        $cantidadRegistros = $cantidadRegistros + 1;
        }  */


         //echo "$Tipo_Identificacion,$Numero_Identificacion,$entidadSaludN,$Tipo_Usuario,$Primer_Nombre,$Segundo_Nombre,$Primer_Apellido,$Segundo_Apellido,$Edad,$Unidad_Edad,$Sexo,$Codigo_Departamento,$Codigo_Municipio,$Zona_Residencial" . "\n";
         
         /*
         <td>Tipo de identificacion del usuario</td>
        <td>Numero de identificacion del usuario del sistema</td>
        <td>Codigo entidad administradora</td>
        <td>Tipo de usuario</td>
        <td>Primer apellido del usuario</td>
        <td>Segundo apellido del usuario</td>
        <td>Primer nombre del usuario</td>
        <td>Segundo nombre del usuario</td>
        <td>Edad</td>
        <td>Unidad de medida de la edad</td>
        <td>Sexo</td>
        <td>Codigo del departamento de residencia habitual</td>
        <td>Codigo del municipio de residencia habitual</td>
        <td>Zona de residencia habitual</td>
        */

        
        $cantidadRegistros = $cantidadRegistros + 1;

        $Arreglo[$cantidadRegistros]["Tipo_Identificacion_Usuario"] = $Tipo_Identificacion;
        $Arreglo[$cantidadRegistros]["Numero_Identificacion_Usuario"] = $Numero_Identificacion;
        $Arreglo[$cantidadRegistros]["Entidad_Administradora"] = $entidadSaludN;
        $Arreglo[$cantidadRegistros]["Tipo_Usuario"] = $Tipo_Usuario;
        $Arreglo[$cantidadRegistros]["Primer_Nombre"] = $Primer_Nombre;
        $Arreglo[$cantidadRegistros]["Segundo_Nombre"] = $Segundo_Nombre;
        $Arreglo[$cantidadRegistros]["Primer_Apellido"] = $Primer_Apellido;
        $Arreglo[$cantidadRegistros]["Segundo_Apellido"] = $Segundo_Apellido;
        $Arreglo[$cantidadRegistros]["Edad"] = $Edad;
        $Arreglo[$cantidadRegistros]["Unidad_Edad"] = $Unidad_Edad;
        $Arreglo[$cantidadRegistros]["Sexo"] = $Sexo;
        $Arreglo[$cantidadRegistros]["Departamento"] = $Codigo_Departamento;
        $Arreglo[$cantidadRegistros]["Municipio"] = $Codigo_Municipio;
        $Arreglo[$cantidadRegistros]["Zona"] = $Zona_Residencial;

    }

    /*
    echo "<pre>";
    print_r($Arreglo);
    echo "</pre>"; 
    */
}


$data = $Arreglo;

$xml = new SimpleXMLElement('<US/>');


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
    codArchivo='US' and
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
        ('$doctor','$fechaHoy','$NOMBRE_USUARIO','$codigoPrestador','CC','$nit','$fechaRemision','US','$cantidadRegistros','$entidadSalud', '$paciente' ,'$convenio');");
} elseif ($existe > 0) {
    mysqli_query($connMedical, "UPDATE  informacion_rips2 set
    usuario_id='$doctor' ,
    Fecha='$fechaHoy' ,
    nombrePrestador='$NOMBRE_USUARIO' ,
    codigoPrestador='$codigoPrestador' ,
    TipoId='CC' ,
    numeroId='$nit' ,
    fechaRemision='$fechaRemision' ,
    codArchivo='US' ,
    paciente='$paciente',
     convenio='$convenio',
    totalRegistros='$cantidadRegistros' ,
    codigoEntidad='$entidadSalud'
    where ID='$id_rips';");
}
?>