<?php
include "../funciones/conn3.php";

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

function DatosIngresarMysqli($valor)
{
    include "../funciones/conn3.php";

    foreach ($valor as $key => $value) {
        if (is_array($value)) {
            $Arreglo[$key] = DatosIngresarMysqli($value);
        } else {
            $Arreglo[$key] = mysqli_real_escape_string($conn3, $value);
        }
    }
    return $Arreglo;
}


if ($_POST["Tipo_Consulta"] == "Busqueda Convenio") {

    $hoy = date("Y-m-d");
    $entidad_id = $_POST["valor"];
    if ($entidad_id == 0) {
        echo "<option value='0'>Ninguno</option>";
    } else {
        $QueryConvenio = mysqli_query($connMedical, "SELECT * FROM Rips_Convenio WHERE entidad_id = '{$entidad_id}' AND Activo = 1");
        while ($RowConvenio = mysqli_fetch_array($QueryConvenio)) {
            $id = $RowConvenio['id'];
            $Nombre = $RowConvenio['Nombre'];

            $ArregloConvenios[$id] = "Existe";
        }


        foreach ($ArregloConvenios as $key => $value) {
            $Nombre = funcionMaster($key, 'id', 'Nombre', 'Rips_Convenio');
            //if($value=="Activo"){
            echo "<option value='$key'>" . $Nombre . "</option>";
            //}else{
            //    echo "<option value='$key' disabled style='color:salmon;'>".$Nombre."</option>";
            //}
        }
    }
} 










