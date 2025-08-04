<?php
$generoPaciente = 'femenino';
?>

<div class="modal fade" id="modalAntecedente" tabindex="-1" aria-labelledby="modalAntecedenteLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalAntecedenteLabel">Antecedentes</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Antecedentes Heredofamiliares</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Antecedentes Personales Patológicos</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Antecedentes Personales No Patológicos</span>
                        </li>
                        <li id="step-gineco-obstetrica" class="step d-none" data-step="4">
                            <span class="step-number">4</span>
                            <span class="step-label">Historia Gineco-Obstétrica</span>
                        </li>
                    </ul>
                </div>

                <form id="antecedentesForm">
                    <div class="wizard-content">
                        <div class="p-3 wizard-step active" data-step="1">
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_diabetes">
                                <label for="chk_diabetes">¿Tiene antecedentes de diabetes en su familia?</label>
                                <input type="text" id="diabetes" name="diabetes" class="form-control d-none" placeholder="Ejemplo: Padre">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_hipertension">
                                <label for="chk_hipertension">¿Quién en su familia ha tenido hipertensión?</label>
                                <input type="text" id="hipertension" name="hipertension" class="form-control d-none" placeholder="Ejemplo: Madre y abuelo paterno">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_cancer">
                                <label for="chk_cancer">¿Algún familiar ha tenido cáncer?</label>
                                <input type="text" id="cancer" name="cancer" class="form-control d-none" placeholder="Ejemplo: Tía materna (de mama)">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_cardiovasculares">
                                <label for="chk_cardiovasculares">¿Existen antecedentes de enfermedades cardiovasculares?</label>
                                <input type="text" id="cardiovasculares" name="cardiovasculares" class="form-control d-none" placeholder="Ejemplo: Ninguna reportada">
                            </div>
                        </div>

                        <!-- Antecedentes Personales Patológicos -->
                        <div class="p-3 wizard-step" data-step="2">
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_enfermedades_previas">
                                <label for="chk_enfermedades_previas">¿Ha tenido enfermedades previas?</label>
                                <input type="text" id="enfermedades_previas" name="enfermedades_previas" class="form-control d-none" placeholder="Ejemplo: Hepatitis A (infancia)">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_cirugias">
                                <label for="chk_cirugias">¿Se ha sometido a alguna cirugía?</label>
                                <input type="text" id="cirugias" name="cirugias" class="form-control d-none" placeholder="Ejemplo: Apendicectomía (2015)">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_hospitalizaciones">
                                <label for="chk_hospitalizaciones">¿Ha sido hospitalizado anteriormente?</label>
                                <input type="text" id="hospitalizaciones" name="hospitalizaciones" class="form-control d-none" placeholder="Ejemplo: Ninguna adicional">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_alergias">
                                <label for="chk_alergias">¿Tiene alguna alergia?</label>
                                <input type="text" id="alergias" name="alergias" class="form-control d-none" placeholder="Ejemplo: Penicilina">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_medicamentos">
                                <label for="chk_medicamentos">¿Está en algún tratamiento con medicamentos?</label>
                                <input type="text" id="medicamentos" name="medicamentos" class="form-control d-none" placeholder="Ejemplo: Metformina (tratamiento actual)">
                            </div>
                        </div>

                        <!-- Antecedentes Personales No Patológicos -->
                        <div class="p-3 wizard-step" data-step="3">
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_habitos">
                                <label for="chk_habitos">¿Cuáles son sus hábitos?</label>
                                <input type="text" id="habitos" name="habitos" class="form-control d-none" placeholder="Ejemplo: No fuma, consume alcohol ocasionalmente">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_actividad_fisica">
                                <label for="chk_actividad_fisica">¿Con qué frecuencia realiza actividad física?</label>
                                <input type="text" id="actividad_fisica" name="actividad_fisica" class="form-control d-none" placeholder="Ejemplo: Realiza ejercicio 3 veces por semana">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_vacunacion">
                                <label for="chk_vacunacion">¿Está al día con su esquema de vacunación?</label>
                                <input type="text" id="vacunacion" name="vacunacion" class="form-control d-none" placeholder="Ejemplo: Esquema completo hasta la última revisión">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_dieta">
                                <label for="chk_dieta">¿Sigue alguna dieta?</label>
                                <input type="text" id="dieta" name="dieta" class="form-control d-none" placeholder="Ejemplo: Controlada en carbohidratos">
                            </div>
                        </div>

                        <!-- Historia Gineco-Obstétrica -->
                        <div class="p-3 wizard-step" data-step="4">
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_menarquia">
                                <label for="chk_menarquia">¿A qué edad tuvo su primera menstruación?</label>
                                <input type="text" id="menarquia" name="menarquia" class="form-control d-none" placeholder="Ejemplo: 12 años">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_ciclos_menstruales">
                                <label for="chk_ciclos_menstruales">¿Cómo son sus ciclos menstruales?</label>
                                <input type="text" id="ciclos_menstruales" name="ciclos_menstruales" class="form-control d-none" placeholder="Ejemplo: Regulares">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_gestaciones">
                                <label for="chk_gestaciones">¿Cuántas gestaciones ha tenido?</label>
                                <input type="text" id="gestaciones" name="gestaciones" class="form-control d-none" placeholder="Ejemplo: 2 (1 parto vaginal, 1 cesárea)">
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" id="chk_metodos_anticonceptivos">
                                <label for="chk_metodos_anticonceptivos">¿Usa algún método anticonceptivo?</label>
                                <input type="text" id="metodos_anticonceptivos" name="metodos_anticonceptivos" class="form-control d-none" placeholder="Ejemplo: DIU">
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

