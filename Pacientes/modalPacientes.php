<?php
// Array de antecedentes con id, valor y nombre
$antecedentes = [
  ["id" => 1, "valor" => "ASMA", "nombre" => "ASMA"],
  ["id" => 2, "valor" => "HTA", "nombre" => "HTA"],
  ["id" => 3, "valor" => "Diabetes", "nombre" => "Diabetes"],
  ["id" => 4, "valor" => "Hipotiroidismo", "nombre" => "Hipotiroidismo"],
  ["id" => 5, "valor" => "Tabaquismo", "nombre" => "Tabaquismo"],
  ["id" => 6, "valor" => "Licor", "nombre" => "Licor"]
];


$typeDocuments = array(
  'DNI' => 'DNI',
  'RUC' => 'RUC',
  'PASAPORTE' => 'PASAPORTE',
  'CEDULA' => 'CEDULA',
  'OTRO' => 'OTRO'
);

$genders = array(
  'MASCULINO' => 'MASCULINO',
  'FEMENINO' => 'FEMENINO',
  'OTRO' => 'OTRO'
);


$countries = array(
  '1' => 'DOMINICANO',
  '2' => 'DOMINICANA',

);

$departments = array(
  '1' => 'Antioquia',
  '2' => 'Atlántico',
  '3' => 'Bolívar',

);

$cities = array(
  '1' => 'Cali',
  '2' => 'Medellin',

);


$sellers = array(
  'vendedor1' => 'vendedor1',
  'vendedor2' => 'vendedor2',
  'vendedor3' => 'vendedor3'
);


$entities = array(
  'entidad1' => 'entidad1',
  'entidad2' => 'entidad2',
  'entidad3' => 'entidad3'
);

$deposits = array(
  'deposito1' => 'deposito1',
  'deposito2' => 'deposito2',
  'deposito3' => 'deposito3'
);

$products = array(
  'producto1' => [
    'name' => 'producto1',
    'price' => 1000,
    'quantity' => 1,
    'tax' => 10
  ]
);

$paymentMethods = array(
  'EFECTIVO' => 'EFECTIVO',
  'NEQUI' => 'NEQUI',
  'TARJETA' => 'TARJETA',
  'OTRO' => 'OTRO'
);


$tax = array(
  'name' => 'IVA',
  'percentage' => 19
);


$relations = array(
  'Padre' => 'Padre',
  'Madre' => 'Madre',
  'Hermano' => 'Hermano',
  'Hermana' => 'Hermana',
  'Tio' => 'Tio',
  'Tia' => 'Tia',
  'Abuelo' => 'Abuelo',
  'Abuela' => 'Abuela',
  'Otros' => 'Otros',
);


$rips = array(
  'RIPS 1' => 'RIPS 1',
  'RIPS 2' => 'RIPS 2',
  'RIPS 3' => 'RIPS 3',
);

$typeConsults = array(
  'Primera vez' => 'Primera vez',
  'Control' => 'Control',
  'Urgencia' => 'Urgencia',
);


$typeConsult = false;



$purposeConsultation = array(
  'Motivo 1' => 'Motivo 1',
  'Motivo 2' => 'Motivo 2',
  'Motivo 3' => 'Motivo 3',
);

$externalCause = array(
  'Causa externa 1' => 'Causa externa 1',
  'Causa externa 2' => 'Causa externa 2',
  'Causa externa 3' => 'Causa externa 3',
);

require "./modals/newPartnerModal.php";
require "./modals/editPartnerModal.php";
?>

