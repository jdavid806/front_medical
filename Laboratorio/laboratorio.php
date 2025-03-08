<?php
include "../menu.php";
include "../header.php";

$arrayCategorias = [
    "microscopio" => "microscopio",
    "microbiologia" => "microbiologia",
    "quimica" => "quimica",
    "hematologia" => "hematologia",
    "inmunologia" => "inmunologia",
    "otros" => "otros",
];

$arrayExamenes = [
    "microscopio" => ["examen microscopio 1", "examen microscopio 2"],
    "microbiologia" => ["examen microbiologia 1 ", "examen microbiologia 2"],
    "quimica" => ["examen quimica 1", "examen quimica 2"],
    "hematologia" => ["examen hematologia 1", "examen hematologia 2"],
    "inmunologia" => ["examen inmunologia 1", "examen inmunologia 2"],
];


$categoriaSeleccionada = "microscopio";

$examenesFiltrados = $arrayExamenes[$categoriaSeleccionada] ?? [];

$arrayPaquetes = [
    "paquete 1" => "paquete 1",
    "paquete 2" => "paquete 2",
    "paquete 3" => "paquete 3",
    "paquete 4" => "paquete 4",
];

$arrayCards = [
    ['icono' => 'stethoscope', 'titulo' => 'Cargar Resultados', 'texto' => 'Carga los resultados de los exámenes de laboratorio', 'divId' => 'cargarResultados'],
    ['icono' => 'kit-medical', 'titulo' => 'Ver Resultados Cargados', 'texto' => 'ver los exámenes de laboratorio', 'divId' => 'resultadosCargados'],
    ['icono' => 'book-medical', 'titulo' => 'Generar Orden', 'texto' => 'Genera una orden de laboratorio', 'divId' => 'orden'],
];

$arrayMedico = [
    "0" => "medico 1",
    "1" => "medico 2",
    "2" => "medico 3",
    "3" => "medico 4",
]
?>

<div class="componete">
    <div class="content mb-5">
        <div class="container-small">
            <nav class="mt-5" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Laboratorio</li>
                </ol>
            </nav>
        </div>
        <div class="row w-100">
            <div class="col-4">
                <div class="sticky-leads-sidebar mt-5">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed" id="productFilterColumn">
                        <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
                            <h3 class="mb-0">Información del Paciente</h3>
                            <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span class="uil uil-times fs-7"></span></button>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle" src="../../assets/img/team/33.webp" alt=""></div>
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
                                    <button class="btn btn-link px-3" type="button">Edit</button>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-envelope-alt"> </span>
                                        <h5 class="text-body-highlight mb-0">Email</h5>
                                    </div><a href="mailto:shatinon@jeemail.com:">jefer@gmail.com</a>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-phone"> </span>
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
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Información de Contacto</h3>
                                    <button class="btn btn-link" type="button">Edit</button>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-estate"></span>
                                        <h5 class="mb-0">Dirección</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">calle 123</p>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-map"></span>
                                        <h5 class="mb-0 text-body-highlight">Ciudad</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Bogota</p>
                                </div>
                                <div>
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-windsock"></span>
                                        <h5 class="mb-0 text-body-highlight">País</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Colombia</p>
                                </div>
                                <div>
                                    <div class="d-flex align-items-center mb-1"><span class="me-2"></span>
                                        <h5 class="text-body-highlight mt-5"> Razón Ultima Consulta</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Presentaba dolores de cabeza y abdominales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="phoenix-offcanvas-backdrop d-lg-none top-0" data-phoenix-backdrop="data-phoenix-backdrop"></div>
                </div>
            </div>
            <div class="col-8">
                <h2>Exámenes de Laboratorio</h2>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3 mt-5">


                    <?php foreach ($arrayCards as $key => $card) { ?>
                        <div class="col">
                            <div class="card card-item" style="max-width:15rem;height:13em;" data-div-id="<?= $card['divId'] ?>">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title"><i class="fas fa-<?= $card['icono'] ?>"></i>
                                        <?= $card['titulo'] ?></h5>
                                    <div class="d-flex gap-2 flex-grow-1">
                                        <p class="card-text fs-9">
                                            <?= $card['texto'] ?>
                                        </p>
                                    </div>
                                    <button class="btn btn-primary btn-icon flex-shrink-0 mt-auto w-100">
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php } ?>


                </div>
                <div class="col-12">
                    <div id="infoContainer" style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
                        <div id="examenes" class="info-div d-none">
                            <h3>Exámenes</h3>
                            <p>Detalles específicos sobre los exámenes de laboratorio.</p>
                        </div>
                        <div id="cargarResultados" class="info-div d-none">
                            <h3>Cargar Resultados</h3>
                            <p>Información sobre cómo cargar resultados al sistema.</p>
                        </div>
                        <div id="resultadosCargados" class="info-div d-none">
                            <h3>Resultados Cargados</h3>
                            <p>Detalles de los resultados que ya están en el sistema.</p>
                        </div>
                        <div id="orden" class="info-div d-none">
                            <h3>Generar Orden de Laboratorio</h3>
                            <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation"><a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#tab-home" role="tab" aria-controls="tab-home" aria-selected="true">Seleccionar por Examenes</a></li>
                                <li class="nav-item" role="presentation"><a class="nav-link" id="profile-tab" data-bs-toggle="tab" href="#tab-profile" role="tab" aria-controls="tab-profile" aria-selected="false" tabindex="-1">Seleccionar por paquetes</a></li>
                                <li class="nav-item" role="presentation"><a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#tab-contact" role="tab" aria-controls="tab-contact" aria-selected="false" tabindex="-1">Seleccionar por categorías</a></li>
                            </ul>
                            <div class="tab-content mt-3" id="myTabContent">
                                <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
                                    <!-- Por examenes -->
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Generar Orden de Laboratorio por exámenes</h5>
                                            <form action="submit" class="row">

                                                <select id="categoria" name="categoria" class="form-control mb-3">
                                                    <option value="">Seleccione una categoría</option>
                                                    <?php foreach ($arrayCategorias as $key => $categoria) { ?>
                                                        <option value="<?= $key ?>"><?= $categoria ?></option>
                                                    <?php } ?>
                                                </select>

                                                <select id="examen" name="examen" class="form-control mb-3">
                                                    <option value="">Seleccione un examen</option>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <!-- Por paquete -->

                                <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Generar Orden de Laboratorio por paquetes</h5>
                                            <form action="submit" class="row">

                                                <select id="categoria" name="categoria" class="form-control mb-3">
                                                    <option value="">Seleccione una paquete</option>
                                                    <?php foreach ($arrayPaquetes as $key => $paquete) { ?>
                                                        <option value="<?= $key ?>"><?= $paquete ?></option>
                                                    <?php } ?>
                                                </select>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!-- Por categoria -->
                                <div class="tab-pane fade" id="tab-contact" role="tabpanel" aria-labelledby="contact-tab">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Generar Orden de Laboratorio por categoria</h5>
                                            <form action="submit" class="row">

                                                <select id="categoria" name="categoria" class="form-control mb-3">
                                                    <option value="">Seleccione una categoría</option>
                                                    <?php foreach ($arrayCategorias as $key => $categoria) { ?>
                                                        <option value="<?= $key ?>"><?= $categoria ?></option>
                                                    <?php } ?>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary mt-3 col-12">Generar Orden de Laboratorio</button>
                            <div class="col-12 mt-3">
                                <table class="table table-bordered" id="tablaExamenes">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Aquí se agregarán dinámicamente las filas -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const selectExamen = document.getElementById('examen');
        const tablaExamenes = document.getElementById('tablaExamenes').querySelector('tbody');
        const botonGenerarOrden = document.querySelector('.btn-primary.mt-3');

        // Agregar opción seleccionada a la tabla
        selectExamen.addEventListener('change', function() {
            const examenSeleccionado = selectExamen.options[selectExamen.selectedIndex];
            const examenId = examenSeleccionado.value;
            const examenNombre = examenSeleccionado.text;

            if (examenId === '') return; // Evitar agregar "Seleccione un examen"


            if ([...tablaExamenes.querySelectorAll('tr')].some(row => row.dataset.id === examenId)) {
                alert('Este examen ya está en la tabla.');
                return;
            }


            const nuevaFila = document.createElement('tr');
            nuevaFila.dataset.id = examenId;
            nuevaFila.innerHTML = `
                <td>${examenNombre}</td>
                <td><button class="btn btn-danger btn-sm eliminar">Eliminar</button></td>
            `;

            tablaExamenes.appendChild(nuevaFila);
        });


        tablaExamenes.addEventListener('click', function(e) {
            if (e.target.classList.contains('eliminar')) {
                e.target.closest('tr').remove();
            }
        });


        botonGenerarOrden.addEventListener('click', function() {
            const datosTabla = [...tablaExamenes.querySelectorAll('tr')].map(row => row.dataset.id);

            if (datosTabla.length === 0) {
                alert('Debe agregar al menos un examen.');
                return;
            }


            console.log('Datos a enviar:', datosTabla);


        });
    });
