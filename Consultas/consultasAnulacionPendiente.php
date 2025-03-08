<?php
include "../menu.php";
include "../header.php";

$historiasClinicas = [
    [
        "id" => 1,
        'nombre' => 'Historia Clínica Estética',
        'doctor' => 'Carlos Ruiz',
        'paciente' => 'Andrea Gómez',
        'motivo' => 'Consulta Estética',
        'razon' => 'Se solicita la anulación debido a un error en los datos del paciente.'
    ],
    [
        "id" => 2,
        'nombre' => 'Historia Clínica Estética 2',
        'doctor' => 'Carlos Ruiz',
        'paciente' => 'Juan Pérez',
        'motivo' => 'Consulta Estética 2',
        'razon' => 'Consulta registrada por duplicado, se requiere anulación.'
    ],
    [
        "id" => 3,
        'nombre' => 'Historia Clínica Medicina General',
        'doctor' => 'Manuel Antonio Rosales',
        'paciente' => 'Lucía Ramírez',
        'motivo' => 'Chequeo general',
        'razon' => 'Se detectó un problema administrativo que requiere anulación de esta historia clínica.'
    ],
    [
        "id" => 4,
        'nombre' => 'Historia Clínica Medicina General 2',
        'doctor' => 'Carlos Ruiz',
        'paciente' => 'Ricardo Torres',
        'motivo' => 'Chequeo de control',
        'razon' => 'El paciente decidió no continuar con la consulta.'
    ],
    [
        "id" => 5,
        'nombre' => 'Historia Clínica Psicología',
        'doctor' => 'Diana Maria Fernandez',
        'paciente' => 'María López',
        'motivo' => 'Evaluación psicológica',
        'razon' => 'Error en la documentación, se requiere corrección antes de registrar nuevamente.'
    ],
    [
        "id" => 6,
        'nombre' => 'Historia Clínica Psiquiatría',
        'doctor' => 'Carlos Ruiz',
        'paciente' => 'Pedro Sánchez',
        'motivo' => 'Tratamiento psiquiátrico',
        'razon' => 'Se realizó una actualización en el diagnóstico del paciente, esta historia queda sin efecto.'
    ],
    [
        "id" => 7,
        'nombre' => 'Historia Clínica Pediatría',
        'doctor' => 'Diana Maria Fernandez',
        'paciente' => 'Sofía Martínez',
        'motivo' => 'Consulta pediátrica',
        'razon' => 'Error en la fecha de la consulta, se requiere registrar nuevamente.'
    ]
];

?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consultas - Solicitudes de anulación pendientes</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-0">Consultas - Solicitudes de anulación pendientes</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="table-responsive">
                <table class="table table-sm tableDataTableSearch">
                    <thead>
                        <tr>
                            <th>Nombre de la Historia</th>
                            <th width="250">Paciente</th>
                            <th width="250">Doctor(a)</th>
                            <th>Razón de la anulación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($historiasClinicas as $historia) { ?>
                            <tr>
                                <td class="align-middle"><?= $historia['nombre'] ?></td>
                                <td class="align-middle"><?= $historia['paciente'] ?></td>
                                <td class="align-middle"><?= $historia['doctor'] ?></td>
                                <td class="align-middle"><?= $historia['razon'] ?></td>
                                <td class="text-center">
                                    <div class="d-flex gap-2 justify-content-center">
                                        <i
                                            class="fs-7 fa-solid fa-check cursor-pointer text-success"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            data-bs-title="Solicitar anulación"
                                            onclick="aceptarAnulacion(<?= $historia['id'] ?>)"
                                            title="Aceptar anulación"></i>
                                        <i
                                            class="fs-7 fa-solid fa-ban cursor-pointer text-danger"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            data-bs-title="Solicitar anulación"
                                            onclick="rechazarAnulacion(<?= $historia['id'] ?>)"
                                            title="Rechazar anulación"></i>
                                    </div>
                                </td>
                            </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        function aceptarAnulacion(id) {
            console.log('Aceptando anulación para historia clinica con ID:', id);

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, aceptar anulación',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Anulacion aceptada con ID:', id);
                    Swal.fire(
                        '¡Aceptado!',
                        'Se ha aceptado la anulación de la historia clinica.',
                        'success'
                    );
                }
            });
        }

        function rechazarAnulacion(id) {
            console.log('Rechazando anulación para historia clinica con ID:', id);

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, rechazar anulación',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Anulación rechazada con ID:', id);
                    Swal.fire(
                        '¡Rechazado!',
                        'Se ha rechazado la anulación de la historia clinica.',
                        'success'
                    );
                }
            });
        }
    </script>

    <?php include "../footer.php"; ?>
</div>