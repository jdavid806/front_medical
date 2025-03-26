A
<?php
session_start();
include "../globalesMN.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title><?= $NAME_PRODUCTO ?></title>
  <link rel="icon" href="<?= $URL_FAVICON ?>" type="image/x-icon">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.5.0-2/css/all.min.css" integrity="sha512-uNOFYDWi8Y7/BN/9S2QDx/BVTEvSwdrZ53NHLgt+fDTdyQeOwmBpHrLrxOT3TQn78H0QKJWLvD7hsDOZ9Gk45A==" crossorigin="anonymous" referrerpolicy="no-referrer" />  <!-- Latest compiled and minified CSS -->
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

                          <a href="#" id="forgotPasswordLink" class="d-block text-center mt-2 text-decoration-none">¿Has olvidado tu contraseña?</a>
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


  <script src="./login/login.js"></script>
</body>

</html>


<script>
  $(document).ready(function() {
    document.addEventListener('keydown', function(event) {
      if (event.code === 'Enter') {
        validarUsuario()
      }
    });
  });
</script>

<script src="./login/particles.min.js"></script>

<?php
include_once('./login/modalOTP.php');
?>