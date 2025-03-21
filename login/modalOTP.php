<div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header text-center">
                <div class="w-100">
                    <img src="/logo_monaros_sinbg_light.png" style="width: 50%;" alt="Logo" class="mb-3">
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="text-center">Ingresa tus datos para recuperar tu contraseña.</p>
                <form id="forgotPasswordForm">
                    <div class="mb-3 input-group">
                        <span class="input-group-text"><i class="bi bi-hospital"></i></span>
                        <input type="text" id="nombreCentro" class="form-control" placeholder="Nombre del centro médico"
                            required>
                    </div>
                    <div class="mb-3 input-group">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text" id="nombreUsuario" class="form-control" placeholder="Nombre de usuario"
                            required>
                    </div>
                    <div class="mb-3 input-group">
                        <span class="input-group-text"><i class="bi bi-globe"></i></span>
                        <input type="text" id="codPais" class="form-control" placeholder="Código de país" required>
                    </div>
                    <div class="mb-3 input-group">
                        <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                        <input type="text" id="telefono" class="form-control" placeholder="Teléfono" required>
                    </div>
                    <div class="mb-3 input-group">
                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                        <input type="email" id="email" class="form-control" placeholder="Correo electrónico" required>
                    </div>
                    <button type="button" class="btn btn-primary w-100" id="btnEnviarOtp">Enviar OTP</button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Estilos personalizados -->
<style>
    .logo {
        width: 80px;
        /* Ajusta el tamaño del logo según sea necesario */
        display: block;
        margin: 0 auto;
    }

    .modal-header {
        border-bottom: none;
    }

    .input-group-text {
        background-color: #f8f9fa;
    }

    .btn-primary {
        background-color: #007bff;
        border: none;
    }
</style>

<!-- Carga Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

<div class="modal fade" id="otpModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header text-center">
                <div class="w-100">
                    <img src="/logo_monaros_sinbg_light.png" style="width: 50%;" alt="Logo" class="mb-3">
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <h5 class="modal-title mb-3">Ingrese el código de verificación</h5>
                <p>El código contiene 6 dígitos, no lo compartas con nadie.</p>

                <!-- Contenedor de los cuadros OTP -->
                <div class="d-flex justify-content-center gap-2">
                    <input type="text" class="otp-input text-center" maxlength="1">
                    <input type="text" class="otp-input text-center" maxlength="1">
                    <input type="text" class="otp-input text-center" maxlength="1">
                    <span class="fw-bold">-</span>
                    <input type="text" class="otp-input text-center" maxlength="1">
                    <input type="text" class="otp-input text-center" maxlength="1">
                    <input type="text" class="otp-input text-center" maxlength="1">
                </div>

                <!-- Mensaje de error -->
                <p class="text-danger mt-2 d-none" id="otpError">OTP inválido</p>
                <p class="text-warning mt-2 d-none" id="otpWarning">Solo números permitidos</p>

                <button class="btn btn-success w-100 mt-3" id="verifyOtpBtn" disabled>Verificar</button>
            </div>
        </div>
    </div>
</div>

<!-- Estilos personalizados -->
<style>
    .otp-input {
        width: 55px;
        height: 55px;
        font-size: 28px;
        font-weight: bold;
        border: 2px solid #007bff;
        border-radius: 8px;
        text-align: center;
        transition: all 0.2s;
    }

    .otp-input:focus {
        border-color: #28a745;
        outline: none;
        background-color: #f8f9fa;
    }

    .otp-input.invalid {
        border-color: #dc3545 !important;
        background-color: #f8d7da;
    }

    .otp-input.filled {
        border-color: #28a745 !important;
        background-color: #d4edda;
    }
</style>

<!-- Script para manejo de OTP -->
<script>
    document.addEventListener("DOMContentLoaded", function () {
        // ==============================
        // 1. VALIDACIONES DE LOS INPUTS OTP
        // ==============================
        const otpInputs = document.querySelectorAll(".otp-input");
        const otpWarning = document.getElementById("otpWarning");

        otpInputs.forEach((input, index) => {
            input.addEventListener("input", function (e) {
                let value = this.value;

                // Validar que sea un número
                if (!/^\d$/.test(value)) {
                    this.value = ""; // Borra el valor inválido
                    this.classList.add("invalid"); // Borde rojo
                    otpWarning.classList.remove("d-none"); // Muestra advertencia
                } else {
                    this.classList.remove("invalid"); // Quita el borde rojo
                    otpWarning.classList.add("d-none"); // Oculta advertencia
                }

                // Pasar al siguiente input si se ingresó un número válido
                if (value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }

                checkOtpCompletion();
            });

            input.addEventListener("keydown", function (e) {
                // Permitir solo números y teclas de navegación
                if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                    e.preventDefault();
                }

                // Volver al input anterior con Backspace
                if (e.key === "Backspace" && index > 0 && !input.value) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        function checkOtpCompletion() {
            const verifyBtn = document.getElementById("verifyOtpBtn");
            let allFilled = [...otpInputs].every(input => input.value !== "");

            verifyBtn.disabled = !allFilled;
        }

        // ==============================
        // 2. ENVÍO DEL OTP
        // ==============================
        document.getElementById("btnEnviarOtp").addEventListener("click", function () {
            const apiUrl = `${window.location.origin}/api/auth/otp/send-otp`;

            let nombreCentro = document.getElementById("nombreCentro").value.trim();
            let nombreUsuario = document.getElementById("nombreUsuario").value.trim();
            let codPais = document.getElementById("codPais").value.trim();
            let telefono = document.getElementById("telefono").value.trim();
            let email = document.getElementById("email").value.trim();

            // Validar campos vacíos
            if (!nombreCentro || !nombreUsuario || !codPais || !telefono || !email) {
                alert("⚠️ Todos los campos son obligatorios.");
                return;
            }

            let datos = {
                nombre_del_centro_medico: nombreCentro,
                nombre_usuario: nombreUsuario,
                "cod pais": codPais,
                phone: codPais + telefono,
                email: email
            };

            fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message && data.message.includes("OTP enviado")) {
                        alert("✅ OTP enviado correctamente.");
                        $("#forgotPasswordModal").modal("hide"); // Cierra modal de datos
                        $("#otpModal").modal("show"); // Abre modal OTP
                    } else {
                        alert("Error al enviar OTP.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Ocurrió un error al enviar OTP.");
                });
        });

    });

    // ==============================
    // 3 VERIFICACIÓN DEL OTP
    // ==============================

    document.getElementById("verifyOtpBtn").addEventListener("click", function () {
        const otpInputs = document.querySelectorAll(".otp-input");
        let otp = Array.from(otpInputs).map(input => input.value).join("");
        let telefono = document.getElementById("telefono").value.trim();
        let email = document.getElementById("email").value.trim();
        let username = document.getElementById("nombreUsuario").value.trim();

        let apiUrl = `${window.location.origin}/api/auth/otp/validate-otp`;
        let datos = {
            phone: telefono,
            email: email,
            otp: otp
        };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message && data.message.includes("OTP válido. Acceso permitido.")) {
                    alert("OTP verificado correctamente.");
                    localStorage.setItem("username", username); // Guardamos el username

                    $("#otpModal").modal("hide");
                    window.location.href = `${window.location.origin}/forgotPassword`;
                } else {
                    alert(" Error al verificar OTP. Intenta nuevamente.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Ocurrió un error al verificar OTP.");
            });
    });



</script>