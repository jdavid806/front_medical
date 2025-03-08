<?php
// header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
// header('Content-Disposition: attachment; filename=RipsCT.xml');
include "../funciones/conn3.php";

$desde = $_POST['desde'];
$tipoUsuario = $_POST['tipoUsuario']; 
if ($tipoUsuario == 0)
 { $entidadSalud ='SDS001';
$entidadSaludN= 'PARTICULAR';

} else {
$entidadSalud= funcionMaster($tipoUsuario,'id', 'Codigo' ,'Rips_Entidades');
$entidadSaludN= funcionMaster($tipoUsuario,'id', 'Nombre' ,'Rips_Entidades');
}


 
$doctor = $_POST['doctor']; 
$paciente = $_POST['paciente'];
   

 $fechaRemision = $_POST['fechaRemision'];

 $convenio = $_POST['convenio'];
 

  if ($convenio > 0) {
  $where = 'and  convenio= '. $convenio. ' ';
} else {
  $where = '';
}




$cantidadRegistros = 0;
if($doctor=="0")
        {
            $queryLista=mysqli_query($connMedical, "SELECT * FROM    informacion_rips2 where fechaRemision like '$fechaRemision' and paciente='$paciente' and codigoEntidad= '$entidadSalud' $where");
        }
        else
        {
            $queryLista=mysqli_query($connMedical,"SELECT * FROM    informacion_rips2  where fechaRemision like '$fechaRemision' and  usuario_id = '$doctor' and paciente='$paciente' and codigoEntidad= '$entidadSalud' $where");

        }


        $nrow=mysqli_num_rows($queryLista);
        while($rowLista=mysqli_fetch_array($queryLista))
        {
            $codigoPrestador=$rowLista['codigoPrestador'];

            $fechaRemision =$rowLista['fechaRemision'];
            $codArchivo =$rowLista['codArchivo'];
            $totalRegistros=$rowLista['totalRegistros'];
             $date = date_create("$fechaRemision");
       $fechaRemision1 = date_format($date, "d/m/Y");
           
            
   //echo "$codigoPrestador,$fechaRemision1,$codArchivo,$totalRegistros"."\n";
      
   /*
   <td>Código del prestador de servicios de salud</td>
        <td>Fecha de remision</td>
        <td>Codigo del archivo </td>
        <td>Total de registros </td>
   */
            $cantidadRegistros++;
   $Arreglo[$cantidadRegistros]["Codigo_Prestador"] = $codigoPrestador;
   $Arreglo[$cantidadRegistros]["Fecha_Remision"] = $fechaRemision1;
   $Arreglo[$cantidadRegistros]["Codigo_Archivo"] = $codArchivo;
   $Arreglo[$cantidadRegistros]["Total_Registros"] = $totalRegistros;

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

?>


<?php
function funcionMaster($filtro, $campoFiltrar, $campoImprimir, $tabla)
{
    include 'funciones/conn3.php';
    $query = mysqli_query($connMedical, "SELECT * FROM $tabla where $campoFiltrar = '$filtro'");
    $nrowl = mysqli_num_rows($query);
    while ($row = mysqli_fetch_array($query)) {

        $text = $row[$campoImprimir];
    }
    return  $text;
}
?>