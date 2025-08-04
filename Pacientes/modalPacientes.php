<?php
include "./modals/newPartnerModal.php";
//include "./modals/editPartnerModal.php";
?>

<?php
$documentType = array("CI - Cédula de Identidad", "CR - Carnet de Residencia", "CM - Carnet de Menor de Edad", "AN - Acta de Nacimiento", "LC - Licencia de Conducción", "Otros");
$relations = array("Padre", "Madre", "Hermano (a)", "Tio (a)", "Abuelo (a)", "Primo (a)", "Amigo (a)", "Esposo (a)", "Otro");
?>

<div class="modal fade" id="newPartnerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo acompañante</h5><button
                    class="btn btn-close p-1 closet-btn" type="button" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3" id="partnerForm">
                    <div class="col-md-6">
                        <label class="form-label text-body" for="companions[0][first_name]">Primer Nombre*</label>
                        <input class="form-control" type="text" name="first_name" placeholder="Primer Nombre"
                            id="first_name">
                    </div>

                    <div class="col-6">
                        <label class="form-label text-body" for="last_name">Primer Apellido*</label>
                        <input class="form-control" type="text" name="last_name" placeholder="Primer apellido"
                            id="last_name">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="document_type">Tipo de documento</label>
                        <select class="form-select" name="document_type" id="document_type">
                            <option value="">Seleccionar</option>
                            <?php foreach ($documentType as $key => $value) { ?>
                                <option value="<?= $key ?>"><?= $value ?></option>
                            <?php } ?>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-body" for="document_number">Número de identificación*</label>
                        <input class="form-control" type="text" name="document_number"
                            placeholder="Número de identificación" id="document_number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="mobile">WhatsApp*</label>
                        <input class="form-control" type="tel" name="mobile" placeholder="Whatsapp" id="mobile">
                    </div>
                    <div class="col-md-6">
                        <label for="relationSelect" class="form-label">Parentesco</label>
                        <select class="form-select" id="relationSelect" name="relationship"
                            aria-label="Default select example">
                            <option selected="">Seleccionar</option>
                            <?php foreach ($relations as $key => $value) { ?>
                                <option value="<?= $value ?>"><?= $value ?></option>
                            <?php } ?>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label" for="email">Correo Electronico*</label>
                        <input class="form-control" type="email" name="email" placeholder="Correo Electronico"
                            id="email">
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button class="btn btn-primary closet-btn" type="button" id="saveCompanionButton">Guardar</button>
                <button class="btn btn-outline-primary closet-btn" type="button"
                    data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>
<script>
    // Esperamos a que el DOM cargue completamente

    document.addEventListener('DOMContentLoaded', function () {

        // Función para agregar una nueva fila a la tabla del primer modal
        const addRowToTable = () => {
            const firstName = document.getElementById('first_name').value;
            const lastName = document.getElementById('last_name').value;
            const relation = document.getElementById('relationSelect').value;
            const idNumber = document.getElementById('document_number').value;
            const whatsapp = document.getElementById('mobile').value;

            if (!firstName || !lastName || !idNumber || !whatsapp || !relation) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            // Seleccionamos el cuerpo de la tabla en el primer modal
            const tableBody = document.querySelector('#modalCrearPaciente tbody');

            // Creamos una nueva fila
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
        <td class="align-middle ps-3">${firstName}</td>
        <td class="align-middle ps-3">${lastName}</td>
        <td class="align-middle">${relation}</td>
        <td class="align-middle">${idNumber}</td>
        <td class="align-middle">${whatsapp}</td>
        <td class="align-middle text-end">
            <button class="btn btn-danger btn-sm me-1 mb-1" type="button" onclick="deleteRow(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

            // Agregamos la nueva fila al cuerpo de la tabla
            tableBody.appendChild(newRow);

            // Limpiamos el formulario después de agregar la fila
            // document.querySelector('#newPartnerModal form').reset();

            // Cerramos el modal del formulario
            $('#newPartnerModal').modal('hide');
            $('#modalCrearPaciente').modal('show');
        };

        // Evento para el botón existente de guardar
        document.querySelector('.modal-footer .btn-primary.closet-btn').addEventListener('click', addRowToTable);

        // Función para eliminar una fila
        window.deleteRow = function (button) {
            const row = button.closest('tr');
            row.remove();
        };
    });

    // document.getElementById('saveCompanionButton').addEventListener('click', function() {

    //     const companionForm = document.getElementById('partnerForm');
    //     const companionFormData = new FormData(companionForm);
    //     const companionData = {};

    //     console.log("companionFormData: ", companionFormData);

    //     companionFormData.forEach((value, key) => {
    //         companionData[key] = value;
    //     });

    //     // Almacenar los datos temporalmente
    //     companionsTemp.push(companionData);

    //     console.log('Companion Data', companionData);
    //     console.log('Companions Temp', companionsTemp);

    //     // Cerrar el modal de crear acompañante
    //     const createCompanionModal = bootstrap.Modal.getInstance(document.getElementById('newPartnerModal'));
    //     createCompanionModal.hide();
    // });
