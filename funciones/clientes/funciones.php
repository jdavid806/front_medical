<?php

include '../conn3.php';

function consultarNombreCliente($array1, $array2, $inputName){

    global $conn3;

    $string1 = implode(',', $array1);
    $string2 = implode(',', $array2);

    $query = "SELECT $string1 FROM cliente2 WHERE $string2 LIKE '%$inputName%';";
    $result = mysqli_query($conn3, $query);


    $result = mysqli_fetch_assoc($result);
    $elemento = crearElementoClientes($result);
    
}

function crearElementoClientes(array $resultsQuery) {
    $html = '';

    foreach ($resultsQuery as $result) {
        $name = htmlspecialchars($result['nombre_cliente']);
        $email = htmlspecialchars($result['correo_cliente']);
        $profilePictureUrl = 'assets/img/team/40x40/default.webp'; // Default image URL if no specific logic for URL

        $html .= '
        <a class="dropdown-item py-2 d-flex align-items-center" href="pages/members.html">
            <div class="avatar avatar-l status-online me-2 text-body">
                <img class="rounded-circle" src="' . $profilePictureUrl . '" alt="" />
            </div>
            <div class="flex-1">
                <h6 class="mb-0 text-body-highlight title">' . $name . '</h6>
                <p class="fs-10 mb-0 d-flex text-body-tertiary">' . $email . '</p>
            </div>
        </a>';
    }

    return $html;
}


?>