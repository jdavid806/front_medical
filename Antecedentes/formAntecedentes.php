<?php
$generoPaciente = 'femenino';
?>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PastMedicalHistoryForm
    } from './react-dist/past-medical-history/PastMedicalHistoryForm.js';

    ReactDOMClient.createRoot(document.getElementById('form-content')).render(React.createElement(PastMedicalHistoryForm));
</script>

<div id="form-content"></div>

<!-- <div class="steps-container mb-4">
    <ul class="steps">
        <li class="step active cursor-pointer" data-step="1" onclick="goToStep(1)">
            <span class="step-number">1</span>
            <span class="step-label">Heredofamiliares</span>
        </li>
        <li class="step cursor-pointer" data-step="2" onclick="goToStep(2)">
            <span class="step-number">2</span>
            <span class="step-label">Personales Patológicos</span>
        </li>
        <li class="step cursor-pointer" data-step="3" onclick="goToStep(3)">
            <span class="step-number">3</span>
            <span class="step-label">Personales No Patológicos</span>
        </li>
        <li id="step-gineco-obstetrica" class="step d-none cursor-pointer" data-step="4" onclick="goToStep(4)">
            <span class="step-number">4</span>
            <span class="step-label">Historia Gineco-Obstétrica</span>
        </li>
    </ul>
</div>         -->

<!-- <form id="antecedentesForm">
    <div class="wizard-content">
        <div class="p-3 wizard-step active" data-step="1">
            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_diabetes">
                <label for="chk_diabetes">¿Tiene antecedentes de diabetes en su familia?</label>
                <div class="d-none">
                    <textarea id="diabetes" name="diabetes" class="form-control rich-text" placeholder="Ejemplo: Padre"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="diabetes" data-bs-toggle="tooltip" data-bs-placement="top" title="<i class=" fa-solid fa-file-prescription"></i>">
                            <i class="fa-solid fa-file-prescription"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_hipertension">
                <label for="chk_hipertension">¿Quién en su familia ha tenido hipertensión?</label>
                <div class="d-none">
                    <textarea id="hipertension" name="hipertension" class="form-control rich-text" placeholder="Ejemplo: Madre y abuelo paterno"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="hipertension"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_cancer">
                <label for="chk_cancer">¿Algún familiar ha tenido cáncer?</label>
                <div class="d-none">
                    <textarea id="cancer" name="cancer" class="form-control rich-text" placeholder="Ejemplo: Tía materna (de mama)"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="cancer"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_cardiovasculares">
                <label for="chk_cardiovasculares">¿Existen antecedentes de enfermedades cardiovasculares?</label>
                <div class="d-none">
                    <textarea id="cardiovasculares" name="cardiovasculares" class="form-control rich-text" placeholder="Ejemplo: Ninguna reportada"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="cardiovasculares"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <!-- Antecedentes Personales Patológicos 
        <div class="p-3 wizard-step" data-step="2">
            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_enfermedades_previas">
                <label for="chk_enfermedades_previas">¿Ha tenido enfermedades previas?</label>
                <div class="d-none">
                    <textarea id="enfermedades_previas" name="enfermedades_previas" class="form-control rich-text" placeholder="Ejemplo: Hepatitis A (infancia)"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="enfermedades_previas"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_cirugias">
                <label for="chk_cirugias">¿Se ha sometido a alguna cirugía?</label>
                <div class="d-none">
                    <textarea id="cirugias" name="cirugias" class="form-control rich-text" placeholder="Ejemplo: Apendicectomía (2015)"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="cirugias"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_hospitalizaciones">
                <label for="chk_hospitalizaciones">¿Ha sido hospitalizado anteriormente?</label>
                <div class="d-none">
                    <textarea id="hospitalizaciones" name="hospitalizaciones" class="form-control rich-text" placeholder="Ejemplo: Ninguna adicional"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="hospitalizaciones"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_alergias">
                <label for="chk_alergias">¿Tiene alguna alergia?</label>
                <div class="d-none">
                    <textarea id="alergias" name="alergias" class="form-control rich-text" placeholder="Ejemplo: Penicilina"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="alergias"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_medicamentos">
                <label for="chk_medicamentos">¿Está en algún tratamiento con medicamentos?</label>
                <div class="d-none">
                    <textarea id="medicamentos" name="medicamentos" class="form-control rich-text" placeholder="Ejemplo: Metformina (tratamiento actual)"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="medicamentos"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Antecedentes Personales No Patológicos 
        <div class="p-3 wizard-step" data-step="3">
            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_habitos">
                <label for="chk_habitos">¿Cuáles son sus hábitos?</label>
                <div class="d-none">
                    <textarea id="habitos" name="habitos" class="form-control rich-text" placeholder="Ejemplo: No fuma, consume alcohol ocasionalmente"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="habitos"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_actividad_fisica">
                <label for="chk_actividad_fisica">¿Con qué frecuencia realiza actividad física?</label>
                <div class="d-none">
                    <textarea id="actividad_fisica" name="actividad_fisica" class="form-control rich-text" placeholder="Ejemplo: Realiza ejercicio 3 veces por semana"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="actividad_fisica"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_vacunacion">
                <label for="chk_vacunacion">¿Está al día con su esquema de vacunación?</label>
                <div class="d-none">
                    <textarea id="vacunacion" name="vacunacion" class="form-control rich-text" placeholder="Ejemplo: Esquema completo hasta la última revisión"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="vacunacion"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_dieta">
                <label for="chk_dieta">¿Sigue alguna dieta?</label>
                <div class="d-none">
                    <textarea id="dieta" name="dieta" class="form-control rich-text" placeholder="Ejemplo: Controlada en carbohidratos"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="dieta"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Historia Gineco-Obstétrica 
        <div class="p-3 wizard-step" data-step="4">
            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_menarquia">
                <label for="chk_menarquia">¿A qué edad tuvo su primera menstruación?</label>
                <div class="d-none">
                    <textarea id="menarquia" name="menarquia" class="form-control rich-text" placeholder="Ejemplo: 12 años"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="menarquia"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_ciclos_menstruales">
                <label for="chk_ciclos_menstruales">¿Cómo son sus ciclos menstruales?</label>
                <div class="d-none">
                    <textarea id="ciclos_menstruales" name="ciclos_menstruales" class="form-control rich-text" placeholder="Ejemplo: Regulares"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="ciclos_menstruales"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_gestaciones">
                <label for="chk_gestaciones">¿Cuántas gestaciones ha tenido?</label>
                <div class="d-none">
                    <textarea id="gestaciones" name="gestaciones" class="form-control rich-text" placeholder="Ejemplo: 2 (1 parto vaginal, 1 cesárea)"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="gestaciones"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>

            <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" id="chk_metodos_anticonceptivos">
                <label for="chk_metodos_anticonceptivos">¿Usa algún método anticonceptivo?</label>
                <div class="d-none">
                    <textarea id="metodos_anticonceptivos" name="metodos_anticonceptivos" class="form-control rich-text" placeholder="Ejemplo: DIU"></textarea>
                    <div class="d-flex justify-content-end py-2">
                        <a href="#" class="text-decoration-none open-template-modal" data-bs-toggle="modal" data-textarea-id="metodos_anticonceptivos"><i class="fa-solid fa-file-prescription"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex gap-2 justify-content-end mt-3">
        <button class="btn btn-secondary" type="button" id="finishStep" form="wizardForm">Finalizar</button>
    </div>
</form> -->

<?php
include "../components/modalTemplateBasic.php";
?>

<style>
    .steps-container {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: scroll;
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
        min-width: 200px
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