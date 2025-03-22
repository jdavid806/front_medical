document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const firstTime = urlParams.get("first_time");
    document.getElementById("forgotPasswordLink").addEventListener("click", function () {
      $("#forgotPasswordModal").modal("show"); // Muestra el modal
  });
  

    if (firstTime === "true" && email) {
        localStorage.setItem("complete_registration", "true");
        localStorage.setItem("email", email);
        $('#registroModal').modal('show');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});


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

   let apiUrl = `${window.location.origin}/api/auth/login`;
   

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
    let otpApiUrl = `${window.location.origin}/api/auth/otp/validate-otp"`;
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




function togglePassword() {
  const passwordInput = document.getElementById("pass");
  const toggleIcon = document.getElementById("togglePasswordIcon");

  if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.classList.remove("bi-eye");
      toggleIcon.classList.add("bi-eye-slash");
  } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("bi-eye-slash");
      toggleIcon.classList.add("bi-eye");
  }
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