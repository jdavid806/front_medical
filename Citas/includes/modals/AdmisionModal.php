<?php
include '../../../header.php';
include '../../../menu.php';
include '../modals/NewCompanionModal.php';

?>

<link rel="stylesheet" href="./assets/css/styles.css">
<style>
    .board {
        display: flex;
        gap: 20px;
        overflow-x: auto;
    }

    .column-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .column-title {
        font-size: 18px;
        margin-bottom: 10px;
        text-align: center;
    }

    .column {
        width: 250px;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 20em;
    }

    .task {
        border-radius: 5px;
        padding: 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        cursor: grab;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        text-align: center;
    }

    .task strong {
        display: block;
    }

    .task p {
        margin: 5px 0;
    }

    .view-patient-btn {
        margin-top: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        text-align: center;
        display: block;
    }

    .view-patient-btn:hover {
        background-color: #0056b3;
    }

    /* Estilos por estado */
    .column[data-status="Pendientes"] .task {
        background-color: #d3d3d3;
    }

    .column[data-status="En espera de consulta"] .task {
        background-color: #add8e6;
    }

    .column[data-status="En consulta"] .task {
        background-color: #90ee90;
    }

    .column[data-status="Consulta finalizada"] .task {
        background-color: #32cd32;
    }

    .column[data-status="Pre admisión"] .task {
        background-color: rgb(220, 94, 153);
    }

    /* Tema oscuro */
    html[data-bs-theme="dark"] .task {
        color: #000;
    }
</style>

