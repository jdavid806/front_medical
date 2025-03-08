<?php
// Array de antecedentes con id, valor y nombre
$vacunas = [
    ["id" => 1, "valor" => "Hepatitis B", "nombre" => "Hepatitis B"],
    ["id" => 2, "valor" => "DTP", "nombre" => "DTP (Difteria, Tétanos y Tos Ferina)"],
    ["id" => 3, "valor" => "Polio", "nombre" => "Polio"],
    ["id" => 4, "valor" => "Triple Viral", "nombre" => "Triple Viral (Sarampión, Rubeola y Parotiditis)"],
    ["id" => 5, "valor" => "Influenza", "nombre" => "Influenza (Gripe)"],
    ["id" => 6, "valor" => "Tétanos", "nombre" => "Tétanos"],
    ["id" => 7, "valor" => "Neumococo", "nombre" => "Neumococo"],
    ["id" => 8, "valor" => "Varicela", "nombre" => "Varicela"],
    ["id" => 9, "valor" => "HPV", "nombre" => "HPV (Virus del Papiloma Humano)"]
];

?>

<div class="modal fade modal-xl" id="modalGrupoVacuna" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Grupo de Vacunas</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <span class="step-label">Información de dosis</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoPaciente" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">
                                <div class="col-8 col-sm-6">

                                    <div class="input-group">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="nombreVacuna" required name="nombreVacuna">
                                            <label for="nombreVacuna" class="form-label">Nombre del grupo</label>
                                            <div class="invalid-feedback">Por favor ingrese el nombre del grupo.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <select class="form-select" name="tipoVacuna" id="tipoVacuna" required>
                                                <option value="" disabled selected>Seleccione el tipo de Grupo</option>
                                                <option value="enfermedad">Tipo de Enfermedad</option>
                                                <option value="vacunaCombinada">Vacuna Combinada</option>
                                                <option value="grupoEdad">Por Edad</option>
                                                <option value="esquema">Esquema</option>
                                            </select>
                                            <label for="tipoVacuna" class="form-label">Grupo de Vacuna</label>
                                            <div class="invalid-feedback">Por favor seleccione un tipo de grupo de vacuna.</div>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <select class="form-select" name="cantidadDosis" id="cantidadDosis" required>
                                                <option value="" disabled selected>Seleccione cantidad de dosis</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                            <label for="cantidadDosis" class="form-label">Grupo de Vacuna</label>
                                        </div>
                                    </div>

                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <select class="form-select" id="organizerMultiple" data-choices="data-choices" multiple="multiple" data-options='{"removeItemButton":true,"placeholder":true}'>
                                                <option value="" disabled selected>Seleccione las vacunas</option>
                                                <?php foreach ($vacunas as $vacuna) : ?>
                                                    <option value="<?= $vacuna['id'] ?>"><?= $vacuna['nombre'] ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-4 col-sm-6">

                                    <div class="row justify-content-center">
                                        <div class="col-md-6 text-center">
                                            <h2>Imagen de Vacuna</h2>
                                            <!-- Imagen de previsualización -->
                                            <div class="mt-3">
                                                <img id="vacunaPreview" src="https://via.placeholder.com/150" alt="Previsualización" class="profile-img">
                                            </div>
                                            <!-- Botones de acción -->
                                            <div class="mt-4">
                                                <label for="uploadVacunaImage" class="btn btn-primary me-2">
                                                    <i class="fa-solid fa-upload me-1"></i> Subir Imagen
                                                </label>
                                                <!-- Input oculto para subir imagen -->
                                                <input type="file" id="uploadVacunaImage" class="d-none" accept="image/*">
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div class="wizard-step" data-step="2">

                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <select class="form-select" name="tipoDosisDias" id="tipoDosisDias" required>
                                        <option value="" disabled selected>Tiempo de aplicación (En días)</option>
                                        <?php for ($i = 1; $i <= 30; $i++) : ?>
                                            <option value="<?= $i ?>"><?= $i ?>
                                            <?php endfor; ?></option>
                                    </select>
                                    <label for="tipoDosisDias" class="form-label">Tiempo de aplicación (En días)</label>
                                </div>
                            </div>
                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <select class="form-select" name="cantidadDosisMeses" id="cantidadDosisMeses" required>
                                        <option value="" disabled selected>Tiempo de aplicación (En meses)</option>
                                        <?php for ($i = 1; $i <= 12; $i++) : ?>
                                            <option value="<?= $i ?>"><?= $i ?></option>
                                        <?php endfor; ?>
                                    </select>
                                    <label for="cantidadDosisMeses" class="form-label">Grupo de Vacuna</label>
                                </div>
                            </div>
                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <select class="form-select" name="tipoDosisAnos" id="tipoDosisAnos" required>
                                        <option value="" disabled selected>Tiempo de aplicación (En años)</option>
                                        <?php for ($i = 1; $i <= 10; $i++) : ?>
                                            <option value="<?= $i ?>"><?= $i ?></option>
                                        <?php endfor; ?>
                                    </select>
                                    <label for="tipoDosisAnos" class="form-label">Tiempo de aplicación (En años)</label>
                                </div>
                            </div>
                            <div class="input-group mt-3">
                                <div class="form-floating">
                                    <input type="text" name="cantidadDosis" id="cantidadDosis" class="form-control">
                                    <label for="cantidadDosis" class="form-label">Descripción</label>
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