</script>

<div class="modal fade modal-xl" id="modalCrearPaciente" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Paciente</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"
                    id="addCompanionButton"></button>
            </div>

            <div class="modal-body">
                <!-- Indicadores de progreso -->
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Datos Generales</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Datos de Residencia</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Seguridad social y Afiliación</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoPaciente" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">

                                <div class="col-9 col-sm-7">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-1 mb-sm-0">
                                                        <label class="form-label" for="document_type">Tipo de
                                                            documento</label>
                                                        <select class="form-select" name="patient[document_type]"
                                                            id="document_type" required>
                                                            <option value="" disabled selected>Seleccione un tipo de
                                                                documento</option>
                                                            <option value="CI">CI - Cédula de Identidad</option>
                                                            <option value="CR">CR - Carnet de Residencia</option>
                                                            <option value="CM">CM - Carnet de Menor de Edad</option>
                                                            <option value="AN">AN - Acta de Nacimiento</option>
                                                            <option value="LC">LC - Licencia de Conducción</option>
                                                            <option value="OT">OT - Otros</option>
                                                        </select>
                                                        <div class="invalid-feedback">Por favor seleccione un tipo de
                                                            documento.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="document_number" class="form-label">Número de
                                                            documento</label>
                                                        <input type="text" class="form-control" id="document_number"
                                                            name="patient[document_number]" placeholder="Documento"
                                                            required name="document_number">
                                                        <div class="invalid-feedback">Por favor agregue el número
                                                            documento.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="first_name" class="form-label">Primer nombre</label>
                                                        <input type="text" class="form-control" id="first_name" required
                                                            name="patient[first_name" ] placeholder="Primer Nombre"
                                                            placeholder="Primer Nombre">
                                                        <div class="invalid-feedback">Por favor agregue el primer
                                                            nombre.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="middle_name" class="form-label">Segundo
                                                            Nombre</label>
                                                        <input type="text" class="form-control" id="middle_name"
                                                            placeholder="Segundo Nombre" name="patient[middle_name]">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="last_name" class="form-label">Primer
                                                            apellido</label>
                                                        <input type="text" class="form-control" id="last_name" required
                                                            name="patient[last_name]" placeholder="Primer Apellido">
                                                        <div class="invalid-feedback">Por favor agregue el primer
                                                            apellido.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="second_last_name" class="form-label">Segundo
                                                            apellido</label>
                                                        <input type="text" class="form-control" id="second_last_name"
                                                            placeholder="Segundo Apellido"
                                                            name="patient[second_last_name]">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="card mt-3">
                                        <div class="card-body">
                                            <div class="row g-3 mb-3">
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="gender" class="form-label">Genero</label>
                                                        <select class="form-select" id="gender" name="patient[gender]"
                                                            required>
                                                            <option selected disabled value="">Seleccione</option>
                                                            <option value="MALE">Masculino</option>
                                                            <option value="FEMALE">Femenino</option>
                                                            <option value="INDETERMINATE">Inderteminado</option>
                                                            <option value="OTHER">Otro</option>
                                                        </select>
                                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label class="form-label" for="date_of_birth">Fecha de
                                                            nacimiento</label>

                                                        <input type="date" name="patient[date_of_birth]"
                                                            class="form-control" id="date_of_birth">

                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label class="form-label" for="whatsapp">WhatsApp</label>
                                                        <input class="form-control" id="whatsapp"
                                                            name="patient[whatsapp]" type="text" placeholder="Whatsapp"
                                                            required>
                                                        <div class="invalid-feedback">El campo es obligatorio.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="email" class="form-label">Correo electrónico</label>
                                                        <input type="text" class="form-control" id="email"
                                                            name="patient[email]" placeholder="Correo Electronico">
                                                        <div class="invalid-feedback">El campo es obligatorio.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="mb-1">
                                                        <label for="civil_status" class="form-label">Estado
                                                            Civil</label>
                                                        <select class="form-select" id="civil_status"
                                                            name="patient[civil_status]" required>
                                                            <option selected disabled value="">Seleccione</option>
                                                            <option value="SINGLE">Soltero</option>
                                                            <option value="MARRIED">Casado</option>
                                                            <option value="DIVORCED">Divorciado</option>
                                                            <option value="WIDOWED">Viudo</option>
                                                        </select>
                                                        <div class="invalid-feedback">El campo es obligatorio.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="mb-1">
                                                        <label for="ethnicity" class="form-label">Etnía</label>
                                                        <select class="form-select" id="ethnicity"
                                                            name="patient[ethnicity]">
                                                            <option selected disabled value="">Seleccione</option>
                                                            <option value="Afrodesendiente">Afrodesendiente</option>
                                                            <option value="Indigena">Indigena</option>
                                                            <option value="Caucásica">Caucásica</option>
                                                            <option value="Asiática">Asiática</option>
                                                            <option value="Mestiza">Mestiza</option>
                                                        </select>
                                                        <div class="invalid-feedback">El campo es obligatorio.</div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-4">
                                                    <div class="mb-1">
                                                        <label for="ethnicity" class="form-label">Tipo de sangre</label>
                                                        <select class="form-select" id="blood_type"
                                                            name="patient[blood_type]" required>
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
                                                        <div class="invalid-feedback">El campo es obligatorio.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="col-3 col-sm-5">

                                    <div class="row justify-content-center">
                                        <div class="col-md-6 text-center">
                                            <h2>Imagen de Perfil</h2>
                                            <div class="mt-3">
                                                <img id="profilePreview" src="../assets/img/profile/profile_default.jpg"
                                                    alt="Previsualización" class="profile-img">
                                            </div>
                                            <div class="mt-3">
                                                <video id="camera" autoplay></video>
                                            </div>
                                            <div class="mt-4">
                                                <label for="uploadImage" class="btn btn-primary me-2">
                                                    <i class="fa-solid fa-upload me-1"></i> Subir Imagen
                                                </label>
                                                <div class="icon-container" id="takePhoto">
                                                    <i class="fa-solid fa-camera fs-4"></i>
                                                </div>
                                                <div class="icon-container d-none" id="capturePhoto">
                                                    <i class="fa-solid fa-check fs-4 text-success"></i>
                                                </div>
                                            </div>
                                            <input type="file" id="uploadImage" class="d-none" accept="image/*">
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div class="wizard-step" data-step="2">
                            <div class="card mt-3">
                                <div class="card-body">
                                    <h5 class="card-title">Información de residencia</h5>
                                    <div class="row g-3 mb-3">
                                        <div class="col-sm-6">
                                            <div class="mb-2 mb-sm-0">
                                                <label for="country_id" class="form-label">Pais</label>
                                                <select class="form-select" id="country_id" name="patient[country_id]"
                                                    required>
                                                    <option selected disabled value="">Seleccione</option>
                                                </select>
                                                <div class="invalid-feedback">Please enter password</div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="mb-2">
                                                <label for="department_id" class="form-label">Departamento o
                                                    provincia</label>
                                                <select class="form-select" id="department_id"
                                                    name="patient[department_id]" required>
                                                    <option selected disabled value="">Seleccione</option>
                                                </select>
                                                <div class="invalid-feedback">El campo es obligatorio</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row g-3 mb-3">
                                        <div class="col-sm-4">
                                            <div class="mb-2 mb-sm-0">
                                                <label for="city_id" class="form-label">Ciudad</label>
                                                <select class="form-select" id="city_id" name="patient[city_id]"
                                                    required>
                                                    <option selected disabled value="">Seleccione</option>
                                                </select>
                                                <div class="invalid-feedback">El campos es obligatorio</div>
                                            </div>
                                        </div>


                                        <div class="col-sm-4">
                                            <div class="mb-2">
                                                <label class="form-label" for="address">Dirección</label>
                                                <input class="form-control" id="address" name="patient[address]"
                                                    type="text" placeholder="Dirección" required />
                                                <div class="invalid-feedback">El campos es obligatorio</div>
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="mb-2">
                                                <label class="form-label" for="nationality">Nacionalidad</label>
                                                <select class="form-select" id="nationality" name="patient[nationality]"
                                                    required>
                                                    <option selected disabled value="">Seleccione</option>
                                                </select>
                                                <div class="invalid-feedback">El campos es obligatorio</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card mt-4">

                                <div class="card-body">
                                    <div class="d-flex">
                                        <div class="form-check form-switch me-3">
                                            <input class="form-check-input" id="flexSwitchCheckDefault" type="checkbox">
                                            <label class="form-check-label text-primary"
                                                for="flexSwitchCheckDefault">Acompañante</label>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div class="card mt-3">

                                <div class="card-body" id="companionForm">

                                    <h5 class="card-title">Información del acompañante</h5>
                                    <div id="tableExample3"
                                        data-list="{&quot;valueNames&quot;:[&quot;name&quot;,&quot;email&quot;,&quot;age&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <div class="search-box">
                                                <form class="position-relative">
                                                    <input class="form-control search-input search form-control-sm"
                                                        type="search" placeholder="Search" aria-label="Search">
                                                    <svg class="svg-inline--fa fa-magnifying-glass search-box-icon"
                                                        aria-hidden="true" focusable="false" data-prefix="fas"
                                                        data-icon="magnifying-glass" role="img"
                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                        data-fa-i2svg="">
                                                        <path fill="currentColor"
                                                            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z">
                                                        </path>
                                                    </svg>
                                                </form>
                                            </div>
                                            <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="modal"
                                                data-bs-target="#newPartnerModal" id="openSecondModal">Nuevo</button>


                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-striped table-sm fs-9 mb-0">
                                                <thead>
                                                    <tr>
                                                        <th class="sort border-top border-translucent ps-3"
                                                            data-sort="name">Nombre</th>
                                                        <th class="sort border-top border-translucent ps-3"
                                                            data-sort="name">Apellido</th>
                                                        <th class="sort border-top border-translucent ps-3"
                                                            data-sort="name">Parentesco</th>
                                                        <th class="sort border-top" data-sort="email">Número de
                                                            identificación</th>
                                                        <th class="sort border-top" data-sort="age">WhatsApp</th>
                                                        <th class="sort text-end align-middle pe-0 border-top"
                                                            scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody class="list">
                                                </tbody>
                                            </table>
                                        </div>
                                        <!-- <div class="d-flex justify-content-between mt-3"><span class="d-none d-sm-inline-block" data-list-info="data-list-info">1 to 5 <span class="text-body-tertiary"> Items of </span>43</span>
                      <div class="d-flex"><button class="page-link disabled" data-list-pagination="prev" disabled=""><svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
                          </svg></button>
                        <ul class="mb-0 pagination">
                          <li class="active"><button class="page btn-primary" type="button" data-i="1" data-page="5">1</button></li>
                          <li><button class="page" type="button" data-i="2" data-page="5">2</button></li>
                          <li><button class="page" type="button" data-i="3" data-page="5">3</button></li>
                          <li class="disabled"><button class="page" type="button">...</button></li>
                        </ul><button class="page-link pe-0" data-list-pagination="next"><svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                          </svg></button>
                      </div>
                    </div> -->
                                    </div>



                                </div>
                            </div>
                        </div>

                        <div class="wizard-step" data-step="3">


                            <!-- <div class="card">
                <div class="card-body">
                  <div class="row g-3 mb-3">
                    <div class="col-sm-6">
                      <label for="type_scheme" class="form-label">Tipo de régimen</label>
                      <select class="form-select" id="type_scheme" name="social_security[type_scheme]" required>
                        <option selected disabled value="">Seleccione</option>
                        <option value="Contributivo">Contributivo</option>
                        <option value="Subsidiado">Subsidiado</option>
                      </select>
                      <div class="invalid-feedback">El campo es obligatorio</div>
                    </div>

                    <div class="col-sm-6">
                      <div class="mb-2 mb-sm-0">
                        <label for="affiliate_type" class="form-label">Tipo de afiliado</label>
                        <select class="form-select" id="affiliate_type" name="social_security[affiliate_type]" required>
                          <option selected disabled value="">Seleccione</option>

                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="row g-3 mb-3">

                    <div class="col-sm-12">
                      <div class="mb-2 mb-sm-0">
                        <label for="category" class="form-label">Categoría</label>
                        <select class="form-select" id="category" name="social_security[category]" required>
                          <option selected disabled value="">Seleccione</option>

                        </select>
                        <div class="invalid-feedback">El campo es obligatorio
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div> -->
                            <div class="card mt-3">
                                <div class="card-body">
                                    <div class="row g-3 mb-3">
                                        <div class="col-sm-6" id="div_eps">
                                            <div class="mb-2 mb-sm-0">
                                                <label for="eps" class="form-label" id="label_eps">Entidad prestadora de
                                                    salud (eps)</label>
                                                <select class="form-select" id="eps" name="social_security[entity_id]"
                                                    required>
                                                    <option selected disabled value="">Seleccione</option>
                                                </select>
                                                <div class="invalid-feedback">El campo es obligatorio</div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6" id="div_afp">
                                            <div class="mb-2">
                                                <label for="arl" class="form-label">Administradora de fondos de
                                                    pensiones (AFP)</label>
                                                <select class="form-select" id="arl" name="social_security[arl]"
                                                    required>
                                                    <option selected disabled value="">Seleccione</option>
                                                    <option value="Colpensiones">Colpensiones</option>
                                                    <option value="Porvenir">Porvenir</option>
                                                    <option value="Protección">Protección</option>
                                                    <option value="Skandia">Skandia</option>
                                                    <option value="Old Mutual">Old Mutual</option>
                                                </select>
                                                <div class="invalid-feedback">El campo es obligatorio</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row g-3 mb-3">
                                        <div class="col-sm-12" id="div_arl">
                                            <div class="mb-2 mb-sm-0">
                                                <label for="afp" class="form-label">Administradoras de riesgos laborales
                                                    (ARL)</label>
                                                <select class="form-select" id="afp" name="social_security[afp]"
                                                    required>
                                                    <option selected disabled value="">Seleccione</option>
                                                    <option value="Sura">Sura</option>
                                                    <option value="Colpatria">Colpatria</option>
                                                    <option value="Bolívar">Bolívar</option>
                                                    <option value="Axa Colpatria">Axa Colpatria</option>
                                                    <option value="ARL Positiva">ARL Positiva</option>
                                                </select>
                                                <div class="invalid-feedback">El campo es obligatorio</div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                    <input type="hidden" id="modalPacientesPatientId" name="patient_id"
                        value="<?php echo $_GET['patient_id'] ?? $_GET['id']; ?>">

                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStep" type="submit"
                    form="wizardForm">Finalizar</button>
            </div>
        </div>
    </div>
