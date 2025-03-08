<?php
include "../menu.php";
include "../header.php";
$historialData = [
    [
        "titulo" => "Historial de Poolio",
        "eventos" => [
            ["titulo" => "Consulta", "descripcion" => "Fecha: 2024-01-01", "start" => "2024-01-01"],
            ["titulo" => "Aplicación", "descripcion" => "Fecha Aplicación: 2024-01-15", "start" => "2024-01-15"],
            ["titulo" => "Próxima Aplicación", "descripcion" => "Fecha: 2024-03-01", "start" => "2024-03-01"]
        ]
    ],
    [
        "titulo" => "Historial de Vacunación covid 19",
        "eventos" => [
            ["titulo" => "Consulta", "descripcion" => "Fecha: 2024-01-01", "start" => "2024-01-01"],
            ["titulo" => "Aplicación primera dosis", "descripcion" => "Fecha Aplicación: 2024-01-15", "start" => "2024-01-15"],
            ["titulo" => "Próxima Aplicación", "descripcion" => "Fecha: 2024-03-01", "start" => "2024-03-01"],
            ["titulo" => "Aplicación segunda dosis", "descripcion" => "Fecha: 2024-03-01", "start" => "2024-03-01"]
        ]
    ]
];

// Convertimos el array PHP en JSON
$jsonData = json_encode($historialData);
?>


<link rel="stylesheet" href="./vacunas/css/vacunaStyle.css">



<div class="componete mt-5">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3 mt-5" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                    <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Exámenes</li>
                </ol>
            </nav>
        </div>
        <div class="row w-100">
            <div class="col-4">
                <div class="sticky-leads-sidebar mt-5">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
                        id="productFilterColumn">
                        <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
                            <h3 class="mb-0">Información del Paciente</h3>
                            <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span
                                    class="uil uil-times fs-7"></span></button>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle"
                                                src="../../assets/img/team/33.webp" alt=""></div>
                                    </div>
                                    <div class="col-12 col-sm-auto flex-1">
                                        <h3 class="fw-bolder mb-2">Jefferson Dávila</h3>
                                        <p class="mb-0">RH O+</p><a class="fw-bold" href="#!"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Información General</h3>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-envelope-alt">
                                        </span>
                                        <h5 class="text-body-highlight mb-0">Email</h5>
                                    </div><a href="mailto:shatinon@jeemail.com:">jefer@gmail.com</a>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-phone">
                                        </span>
                                        <h5 class="text-body-highlight mb-0">Celular</h5>
                                    </div><a href="tel:+1234567890">+57305.....</a>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-clock"></span>
                                        <h5 class="text-body-highlight mb-0">Ultima Consulta</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">12 November 2021, 10:54 AM</p>
                                </div>

                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Genero
                                    </div>
                                    <div>
                                        Masculino
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Edad
                                    </div>
                                    <div>
                                        21 Años
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Tipo de Sangre
                                    </div>
                                    <div>
                                        A Positivo
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Condicion Especial
                                    </div>
                                    <div>
                                        TDHA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Antecedentes
                                    </div>
                                    <div>
                                        TDHA, ASMA, HTA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Whatsapp
                                    </div>
                                    <div>
                                        +57350........
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-primary" type="button">
                                        <i class="fas fa-pencil"></i> &nbsp; Editar información
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="phoenix-offcanvas-backdrop d-lg-none top-0"
                        data-phoenix-backdrop="data-phoenix-backdrop"></div>
                </div>
            </div>
            <div class="col-8">
                <h3>Esquema de Vacunación</h3>
                <button type="button" class="btn btn-primary mb-1 mt-3" data-bs-toggle="modal"
                    data-bs-target="#modalNuevaVacuna">Aplicar nueva vacuna</button>
                <ul class="nav nav-underline fs-9" id="myTab" role="tablist">

                    <li class="nav-item">
                        <a class="nav-link active" id="timeLine-tab" data-bs-toggle="tab" href="#timeLine" role="tab">
                            <i class="fas fa-stream"></i> Línea de Tiempo
                        </a>
                    </li>
                    <!-- <li class="nav-item">
                        <a class="nav-link" id="calendar-tab" data-bs-toggle="tab" href="#calendar" role="tab">
                            <i class="fas fa-calendar-alt"></i> Calendario
                        </a>
                    </li> -->
                </ul>
                <div class="tab-content mt-3" id="myTabContent">

                    <div class="tab-content" id="timeLineTab">
                        <div class="tab-pane fade show active" id="timeLine" role="tabpanel">
                            <h3>Línea de tiempo</h3>
                            <div id="historialContainer"></div>
                        </div>
                    </div>


                    <div class="tab-content" id="calendarTab">
                        <div class="tab-pane fade show" id="calendar" role="tabpanel">
                            Calendario
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>

</div>

<script>
    // Convertimos el JSON PHP a un objeto de JavaScript
    const historialData = <?php echo $jsonData; ?>;

    const historialContainer = document.getElementById("historialContainer");

    // Generar un identificador único para cada acordeón
    historialData.forEach((historial, index) => {
        const accordionId = `accordion-${index}`;
        const collapseId = `collapse-${index}`;

        // Contenedor principal del historial (accordion-item)
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("accordion-item");

        // Título del acordeón con botón e ícono dentro de una card
        cardContainer.innerHTML = `
    <h2 class="accordion-header" id="heading-${index}">
        <button class="accordion-button collapsed d-flex justify-content-between align-items-center" 
                type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" 
                aria-expanded="false" aria-controls="${collapseId}">
            ${historial.titulo}
            <i class="bi bi-chevron-down ms-auto toggle-icon"></i> <!-- Icono por defecto -->
        </button>
    </h2>
    <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="heading-${index}" data-bs-parent="#historialContainer">
        <div class="accordion-body">
            <!-- Card con contenido de eventos -->
            <div class="card">
                <div class="card-body">
                    <!-- Aquí van los eventos -->
                </div>
            </div>
        </div>
    </div>
    `;

        // Seleccionamos el body del acordeón para insertar los eventos
        const accordionBody = cardContainer.querySelector(".accordion-body .card-body");

        historial.eventos.forEach(evento => {
            // Contenedor para cada evento dentro de la card
            const eventoContainer = document.createElement("div");
            eventoContainer.classList.add("mb-3", "border-bottom", "pb-2");

            // Contenido del evento
            eventoContainer.innerHTML = `
        <h5 class="fw-bold">${evento.titulo}</h5>
        <p class="mb-1">${evento.descripcion}</p>
        <span class="badge bg-primary">${evento.start}</span>
        `;

            // Agregar el evento al cuerpo de la card dentro del acordeón
            accordionBody.appendChild(eventoContainer);
        });

        // Agregar cada item del acordeón al historialContainer
        historialContainer.appendChild(cardContainer);
    });

    // Agregar funcionalidad para cambiar el icono al abrir/cerrar el acordeón
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('.toggle-icon');
            if (this.classList.contains('collapsed')) {
                icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
            } else {
                icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
            }
        });
    });
</script>


<style>
    .historial-section {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .eventos-list {
        list-style: none;
        padding: 0;
    }

    .evento-item {
        padding: 5px;
        border-bottom: 1px solid #ddd;
    }

    .evento-item:last-child {
        border-bottom: none;
    }
</style>



<?php
include "../footer.php";
include "./modalNuevaVacuna.php";
?>