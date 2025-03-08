<?php
function obtenerDatosPais()
{
    $connApi = mysqli_connect('154.38.165.62', 'apidian24', 'EL9u;UC)b!AY', "apidian24");

    $clientesMedical = mysqli_query($connApi, "SELECT * FROM departments where country_id = 46");
    $datosDepartamentos = [];

    while ($row = mysqli_fetch_assoc($clientesMedical)) {
        $datosDepartamentos[] = [
            "name" => $row['name'],
            "id" => $row['id'],
        ];
    }

    return json_encode($datosDepartamentos);
}

?>