</div>


<style>
    .profile-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #ddd;
    }

    video {
        display: none;
        width: 100%;
        max-width: 300px;
        border-radius: 10px;
        border: 2px solid #ddd;
    }

    .steps-container {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .steps {
        list-style: none;
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
    }

    .step {
        text-align: center;
        position: relative;
        flex: 1;
    }

    .step-number {
        display: inline-block;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        background-color: #e9ecef;
        color: #0d6efd;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .step.active .step-number {
        background-color: #0d6efd;
        color: #fff;
    }

    .wizard-step {
        display: none;
    }

    .wizard-step.active {
        display: block;
    }
</style>

<script type="module">
    import {
        countryService,
        departmentService,
        cityService,
        userService,
        entityService
    } from './services/api/index.js';
    import {
        getJWTPayload,
        dataURItoBlob
    } from "./services/utilidades.js";
    import {
        countriesSelect,
        departmentsSelect,
        citiesSelect
    } from "./services/selects.js";
    // Declaración de funciones
    const updateWizard = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Controlar los botones
        document.getElementById('prevStep').disabled = currentStep === 1;
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 3);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 3);
    };

    const handleCompanionForm = () => {
        const checkbox = document.getElementById('flexSwitchCheckDefault');
        const companionForm = document.getElementById('companionForm');

        checkbox.checked = false;
        companionForm.style.display = 'none';

        checkbox.addEventListener('change', function () {
            companionForm.style.display = checkbox.checked ? 'block' : 'none';
        });
    };

    const handleModalNavigation = () => {
        const btn = document.getElementById('openSecondModal');
        if (!btn) {
            console.error('El botón con ID "openSecondModal" no existe en el DOM.');
            return;
        }

        btn.addEventListener('click', function () {
            $('#modalCrearPaciente').modal('hide');
            $('#newPartnerModal').modal('show');
        });
    };



    const handleImageUpload = () => {
        const profilePreview = document.getElementById('profilePreview');
        const uploadImage = document.getElementById('uploadImage');
        const takePhoto = document.getElementById('takePhoto');
        const capturePhoto = document.getElementById('capturePhoto');
        const camera = document.getElementById('camera');
        let stream;

        uploadImage.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.src = e.target.result;

                    const blob = dataURItoBlob(profilePreview.src);
                    const file = new File([blob], 'profile_image.png', {
                        type: 'image/png'
                    });
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    uploadImage.files = dataTransfer.files;
                };
                reader.readAsDataURL(file);
            }
        });

        takePhoto.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                camera.srcObject = stream;
                camera.style.display = "block";
                takePhoto.classList.add("d-none");
                capturePhoto.classList.remove("d-none");
            } catch (err) {
                console.error('Error en getUserMedia:', err);
                alert('No se pudo acceder a la cámara: ' + err.message);
            }
        });

        capturePhoto.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = camera.videoWidth;
            canvas.height = camera.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);

            profilePreview.src = canvas.toDataURL('image/png');

            const blob = dataURItoBlob(profilePreview.src);
            const file = new File([blob], 'profile_image.png', {
                type: 'image/png'
            });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            uploadImage.files = dataTransfer.files;

            stream.getTracks().forEach(track => track.stop());
            camera.style.display = "none";
            capturePhoto.classList.add("d-none");
            takePhoto.classList.remove("d-none");
        });
    };

    // Inicialización de variables
    let currentStep = 1;

    // Eventos
    document.getElementById('nextStep').addEventListener('click', () => {
        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            currentStep++;
            updateWizard();
        }
    });

    document.getElementById('prevStep').addEventListener('click', () => {
        currentStep--;
        updateWizard();
    });

    document.getElementById('modalCrearPaciente').addEventListener('submit', function (event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            this.classList.add('was-validated');
        }
    });

    const handleRegimenChange = () => {
        const regimenSelect = document.getElementById('type_scheme');
        const tipoAfiliadoSelect = document.getElementById('affiliate_type');
        const categorySelect = document.getElementById('category');

        regimenSelect.addEventListener('change', function () {
            const selectedRegimen = this.value;

            // Limpiar opciones actuales
            tipoAfiliadoSelect.innerHTML = '<option selected disabled value="">Seleccione</option>';
            categorySelect.innerHTML = '<option selected disabled value="">Seleccione</option>';

            if (selectedRegimen === 'Contributivo') {
                // Agregar opciones para "Contributivo"
                tipoAfiliadoSelect.innerHTML += `
                <option value="Cotizante">Cotizante</option>
                <option value="Beneficiario">Beneficiario</option>
                <option value="Independiente">Independiente</option>
                <option value="Pensionado">Pensionado</option>
                <option value="Estudiante">Estudiante</option>
            `;
                categorySelect.innerHTML += `
                <option value="A">Categoría A</option>
                <option value="B">Categoría B</option>
                <option value="C">Categoría C</option>
            `;
            } else if (selectedRegimen === 'Subsidiado') {
                // Agregar opciones para "Subsidiado"
                tipoAfiliadoSelect.innerHTML += `
                <option value="Beneficiario">Beneficiario</option>
            `;
                categorySelect.innerHTML += `
                <option value="1">Nivel 1</option>
                <option value="2">Nivel 2</option>            `;
            }
        });
    };

    async function getEntities() {
        try {
            const data = await entityService.getAll();

            populateEntitySelect(data.data);
        } catch (error) {
            console.error('Error al obtener las entidades:', error);
        }
    }

    function populateEntitySelect(entities) {
        const entitySelect = document.getElementById('eps');
        entities.forEach(entity => {
            const option = document.createElement('option');
            option.value = entity.id;
            option.textContent = entity.name;
            entitySelect.appendChild(option);
        });
    }

    // Llamadas a funciones dentro de DOMContentLoaded
    document.addEventListener('DOMContentLoaded', async function () {
        // handleRegimenChange();
        updateWizard();
        handleCompanionForm();
        handleModalNavigation();
        handleImageUpload();
        // Llama a la función para obtener y cargar los países
        countriesSelect(document.getElementById('country_id'), (selectedOption) => {
            const selectedCountryId = selectedOption.customProperties.id;

            departmentsSelect(
                document.getElementById('department_id'),
                selectedCountryId,
                (selectedDepartment) => {
                    const selectedDepartmentId = selectedDepartment.customProperties.id;

                    citiesSelect(
                        document.getElementById('city_id'),
                        selectedDepartmentId,
                        (selectedCity) => { }
                    );
                }
            );
        });

        countriesSelect(document.getElementById('nationality'));

        getEntities();


        if (true) {
            document.getElementById('label_eps').textContent = 'Aseguradora';
            // console.log('ocultando campos de colombia');
            document.getElementById('div_eps').classList.add('col-12');
            document.getElementById('div_eps').classList.remove('col-sm-6');
            document.getElementById('div_afp').style.display = 'none';
            document.getElementById('div_afp').classList.remove('col-md-6');
            document.getElementById('div_arl').style.display = 'none';
        }
        // console.log("User:", user);
    });
</script>

<script type="module" src="./Pacientes/js/modalPacientes.js"></script>