<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="citasControl">Admisiones</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Control de citas</li>
                </ol>
            </nav>
            <div class="row mt-4">
                <div class="card theme-wizard mb-5" data-theme-wizard="data-theme-wizard">
                    <div class="card-header bg-body-highlight pt-3 pb-2 border-bottom-0">
                        <ul class="nav justify-content-between nav-wizard nav-wizard-success" role="tablist">
                            <li class="nav-item" role="presentation"><a class="nav-link active fw-semibold" href="#bootstrap-wizard-validation-tab1" data-bs-toggle="tab" data-wizard-step="1" aria-selected="true" role="tab">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle d-flex"><svg class="svg-inline--fa fa-lock" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                    <path fill="currentColor" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path>
                                                </svg><!-- <span class="fas fa-lock"></span> Font Awesome fontawesome.com --></span></span><span class="d-none d-md-block mt-1 fs-9">Datos del paciente</span></div>
                                </a></li>

                            <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-validation-tab2" data-bs-toggle="tab" data-wizard-step="2" aria-selected="false" tabindex="-1" role="tab">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle d-flex"><svg class="svg-inline--fa fa-user" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                    <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                                                </svg><!-- <span class="fas fa-user"></span> Font Awesome fontawesome.com --></span></span><span class="d-none d-md-block mt-1 fs-9">Agregar ítems</span></div>
                                </a></li>
                            <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab3" data-bs-toggle="tab" data-wizard-step="3" aria-selected="false" tabindex="-1" role="tab">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle d-flex"><svg class="svg-inline--fa fa-file-lines" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-lines" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg="">
                                                    <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path>
                                                </svg><!-- <span class="fas fa-file-alt"></span> Font Awesome fontawesome.com --></span></span><span class="d-none d-md-block mt-1 fs-9">Previsualización</span></div>
                                </a></li>
                            <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab4" data-bs-toggle="tab" data-wizard-step="4" aria-selected="false" tabindex="-1" role="tab">
                                    <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle d-flex"><svg class="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                    <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
                                                </svg><!-- <span class="fas fa-check"></span> Font Awesome fontawesome.com --></span></span><span class="d-none d-md-block mt-1 fs-9">Hecho</span></div>
                                </a></li>
                        </ul>
                    </div>
                    <div class="card-body pt-4 pb-0">
                        <div class="tab-content">
                            <div class="tab-pane active" role="tabpanel" aria-labelledby="bootstrap-wizard-validation-tab1" id="bootstrap-wizard-validation-tab1">
                                <!-- Datos del paciente -->
                                <form class="needs-validation was-validated" id="wizardValidationForm1" novalidate="novalidate" data-wizard-form="1">
                                    <div class="card">

                                        <div class=" card-body">
                                            <h5 class="card-title">Información del paciente</h5>
                                            <div class="mb-3 justify-content-end">
                                                <div class="mb-3 text-end">
                                                    <span class="badge bg-secondary m-1" data-bs-toggle="tooltip" data-bs-placement="top" title="" id="typeScheme">

                                                    </span>

                                                    <span class="badge bg-info m-1" data-bs-toggle="tooltip" data-bs-placement="top" title="" id="attentionType">
                                                    </span>
                                                </div>

                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="typeDocumentPatient">Tipo de documento</label>
                                                        <select class="form-select" name="typeDocumentPatient" id="typeDocumentPatient" required>
                                                            <option value="" disabled selected>Seleccione un tipo de documento</option>
                                                            <option value="CI">CI - Cédula de Identidad</option>
                                                            <option value="CR">CR - Carnet de Residencia</option>
                                                            <option value="CM">CM - Carnet de Menor de Edad</option>
                                                            <option value="AN">AN - Acta de Nacimiento</option>
                                                            <option value="LC">LC - Licencia de Conducción</option>
                                                            <option value="OT">OT - Otros</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body text-body" for="numberIdentificationPatient">Número de identificación*</label>
                                                        <input class="form-control" type="number" name="numberIdentificationPatient" id="numberIdentificationPatient">

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body text-body" for="firstNamePatient">Primer Nombre*</label>
                                                        <input class="form-control" type="text" name="firstNamePatient" id="firstNamePatient" placeholder="Primer Nombre">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body text-body" for="middleNamePatient">Segundo Nombre</label>
                                                        <input class="form-control" type="text" name="middleNamePatient" placeholder="Segundo Nombre" id="middleNamePatient">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body text-body" for="lastNamePatient">Primer Apellido*</label>
                                                        <input class="form-control" type="text" name="lastNamePatient" placeholder="Primer apellido" id="lastNamePatient" value="<?php echo $patient['last_name']; ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body text-body" for="secondLastNamePatient">Segundo Apellido</label>
                                                        <input class="form-control" type="text" name="secondLastNamePatient" placeholder="Segundo Apellido" id="secondLastNamePatient">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="dateBirthPatient">Fecha de nacimiento*</label>
                                                        <input class="form-control datetimepicker flatpickr-input" id="dateBirthPatient" name="dateBirthPatient" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" value="<?php echo $patient['date_of_birth']; ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="genderPatient">Género</label>

                                                        <select class="form-control" name="genderPatient" placeholder="Género" id="genderPatient">
                                                            <option value="MALE">Masculino</option>
                                                            <option value="FEMALE">Femenino</option>
                                                            <option value="OTHER">Otro</option>
                                                        </select>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="countryPatient">País</label>
                                                        <select class="form-select" id="countryPatient" name="countryPatient" required>
                                                            <option selected disabled value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label for="departmentPatient" class="form-label">Departamento o provincia</label>
                                                        <select class="form-select" id="departmentPatient" name="departmentPatient" required>
                                                            <option selected disabled value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <!-- <div class="col-sm-6">
                                        <div class="mb-2 mb-sm-0">
                                            <label class="form-label text-body" for="deparmentPatient">Departamento o Estado</label>
                                            <input class="form-control" type="text" name="deparmentPatient" id="deparmentPatient" required="required">
                                        </div>
                                    </div> -->
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label for="cityPatient" class="form-label">Ciudad</label>
                                                        <select class="form-select" id="cityPatient" name="cityPatient" required>
                                                            <option selected disabled value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body text-body" for="addressPatient">Dirección*</label>
                                                        <input class="form-control" type="text" name="addressPatient" id="addressPatient" required="required">
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="row g-3 mb-3">

                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="emailPatient">Correo electrónico*</label>
                                                        <input class="form-control" type="email" id="emailPatient" name="emailPatient" placeholder="Correo electronico" id="email">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="whatsappPatient">WhatsApp*</label>
                                                        <input class="form-control" type="text" name="whatsappPatient" placeholder="Whatsapp" id="whatsappPatient" value="<?php echo $patient['whatsapp']; ?>" required="required">
                                                        <div class="invalid-feedback">El campo es requerido.</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body text-body" for="bloodTypePatient">Tipo de sangre*</label>
                                                        <select class="form-select" name="bloodTypePatient" placeholder="Tipo de sangre" id="bloodTypePatient" required>
                                                            <option selected disabled value="">Seleccione</option>
                                                            <option value="NO_REFIERE">No Refiere</option>
                                                            <option value="O_POSITIVE">O Positivo</option>
                                                            <option value="O_NEGATIVE">O Negativo</option>
                                                            <option value="A_POSITIVE">A Positivo</option>
                                                            <option value="A_NEGATIVE">A Negativo</option>
                                                            <option value="B_POSITIVE">B Positivo</option>
                                                            <option value="B_NEGATIVE">B Negativo</option>
                                                            <option value="AB_POSITIVE">AB Positivo</option>
                                                            <option value="AB_NEGATIVE">AB Negativo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label for="epsPatient" class="form-label">Aseguradora</label>
                                                        <select class="form-select" id="epsPatient" name="epsPatient" required>
                                                            <option selected disabled value="">Seleccione</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <input type="hidden" id="patientIdForUpdate" name="patientIdForUpdate">
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="d-flex justify-content-end">
                                                    <button class="btn btn-primary px-6 px-sm-6" type="button" id="btnUpdatePatient" disabled>
                                                        Actualizar información del paciente
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="card mt-4">

                                        <div class="card-body">
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="form-check form-switch d-flex align-items-center gap-1">
                                                    <input class="form-check-input" id="flexSwitchCheckDefault" type="checkbox">
                                                    <label class="form-check-label text-primary" for="flexSwitchCheckDefault">Acompañante</label>
                                                </div>
                                                <div class="form-check form-switch me-3 d-flex align-items-center gap-1">
                                                    <input class="form-check-input mt-1" id="entitySwitch" type="checkbox">
                                                    <label class="form-check-label text-primary mt-1" for="entitySwitch">Facturación Entidad</label>
                                                </div>
                                                <div class="form-check form-switch me-3 d-flex align-items-center gap-1">
                                                    <input class="form-check-input mt-1" id="consumidorSwitch" type="checkbox">
                                                    <label class="form-check-label text-primary mt-1" for="consumidorSwitch">Facturar consumidor</label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <!-- Información del acompañante -->
                                    <div class="card mt-4" id="infoAcompanante" style="display: none;">

                                        <div class="card-body">
                                            <label for="companionsPatients">Acompañantes</label>
                                            <select class="form-select" id="companionsPatients" name="companionsPatients" aria-label="Default select example">
                                                <option selected="">Seleccionar</option>

                                            </select>

                                        </div>

                                        <div class="card-body" id="companionForm">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <h5 class="card-title mb-0">Información del acompañante</h5>
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-success m-1" id="saveCompanion"><i class="fa-solid fa-floppy-disk"></i> Confirmar</button>
                                                    <button type="button" class="btn btn-info m-1" data-bs-toggle="modal" data-bs-target="#newCompanionModal"><i class="fa-solid fa-pen-to-square"></i> Nuevo</button>

                                                </div>
                                            </div>


                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="typeDocumentAcompanion">Tipo de documento</label>
                                                        <input class="form-control" type="text" name="typeDocumentAcompanion" id="typeDocumentAcompanion" readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label text-body" for="numberIdentificationAcompanion">Número de identificación*</label>
                                                        <input class="form-control" type="number" name="numberIdentificationAcompanion" id="numberIdentificationAcompanion" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="firstNameAcompanion">Primer Nombre*</label>
                                                        <input class="form-control" type="text" name="firstNameAcompanion" placeholder="Primer Nombre" id="firstNameAcompanion" readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label text-body" for="lastNameAcompanion">Primer Apellido*</label>
                                                        <input class="form-control" type="text" name="lastNameAcompanion" placeholder="Primer apellido" id="lastNameAcompanion" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="whatsappAcompanion">WhatsApp*</label>
                                                        <input class="form-control" type="text" name="whatsappAcompanion" placeholder="Whatsapp" id="whatsappAcompanion" readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="relationshipAcompanion">Parentesco*</label>
                                                        <input class="form-control" type="text" name="relationshipAcompanion" placeholder="Parentesco" id="relationshipAcompanion" readonly>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label" for="emailCompanion">Email*</label>
                                                    <input class="form-control" type="text" name="emailCompanion" placeholder="Correo Electronico" id="emailCompanion" readonly>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <!-- Entidad -->
                                    <div class="card mt-4" id="infoEntidad" style="display: none;">
                                        <form class="" id="formEntityInvoice" data-wizard-form="">
                                            <div class=" card-body">
                                                <h5 class="card-title">Información de la entidad</h5>

                                                <div class="row g-3 mb-3">

                                                    <div class="col-sm-6">
                                                        <div class="mb-2">
                                                            <label class="form-label" for="entity">Entidad*</label>
                                                            <input class="form-control" type="text" name="entity" id="entity" readonly>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="mb-2">
                                                            <label class="form-label" for="authorisationNumberEntity">Número de autorizaciónn*</label>
                                                            <input class="form-control" type="text" name="authorisationNumberEntity" id="authorisationNumberEntity">
                                                        </div>
                                                    </div>

                                                    <div class="col-sm-6">
                                                        <div class="mb-2">

                                                            <label class="form-label" for="dateAuthorisation">Fecha de autorización</label>
                                                            <input class="form-control datetimepicker flatpickr-input" id="dateAuthorisation" name="date_authorisation" type="text" placeholder="Fecha de autorización" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">

                                                        </div>
                                                    </div>
                                                    <div id="amountAuthorisationContent" class="col-6">
                                                        <label class="form-label" for="amount">Monto autorizado</label>
                                                        <input class="form-control" id="amountAuthorisation" type="text">
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                </form>


                            </div>
                            <!-- Sección Productos -->

                            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-validation-tab2" id="bootstrap-wizard-validation-tab2">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Seleccionar el producto</h5>
                                        <div class="mb-3 justify-content-end">
                                            <div class="mb-3 text-end">
                                                <span class="badge bg-secondary m-1" data-bs-toggle="tooltip" data-bs-placement="top" title="" id="typeScheme2">

                                                </span>

                                                <span class="badge bg-info m-1" data-bs-toggle="tooltip" data-bs-placement="top" title="" id="attentionType2">
                                                </span>

                                                <span class="badge bg-success m-1" data-bs-toggle="tooltip" data-bs-placement="top" title="" id="category">
                                                </span>
                                            </div>
                                        </div>
                                        <form class="needs-validation" id="wizardValidationForm2" novalidate="novalidate" data-wizard-form="2">
                                            <!-- <div class="row g-3 mb-3">
                                                <div class="col-sm-3">
                                                    <div class="mb-2 mb-sm-0">
                                                        <label class="form-label" for="subsidiary">Eps</label>
                                                        <input class="form-control" type="text" name="subsidiary" placeholder="Sucursal" id="subsidiary" readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-3">
                                                    <div class="mb-2">
                                                        <label class="form-label" for="product">Producto</label>
                                                        <input type="text" class="form-control" name="product" id="product" readonly>
                                                    </div>
                                                </div>

                                                <div class="col-sm-6 d-flex justify-content-end align-items-center">
                                                    <div class="mb-2">
                                                        <button class="btn btn-primary" type="button" id="addService"><i class="fas fa-plus"></i> Agregar servicio</button>
                                                    </div>
                                                </div>


                                            </div> -->


                                            <div class="row align-items-end mb-3">
                                                <div class="col-md-12">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <div class="mb-0">
                                                                <label class="form-label" for="subsidiary">Eps</label>
                                                                <input class="form-control" type="text" name="subsidiary" placeholder="Sucursal" id="subsidiary" readonly>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <div class="mb-0">
                                                                <label class="form-label" for="product">Producto</label>
                                                                <input type="text" class="form-control" name="product" id="product" readonly>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- <div class="col-md-4 mb-0">
                                                    <button class="btn btn-dark w-100" type="button" id="addService">
                                                        <i class="fas fa-plus"></i> Agregar otro procedimiento
                                                    </button>
                                                </div> -->
                                            </div>

                                            <!-- <div class="col-sm-12 d-flex justify-content-end align-items-center">
                                                <div class="mb-2">
                                                    <button class="btn btn-primary" type="button" id="addService"><i class="fas fa-plus"></i> Agregar servicio</button>
                                                </div>
                                            </div> -->



                                            <div id="formProduct" class="d-none">
                                                <h5 class="card-title">Información del procedimiento</h5>

                                                <div class="row g-3 mb-3">
                                                    <div class="col-12">
                                                        <div class="mb-3">
                                                            <label class="form-label" for="services">Procedimiento *</label>
                                                            <select class="form-select" name="services" id="services">
                                                                <option value="">Seleccionar</option>
                                                            </select>
                                                            <div class="invalid-feedback">Por favor seleccione el tipo de atención.</div>
                                                        </div>
                                                    </div>

                                                    <div class="col-12">
                                                        <div class="row align-items-end">
                                                            <!-- Precio -->
                                                            <div class="col-md-3">
                                                                <div class="mb-0">
                                                                    <label class="form-label" for="productPrice">Precio</label>
                                                                    <input class="form-control" type="number" name="productPrice" placeholder="Precio" id="productPrice" readonly>
                                                                    <div class="invalid-feedback">El campo es requerido.</div>
                                                                </div>
                                                            </div>

                                                            <div class="col-md-3">
                                                                <div class="mb-0">
                                                                    <label class="form-label" for="productQuantity">Cantidad</label>
                                                                    <input class="form-control" type="numeric" name="productQuantity" placeholder="Cantidad" id="productQuantity">
                                                                    <div class="invalid-feedback">El campo es requerido.</div>
                                                                </div>
                                                            </div>

                                                            <div class="col-md-3">
                                                                <div class="mb-0">
                                                                    <label class="form-label" for="subtotal">Subtotal</label>
                                                                    <input class="form-control" type="number" name="subtotal" placeholder="Subtotal" id="subtotal" readonly>
                                                                    <div class="invalid-feedback">El campo es requerido.</div>
                                                                </div>
                                                            </div>

                                                            <div class="col-md-3">
                                                                <div class="mb-0">
                                                                    <button class="btn btn-primary w-100 rounded-pill" type="button" id="addProduct">
                                                                        <i class="far fa-plus-square"></i> Agregar producto
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <div class="card">
                                                <div class="card-body">
                                                    <h5 class="card-title">Lista de productos</h5>
                                                    <table class="table" id="productsTable">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" class="small">#</th>
                                                                <th scope="col" class="small">Descripción del Producto</th>
                                                                <th scope="col" class="small">Precio</th>
                                                                <th scope="col" class="small">Cantidad</th>
                                                                <th scope="col" class="small">Impuesto</th>
                                                                <th scope="col" class="small">Total</th>
                                                                <th scope="col" class="small"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="productsTableBody">
                                                            <tr></tr>
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colspan="4" class="text-end"><strong>Total General</strong></td>
                                                                <td><strong id="totalSum">0.00</strong></td>
                                                                <td></td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>

                                            <div class="card mt-4" id="infoFactura">
                                                <div class="card-body">
                                                    <h5 class="card-title">Detalles de la factura</h5>
                                                    <div class="container text-center">
                                                        <div class="row row-cols-2">
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Lista de Método de Pago</h4>
                                                                        <table class="table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col" class="small">#</th>
                                                                                    <th scope="col" class="small">Método de Pago</th>
                                                                                    <th scope="col" class="small">Monto</th>
                                                                                    <th scope="col" class="small"></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody id="paymentsTableBody">
                                                                                <tr></tr>
                                                                            </tbody>
                                                                            <tfoot>
                                                                                <tr>
                                                                                    <td colspan="4" class="text-end"><strong style="font-size: 15px;">Total monto</strong></td>
                                                                                    <td><strong id="totalSumAmount" style="font-size: 15px;">0.00</strong></td>
                                                                                    <td></td>
                                                                                </tr>
                                                                            </tfoot>
                                                                        </table>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Método de Pago</h4>

                                                                        <div class="row g-3">
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="methodPayment">Método de pago</label>
                                                                                <select class="form-select" id="methodPayment">
                                                                                    <option selected="selected">Seleccionar</option>

                                                                                </select>
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="amount">Monto</label>
                                                                                <input class="form-control" id="amount" type="text">
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="numberAuthorisation">Número de autorización</label>
                                                                                <input class="form-control" name="numberAuthorisation" id="numberAuthorisation" type="text">
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <button class="btn btn-primary w-100 rounded-pill" type="button" id="payButton"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Observaciones o notas</h4>
                                                                        <textarea class="form-control" rows="5" id="observation"></textarea>
                                                                        <div class="invalid-feedback">This field is required.</div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col p-2">
                                                                <div class="card">
                                                                    <div class="card-body">
                                                                        <h4 class="card-title">Montos</h4>

                                                                        <div class="row g-3">

                                                                            <div class="col-sm-3 col-md-6 col-lg-12">
                                                                                <label class="form-label" for="pending">Monto Pendiente</label>
                                                                                <input class="form-control" id="pending" type="number" readonly>
                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">

                                                                                <label class="form-label" for="datepicker">Fecha de vencimiento</label>
                                                                                <input class="form-control datetimepicker flatpickr-input" id="datepicker" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">

                                                                            </div>
                                                                            <div class="col-sm-3 col-md-6 col-lg-12">

                                                                                <label class="form-label" for="customFile">Documentos</label>
                                                                                <input class="form-control" id="customFile" type="file">

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <!-- Previsualización -->
                            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab3" id="bootstrap-wizard-tab3">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Previsualización</h5>
                                        <div class="bg-body dark__bg-gray-1100 p-4 mb-4 rounded-2">
                                            <div class="row g-4">
                                                <!-- <div class="col-12 col-lg-6">
                                                    <h6 class="mb-2 small">Datos de la Empresa</h6>
                                                    <div class="row">
                                                        <div class="col-4 small"><strong>Nombre:</strong></div>
                                                        <div class="col-8 text-body-secondary small">HOY Prueba</div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 small"><strong>NIT:</strong></div>
                                                        <div class="col-8 text-body-secondary small">10027319-8</div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 small"><strong>Dirección:</strong></div>
                                                        <div class="col-8 text-body-secondary small" data-field="address">-</div>
                                                    </div>
                                                </div> -->
                                                <div class="col-12">
                                                    <h6 class="mb-2 small">Datos del Cliente</h6>
                                                    <div class="row">
                                                        <div class="col-4 small"><strong>Nombre:</strong></div>
                                                        <div class="col-8 text-body-secondary small" data-field="fullName"></div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 small"><strong>Cédula:</strong></div>
                                                        <div class="col-8 text-body-secondary small" data-field="document"></div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-4 small"><strong>Ciudad:</strong></div>
                                                        <div class="col-8 text-body-secondary small" data-field="city"></div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <!-- Tabla de Productos -->
                                        <div class="px-0">
                                            <div class="table-responsive scrollbar">
                                                <table class="table fs-9 text-body mb-0">
                                                    <thead class="bg-body-secondary">
                                                        <tr>
                                                            <th scope="col" class="small">#</th>
                                                            <th scope="col" class="small">Descripción</th>
                                                            <th class="text-end small" scope="col">Cantidad</th>
                                                            <th class="text-end small" scope="col">Precio</th>
                                                            <th class="text-end small" scope="col">Descuento</th>
                                                            <th class="text-end small" scope="col">Subtotal</th>
                                                            <th scope="col" class="small" style="width: 24px;"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="summaryProductsTableBody">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- Resumen de Pagos -->
                                        <div class="row mt-4">
                                            <div class="col-12 col-lg-6">
                                                <h6 class="mb-3">Métodos de Pago</h6>
                                                <table class="table fs-9 text-body">
                                                    <thead>
                                                        <tr>
                                                            <th class="small">#</th>
                                                            <th class="small">Método de Pago</th>
                                                            <th class="text-end small">Monto</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="summaryPaymentsTableBody">

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="col-12 col-lg-6">
                                                <table class="table fs-9 text-body">
                                                    <tbody>
                                                        <tr>
                                                            <td class="small fw-bold">Subtotal:</td>
                                                            <td class="text-end small" data-field="subtotal"></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="small fw-bold">Total a Pagar:</td>
                                                            <td class="text-end small fw-bold" data-field="total"></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="small fw-bold">Pagado:</td>
                                                            <td class="text-end small" data-field="paid"></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="small fw-bold text-danger">Saldo:</td>
                                                            <td class="text-end small text-danger" data-field="balance"></td>
                                                        </tr>
                                                        <tr>
                                                            <td class="small fw-bold">Total Factura:</td>
                                                            <td class="text-end small fw-bold" data-field="total_invoice"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- Comentarios -->
                                        <!-- <div class="row mt-4">
                                            <div class="col-12">
                                                <h6 class="mb-2">Comentarios:</h6>
                                                <div class="border p-2 rounded">
                                                    <p class="text-body-secondary small mb-0">xxxxxxxxxxxxxxxxxxxxxxxxx</p>
                                                </div>
                                            </div>
                                        </div> -->

                                        <!-- Botones de Acción -->
                                        <!-- <div class="d-flex justify-content-between mt-4">
                                            <button class="btn btn-primary btn-sm small">
                                                <svg class="svg-inline--fa fa-bag-shopping me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bag-shopping" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                                    <path fill="currentColor" d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path>
                                                </svg>
                                                Ver más artículos
                                            </button>
                                            <div>
                                                <button class="btn btn-phoenix-secondary me-2">
                                                    <svg class="svg-inline--fa fa-download me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                                        <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                                                    </svg>
                                                    <span class="d-none d-sm-inline-block small">Descargar Factura</span>
                                                </button>
                                                <button class="btn btn-phoenix-secondary">
                                                    <svg class="svg-inline--fa fa-print me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="print" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                                        <path fill="currentColor" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                                                    </svg>
                                                    <span class="d-none d-sm-inline-block small">Imprimir</span>
                                                </button>
                                            </div>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab4" id="bootstrap-wizard-tab4">
                                <div class="row flex-center pb-8 pt-4 gx-3 gy-4">
                                    <div class="col-12 col-sm-auto">
                                        <div class="d-flex flex-column justify-content-center">
                                            <h5 class="mb-3">Felicidades!</h5>
                                            <p class="text-body-emphasis fs-9">La admisión medica ha sido completada exitosamente </p>

                                            <div class="btn-group me-1 justify-content-center">
                                                <!-- <div class="btn-group me-1">
                                                    <button class="btn dropdown-toggle mb-1 btn-primary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Obtener factura</button>
                                                    <div class="dropdown-menu">

                                                        <a class="dropdown-item" href="#"><i class="fas fa-download me-2"></i> Descargar</a>
                                                        <a class="dropdown-item" href="#"> <i class="fas fa-print me-2"></i> Imprimir</a>
                                                    </div>
                                                </div> -->
                                                <!-- <div class="btn-group me-1">
                                                    <button class="btn dropdown-toggle mb-1 btn-secondary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Enviar factura</button>
                                                    <div class="dropdown-menu">

                                                        <a class="dropdown-item" href="#"><i class="fab fa-whatsapp me-2"></i> Vía whatsApp</a>
                                                        <a class="dropdown-item" href="#"><i class="far fa-envelope me-2"></i> Vía correo electrónico</a>
                                                    </div>
                                                </div> -->
                                                <div class="btn-group me-1">
                                                    <button id="finishInvoiceParent" class="btn dropdown-toggle mb-1 btn-success" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Finalizar factura</button>
                                                    <div class="dropdown-menu">

                                                        <a id="finish" class="dropdown-item" href="#"><i class="fas fa-save me-2"></i>Finalizar</a>
                                                        <a id="downloadInvoice" class="dropdown-item" href="#"><i class="fas fa-save me-2"></i>Descargar factura</a>
                                                        <a id="printInvoice" class="dropdown-item" href="#"><i class="fas fa-save me-2"></i>Imprimir factura</a>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Footer -->
                    <div class="card-footer border-top-0" data-wizard-footer="data-wizard-footer">
                        <div class="d-flex pager wizard list-inline mb-0"><button class="d-none btn btn-link ps-0" id="back_step" type="button" data-wizard-prev-btn="data-wizard-prev-btn"><svg class="svg-inline--fa fa-chevron-left me-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                                    <g transform="translate(160 256)">
                                        <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                            <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" transform="translate(-160 -256)"></path>
                                        </g>
                                    </g>
                                </svg><!-- <span class="fas fa-chevron-left me-1" data-fa-transform="shrink-3"></span> Font Awesome fontawesome.com -->Anterior</button>
                            <div class="flex-1 text-end"><button class="btn btn-primary px-6 px-sm-6" type="submit" id="next_step" data-wizard-next-btn="data-wizard-next-btn">Siguiente<svg class="svg-inline--fa fa-chevron-right ms-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                                        <g transform="translate(160 256)">
                                            <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                                                <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" transform="translate(-160 -256)"></path>
                                            </g>
                                        </g>
                                    </svg><!-- <span class="fas fa-chevron-right ms-1" data-fa-transform="shrink-3"> </span> Font Awesome fontawesome.com --></button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php include "../../../footer.php"; ?>
