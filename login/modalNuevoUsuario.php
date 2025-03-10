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



<form id="registroModal" class="needs-validation" novalidate>
    <div class="wizard-content">

        <!-- Paso 1: Datos personales -->
        <div class="wizard-step active" data-step="1">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="first_name" name="first_name" required>
                        <label for="first_name">Primer Nombre</label>
                        <div class="invalid-feedback">Por favor ingrese su primer nombre.</div>
                    </div>
                </div>

                <div class="col-12 col-sm-6">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="middle_name" name="middle_name">
                        <label for="middle_name">Segundo Nombre</label>
                    </div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-12 col-sm-6">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="last_name" name="last_name" required>
                        <label for="last_name">Apellido</label>
                        <div class="invalid-feedback">Por favor ingrese su apellido.</div>
                    </div>
                </div>

                <div class="col-12 col-sm-6">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="second_last_name" name="second_last_name">
                        <label for="second_last_name">Segundo Apellido</label>
                    </div>
                </div>
            </div>

            <div class="input-group mt-3">
                <div class="form-floating">
                    <select class="form-select" name="gender" id="gender" required>
                        <option value="" disabled selected>Seleccione su género</option>
                        <option value="MALE">Hombre</option>
                        <option value="FEMALE">Mujer</option>
                    </select>
                    <label for="gender">Género</label>
                    <div class="invalid-feedback">Por favor seleccione su género.</div>
                </div>
            </div>

            <div class="input-group mt-3">
                <div class="form-floating">
                    <input type="text" class="form-control" id="address" name="address" required>
                    <label for="address">Dirección</label>
                    <div class="invalid-feedback">Por favor ingrese su dirección.</div>
                </div>
            </div>
        </div>

        <!-- Paso 2: Credenciales y contacto -->
        <div class="wizard-step" data-step="2">
            <div class="input-group mt-3">
                <div class="form-floating">
                    <input type="text" class="form-control" id="username" name="username" required>
                    <label for="username">Nombre de Usuario</label>
                    <div class="invalid-feedback">Por favor ingrese un nombre de usuario.</div>
                </div>
            </div>

            <div class="input-group mt-3">
                <div class="form-floating">
                    <input type="email" class="form-control" id="email" name="email" required>
                    <label for="email">Correo Electrónico</label>
                    <div class="invalid-feedback">Por favor ingrese un correo válido.</div>
                </div>
            </div>

            <div class="input-group mt-3">
                <div class="form-floating">
                    <input type="password" class="form-control" id="password" name="password" required>
                    <label for="password">Contraseña</label>
                    <div class="invalid-feedback">Por favor ingrese una contraseña.</div>
                </div>
            </div>

            <div class="input-group mt-3">
                <div class="form-floating">
                    <input type="tel" class="form-control" id="phone" name="phone" required>
                    <label for="phone">Teléfono</label>
                    <div class="invalid-feedback">Por favor ingrese un número de teléfono.</div>
                </div>
            </div>
        </div>
    </div>
</form>


<div class="modal-footer">
    <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
    <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
    <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="registroModal">Finalizar</button>
</div>



<script>
document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;

    const updateWizard = () => {
        console.log("Actualizando paso:", currentStep); // Depuración

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        // Control de botones
        document.getElementById('prevStep').disabled = currentStep === 1;
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 2);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 2);
    };

    document.getElementById('nextStep').addEventListener('click', () => {
        console.log("Paso actual antes de avanzar:", currentStep); // Depuración

        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        
        if (!currentForm) {
            console.error("No se encontró wizard-step para el paso:", currentStep);
            return;
        }

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

    document.getElementById('registroModal').addEventListener('submit', function (event) {
        if (!this.checkValidity()) {
            event.preventDefault();
            this.classList.add('was-validated');
        }
    });

    updateWizard();
});
</script>