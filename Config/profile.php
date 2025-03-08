<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="#!">Configuración</a></li>
                <li class="breadcrumb-item active" aria-current="page">Perfil</li>
            </ol>
        </nav>
        <div class="row align-items-center justify-content-between g-3 mb-4">
            <div class="col-auto">
                <h2 class="mb-0">Perfil</h2>
            </div>
            <div class="col-auto">
                <div class="row g-2 g-sm-3">
                    <div class="col-auto">
                        <button class="btn btn-phoenix-secondary"><span class="fas fa-key me-2"></span>Cambiar Contraseña</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row g-3 mb-6">
            <div class="col-12 col-lg-8">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="border-bottom border-dashed pb-4">
                            <div class="row align-items-center g-3 g-sm-5 text-center text-sm-start">
                                <div class="col-12 col-sm-auto">
                                    <input class="d-none" id="avatarFile" type="file" />
                                    <label class="cursor-pointer avatar avatar-5xl" for="avatarFile"><img class="rounded-circle" src="assets/img/team/150x150/24.webp" alt="" /></label>
                                </div>
                                <div class="col-12 col-sm-auto flex-1">
                                    <h3>Jerry Seinfield</h3>
                                    <h5>Cardiologo</h5>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-between-center pt-4">
                            <div>
                                <h6 class="mb-2 text-body-secondary">Total Facturado</h6>
                                <h4 class="fs-7 text-body-highlight mb-0">$1.894.000 COP</h4>
                            </div>
                            <div class="text-end">
                                <h6 class="mb-2 text-body-secondary">Últtima factura</h6>
                                <h4 class="fs-7 text-body-highlight mb-0">Hace 1 semana</h4>
                            </div>
                            <div class="text-end">
                                <h6 class="mb-2 text-body-secondary">Total Facturas Generadas</h6>
                                <h4 class="fs-7 text-body-highlight mb-0">17</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="border-bottom border-dashed">
                            <h4 class="mb-3">Dirección Predeterminada
                                <button class="btn btn-link p-0" type="button"> <span class="fas fa-edit fs-9 ms-3 text-body-quaternary"></span></button>
                            </h4>
                        </div>
                        <div class="pt-4 mb-7 mb-lg-4 mb-xl-7">
                            <div class="col-auto">
                                <h5 class="text-body-highlight">Dirección</h5>
                            </div>
                            <div class="col-auto">
                                <p class="text-body-secondary">Carrera 32a #19a-70 a 19a-144<br />Santa Elena</p>
                            </div>
                        </div>
                        <div class="border-top border-dashed pt-4">
                            <div class="row flex-between-center mb-2">
                                <div class="col-auto">
                                    <h5 class="text-body-highlight">Ciudad, Departamento</h5>
                                </div>
                                <div class="col-auto">
                                    <p class="text-body-secondary">Cali, Valle del Cauca<br />Colombia</p>
                                </div>
                            </div>
                        </div>
                        <div class="border-top border-dashed pt-4">
                            <div class="row flex-between-center mb-2">
                                <div class="col-auto">
                                    <h5 class="text-body-highlight mb-0">Correo electrónico</h5>
                                </div>
                                <div class="col-auto"><a class="lh-1" href="mailto:shatinon@jeemail.com">jerryseinfield@email.com</a></div>
                            </div>
                            <div class="row flex-between-center">
                                <div class="col-auto">
                                    <h5 class="text-body-highlight mb-0">WhatsApp</h5>
                                </div>
                                <div class="col-auto"><a href="tel:+1234567890">+57320123456</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="scrollbar">
                <ul class="nav nav-underline fs-9 flex-nowrap mb-3 pb-1" id="myTab" role="tablist">
                    <li class="nav-item"><a class="nav-link text-nowrap active" id="personal-info-tab" data-bs-toggle="tab" href="#tab-personal-info" role="tab" aria-controls="tab-personal-info" aria-selected="true"><span class="fas fa-user me-2"></span>Información Personal</a></li>
                </ul>
                <div class="text-end">
                    <button class="btn btn-primary px-7 text-end">Guardar Cambios</button>
                </div>
            </div>
            <div class="tab-content" id="profileTabContent">
                <div class="tab-pane fade show active" id="tab-personal-info" role="tabpanel" aria-labelledby="personal-info-tab">
                    <div class="row gx-3 gy-4 mb-5">
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm" for="fullName">Nombre Completo</label>
                            <input class="form-control" id="fullName" type="text" placeholder="Nombre completo" />
                        </div>
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm" for="gender">Genero</label>
                            <select class="form-select" id="gender">
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="non-binary">No binario</option>
                                <option value="not-to-say">Prefiero no decirlo</option>
                            </select>
                        </div>
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fs-8 ps-0 text-capitalize lh-sm" for="email">Correo electrónico</label>
                            <input class="form-control" id="email" type="text" placeholder="Email" />
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="row g-2 gy-lg-0">
                                <label class="form-label text-body-highlight fs-8 ps-1 text-capitalize lh-sm mb-1">Fecha de Nacimiento</label>
                                <input type="date" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="phone">WhatsApp</label>
                            <input class="form-control" id="phone" type="text" placeholder="+57 123456788" />
                        </div>
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="adress">Dirección</label>
                            <input class="form-control" id="adress" type="text" placeholder="opcional" />
                        </div>
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="department">Departamento</label>
                            <select class="form-select" id="department">
                                <option value="Amazonas">Amazonas</option>
                                <option value="Antioquia">Antioquia</option>
                                <option value="Arauca">Arauca</option>
                                <option value="Atlántico">Atlántico</option>
                                <option value="Bolívar">Bolívar</option>
                                <option value="Boyacá">Boyacá</option>
                                <option value="Caldas">Caldas</option>
                                <option value="Caquetá">Caquetá</option>
                                <option value="Casanare">Casanare</option>
                                <option value="Cauca">Cauca</option>
                                <option value="Cesar">Cesar</option>
                                <option value="Chocó">Chocó</option>
                                <option value="Córdoba">Córdoba</option>
                                <option value="Cundinamarca">Cundinamarca</option>
                                <option value="Guainía">Guainía</option>
                                <option value="Guaviare">Guaviare</option>
                                <option value="Huila">Huila</option>
                                <option value="La Guajira">La Guajira</option>
                                <option value="Magdalena">Magdalena</option>
                                <option value="Meta">Meta</option>
                                <option value="Nariño">Nariño</option>
                                <option value="Norte de Santander">Norte de Santander</option>
                                <option value="Putumayo">Putumayo</option>
                                <option value="Quindío">Quindío</option>
                                <option value="Risaralda">Risaralda</option>
                                <option value="San Andrés y Providencia">San Andrés y Providencia</option>
                                <option value="Santander">Santander</option>
                                <option value="Sucre">Sucre</option>
                                <option value="Tolima">Tolima</option>
                                <option value="Valle del Cauca">Valle del Cauca</option>
                                <option value="Vaupés">Vaupés</option>
                                <option value="Vichada">Vichada</option>

                            </select>
                        </div>
                        <div class="col-12 col-lg-6">
                            <label class="form-label text-body-highlight fw-bold fs-8 ps-0 text-capitalize lh-sm" for="city">Ciudad</label>
                            <select class="form-select" id="city">
                                <option value="Bogotá">Bogotá</option>
                                <option value="Medellín">Medellín</option>
                                <option value="Cali">Cali</option>
                                <option value="Barranquilla">Barranquilla</option>
                                <option value="Cartagena">Cartagena</option>
                                <option value="Cúcuta">Cúcuta</option>
                                <option value="Bucaramanga">Bucaramanga</option>
                                <option value="Pereira">Pereira</option>
                                <option value="Santa Marta">Santa Marta</option>
                                <option value="Manizales">Manizales</option>
                                <option value="Villavicencio">Villavicencio</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Ibagué">Ibagué</option>
                                <option value="Neiva">Neiva</option>
                                <option value="Popayán">Popayán</option>
                                <option value="Montería">Montería</option>
                                <option value="Sincelejo">Sincelejo</option>
                                <option value="Valledupar">Valledupar</option>
                                <option value="Quibdó">Quibdó</option>
                                <option value="Leticia">Leticia</option>
                                <option value="Riohacha">Riohacha</option>
                                <option value="San Andrés">San Andrés</option>
                                <option value="Yopal">Yopal</option>
                                <option value="Tunja">Tunja</option>
                                <option value="Florencia">Florencia</option>
                                <option value="Mocoa">Mocoa</option>
                                <option value="Inírida">Inírida</option>
                                <option value="Puerto Carreño">Puerto Carreño</option>
                                <option value="San José del Guaviare">San José del Guaviare</option>
                                <option value="Mitú">Mitú</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end of .container-->

</div>

<?php include "../footer.php"; ?>

<script>
    // Listen to the tab change event
    document.addEventListener('DOMContentLoaded', function() {
        const triggerTabList = document.querySelectorAll('#myTab a');

        // Store the active tab in localStorage so it's remembered after a page refresh
        triggerTabList.forEach(function(triggerEl) {
            triggerEl.addEventListener('click', function(event) {
                localStorage.setItem('activeTab', event.target.id);
            });
        });

        // Get the saved tab from localStorage and activate it
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            const tabTrigger = document.querySelector(`#${savedTab}`);
            const tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        }
    });
</script>