<?php

function obtenerDatosMunicipio($departamento)
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");

    $Municipios = mysqli_query($connApi, "SELECT * FROM municipalities WHERE department_id = '$departamento'");

    
    $datosMunicipios = [];

    while ($row = mysqli_fetch_assoc($Municipios)) {
        $datosMunicipios[] = [
            "name" => $row['name'],
            "code" => $row['code']
        ];
    }

    return json_encode($datosMunicipios);
}

if (isset($_POST['departamento'])) {
    $departamento = $_POST['departamento'];
    echo obtenerDatosMunicipio($departamento);
}