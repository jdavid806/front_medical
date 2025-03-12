o<?php
session_start();
include "../globalesMN.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $NAME_PRODUCTO ?></title>
  <link rel="icon" href="<?= $URL_FAVICON ?>" type="image/x-icon">

  <!-- Latest compiled and minified CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Latest compiled JavaScript -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

  <!-- JQUERY -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <!-- SweetAlert2 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
  <!-- SweetAlert2 JS -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
  <!-- Particles.js -->
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>

  <!-- OPEN SANS -->
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Orbitron:wght@400..900&display=swap"
    rel="stylesheet">
  <!-- OPEN SANS -->

  <!-- ANIMATE.CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <!-- ANIMATE.CSS -->

  <style>
    /* Full screen particles container */

    #particles-js {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh !important;
      z-index: -1;
      /* Make sure particles are behind other content */
      overflow: hidden;
    }

    /* Ensure the container takes full height */
    .container {
      position: relative;
      z-index: 1;
    }

    * {
      font-family: "Open Sans" !important;
    }

    /* h1, h2, h3, h4, li, button{
          font-weight: normal !important;
        } */
  </style>
</head>

<!-- <body style="max-height: 100vh !important;height: 100vh !important;"> -->
<!-- Particles.js container -->

<body style="max-height: 100vh !important;height: 100vh !important;">

  <div id="particles-js"></div>

  <section
    style="background-color: transparent; height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div class="container-fluid py-0" style="height: 100%;">
      <div class="row d-flex justify-content-center align-items-center" style="height: 100%; margin: 0;">
        <div class="col-12 col-md-10 col-xl-8 d-flex justify-content-center">
          <div class="card shadow-lg"
            style="width: 100%; height: auto; max-height: 90vh; border-radius: 1rem; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <div class="row g-0 w-100 h-100">
              <!-- Contenedor izquierdo con efecto de giro -->
              <div class="col-md-6 col-lg-4 d-flex align-items-center justify-content-center p-4">
                <div class="flip-container w-100" style="perspective: 1000px;">
                  <div class="flipper position-relative" id="flipper"
                    style="transition: transform 0.6s; transform-style: preserve-3d; width: 100%; height: 100%;">
                    <!-- Formulario de Login -->
                    <div
                      class="front w-100 h-100 bg-white position-absolute d-flex flex-column align-items-center justify-content-center"
                      style="backface-visibility: hidden; transform: rotateY(0deg);">
                      <div class="p-4 text-black w-100 text-center">
                        <img src="/logo_monaros_sinbg_light.png" style="width: 50%;" alt="Logo Medicalsoft"
                          class="mb-3">
                        <h5 class="fw-bold mb-3">Inicia sesión</h5>
                        <form>
                          <div class="form-outline mb-3">
                            <input type="email" id="user" class="form-control" />
                            <label class="form-label" for="user">Usuario</label>
                          </div>
                          <div class="form-outline mb-3 position-relative">
                            <input type="password" id="pass" class="form-control" />
                            <label class="form-label" for="pass">Contraseña</label>
                            <span class="position-absolute end-0 top-50 translate-middle-y me-3"
                              style="cursor: pointer;" onclick="togglePassword()">
                              <i id="togglePasswordIcon" class="fas fa-eye"></i>
                            </span>
                          </div>
                          <button class="btn btn-dark w-100 mb-2" id="btn-enter" onclick="validarUsuario()"
                            type="button">Iniciar sesión</button>
                          <button class="btn btn-outline-dark w-100" onclick="toggleForm()" type="button">Crear
                            cuenta</button>
                        </form>
                      </div>
                    </div>
                    <!-- Formulario de Registro -->
                    <div
                      class="back w-100 h-100 bg-white position-absolute d-flex flex-column align-items-center justify-content-center"
                      style="backface-visibility: hidden; transform: rotateY(180deg);">
                      <div class="p-4 text-black w-100 text-center">
                        <img src="/logo_monaros_sinbg_light.png" style="width: 50%;" alt="Logo Medicalsoft"
                          class="mb-3">
                        <h5 class="fw-bold mb-3">Regístrate</h5>
                        <form>
                          <div class="form-outline mb-3">
                            <input type="email" id="email" class="form-control" placeholder="Ej:KdV2A@example.com" />
                            <label class="form-label" for="email">Email</label>
                          </div>
                          <div class="form-outline mb-3">
                            <input type="domain" id="domain" class="form-control" placeholder="Ej:onsultorio1" />
                            <label class="form-label" for="domain">Dominio</label>
                          </div>
                          <button class="btn btn-dark w-100 mb-2" id="btn-register" onclick="registrarUsuario()"
                            type="button">Registrarse</button>
                          <button class="btn btn-outline-dark w-100" onclick="toggleForm()" type="button">Iniciar
                            sesión</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Contenedor derecho con la imagen -->
              <div class="col-md-6 col-lg-8 d-flex justify-content-center align-items-center position-relative">
                <img src="/medical_index.jpg" alt="login form" class="img-fluid"
                  style="border-radius: 0 1rem 1rem 0; width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registroModal">
    Registrar Usuario
  </button> -->

  <!-- Modal -->
  <div class="modal fade" id="registroModal" tabindex="-1" aria-labelledby="registroModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="registroModalLabel">Registro de Usuario</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <form id="registroForm" class="needs-validation" novalidate>

            <div class="mb-3">
              <div class="form-floating">
                <input type="text" class="form-control" id="username" name="username" required>
                <label for="username">Nombre de Usuario</label>
                <div class="invalid-feedback">Ingrese un nombre de usuario.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="text" class="form-control" id="first_name" name="first_name" required>
                <label for="first_name">Primer Nombre</label>
                <div class="invalid-feedback">Ingrese su primer nombre.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="text" class="form-control" id="middle_name" name="middle_name">
                <label for="middle_name">Segundo Nombre</label>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="text" class="form-control" id="last_name" name="last_name" required>
                <label for="last_name">Apellido</label>
                <div class="invalid-feedback">Ingrese su apellido.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="text" class="form-control" id="second_last_name" name="second_last_name">
                <label for="second_last_name">Segundo Apellido</label>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="email" class="form-control" id="emailNuevo" name="emailNuevo" required>
                <label for="email">Correo Electrónico</label>
                <div class="invalid-feedback">Ingrese un correo válido.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="password" class="form-control" id="password" name="password" required>
                <label for="password">Contraseña</label>
                <div class="invalid-feedback">Ingrese una contraseña.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="tel" class="form-control" id="phone" name="phone" required>
                <label for="phone">Teléfono</label>
                <div class="invalid-feedback">Ingrese un número de teléfono.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <select class="form-select" id="gender" name="gender" required>
                  <option value="" disabled selected>Seleccione su género</option>
                  <option value="MALE">Hombre</option>
                  <option value="FEMALE">Mujer</option>
                </select>
                <label for="gender">Género</label>
                <div class="invalid-feedback">Seleccione su género.</div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-floating">
                <input type="text" class="form-control" id="address" name="address" required>
                <label for="address">Dirección</label>
                <div class="invalid-feedback">Ingrese su dirección.</div>
              </div>
            </div>

            <button type="button" class="btn btn-success w-100" onclick="completarRegistro()">Registrar</button>

          </form>
        </div>
      </div>
    </div>
  </div>


  <script>

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

          if (data.message === "Authenticated" || data.status === 200) {

            const token = data.data[0].original.access_token;
            sessionStorage.setItem('auth_token', token);
            Swal.fire('Autenticación', data.message, 'success');

            setTimeout(() => {
              window.location.href = 'Dashboard';
            }, 500);
          } else {
            Swal.fire('Error', data.message || 'Credenciales incorrectas', 'error');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
          boton.innerHTML = `Acceder`;
          boton.disabled = false;
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


  </script>
</body>

</html>


<script>
  $(document).ready(function () {
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Enter') {
        validarUsuario()
      }
    });
  });
</script>

<script src="./login/particles.min.js"></script>
<script>
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
</script>