document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const firstTime = urlParams.get("first_time");


    if (firstTime === "true" && email) {
        localStorage.setItem("complete_registration", "true");
        localStorage.setItem("email", email);
        $('#registroModal').modal('show');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
function toggleForm() {
    let flipper = document.getElementById('flipper');
    flipper.style.transform = (flipper.style.transform === 'rotateY(180deg)') ? 'rotateY(0deg)' : 'rotateY(180deg)';
}

function completarRegistro() {
    let form = document.getElementById("registroForm");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    let username = document.getElementById("username").value;
    let firstName = document.getElementById("first_name").value;
    let middleName = document.getElementById("middle_name").value;
    let lastName = document.getElementById("last_name").value;
    let secondLastName = document.getElementById("second_last_name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let phone = document.getElementById("phone").value;
    let gender = document.getElementById("gender").value;
    let address = document.getElementById("address").value;

    let userRoleId = 1;
    let userSpecialtyId = 1;
    let countryId = 1;
    let cityId = 1;

    const baseDomain = window.location.hostname;
    const apiUrl = `http://${baseDomain}/api/auth/register`;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            second_last_name: secondLastName,
            user_role_id: userRoleId,
            user_specialty_id: userSpecialtyId,
            country_id: countryId,
            city_id: cityId,
            gender,
            address,
            phone
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) { // <-- AQUÍ SE CORRIGE
                Swal.fire("Registro exitoso", "Bienvenido a MedicalSoft", "success").then(() => {
                    const modal = new bootstrap.Modal(document.getElementById("registroModal"));
                    modal.hide();
                    form.reset();
                    form.classList.remove("was-validated");
                });
            } else {
                Swal.fire("Error", data.message || "No se pudo completar el registro", "error");
            }
        })
        .catch(error => {
            console.error("Error en el registro:", error);
            Swal.fire("Error", "Ocurrió un problema en el servidor", "error");
        });
}


function validarUsuario() {
    let boton = document.getElementById("btn-enter");
    boton.innerHTML = `<div class="spinner-border text-light" role="status"></div>`;
    boton.disabled = true;

    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if (user === '' || pass === '') {
        Swal.fire('Error', 'Por favor ingrese usuario y contraseña', 'error');
        boton.innerHTML = `Acceder`;
        boton.disabled = false;
        return;
    }

    const apiUrl = "https://dev.monaros.co/api/auth/login";

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-domain': 'dev.monaros.co'
        },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        boton.innerHTML = `Acceder`;
        boton.disabled = false;

        if (data.status === 200 && data.message === "Authenticated") {
            const token = data.data.token?.original?.access_token || null;

            if (token) {
                sessionStorage.setItem('auth_token', token);

                Swal.fire({
                    title: 'Inicio de sesión exitoso',
                    text: 'Has iniciado sesión correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    window.location.href = "/Dashboard"; // Redirigir al usuario
                });
            } else {
                Swal.fire('Error', 'No se recibió un token válido', 'error');
            }
        } else {
            Swal.fire('Error', 'Credenciales incorrectas', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
        boton.innerHTML = `Acceder`;
        boton.disabled = false;
    });
}


function validarOTP(otp, token) {
    const otpApiUrl = "https://dev.monaros.co/api/auth/otp/validate-otp";

    return fetch(otpApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp: otp })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                Swal.fire({
                    title: '¡Bienvenido a MedicalSoft!',
                    text: 'Nos alegra verte de nuevo',
                    icon: 'success',
                    confirmButtonText: '¡Entrar!'
                }).then(() => {
                    window.location.href = 'Dashboard';
                });
            } else {
                sessionStorage.removeItem('auth_token');
                Swal.fire('Error', 'Código OTP inválido. Inténtalo de nuevo.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            sessionStorage.removeItem('auth_token');
            Swal.fire('Error', 'Ocurrió un error al validar el OTP', 'error');
        });
}

registrarUsuario = () => {
    let boton = document.getElementById("btn-enter");
    boton.innerHTML = `<div class="spinner-border text-light" role="status"></div>`;
    boton.disabled = true;

    let email = document.getElementById("email").value;
    let domain = document.getElementById("domain").value;

    if (email === '' || domain === '') {
        Swal.fire('Error', 'Por favor ingrese el email y el dominio', 'error');
        boton.innerHTML = `Acceder`;
        boton.disabled = false;
        return false;
    }

    const baseUrl = "http://dev.monaros.co";
    const apiUrl = `${baseUrl}/api/create/tenant`;

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tenant_name: domain,
            email: email
        })
    })
        .then(async response => {
            let data;
            try {
                data = await response.json();
            } catch (error) {
                throw new Error("La respuesta del servidor no es un JSON válido.");
            }

            boton.innerHTML = `Acceder`;
            boton.disabled = false;

            if (response.ok && data.message === "Tenant creado exitosamente" && data.domain) {
                console.log("➡️ Redirigiendo a:", `http://${data.domain}:8080`);

                Swal.fire({
                    title: 'Éxito',
                    text: 'Redirigiendo a su dominio',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    window.location.href = `http://${data.domain}:8080?email=${encodeURIComponent(email)}&first_time=true`;
                }, 1500);
            } else {
                throw new Error(data.message || "Error desconocido al crear el tenant");
            }
        })
        .catch(error => {
            console.error('❌ Error:', error.message);

            Swal.fire({
                title: 'Error',
                text: error.message || 'Ocurrió un error en la solicitud',
                icon: 'error'
            });

            boton.innerHTML = `Acceder`;
            boton.disabled = false;
        });
};



function togglePassword() {
    const passwordInput = document.getElementById('pass');
    const toggleIcon = document.getElementById('togglePasswordIcon');
    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
}


particlesJS({
    "particles": {
      "number": {
        "value": 85,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#505A67"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#3A4552"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#000000",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2.22388442605866,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });