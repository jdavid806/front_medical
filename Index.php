o
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


  <script src="./login/login.js"></script>
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