<script>
    let generoPaciente = '<?= $generoPaciente ?>'
    let lastStep = 3

    function checkAntecedente(el) {
        let inputField = el.nextElementSibling.nextElementSibling;
        if (el.checked) {
            inputField.classList.remove("d-none");
            inputField.required = true
        } else {
            inputField.classList.add("d-none");
            inputField.required = false
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("input[type=checkbox]").forEach(function(checkbox) {
            checkbox.addEventListener("change", function() {
                checkAntecedente(this)
            });
        });

        if (generoPaciente == 'femenino') {
            lastStep = 4
            document.getElementById('step-gineco-obstetrica').classList.remove('d-none')
        }
    });

    const antecedentes = {
        diabetes: "diabetes",
        hipertension: "hipertension",
        cancer: "cancer",
        cardiovasculares: "cardiovasculares",
        enfermedades_previas: "enfermedades_previas",
        cirugias: "cirugias",
        hospitalizaciones: "hospitalizaciones",
        alergias: "alergias",
        medicamentos: "medicamentos",
        habitos: "habitos",
        actividad_fisica: "actividad_fisica",
        vacunacion: "vacunacion",
        dieta: "dieta",
        menarquia: "menarquia",
        ciclos_menstruales: "ciclos_menstruales",
        gestaciones: "gestaciones",
        metodos_anticonceptivos: "metodos_anticonceptivos"
    };

    function editarAntecedente(id) {
        $("#modalAntecedenteLabel").html(`Editar Antecedente`);
        // console.log('Editar incapacidad con ID:', id, "data_antecedente_" + id);

        const data = JSON.parse(
            document.getElementById("data_antecedente_" + id).value
        );

        // console.log(data);

        Object.keys(antecedentes).forEach(key => {
            const dataKey = antecedentes[key]

            $("#chk_" + key).prop('checked', !!data[dataKey]);
            checkAntecedente(document.getElementById("chk_" + key))
            $("#" + key).val(data[dataKey]);
        })

        $("#modalAntecedente").modal('show');
    }

    const scrollToCurrentStep = () => {
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            const container = document.querySelector('.steps-container');
            container.scrollLeft = activeStep.offsetLeft - container.offsetWidth / 2 + activeStep.offsetWidth / 2;
        }
    };


    let currentStep = 1;

    const updateWizard = () => {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        document.getElementById('prevStep').disabled = currentStep === 1;
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === lastStep);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== lastStep);

        scrollToCurrentStep(); // Llamar a la función de scroll
    };

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
</script>