<script type="module">
    import {
        admissionService,
        productService,
        paymentMethodService,
        userService,
        userServiceMedical,
        appointmentService,
        countryService,
        departmentService,
        cityService,
        entityService,
        patientService
    } from './services/api/index.js';
    import {
        countriesSelect,
        departmentsSelect,
        citiesSelect
    } from './services/selects.js';

    import {
        getJWTPayload,
        getUserLogged
    } from './services/utilidades.js';

    import AlertManager from './services/alertManager.js';

    let updateData = null;
    let id = 0;

    document.addEventListener('DOMContentLoaded', function() {

        document.getElementById('btnUpdatePatient').addEventListener('click', function() {
            updateData = {
                patient: {
                    document_type: document.getElementById('typeDocumentPatient').value,
                    document_number: document.getElementById('numberIdentificationPatient').value,
                    first_name: document.getElementById('firstNamePatient').value,
                    middle_name: document.getElementById('middleNamePatient').value,
                    last_name: document.getElementById('lastNamePatient').value,
                    second_last_name: document.getElementById('secondLastNamePatient').value,
                    gender: document.getElementById('genderPatient').value,
                    date_of_birth: document.getElementById('dateBirthPatient').value,
                    country_id: document.getElementById('countryPatient').value,
                    department_id: document.getElementById('departmentPatient').value,
                    city_id: document.getElementById('cityPatient').value,
                    address: document.getElementById('addressPatient').value,
                    email: document.getElementById('emailPatient').value,
                    whatsapp: document.getElementById('whatsappPatient').value,
                    blood_type: document.getElementById('bloodTypePatient').value,
                },
                social_security: {
                    entity_id: document.getElementById('epsPatient').value
                }
            }

            id = document.getElementById('patientIdForUpdate').value;

            patientService.updatePatient(id, updateData)
                .then(() => {
                    AlertManager.success({
                        text: 'Se ha actualizado el registro exitosamente'
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                })
                .catch(err => {
                    if (err.data?.errors) {
                        AlertManager.formErrors(err.data.errors);
                    } else {
                        AlertManager.error({
                            text: err.message || 'Ocurrió un error inesperado'
                        });
                    }
                });
        });

        document.getElementById('saveCompanion').addEventListener('click', function() {

            updateData = {
                patient: {
                    document_type: document.getElementById('typeDocumentPatient').value,
                    document_number: document.getElementById('numberIdentificationPatient').value,
                    first_name: document.getElementById('firstNamePatient').value,
                    middle_name: document.getElementById('middleNamePatient').value,
                    last_name: document.getElementById('lastNamePatient').value,
                    second_last_name: document.getElementById('secondLastNamePatient').value,
                    gender: document.getElementById('genderPatient').value,
                    date_of_birth: document.getElementById('dateBirthPatient').value,
                    country_id: document.getElementById('countryPatient').value,
                    department_id: document.getElementById('departmentPatient').value,
                    city_id: document.getElementById('cityPatient').value,
                    address: document.getElementById('addressPatient').value,
                    email: document.getElementById('emailPatient').value,
                    whatsapp: document.getElementById('whatsappPatient').value,
                    blood_type: document.getElementById('bloodTypePatient').value,
                },
                social_security: {
                    entity_id: document.getElementById('epsPatient').value
                },
                companions: [{
                    document_type: document.getElementById('typeDocumentAcompanion').value,
                    document_number: document.getElementById('numberIdentificationAcompanion').value,
                    first_name: document.getElementById('firstNameAcompanion').value,
                    middle_name: null,
                    last_name: document.getElementById('lastNameAcompanion').value,
                    second_last_name: null,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('whatsappAcompanion').value,
                    is_active: true,
                    relationship: document.getElementById('relationshipAcompanion').value
                }]
            }
            id = document.getElementById('patientIdForUpdate').value;


            patientService.updatePatient(id, updateData)
                .then(() => {
                    AlertManager.success({
                        text: 'Se ha agregado el acompañante exitosamente'
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                })
                .catch(err => {
                    if (err.data?.errors) {
                        AlertManager.formErrors(err.data.errors);
                    } else {
                        AlertManager.error({
                            text: err.message || 'Ocurrió un error inesperado'
                        });
                    }
                });
        })


        flatpickr("#datepicker", {
            dateFormat: "d/m/Y",
            defaultDate: new Date(), // Establece la fecha actual
            disableMobile: true
        });

        flatpickr("#dateAuthorisation", {
            dateFormat: "d/m/Y",
            defaultDate: new Date(), // Establece la fecha actual
            disableMobile: true
        });

        initializeAdmissionInfo();
        // Inicializa Choices.js en todos los <select> con el atributo data-choices
        initializeChoices();

        // Maneja el cambio del interruptor "Acompañante"
        handleSwitchChange('flexSwitchCheckDefault', 'infoAcompanante');

        // Maneja el cambio del interruptor "Entidad"

        handleSwitchChange('entitySwitch', 'infoEntidad', function(isChecked) {
            // Recuperar productId y admission antes de actualizar la tabla
            const productId = obtenerProductId(); // Asegúrate de definir esta función o variable
            const admission = obtenerAdmission(); // Asegúrate de definir esta función o variable

            refreshProductsTable(productId, admission, isChecked);
        });

        // Maneja el cambio del interruptor "Autorización"
        toggleAuthorizationField();

        getProducts();

        // Maneja el cambio del producto seleccionado
        handleProductChange('product', 'productPrice', 'tax', 'taxValue');

        // Maneja el evento de cambio de cantidad y descuento para calcular el subtotal
        handleInputChange('productQuantity', 'productPrice', 'subtotal');

        // Maneja el evento de clic del botón "Agregar"
        handleAddProductClick('addProduct', 'productPrice', 'productQuantity', 'subtotal', 'productsTableBody');

        // Maneja el evento de clic del botón "Pagar"
        handlePayButtonClick('payButton', 'methodPayment', 'amount', 'paymentsTableBody');

        // Maneja el cambio en el <select> de relaciones
        //handleRelationChange('relationSelect', 'companionForm');

        // Formatea el campo de entrada de monto con separadores de miles
        handleFormatAmountInput('amount');
        handleFormatAmountInput('amountAuthorisation');

        // Maneja el evento de clic del botón "Eliminar"
        handleRemoveRequiredAttribute(['authorisationNumber', 'secondField', 'thirdField']);


        //mostar el formulario de agregar producto
        // showFormAddProduct();

        // Consultar los métodos de pago
        getPaymentMethods();

        // Sincronizar las tablas
        syncTables(); // Sincronizar productos
        syncPaymentTables(); // Sincronizar pagos al inicio
        getUserLogged();

        // Iniciar el observer DESPUÉS de la carga inicial
        const paymentObserver = new MutationObserver(() => {
            syncPaymentTables(); // Sincronizar ante cambios
        });

        paymentObserver.observe(document.getElementById('paymentsTableBody'), {
            childList: true, // Detecta añadir/eliminar filas
            subtree: true, // Detecta cambios en celdas
        });

    });

    document.getElementById('entitySwitch').addEventListener('change', function() {
        getProducts();
    })

    // Observer para productos
    const productsObserver = new MutationObserver(() => syncTables());
    productsObserver.observe(document.getElementById('productsTableBody'), {
        childList: true,
        subtree: true,
    });



    function syncTables() {
        const productsTableBody = document.getElementById('productsTableBody');
        const summaryTableBody = document.getElementById('summaryProductsTableBody');
        // Limpiar la tabla de resumen
        summaryTableBody.innerHTML = '';

        // Obtener todas las filas de la tabla de productos
        const productRows = productsTableBody.querySelectorAll('tr');

        // Recorrer cada fila y agregarla a la tabla de resumen
        productRows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');

            // Extraer los valores de la fila
            const productId = cells[0].textContent; // Nombre del producto
            const productName = cells[1].textContent; // Nombre del producto
            const productPrice = cells[2].textContent; // Precio
            const productQuantity = 1; // Cantidad
            const subtotal = cells[2].textContent; // Subtotal

            // Crear la fila para la tabla de resumen
            const summaryRow = document.createElement('tr');
            summaryRow.innerHTML = `
            <td class="align-middle small">${productId}</td>
            <td class="align-middle small">${productName}</td>
            <td class="align-middle small text-end">${productQuantity}</td>
            <td class="align-middle small text-end">${productPrice} </td>
            <td class="align-middle small text-end">0 </td>
            <td class="align-middle small text-end">${subtotal} </td>
            <td class="border-0"></td>
        `;

            // Agregar la fila a la tabla de resumen
            summaryTableBody.appendChild(summaryRow);
        });
    }


    // Función para sincronizar las tablas de métodos de pago
    function syncPaymentTables() {
        const paymentsTableBody = document.getElementById('paymentsTableBody');
        const summaryPaymentsTableBody = document.getElementById('summaryPaymentsTableBody');
        const rows = paymentsTableBody.getElementsByTagName('tr');
        summaryPaymentsTableBody.innerHTML = ''; // Limpiar tabla resumen

        Array.from(rows).forEach((row, index) => {
            const cells = row.querySelectorAll('td');

            if (cells.length) {
                // Verificar que los índices sean correctos:
                const paymentMethod = cells[1].textContent; // Columna 2: Método
                const paymentAmount = cells[2].textContent; // Columna 3: Monto

                // Crear fila en la tabla de resumen
                const summaryRow = document.createElement('tr');
                summaryRow.innerHTML = `
                <td class="small">${index + 1}</td>
                <td class="small">${paymentMethod}</td>
                <td class="text-end small">${paymentAmount}</td>
            `;
                summaryPaymentsTableBody.appendChild(summaryRow);
            }

        });
    }


    function toggleAuthorizationField() {
        const methodPayment = document.getElementById('methodPayment');
        const numberAuthorisation = document.getElementById('numberAuthorisation');

        if (!methodPayment || !numberAuthorisation) return;

        const hiddenMethods = [2, 3]; // Aquí están los IDs de los métodos de pago que deben ocultar el campo de autorización

        function updateVisibility() {
            if (hiddenMethods.includes(parseInt(methodPayment.value))) {
                numberAuthorisation.closest('.col-sm-3').style.display = 'none';
            } else {
                numberAuthorisation.closest('.col-sm-3').style.display = 'block';
            }
        }

        methodPayment.addEventListener('change', updateVisibility);
        updateVisibility(); // Ejecutar al cargar la página
    }


    function initializeAdmissionInfo() {
        // Obtener el ID de la cita desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const citaId = urlParams.get('id_cita');

        if (!citaId) {
            console.error('ID de cita no encontrado en la URL');
            return;
        }
        getAdmissionInfo(citaId);
    }

    function initializeChoices() {
        const selectElements = document.querySelectorAll('select[data-choices]');
        selectElements.forEach((selectElement) => {
            const options = JSON.parse(selectElement.getAttribute('data-choices'));
            const defaultOptions = {
                removeItemButton: true,
                placeholder: true,
                searchEnabled: true,
            };
            const finalOptions = {
                ...defaultOptions,
                ...options
            };
            new Choices(selectElement, finalOptions);
        });
    }

    // function showFormAddProduct() {
    //     const addProductButton = document.getElementById('addService');
    //     const formProduct = document.getElementById('formProduct');
    //     const infoFactura = document.getElementById('infoFactura');

    //     addProductButton.addEventListener('click', function() {
    //         // Verifica el estado de display del formulario y lo alterna
    //         if (formProduct.style.display === 'block') {
    //             formProduct.style.display = 'none'; // Oculta el formulario
    //             infoFactura.style.display = 'none'; // Muestra la información de la factura

    //         } else {
    //             formProduct.style.display = 'none'; // Muestra el formulario
    //             infoFactura.style.display = 'block'; // Oculta la información de la factura
    //         }
    //     });
    // }



    function handleSwitchChange(switchId, targetId, callback) {
        const switchElement = document.getElementById(switchId);
        const targetElement = document.getElementById(targetId);

        // Obtener los elementos que deben mostrarse solo si la entidad está activa
        const formProduct = document.getElementById('formProduct');
        // const addService = document.getElementById('addService');

        switchElement.addEventListener('change', function() {
            if (this.checked) {
                targetElement.style.display = 'block';
                // addService.style.display = 'none';
            } else {
                targetElement.style.display = 'none';
                // addService.style.display = 'block';
            }

            // Ejecutar el callback si se proporciona
            if (callback) {
                callback(this.checked);
            }
        });
    }



    // Llamar a la función para inicializar el listener
    handleSwitchChange('flexSwitchCheckDefault', 'infoAcompanante');


    function handleProductChange(selectId, productPriceInputId) {
        document.getElementById(selectId).addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const productPrice = selectedOption.getAttribute('data-price');
            document.getElementById(productPriceInputId).value = productPrice;


        });
    }


    function handleInputChange(productQuantityInputId, productPriceInputId, subtotalInputId) {
        const productQuantityInput = document.getElementById(productQuantityInputId);
        const productPriceInput = document.getElementById(productPriceInputId);
        const subtotalInput = document.getElementById(subtotalInputId);

        function calculateSubtotal() {
            const productPrice = parseFloat(productPriceInput.value) || 0;
            const productQuantity = parseFloat(productQuantityInput.value) || 0;
            const subtotal = productPrice * productQuantity;
            subtotalInput.value = subtotal;
        }

        productQuantityInput.addEventListener('input', calculateSubtotal);
    }

    function handleRemoveRequiredAttribute(fieldIds) {
        fieldIds.forEach(function(id) {
            var inputElement = document.getElementById(id);
            if (inputElement) {
                inputElement.removeAttribute('required');
            }
        });
    }

    let total = 0;

    function handleAddProductClick(buttonId, productPriceInputId, productQuantityInputId, subtotalInputId, tableBodyId) {
        document.getElementById(buttonId).addEventListener('click', async function() {
            const productId = document.getElementById('services').value;

            const product = productDataMap[productId]; // Obtiene los datos del producto del objeto
            const productPrice = parseFloat(document.getElementById(productPriceInputId).value);
            const productQuantity = parseFloat(document.getElementById(productQuantityInputId).value);

            const subtotal = productPrice * productQuantity;
            const total = // Calcular el total de todos los productos

                // Limpiar campos
                document.getElementById('productQuantity').value = '';
            document.getElementById('subtotal').value = '';
            document.getElementById('productPrice').value = '';

            if (productQuantity) {
                addRowToProductTable([productId, product.name, productPrice, productQuantity, product.taxes ? product.taxes[0].percentage : 0, subtotal], tableBodyId);
            } else {
                alert('Por favor, completa todos los campos correctamente.');
            }
        });
    }


    function handlePayButtonClick(buttonId, methodSelectId, amountInputId, tableBodyId) {
        document.getElementById(buttonId).addEventListener('click', function() {
            const methodPayment = document.getElementById(methodSelectId).value;
            const amountInput = document.getElementById(amountInputId).value.replace(/\./g, ''); // Remover los puntos antes de convertir a número
            const amount = parseFloat(amountInput);

            calculatedAmountToPaid();


            if (methodPayment !== 'Seleccionar') {
                const formattedAmount = new Intl.NumberFormat('es-CO').format(amount); // Formatear el monto con puntos
                addRowToPaymentTable([methodPayment, formattedAmount], tableBodyId);

                //limpiar campos
                document.getElementById('methodPayment').value = 'Seleccionar';
                document.getElementById('amount').value = '';
            } else {
                alert('Por favor, selecciona un método de pago e ingresa un monto.');
            }
        });
    }

    function calculatedAmountToPaid() {
        const pending = document.getElementById('pending');
        const buttonStep = document.getElementById('next_step');
        const sumAmount = document.getElementById('totalSum');
        const sumAmountPayment = document.getElementById('totalSumAmount');

        setTimeout(() => {
            let sumAmountValue = parseFloat(sumAmount.textContent).toFixed(0);
            let sumAmountPaymentValue = parseFloat(sumAmountPayment.textContent).toFixed(0);
            pending.value = sumAmountValue - sumAmountPaymentValue;

            if (pending.value == 0) {
                buttonStep.disabled = false;
            } else {
                buttonStep.disabled = true;
            }

        }, 1000);
    }

    function addRowToProductTable(values, tableBodyId) {

        const tableBody = document.getElementById(tableBodyId);
        const summaryTableBody = document.getElementById('summaryProductsTableBody'); // Nueva tabla
        const rowCount = tableBody.rows.length + 1;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td class="small">${values[0]}</td>
        <td class="small">${values[1]}</td>
        <td class="small">${values[2]}</td>
        <td class="small">${values[3]}</td>
        <td class="small">${values[4]}</td>
        <td class="small">${values[5]}</td>
        <td class="small"><i class="far fa-trash-alt text-danger" onclick="removeRow(this)"></i></td>
    `;
        tableBody.appendChild(row);

        // Agregar fila a la nueva tabla
        const summaryRow = document.createElement('tr');
        summaryRow.innerHTML = `
        <td class="align-middle small">${rowCount}</td>
        <td class="align-middle small">${values[0]}</td>
        <td class="align-middle small text-end">${values[2]}</td>
        <td class="align-middle small text-end">${values[1]} COP</td>
        <td class="align-middle small text-end">0 COP</td>
        <td class="align-middle small text-end">${values[4]} COP</td>
        <td class="border-0"></td>
    `;
        summaryTableBody.appendChild(summaryRow);
        updateTotal();
    }

    // Función para agregar métodos de pago a ambas tablas
    function addRowToPaymentTable(values, tableBodyId) {
        const jsonPaymentmethod = JSON.parse(values[0]);
        values[0] = jsonPaymentmethod.method;
        const tableBody = document.getElementById(tableBodyId);
        const rowCount = jsonPaymentmethod.id;

        // Convertir valores
        switch (values[0]) {
            case '1':
                values[0] = 'Paypal';
                break;
            case '2':
                values[0] = 'Efectivo';
                break;
            case '3':
                values[0] = 'Tarjeta de crédito';
                break;
            case '4':
                values[0] = 'Tarjeta de débito';
                break;
        }

        // Formatear monto
        // values[1] = new Intl.NumberFormat('es-CO', {
        //     style: 'currency',
        //     currency: 'COP'
        // }).format(values[1]);

        // Crear fila
        const row = document.createElement('tr');
        row.innerHTML = `
        <td class="small">${rowCount}</td>
        <td class="small">${values[0]}</td>
        <td class="small">${values[1]}</td>
        <td class="small"><i class="far fa-trash-alt text-danger" onclick="removeRow(this)"></i></td>
    `;

        // Agregar solo a la tabla principal
        tableBody.appendChild(row);
        updateTotalAmount();
        syncPaymentTables();
    }




    window.removeRow = function(element) {
        const row = element.closest('tr');
        row.remove();
        updateTotal();
        updateTotalAmount();
    };



    function handleRelationChange(selectId, formId) {
        const relationSelect = document.getElementById(selectId);
        const companionForm = document.getElementById(formId);
        const editButton = document.querySelector('button[onclick="editCompanion()"]');

        // Inicialmente deshabilitar el formulario y limpiar los datos
        clearForm(companionForm);

        relationSelect.addEventListener('change', function() {
            const selectedValue = this.value;

            if (selectedValue !== '') {
                loadCompanionData();
            } else {
                clearForm(companionForm);
            }
        });

        editButton.addEventListener('click', function() {
            enableForm(companionForm, true);
        });

        // Función para habilitar o deshabilitar el formulario
        function enableForm(form, enable) {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.readonly = !enable;
            });
        }

        // Función para limpiar los datos del formulario
        function clearForm(form) {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.value = '';
            });
        }

        // Función para cargar los datos del acompañante
        function loadCompanionData() {
            // Información ficticia para cargar en el formulario
            const companionData = {
                typeDocument: 'CC',
                document: '123456789',
                firstName: 'Juan',
                secondName: 'Carlos',
                lastName: 'Pérez',
                secondLastName: 'Gómez',
                whatsapp: '3001234567',
                relationship: 'Amigo'
            };

            // Asignar los valores a los campos del formulario
            document.getElementById('bootstrap-wizard-validation-type-document').value = companionData.typeDocument;
            document.getElementById('numberIdentification').value = companionData.document;
            document.getElementById('firstName').value = companionData.firstName;
            document.getElementById('secondName').value = companionData.secondName;
            document.getElementById('lastName').value = companionData.lastName;
            document.getElementById('secondLastName').value = companionData.secondLastName;
            document.getElementById('whatsapp').value = companionData.whatsapp;
            document.getElementById('relationship').value = companionData.relationship;

            // Mantener el formulario deshabilitado después de cargar los datos
            enableForm(companionForm, false);
        }
    }

    function editCompanion() {
        const companionForm = document.getElementById('companionForm');
        enableForm(companionForm, true);
    }


    // Define la función formatAmountInput
    function handleFormatAmountInput(inputId) {

        const amountInput = document.getElementById(inputId);

        amountInput.addEventListener('input', function(event) {

            let value = event.target.value;
            value = value.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos
            value = new Intl.NumberFormat('es-CO').format(value); // Formatear con puntos
            event.target.value = value;
        });
    }


    function updateTableAdmissions(list, template, admissiones) {
        list.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

        admissiones.forEach(consulta => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('#nombre').textContent = `${consulta.patient.first_name} ${consulta.patient.last_name}`;
            clone.querySelector('#documento').textContent = consulta.patient.document_number;
            clone.querySelector('#fecha-consulta').textContent = consulta.appointment_date;
            clone.querySelector('#hora-consulta').textContent = consulta.appointment_time;
            clone.querySelector('#profesional').textContent = `${consulta.user_availability.user.first_name} ${consulta.user_availability.user.last_name}`;
            clone.querySelector('#entidad').textContent = consulta.patient?.social_security?.entity?.name || "No tiene EPS";


            clone.querySelector('#generar-admision').href = `generar_admision?id_cita=${consulta.id}`;
            list.appendChild(clone);

        });
    }

    async function getProducts() {
        try {
            const response = await productService.getAllProducts(); // ya retorna JSON
            let products;
            if (response.data && Array.isArray(response.data)) {
                products = response.data; // Estructura correcta
            } else if (Array.isArray(response)) {
                products = response; // Caso en que los productos están directamente en la respuesta
            } else {
                console.error("Estructura de respuesta desconocida");
            }
            // let productsFilter = products.filter(product => product.attributes.attention_type == "LABORATORY");
            // console.log("productos: ", productsFilter);

            populateProductSelect(products);
            handleProductChange('services', 'productPrice'); // Llamada a handleProductChange después de llenar el select
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    async function getPaymentMethods() {
        try {
            const response = await paymentMethodService.getPaymentMethods(); // ya retorna JSON
            if (response) {
                populatePaymentMethods(response);
            } else {
                console.error("Estructura de respuesta desconocida");
            }
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    function populatePaymentMethods(paymentMethods) {
        const paymentMethodSelect = document.getElementById('methodPayment');
        if (Array.isArray(paymentMethods)) {
            paymentMethods.forEach(paymentMethod => {
                const option = document.createElement('option');
                option.value = JSON.stringify(paymentMethod);
                option.textContent = paymentMethod.method;
                paymentMethodSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un array de métodos de pago');
        }
    }


    const productDataMap = {};

    function populateProductSelect(products) {
        const entitySwitch = document.getElementById('entitySwitch');
        const productSelect = document.getElementById('services');
        productSelect.innerHTML = '';

        if (Array.isArray(products)) {
            products.forEach(product => {
                const attributes = product.attributes;
                if (attributes && attributes.name) {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = attributes.name;
                    if (entitySwitch.checked) {
                        option.setAttribute('data-price', attributes.copayment);
                    } else {
                        option.setAttribute('data-price', attributes.sale_price);
                    }
                    productSelect.appendChild(option);

                    // Almacena los datos del producto en el objeto productDataMap
                    productDataMap[product.id] = {
                        name: attributes.name,
                        price: entitySwitch.checked ? attributes.copayment : attributes.sale_price,
                        taxes: product.taxes
                    };
                } else {
                    console.error('El producto o sus atributos son undefined:', product);
                }
            });
        } else {
            console.error('No se encontró un array de productos');
        }
    }


    // Obtener la información del producto por ID
    let globalProduct = null;

    function getProductId(productId, admission) {
        return productService.getProductById(productId) // 👈 Ahora retornamos la promesa
            .then(response => {
                const product = response;
                globalProduct = product; // Asegúrate de que la estructura de la respuesta sea correcta

                addProductToTable(product, admission); // Agregar el producto a la tabla
                populateProductInput(product); // Llenar el input con la información del producto
                return product; // 👈 Retornar el producto por si se necesita en otra parte
            })
            .catch(error => {
                console.error('Error al obtener el producto:', error);
            });
    }


    async function refreshProductsTable(productId, admission, isEntityActive) {
        const tableBody = document.getElementById('productsTableBody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de volver a llenarla

        if (!productId) {
            console.warn("No hay productId disponible.");
            return;
        }

        try {
            const product = await getProductId(productId, admission); // 👈 Esperamos la respuesta
            addProductToTable(product, admission, isEntityActive); // Agregamos el producto con el estado del toggle
        } catch (error) {
            console.error("Error al actualizar la tabla:", error);
        }
    }

    document.getElementById('productsTableBody').addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-trash-alt')) {
            event.target.closest('tr').remove();
        }
    });



    function populateProductInput(product) {
        // Obtener el campo de entrada por su id
        const productInput = document.getElementById('product');
        const productPrice = document.getElementById('productPrice');


        // Verificar si el campo de entrada y el producto existen
        if (productInput && product) {
            // Asignar el nombre del producto al campo de entrada
            productInput.value = product.name || 'Producto sin nombre'; // Asignar un valor predeterminado si el nombre es null

            // Asignar el precio del producto al campo de entrada
            productPrice.value = product.copayment || 0; // Asignar un valor predeterminado si el precio es null

        } else {
            console.error('No se pudo encontrar el campo de entrada o la información del producto.');
        }
    }

    async function getEntities() {
        try {
            const data = await entityService.getAll();

            populateEntitySelect(data.data);
        } catch (error) {
            console.error('Error al obtener las entidades:', error);
        }
    }

    function populateEntitySelect(entities) {
        const entitySelect = document.getElementById('epsPatient');
        entities.forEach(entity => {
            const option = document.createElement('option');
            option.value = entity.id;
            option.textContent = entity.name;
            entitySelect.appendChild(option);
        });
    }

    getEntities();

    let globalProductId = null;
    let globalAdmission = null;
    async function getAdmissionInfo(citaId) {
        try {
            // Llamar al servicio para obtener los datos de la admisión
            const admission = await appointmentService.get(citaId);
            globalAdmission = admission;


            const subsidiary = document.getElementById('subsidiary');
            subsidiary.value = admission.patient?.social_security?.entity?.name || "No tiene EPS";
            if (admission.product_id) {
                globalProductId = admission.product_id; // Guardamos productId globalmente
                getProductId(globalProductId, admission);
            }

            // Verificar si se recibió la información correctamente
            if (admission && admission.patient && admission.patient.companions && admission.user_availability && admission.appointment_date && admission.appointment_time) {
                /* Información del paciente */
                setElementValue('select[name="typeDocumentPatient"]', admission.patient.document_type);
                setElementValue('input[name="numberIdentificationPatient"]', admission.patient.document_number);
                setElementValue('input[name="firstNamePatient"]', admission.patient.first_name);
                setElementValue('input[name="middleNamePatient"]', admission.patient.middle_name);
                setElementValue('input[name="lastNamePatient"]', admission.patient.last_name);
                setElementValue('input[name="secondLastNamePatient"]', admission.patient.second_last_name);
                setElementValue('input[name="dateBirthPatient"]', admission.patient.date_of_birth);
                setElementValue('select[name="genderPatient"]', admission.patient.gender);
                setElementValue('input[name="countryPatient"]', admission.patient.country_id);
                setElementValue('input[name="cityPatient"]', admission.patient.city_id);
                setElementValue('input[name="addressPatient"]', admission.patient.address);
                setElementValue('input[name="emailPatient"]', admission.patient.email);
                setElementValue('select[name="bloodTypePatient"]', admission.patient.blood_type);
                setElementValue('select[name="epsPatient"]', admission.patient.social_security?.entity_id);
                setElementValue('input[name="whatsappPatient"]', admission.patient.whatsapp);
                setElementValue('input[name="patientIdForUpdate"]', admission.patient.id);

                const countrySelect = document.getElementById('countryPatient');
                const deptSelect = document.getElementById('departmentPatient');
                const citySelect = document.getElementById('cityPatient');

                const countries = await countryService.getAll()
                const countryId = countries.data.find((country) => country.name === admission.patient.country_id).id

                const departments = await departmentService.getByCountry(countryId);
                const departmentId = departments.find((department) => department.name === admission.patient.department_id).id

                await countriesSelect(countrySelect, (selectedCountry) => {
                    const selectedCountryId = selectedCountry.customProperties.id;
                    departmentsSelect(
                        deptSelect,
                        selectedCountryId,
                        (selectedDepartment) => {
                            citiesSelect(citySelect, selectedDepartment.customProperties.id, () => {});
                        }
                    );
                }, admission.patient.country_id);

                await departmentsSelect(deptSelect, countryId, (selectedDepartment) => {
                    citiesSelect(citySelect, selectedDepartment.customProperties.id, () => {});
                }, admission.patient.department_id);

                await citiesSelect(citySelect, departmentId, () => {}, admission.patient.city_id);

                document.getElementById('btnUpdatePatient').removeAttribute('disabled');

                /* Información de los acompañantes */
                const companionsSelect = document.querySelector('select[name="companionsPatients"]');
                companionsSelect.innerHTML = '<option selected="">Seleccionar</option>'; // Limpiar opciones previas

                admission.patient.companions.forEach(companion => {
                    const option = document.createElement('option');
                    option.value = companion.id; // Suponiendo que cada acompañante tiene un id único
                    option.textContent = `${companion.first_name} ${companion.last_name}`;
                    companionsSelect.appendChild(option);
                });

                companionsSelect.addEventListener('change', function() {
                    const selectedCompanionId = this.value;
                    const selectedCompanion = admission.patient.companions.find(companion => companion.id == selectedCompanionId);

                    if (selectedCompanion) {
                        setElementValue('input[name="typeDocumentAcompanion"]', selectedCompanion.document_type);
                        setElementValue('input[name="numberIdentificationAcompanion"]', selectedCompanion.document_number);
                        setElementValue('input[name="firstNameAcompanion"]', selectedCompanion.first_name);
                        setElementValue('input[name="lastNameAcompanion"]', selectedCompanion.last_name);
                        setElementValue('input[name="whatsappAcompanion"]', selectedCompanion.mobile);
                        setElementValue('input[name="relationshipAcompanion"]', selectedCompanion.pivot.relationship);
                        setElementValue('input[name="emailCompanion"]', selectedCompanion.email);
                    }
                });

                /* Información de la entidad */
                let eps = admission.patient?.social_security?.entity?.name || "No tiene eps";
                setElementValue('input[name="entity"]', eps);

                /* Etiquetas */
                const typeScheme = document.getElementById('typeScheme');
                const attentionType = document.getElementById('attentionType');
                const typeScheme2 = document.getElementById('typeScheme2');
                const attentionType2 = document.getElementById('attentionType2');
                const category = document.getElementById('category');

                if (typeScheme && attentionType && typeScheme2 && attentionType2 && category) {
                    typeScheme.textContent = admission.patient?.social_security.type_scheme;
                    typeScheme.setAttribute('title', `Tipo de esquema: ${admission.patient?.social_security.type_scheme}`);

                    attentionType.textContent = admission.patient?.social_security.affiliate_type;
                    attentionType.setAttribute('title', `Tipo de afiliado: ${admission.patient?.social_security?.affiliate_type}`);

                    typeScheme2.textContent = admission.patient?.social_security?.type_scheme;
                    typeScheme2.setAttribute('title', `Tipo de esquema: ${admission.patient?.social_security?.type_scheme}`);

                    attentionType2.textContent = admission.attention_type === 'PROCEDURE' ? 'Procedimiento' : 'Consulta';
                    attentionType2.setAttribute('title', `Tipo de atención: ${admission.attention_type}`);

                    category.textContent = admission.patient?.social_security?.category;
                    category.setAttribute('title', `Categoría: ${admission.patient?.social_security?.category}`);
                }

                /* Datos del Cliente */
                setElementValue('#name', admission.patient.first_name);
                setElementValue('#clientDocument', admission.patient.document_number);

                /* Mostrar información del paciente en otras partes del DOM */
                setElementValue('.row .col-8.text-body-secondary[data-field="fullName"]', `${admission.patient.first_name} ${admission.patient.last_name}`);
                setElementValue('.row .col-8.text-body-secondary[data-field="document"]', admission.patient.document_number);
                setElementValue('.row .col-8.text-body-secondary[data-field="city"]', admission.patient.city_id);
                setElementValue('.row .col-8.text-body-secondary[data-field="address"]', admission.patient.address);

            } else {
                console.error('La respuesta de la API no contiene los datos esperados');
            }
        } catch (error) {
            console.error('Error al obtener la información de la admisión:', error);
        }
    }

    function setElementValue(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            if (element.tagName === "INPUT" || element.tagName === "SELECT") {
                element.value = value;
            } else {
                element.textContent = value;
            }
        }
    }

    function obtenerProductId() {
        return globalProductId;
    }

    function obtenerAdmission() {
        return globalAdmission;
    }

    let priceByEntity = null;

    function addProductToTable(product, admission, isEntityActive) {


        priceByEntity = product.entities.find(entity => entity.entity_id == admission.patient?.social_security?.entity_id) || false;



        if (globalProduct.attention_type == "LABORATORY") {
            showMultipleProducts();
        }

        const tableBody = document.getElementById('productsTableBody');
        const entitySwitch = document.getElementById('entitySwitch');

        if (!tableBody) {
            console.error('No se pudo encontrar el cuerpo de la tabla con el id "productsTableBody".');
            return;
        }

        tableBody.innerHTML = '';

        // Mapeo de cuotas moderadoras y copagos
        const cuotaModeradoraMap = {
            "Contributivo_Categoría A": {
                cuota: 4500,
                copago: "11%"
            },
            "Contributivo_Categoría B": {
                cuota: 11300,
                copago: "17%"
            },
            "Contributivo_Categoría C": {
                cuota: 41000,
                copago: "21%"
            },
            "Subsidiado_Nivel 2": {
                cuota: 0,
                copago: "10%"
            }
        };

        const key = `${admission.patient?.social_security?.type_scheme}_${admission.patient?.social_security?.category}`;

        // Agregar fila del producto
        const productRow = document.createElement('tr');
        if (isEntityActive && cuotaModeradoraMap[key]) {
            productRow.innerHTML = `
            <td class="small">${product.name || 'Producto sin nombre'}</td>
            <td class="small">0</td>
            <td class="small">1</td>
            <td class="small">0</td>
            <td class="small">0</td>
            <td class="small"><i class="far fa-trash-alt text-danger" onclick="removeRow(this)"></i></td>
            <td></td>
        `;
        } else {
            if (!product.error) {
                let validationPriceProduct = entitySwitch.checked ? product.copayment : product.sale_price;
                const priceProduct = new Intl.NumberFormat('es-CO').format(validationPriceProduct);
                const totalPrice = new Intl.NumberFormat('es-CO').format(validationPriceProduct);
                productRow.innerHTML = `
            <td class="small">${product.id}</td>
            <td class="small">${product.name || 'Producto sin nombre'}</td>
            <td class="small">${ entitySwitch.checked ? product.copayment : product.sale_price || 'N/A'}</td>
            <td class="small">1</td>
            <td class="small">${product.taxes || '0'}</td>
            <td class="small">${ entitySwitch.checked ? totalPrice : totalPrice || 'N/A'}</td>
            <td class="small"><i class="far fa-trash-alt text-danger" onclick="removeRow(this)"></i></td>
            <td></td>
        `;
            }

        }
        tableBody.appendChild(productRow);

        // Agregar fila de Cuota/Copago si aplica
        if (isEntityActive && cuotaModeradoraMap[key]) {
            const {
                cuota,
                copago
            } = cuotaModeradoraMap[key];
            const isConsulta = admission.attention_type === 'Consulta';
            const rowName = isConsulta ? 'Cuota Moderadora' : 'Copago';

            // Calcular el valor a mostrar (para Procedimiento, el monto es el porcentaje aplicado al precio del producto)
            const displayAmount = isConsulta ? cuota : (parseFloat(copago.replace('%', '')) / 100 * (product.sale_price || 0));
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td class="small">${rowName}</td>
            <td class="small">${isConsulta ? cuota : displayAmount.toFixed(2)}</td>
            <td class="small">1</td>
            <td class="small">0</td>
            <td class="small">${isConsulta ? cuota : displayAmount.toFixed(2)}</td>
            <td class="small"><i class="far fa-trash-alt text-danger" onclick="removeRow(this)"></i></td>
            <td class="small">${copago}</td>
        `;
            tableBody.appendChild(newRow);
        }
        updateTotal();
    }

    function showMultipleProducts() {
        document.getElementById('formProduct').classList.remove('d-none');
    }

    function validateAmountPriceByEntity() {


    }

    function getDataToPrices(product, patient) {

        const entityCreate = {
            entity_id: patient?.social_security?.entity_id,
            price: document.getElementById('amountAuthorisation').value,
            tax_charge_id: null,
            withholding_tax_id: null
        }

        const dataProductsEntities = {
            product: {
                name: product.name,
                barcode: product.barcode,
                attention_type: product.attention_type,
                sale_price: product.sale_price,
                copaymen: product.copayment,
                tax_charge_id: product.tax_charge_id,
                exam_type_id: product.exam_type_id
            },
            entities: [...product.entities, entityCreate]
        }
        return dataProductsEntities;
    }

    function createPricesByEntity(product, patient) {
        const dataRequestPrices = getDataToPrices(product, patient);
        let url = obtenerRutaPrincipal() + `/api/v1/admin/products/${product.id}`;

        actualizarDatos(url, dataRequestPrices);

    }

    function updateTotal() {
        const tableBody = document.getElementById('productsTableBody');
        const rows = tableBody.getElementsByTagName('tr');
        let sum = 0;

        for (let row of rows) {
            if (row.cells.length) {
                const totalCell = row.cells[5]; // Columna "Total" (índice 4)
                const totalText = totalCell.textContent.replace(' COP', '').trim();
                const totalValue = parseFloat(totalText.split(".").join("")) || 0;
                sum += totalValue;
            }
        }
        document.getElementById('totalSum').textContent = sum.toFixed(2)
    }

    function updateTotalAmount() {
        const tableBody = document.getElementById('paymentsTableBody');
        const rows = tableBody.getElementsByTagName('tr');
        let sum = 0;

        for (let row of rows) {
            if (row.cells.length) {
                const totalCell = row.cells[2];
                const totalText = totalCell.textContent.replace(' COP', '').trim();
                const totalValue = parseFloat(totalText.split(".").join("")) || 0;
                sum += totalValue;
            }
        }

        document.getElementById('totalSumAmount').textContent = `${sum.toFixed(2)}`;
        calculatedAmountToPaid();
    }

    document.getElementById('next_step').addEventListener('click', async function() {
        const activeStep = document.querySelector('.nav-link.active'); // Selecciona el paso activo
        const sumAmount = document.getElementById('totalSum');
        const entitySwitch = document.getElementById('entitySwitch');

        if (activeStep) {
            switch (activeStep.dataset.wizardStep) {
                case "1":
                    if (parseFloat(sumAmount.textContent).toFixed(0) != 0) {
                        this.disabled = true; // Deshabilita el botón
                    }
                    if (!priceByEntity && entitySwitch.checked) {
                        createPricesByEntity(globalProduct, globalAdmission.patient);
                    }
                    break;
                case "3":
                    await guardarAdmision();
                    break;
                default:
                    break;
            }
        }

    });

    document.getElementById('entitySwitch').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('consumidorSwitch').disabled = true;
        } else {
            document.getElementById('consumidorSwitch').disabled = false;
        }
    })

    document.getElementById('consumidorSwitch').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('entitySwitch').disabled = true;
        } else {
            document.getElementById('entitySwitch').disabled = false;
        }
    })

    document.getElementById('back_step').addEventListener('click', function() {
        document.getElementById('next_step').disabled = false;
    })

    let dataAdmissionSaved;

    async function guardarAdmision() {
        dataAdmissionSaved = null;

        const tableBody = document.getElementById('productsTableBody');
        const rowsProducts = tableBody.getElementsByTagName('tr');
        const tableBodyPaymentsmethod = document.getElementById('paymentsTableBody');
        const rowsPaymentsmethod = tableBodyPaymentsmethod.getElementsByTagName('tr');
        const dataProducts = [];
        const dataPaymentMthods = [];
        const entitySwitch = document.getElementById('entitySwitch');
        const userLogged = getUserLogged();
        const consumidorSwitch = document.getElementById('consumidorSwitch');

        for (let row of rowsProducts) {
            const cells = row.getElementsByTagName('td');

            const rowData = {
                product_id: Number(cells[0]?.innerText.trim()), // Ajusta según el índice de las columnas
                quantity: Number(cells[3]?.innerText.trim()),
                unit_price: Number(cells[2]?.innerText.trim()),
                amount: Number(cells[2]?.innerText.trim()),
                discount: 0,
                subtotal: Number(cells[2]?.innerText.trim()),
            };
            dataProducts.push(rowData);
        }
        for (let row of rowsPaymentsmethod) {
            const cells = row.getElementsByTagName('td');

            if (Number(cells[0]?.innerText.trim()) > 0) {
                const rowData = {
                    payment_method_id: Number(cells[0]?.innerText.trim()), // Ajusta según el índice de las columnas
                    payment_date: "<?php echo date('Y-m-d'); ?>",
                    amount: Number(cells[2]?.innerText.replace('.', '')),
                    notes: "xxxxxxx",
                };
                dataPaymentMthods.push(rowData);
            }
        }

        const requestData = {
            external_id: `${userLogged.external_id}`,
            public_invoice: consumidorSwitch.checked,
            admission: {
                entity_id: globalAdmission.patient?.social_security?.entity_id,
                entity_authorized_amount: document.getElementById('amountAuthorisation').value.replace('.', '') || 0,
                authorization_number: entitySwitch.checked ? document.getElementById('authorisationNumberEntity').value : "",
                authorization_date: entitySwitch.checked ? document.getElementById('dateAuthorisation').value.split('/').reverse().join('-') : "",
                appointment_id: globalAdmission.id,
            },
            invoice: {
                type: entitySwitch.checked ? "entity" : "public",
                status: "Pagado",
                subtotal: dataProducts[0].unit_price,
                discount: 0,
                taxes: 0,
                total_amount: dataProducts[0].unit_price,
                observations: document.getElementById('observation').value,
                due_date: document.getElementById('datepicker').value.split('/').reverse().join('-'),
                paid_amount: dataProducts[0].unit_price,
                user_id: userLogged.id
            },
            invoice_detail: dataProducts,
            payments: dataPaymentMthods
        }

        document.getElementById('finishInvoiceParent').disabled = true;

        console.log("Data request: ", requestData);
        await admissionService.createAdmission(requestData, globalAdmission.patient_id)
            .then(response => {
                if (response) {
                    dataAdmissionSaved = response;
                    obtenerDatosAdmision();
                }
            })
            .catch(error => {
                console.error('Error al crear la admisión:', error);
            });

    }

    async function obtenerDatosAdmision() {

        await sendInvoice(dataAdmissionSaved.admission_data.appointment_id, dataAdmissionSaved.admission_data.patient_id);

        document.getElementById('finishInvoiceParent').disabled = false;

    }

    document.getElementById('finish').addEventListener('click', function() {
        window.location.href = 'citasControl';
    })

    document.getElementById('printInvoice').addEventListener('click', async function() {
        await generateInvoice(dataAdmissionSaved.admission_data.appointment_id, false);

        setTimeout(() => {
            window.location.href = 'citasControl';
        }, 1000);
    })
    document.getElementById('downloadInvoice').addEventListener('click', async function() {
        await generateInvoice(dataAdmissionSaved.admission_data.appointment_id, true);
        setTimeout(() => {
            window.location.href = 'citasControl';
        }, 1000);
    })
</script>

<style>
    .nav-item-circle {
        background-color: #0dcaf0;
        /* Color "info" */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        /* Ajusta el tamaño del círculo */
        height: 40px;
        /* Ajusta el tamaño del círculo */
        border-radius: 50%;
        /* Hace que el fondo sea circular */
    }
</style>