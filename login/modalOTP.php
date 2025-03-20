<!-- Modal para solicitar datos -->
<div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="forgotPasswordModalLabel">Recuperar Contraseña</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Ingresa tus datos para recuperar tu contraseña.</p>
                <form id="forgotPasswordForm">
                    <div class="mb-3">
                        <input type="text" id="nombreCentro" class="form-control" placeholder="Nombre del centro médico"
                            required>
                    </div>
                    <div class="mb-3">
                        <input type="text" id="nombreUsuario" class="form-control" placeholder="Nombre de usuario"
                            required>
                    </div>
                    <div class="mb-3">
                        <input type="text" id="codPais" class="form-control" placeholder="Código de país" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" id="telefono" class="form-control" placeholder="Teléfono" required>
                    </div>
                    <div class="mb-3">
                        <input type="email" id="email" class="form-control" placeholder="Correo electrónico" required>
                    </div>
                    <button type="button" class="btn btn-primary w-100" id="btnEnviarOtp">Enviar OTP</button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal para OTP -->
<div class="modal fade" id="otpModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="otpModalLabel">Ingrese el código de verificación</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <p>El código contiene 6 dígitos, no lo compartas con nadie.</p>
                <div class="d-flex justify-content-center gap-2">
                    <input type="text" class="otp-input" maxlength="1">
                    <input type="text" class="otp-input" maxlength="1">
                    <input type="text" class="otp-input" maxlength="1">
                    <span>-</span>
                    <input type="text" class="otp-input" maxlength="1">
                    <input type="text" class="otp-input" maxlength="1">
                    <input type="text" class="otp-input" maxlength="1">
                </div>
                <p class="text-danger mt-2 d-none" id="otpError">OTP inválido</p>
                <button class="btn btn-success w-100 mt-3" id="verifyOtpBtn" disabled>Verificar</button>
            </div>
        </div>
    </div>
</div>

<!-- Estilos personalizados -->
<style>
    .otp-input {
        width: 40px;
        height: 40px;
        text-align: center;
        font-size: 20px;
        border: 2px solid #ced4da;
        border-radius: 5px;
        transition: border-color 0.2s, background-color 0.2s;
    }

    .otp-input:focus {
        border-color: #007bff;
        outline: none;
    }

    .otp-input.filled {
        border-color: #28a745 !important;
        background-color: #d4edda;
    }
</style>

<!-- JavaScript para OTP -->
<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btnEnviarOtp").addEventListener("click", function () {
            const apiUrl = `https://dev.monaros.co/api/auth/otp/send-otp`;

            let nombreCentro = document.getElementById("nombreCentro").value.trim();
            let nombreUsuario = document.getElementById("nombreUsuario").value.trim();
            let cod pais = document.getElementById("codPais").value.trim();
            let telefono = document.getElementById("telefono").value.trim();
            let email = document.getElementById("email").value.trim();

            if (!nombreCentro || !nombreUsuario || !codPais || !telefono || !email) {
                alert("⚠️ Todos los campos son obligatorios.");
                return;
            }

            let datos = {
                nombre_centro_medico: nombreCentro,
                nombre_usuario: nombreUsuario,
                cod_pais: codPais,
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
                        $("#forgotPasswordModal").modal("hide"); // Cierra el modal de datos
                        $("#otpModal").modal("show"); // Muestra el modal OTP
                    } else {
                        alert("❌ Error al enviar OTP.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("❌ Ocurrió un error al enviar OTP.");
                });
        });

        const inputs = document.querySelectorAll(".otp-input");
        const verifyBtn = document.getElementById("verifyOtpBtn");

        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                if (e.target.value.length === 1) {
                    e.target.classList.add("filled"); // Poner color verde cuando se llena
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                } else {
                    e.target.classList.remove("filled");
                }
                checkOtpCompletion();
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && index > 0 && e.target.value === "") {
                    inputs[index - 1].focus();
                }
            });
        });

        function checkOtpCompletion() {
            let otp = "";
            let allFilled = true;

            inputs.forEach(input => {
                otp += input.value;
                if (input.value === "") {
                    allFilled = false;
                }
            });

            if (allFilled) {
                verifyBtn.removeAttribute("disabled");
            } else {
                verifyBtn.setAttribute("disabled", "true");
            }
        }
    });
</script>