<div class="modal fade modal-xl" id="modalCrearPaciente" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Nuevo Paciente</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close" id="addCompanionButton"></button>
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
                            <label class="form-label" for="document_type">Tipo de documento</label>
                            <select class="form-select" name="patient[document_type]" id="document_type" required>
                              <option value="" disabled selected>Seleccione un tipo de documento</option>
                              <option value="CC">CC - Cedula de Ciudadania</option>
                              <option value="CE">CE - Cedula de Extranejeria</option>
                              <option value="TI">TI - Tarjeta de Identidad</option>
                            </select>
                            <div class="invalid-feedback">Por favor seleccione un tipo de documento.</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label for="document_number" class="form-label">Número de documento</label>
                            <input type="number" class="form-control" min="0" id="document_number" name="patient[document_number]" placeholder="Documento" required
                              name="document_number">
                            <div class="invalid-feedback">Por favor agregue el número documento.</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label for="first_name" class="form-label">Primer nombre</label>
                            <input type="text" class="form-control" id="first_name" required name="patient[first_name" ] placeholder="Primer Nombre" placeholder="Primer Nombre">
                            <div class="invalid-feedback">Por favor agregue el primer nombre.</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label for="middle_name" class="form-label">Segundo Nombre</label>
                            <input type="text" class="form-control" id="middle_name" placeholder="Segundo Nombre" name="patient[middle_name]">
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label for="last_name" class="form-label">Primer apellido</label>
                            <input type="text" class="form-control" id="last_name" required name="patient[last_name]" placeholder="Primer Apellido">
                            <div class="invalid-feedback">Por favor agregue el primer apellido.</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label for="second_last_name" class="form-label">Segundo apellido</label>
                            <input type="text" class="form-control" id="second_last_name" placeholder="Segundo Apellido" name="patient[second_last_name]">
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
                            <select class="form-select" id="gender" name="patient[gender]" required>
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
                            <label class="form-label" for="date_of_birth">Fecha de nacimiento</label>
                            <!-- <input class="form-control datetimepicker flatpickr-input" id="date_of_birth" name="patient[date_of_birth]" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly" required> -->

                            <input type="date" name="patient[date_of_birth]" class="form-control" id="">

                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label class="form-label" for="whatsapp">WhatsApp</label>
                            <input class="form-control" id="whatsapp" name="patient[whatsapp]" type="text" placeholder="Whatsapp" required>
                            <div class="invalid-feedback">El campo es obligatorio.</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-1">
                            <label for="email" class="form-label">Correo electrónico</label>
                            <input type="text" class="form-control" id="email" name="patient[email]" placeholder="Correo Electronico">
                            <div class="invalid-feedback">El campo es obligatorio.</div>
                          </div>
                        </div>
                        <div class="col-sm-4">
                          <div class="mb-1">
                            <label for="civil_status" class="form-label">Estado Civil</label>
                            <select class="form-select" id="civil_status" name="patient[civil_status]" required>
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
                            <select class="form-select" id="ethnicity" name="patient[ethnicity]">
                              <option selected disabled value="">Seleccione</option>
                              <option value="Campesino">Campesino</option>
                              <option value="Indigena">Indigena</option>
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio.</div>
                          </div>
                        </div>
                        <div class="col-sm-4">
                          <div class="mb-1">
                            <label for="ethnicity" class="form-label">Tipo de sangre</label>
                            <select class="form-select" id="blood_type" name="patient[blood_type]" required>
                              <option selected disabled value="">Seleccione</option>
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
                      <!-- Imagen de previsualización -->
                      <div class="mt-3">
                        <img id="profilePreview" src="../assets/img/profile/profile_default.jpg" alt="Previsualización"
                          class="profile-img">
                      </div>
                      <!-- Video para captura -->
                      <div class="mt-3">
                        <video id="camera" autoplay></video>
                      </div>
                      <!-- Botones de acción -->
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
                      <!-- Input oculto para subir imagen -->
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
                        <select class="form-select" id="country_id" name="patient[country_id]" required>
                          <option selected disabled value="">Seleccione</option>
                        </select>
                        <div class="invalid-feedback">Please enter password</div>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="mb-2">
                        <label for="department_id" class="form-label">Departamento o provincia</label>
                        <select class="form-select" id="department_id" name="patient[department_id]" required>
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
                        <select class="form-select" id="city_id" name="patient[city_id]" required>
                          <option selected disabled value="">Seleccione</option>
                        </select>
                        <div class="invalid-feedback">El campos es obligatorio</div>
                      </div>
                    </div>


                    <div class="col-sm-4">
                      <div class="mb-2">
                        <label class="form-label" for="address">Dirección</label>
                        <input class="form-control" id="address" name="patient[address]" type="text" placeholder="Dirección" required />
                        <div class="invalid-feedback">El campos es obligatorio</div>
                      </div>
                    </div>
                    <div class="col-sm-4">
                      <div class="mb-2">
                        <label class="form-label" for="nationality">Nacionalidad</label>
                        <select class="form-select" id="nationality" name="patient[nationality]" required>
                          <option selected disabled value="">Seleccione</option>
                          <?php foreach ($countries as $key => $value) { ?>
                            <option value="<?= $key ?>"><?= $value ?></option>
                          <?php } ?>
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
                      <label class="form-check-label text-primary" for="flexSwitchCheckDefault">Acompañante</label>
                    </div>

                  </div>
                </div>

              </div>

              <div class="card mt-3">

                <div class="card-body" id="companionForm">

                  <!--  -->


                  <h5 class="card-title">Información del acompañante</h5>
                  <div id="tableExample3" data-list="{&quot;valueNames&quot;:[&quot;name&quot;,&quot;email&quot;,&quot;age&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <!-- Search Box -->
                      <div class="search-box">
                        <form class="position-relative">
                          <input class="form-control search-input search form-control-sm" type="search" placeholder="Search" aria-label="Search">
                          <svg class="svg-inline--fa fa-magnifying-glass search-box-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                          </svg>
                        </form>
                      </div>
                      <!-- Botón Nuevo -->
                      <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#newPartnerModal" id="openSecondModal">Nuevo</button>


                    </div>
                    <div class="table-responsive">
                      <table class="table table-striped table-sm fs-9 mb-0">
                        <thead>
                          <tr>
                            <th class="sort border-top border-translucent ps-3" data-sort="name">Nombre</th>
                            <th class="sort border-top border-translucent ps-3" data-sort="name">Apellido</th>
                            <th class="sort border-top border-translucent ps-3" data-sort="name">Parentesco</th>
                            <th class="sort border-top" data-sort="email">Número de identificación</th>
                            <th class="sort border-top" data-sort="age">WhatsApp</th>
                            <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                          </tr>
                        </thead>
                        <tbody class="list">
                        </tbody>
                      </table>
                    </div>
                    <div class="d-flex justify-content-between mt-3"><span class="d-none d-sm-inline-block" data-list-info="data-list-info">1 to 5 <span class="text-body-tertiary"> Items of </span>43</span>
                      <div class="d-flex"><button class="page-link disabled" data-list-pagination="prev" disabled=""><svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
                          </svg><!-- <span class="fas fa-chevron-left"></span> Font Awesome fontawesome.com --></button>
                        <ul class="mb-0 pagination">
                          <li class="active"><button class="page btn-primary" type="button" data-i="1" data-page="5">1</button></li>
                          <li><button class="page" type="button" data-i="2" data-page="5">2</button></li>
                          <li><button class="page" type="button" data-i="3" data-page="5">3</button></li>
                          <li class="disabled"><button class="page" type="button">...</button></li>
                        </ul><button class="page-link pe-0" data-list-pagination="next"><svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                          </svg><!-- <span class="fas fa-chevron-right"></span> Font Awesome fontawesome.com --></button>
                      </div>
                    </div>
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
                        <label for="eps" class="form-label" id="label_eps">Entidad prestadora de salud (eps)</label>
                        <select class="form-select" id="eps" name="social_security[entity_id]" required>
                          <option selected disabled value="">Seleccione</option>
                        </select>
                        <div class="invalid-feedback">El campo es obligatorio</div>
                      </div>
                    </div>
                    <div class="col-sm-6" id="div_afp">
                      <div class="mb-2">
                        <label for="arl" class="form-label">Administradora de fondos de pensiones (AFP)</label>
                        <select class="form-select" id="arl" name="social_security[arl]" required>
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
                        <label for="afp" class="form-label">Administradoras de riesgos laborales (ARL)</label>
                        <select class="form-select" id="afp" name="social_security[afp]" required>
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
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
        <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
        <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="wizardForm">Finalizar</button>
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
    getJWTPayload
  } from "./services/utilidades.js";
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

    checkbox.addEventListener('change', function() {
      companionForm.style.display = checkbox.checked ? 'block' : 'none';
    });
  };

  const handleModalNavigation = () => {
    const btn = document.getElementById('openSecondModal');
    if (!btn) {
      console.error('El botón con ID "openSecondModal" no existe en el DOM.');
      return;
    }

    btn.addEventListener('click', function() {
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

  document.getElementById('modalCrearPaciente').addEventListener('submit', function(event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      this.classList.add('was-validated');
    }
  });

  const handleRegimenChange = () => {
    const regimenSelect = document.getElementById('type_scheme');
    const tipoAfiliadoSelect = document.getElementById('affiliate_type');
    const categorySelect = document.getElementById('category');

    regimenSelect.addEventListener('change', function() {
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
                <option value="2">Nivel 2</option>
            `;
      }
    });
  };

  async function getEntities() {
    try {
      const data = await entityService.getAll();
      console.log('Entidades', data);

      populateEntitySelect(data.data);
    } catch (error) {
      console.error('Error al obtener las entidades:', error);
    }
  }

  async function getCountries() {
    try {
      const data = await countryService.getAll();
      console.log('Paises', data);

      populateCountrySelect(data.data);
    } catch (error) {
      console.error('Error al obtener los países:', error);
    }
  }

  async function getDepartments(countryId) {
    try {
      const data = await departmentService.ofParent(countryId);
      console.log('Departamentos', data);

      populateDepartmentSelect(data);
    } catch (error) {
      console.error('Error al obtener los departamentos:', error);
    }
  }

  async function getCities(departmentId) {
    try {
      const data = await cityService.ofParent(departmentId);
      console.log('Ciudades', data);

      populateCitySelect(data);
    } catch (error) {
      console.error('Error al obtener las ciudades:', error);
    }
  }

  function populateCountrySelect(countries) {
    const countrySelect = document.getElementById('country_id');
    console.log('Paises', countries);
    countries = countries.filter(country => [
      "AR",
      "BO",
      "BR",
      "CL",
      "CO",
      "CR",
      "CU",
      "DO",
      "EC",
      "SV",
      "GT",
      "HN",
      "MX",
      "NI",
      "PA",
      "PY",
      "PE",
      "PR",
      "UY",
      "VE"
    ].includes(country.iso2));

    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.name;
      option.textContent = country.name;
      option.setAttribute('data-id', country.id);
      countrySelect.appendChild(option);
    });
  }

  function populateDepartmentSelect(departments) {
    const departmentSelect = document.getElementById('department_id');
    departmentSelect.innerHTML = '<option selected disabled value="">Seleccione</option>';
    departments.forEach(department => {
      const option = document.createElement('option');
      option.value = department.name;
      option.textContent = department.name;
      option.setAttribute('data-id', department.id);
      departmentSelect.appendChild(option);
    });
  }

  function populateCitySelect(cities) {
    const citySelect = document.getElementById('city_id');
    citySelect.innerHTML = '<option selected disabled value="">Seleccione</option>';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city.name;
      option.textContent = city.name;
      option.setAttribute('data-id', city.id);
      citySelect.appendChild(option);
    });
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
  document.addEventListener('DOMContentLoaded', async function() {
    // handleRegimenChange();
    updateWizard();
    handleCompanionForm();
    handleModalNavigation();
    handleImageUpload();
    // Llama a la función para obtener y cargar los países
    getCountries();
    getEntities();

    document.getElementById('country_id').addEventListener('change', function() {
      const selectedCountryId = this.selectedOptions[0].dataset.id;
      console.log('Pais seleccionado:', selectedCountryId);
      getDepartments(selectedCountryId);
    });

    document.getElementById('department_id').addEventListener('change', function() {
      const selectedDepartmentId = this.selectedOptions[0].dataset.id;
      console.log('Departamento seleccionado:', selectedDepartmentId);
      getCities(selectedDepartmentId);
    })

    const payloadDecoded = getJWTPayload();
    console.log(payloadDecoded);
    const userId = payloadDecoded.id || payloadDecoded.user_id || payloadDecoded.sub;
    console.log("User ID:", userId);
    // const user = await userService.get(userId);
    // user.country = {
    //   country_code: "AR"
    // }
    if (true || user.country.country_code !== "CO") {
      document.getElementById('label_eps').textContent = 'Aseguradora';
      console.log('ocultando campos de colombia');
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