document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("username").value = username;
    }

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const requirementItems = {
        length: document.getElementById("requirement-length"),
        uppercase: document.getElementById("requirement-uppercase"),
        special: document.getElementById("requirement-special")
    };

    // Validaciones en tiempo real
    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;

        // Reglas de validación
        const isLengthValid = password.length >= 8;
        const isUppercaseValid = /[A-Z]/.test(password);
        const isSpecialValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        function updateRequirement(element, isValid) {
            element.style.color = isValid ? "green" : "red";
        }

        updateRequirement(requirementItems.length, isLengthValid);
        updateRequirement(requirementItems.uppercase, isUppercaseValid);
        updateRequirement(requirementItems.special, isSpecialValid);
    });

    document.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();

        let username = document.getElementById("username").value;
        let password = passwordInput.value;
        let passwordConfirmation = confirmPasswordInput.value;

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            alert("La contraseña no cumple con los requisitos.");
            return;
        }

        if (password !== passwordConfirmation) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        let apiUrl = `${window.location.origin}/api/auth/change-password`;
        let data = { username, password, password_confirmation: passwordConfirmation };

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    Swal.fire({
                        title: "Contraseña cambiada",
                        text: "Tu contraseña ha sido actualizada correctamente.",
                        icon: "success",
                        confirmButtonText: "Continuar",
                        confirmButtonClass: "btn btn-phoenix-primary",
                    });
                    localStorage.removeItem("username");
                    window.location.href = "/Dashboard";
                } else {
                    alert("Error al cambiar contraseña.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Ocurrió un error.");
            });
    });

    // 🟢 FUNCIONALIDAD PARA MOSTRAR/OCULTAR CONTRASEÑA 🟢
    document.querySelectorAll("[data-password-toggle]").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault(); // Evita recargas o envíos accidentales

            let input = this.closest(".position-relative").querySelector("input"); // Encuentra el input dentro del contenedor
            let iconShow = this.querySelector(".uil-eye");
            let iconHide = this.querySelector(".uil-eye-slash");

            if (input.type === "password") {
                input.type = "text"; // Muestra la contraseña
                iconShow.style.display = "none";
                iconHide.style.display = "inline";
            } else {
                input.type = "password"; // Oculta la contraseña
                iconShow.style.display = "inline";
                iconHide.style.display = "none";
            }
        });
    });
});
