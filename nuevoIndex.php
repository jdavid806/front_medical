<?php
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

<section style="background-color: transparent; height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div class="container-fluid py-0" style="height: 100%;">
        <div class="row d-flex justify-content-center align-items-center" style="height: 100%; margin: 0;">
            <div class="col-12 col-md-10 col-xl-8 d-flex justify-content-center">
                <div class="card shadow-lg" style="width: 100%; height: auto; max-height: 90vh; border-radius: 1rem; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <div class="row g-0 w-100 h-100">
                        <!-- Contenedor izquierdo con efecto de giro -->
                        <div class="col-md-6 col-lg-4 d-flex align-items-center justify-content-center p-4">
                            <div class="flip-container w-100" style="perspective: 1000px;">
                                <div class="flipper position-relative" id="flipper" style="transition: transform 0.6s; transform-style: preserve-3d; width: 100%; height: 100%;">
                                    <!-- Formulario de Login -->
                                    <div class="front w-100 h-100 bg-white position-absolute d-flex flex-column align-items-center justify-content-center" style="backface-visibility: hidden; transform: rotateY(0deg);">
                                        <div class="p-4 text-black w-100 text-center">
                                            <img src="/logo_monaros_sinbg_light.png" style="width: 50%;" alt="Logo Medicalsoft" class="mb-3">
                                            <h5 class="fw-bold mb-3">Inicia sesión</h5>
                                            <form>
                                                <div class="form-outline mb-3">
                                                    <input type="email" id="user" class="form-control" />
                                                    <label class="form-label" for="user">Usuario</label>
                                                </div>
                                                <div class="form-outline mb-3">
                                                    <input type="password" id="pass" class="form-control" />
                                                    <label class="form-label" for="pass">Contraseña</label>
                                                </div>
                                                <button class="btn btn-dark w-100 mb-2" id="btn-enter" onclick="validarUsuario()" type="button">Iniciar sesión</button>
                                                <button class="btn btn-outline-dark w-100" onclick="toggleForm()" type="button">Crear cuenta</button>
                                            </form>
                                        </div>
                                    </div>
                                    <!-- Formulario de Registro -->
                                    <div class="back w-100 h-100 bg-white position-absolute d-flex flex-column align-items-center justify-content-center" style="backface-visibility: hidden; transform: rotateY(180deg);">
                                        <div class="p-4 text-black w-100 text-center">
                                            <img src="/logo_monaros_sinbg_light.png" style="width: 50%;" alt="Logo Medicalsoft" class="mb-3">
                                            <h5 class="fw-bold mb-3">Regístrate</h5>
                                            <form>
                                                <div class="form-outline mb-3">
                                                    <input type="email" id="email" class="form-control" />
                                                    <label class="form-label" for="email">Email</label>
                                                </div>
                                                <button class="btn btn-dark w-100 mb-2" id="btn-register" onclick="registrarUsuario()" type="button">Registrarse</button>
                                                <button class="btn btn-outline-dark w-100" onclick="toggleForm()" type="button">Iniciar sesión</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Contenedor derecho con la imagen -->
                        <div class="col-md-6 col-lg-8 d-flex justify-content-center align-items-center position-relative">
                            <img src="/medical_index.jpg" alt="login form" class="img-fluid" style="border-radius: 0 1rem 1rem 0; width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>



<script>
  function validarUsuario() {
    let boton = document.getElementById("btn-enter");
    boton.innerHTML = `<div class="spinner-border text-light" role="status">
                                  <span class="sr-only"></span>
                              </div>`;
    boton.disabled = true;

    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if (user === '' || pass === '') {
      Swal.fire('Error', 'Por favor ingrese usuario y contraseña', 'error');
      return false;
    }

    const baseUrl = "http://dev.medicalsoft.ai";  // Cambia esto a la URL de tu backend
    const apiUrl = `${baseUrl}/api/auth/login`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-domain': 'dev.medicalsoft.ai'
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    })
    .then(response => response.json())  // Parseamos la respuesta a JSON
    .then(data => {
      console.log(data);
      boton.innerHTML = `Acceder`;
      boton.disabled = false;

      const { message, status, data: responseData } = data;


      Swal.fire('Autenticación', message, status === 200 ? 'success' : 'error');
      if (status === 200) {
        const token = responseData[0].original.access_token;
        localStorage.setItem('auth_token', token);

        setTimeout(() => {
          window.location.href = 'Dashboard'; 
        }, 200);  
      }
    })
    .catch(error => {
      boton.innerHTML = `<i class='fas fa-exclamation'></i> Ocurrio un error`;
      boton.disabled = false;
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un error en la solicitud', 'error');
    });
  }
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
</body>
</html>

<script>
function toggleForm() {
    let flipper = document.getElementById('flipper');
    flipper.style.transform = flipper.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
}
</script>


<script>
    $(document).ready(function () {
        document.addEventListener('keydown', function (event) {
            if (event.code === 'Enter') {
                validarUsuario()
            }
        });
    });
</script>

<php>
    
</php>