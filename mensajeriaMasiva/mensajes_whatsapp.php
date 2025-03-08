<?php

include "../menu.php";
include "../header.php";

$arrayMensajes = [
    [
        "titulo" => "Promoción de Cardiología",
        "mensaje" => "Consulta con nuestros especialistas en cardiología y obtén un 20% de descuento.",
        "filtro" => "Cardiología"
    ],
    [
        "titulo" => "Cuidado de la Piel",
        "mensaje" => "Aprovecha nuestras promociones en tratamientos dermatológicos.",
        "filtro" => "Dermatología"
    ],
    [
        "titulo" => "Vacunación Infantil",
        "mensaje" => "Protege a tus hijos con nuestro servicio de vacunación infantil.",
        "filtro" => "Pediatría"
    ],
    [
        "titulo" => "Consulta General",
        "mensaje" => "Agenda tu consulta general con nuestros médicos especialistas.",
        "filtro" => "General"
    ]
];

?>

<div class="content">

    <div class="container my-4">
        <h3 class="mb-4">Lista de mensajes masivos - WhatsApp</h3>

        <div class="d-flex justify-content-between mb-3">
            <div>
                <button type="button" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#newMessage">+ Nuevo mensaje</button>
            </div>
        </div>

        <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
            <thead>
                <tr>
                    <th class="sort border-top custom-th" data-sort="Titulo">Titulo</th>
                    <th class="sort border-top custom-th" data-sort="Mensaje">Mensaje</th>
                    <th class="sort border-top custom-th" data-sort="Filtro">Filtro</th>
                    <th class="sort text-end align-middle pe-0 border-top mb-2" scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody class="list">
                <?php


                foreach ($arrayMensajes as $value) { ?>
                    <tr>
                        <td class="align-middle custom-td"><?= $value["titulo"] ?></td>
                        <td class="align-middle custom-td"><?= $value["mensaje"] ?></td>
                        <td class="align-middle custom-td"><?= $value["filtro"] ?></td>
                        <td class="align-middle white-space-nowrap pe-0 p-3">
                            <button class="btn btn-sm btn-secondary"><i class="fa fa-cog"></i></button>
                            <button class="btn btn-sm btn-success"><i class="fa fa-power-off"></i></button>
                            <button class="btn btn-sm btn-primary"><i class="fa fa-paper-plane"></i></button>
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>

</div>

<?php
include "../footer.php";

include "modal_form_message.php";
?>