<?php

header('Content-Type: application/vnd.ms-excel; charset=UTF-8');
header('Content-Disposition: attachment; filename=RipsCT.txt');
include "../funciones/conn3.php";

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
// $hasta = $_POST['hasta'];
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
           
 
   echo "$codigoPrestador,$fechaRemision1,$codArchivo,$totalRegistros"."\n";
      

}




 
?>