</script>



<script>
    document.addEventListener("DOMContentLoaded", function() {
        const cards = document.querySelectorAll('.card-item');
        const infoDivs = document.querySelectorAll('.info-div');

        cards.forEach(card => {
            card.addEventListener('click', function() {
                const divId = this.getAttribute('data-div-id');

                // Ocultar todos los divs dentro del contenedor
                infoDivs.forEach(div => div.classList.add('d-none'));

                // Mostrar el div correspondiente
                const targetDiv = document.getElementById(divId);
                if (targetDiv) {
                    targetDiv.classList.remove('d-none');
                }

                // Quitar clase activa de todas las cards
                cards.forEach(c => c.classList.remove('active-card'));

                // Agregar clase activa a la card seleccionada
                this.classList.add('active-card');
            });
        });
    });
</script>

<script>
    const examenes = <?php echo json_encode($arrayExamenes); ?>;


    const categoriaSelect = document.getElementById('categoria');
    const examenSelect = document.getElementById('examen');


    categoriaSelect.addEventListener('change', function() {
        const categoriaSeleccionada = this.value;


        examenSelect.innerHTML = '<option value="">Seleccione un examen</option>';

        if (categoriaSeleccionada) {

            const examenList = examenes[categoriaSeleccionada];

            if (examenList && examenList.length > 0) {

                examenList.forEach(examen => {
                    const option = document.createElement('option');
                    option.value = examen;
                    option.textContent = examen;
                    examenSelect.appendChild(option);
                });
            } else {
                examenSelect.innerHTML = '<option value="">No hay exámenes disponibles</option>';
            }
        }
    });
</script>

<style>
    .active-card {
        border: 2px solid #007bff;
        /* Cambia el borde */
        background-color: #f0f8ff;
        /* Cambia el color de fondo */
        transition: all 0.3s ease;
        /* Animación suave */
    }

    .floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        background-color: #007bff;
        color: white;
        border-radius: 50px;
        padding: 10px 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        z-index: 1000;
    }

    .floating-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
    }

    .button-icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 50%;
    }
</style>

<?
include "../footer.php";
?>