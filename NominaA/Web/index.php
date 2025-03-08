<?php

require_once __DIR__ . "../../../funciones/conn3.php";
require_once __DIR__ . "../../../funciones/funciones.php";

require_once __DIR__ . "../../../Models/Nomina/index.php";
require_once __DIR__ . "../../../Controllers/Nomina/index.php";

require_once __DIR__ . "../../../Models/Reclutamiento/index.php";
require_once __DIR__ . "../../../Controllers/Reclutamiento/index.php";

$idUser = decrypt($_GET["idUser"]);


$BASE_WEB = 'https://erp.medicalsoftplus.com/FE/NominaA/Web/';


$controllerConfiguracion = new ConfiguracionesController($conn3);
$configuracionUsuario = $controllerConfiguracion->obtenerPorIdUsuario($idUser);
$logoBase64 = $configuracionUsuario["logoBase64"];

$ControllerWeb = new ConfigWebController($conn3);
$configuracionWeb = $ControllerWeb->obtenerPorUsuario($idUser);

$ControllerPuestosTrabajo = new PuestosTrabajoController($conn3);
$puestosTrabajoPorUsuario = $ControllerPuestosTrabajo->obtenerPorUsuarioyActivos($idUser);


$colorPrimario = $configuracionWeb["colorPrimario"];
$colorSecundario = $configuracionWeb["colorSecundario"];

if (!is_numeric($idUser)) {
  //window.location.href = 'https://ofertasmedicalsoft.com/';
  echo "<script>
          alert('Sitio web no configurado o inaccesible, si cree que se trata de un error comuniquese con soporte');
        </script>";
  die();
}

$espaciosVaciosConfiguracionWeb = count(array_filter($configuracionWeb, function ($value) {
  return empty($value) && $value !== 0;
}));


if (empty($configuracionUsuario) || empty($configuracionWeb) || !$configuracionWeb || !$configuracionUsuario || $espaciosVaciosConfiguracionWeb > 3) {

  // window.location.href = 'https://ofertasmedicalsoft.com/';
  echo "idUser => " . $idUser;
  var_dump($configuracionUsuario);
  echo "<br>";
  var_dump($configuracionWeb);
  echo "<br>";
  var_dump($configuracionWeb);
  echo "<br>";
  var_dump($configuracionUsuario);
  echo "<br>";
  var_dump($espaciosVaciosConfiguracionWeb);
  echo "<br>";


  
  echo "<script>
          alert('Sitio web no configurado o inaccesible, si cree que se trata de un error comuniquese con soporte');
        </script>";
  die();
}



// var_dump($configuracionUsuario);
// var_dump($configuracionWeb);
// die();

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Ofertas </title>
  <meta name="description" content="">
  <meta name="keywords" content="">

  <!-- Favicons -->
  <link href="<?= $logoBase64 ?>" rel="icon">
  <link href="<?= $logoBase64 ?>" rel="apple-touch-icon">

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="<?= $BASE_WEB ?>assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="<?= $BASE_WEB ?>assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="<?= $BASE_WEB ?>assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="<?= $BASE_WEB ?>assets/vendor/animate.css/animate.min.css" rel="stylesheet">
  <link href="<?= $BASE_WEB ?>assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
  <link href="<?= $BASE_WEB ?>assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

  <!-- Jquery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <!-- Jquery -->

  <!-- SweetAlert2 -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <!-- SweetAlert2 -->


  <!-- Main CSS File -->
  <link href="<?= $BASE_WEB ?>assets/css/main_css.php" rel="stylesheet">
  <!-- <link href="<?= $BASE_WEB ?>assets/css/main.css" rel="stylesheet"> -->

  <!-- =======================================================
  * Template Name: Avilon
  * Template URL: https://bootstrapmade.com/avilon-bootstrap-landing-page-template/
  * Updated: Aug 07 2024 with Bootstrap v5.3.3
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
</head>

<body class="index-page">

  <header id="header" class="header d-flex align-items-center fixed-top">
    <div class="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

      <a href="index.html" class="">
        <!-- Uncomment the line below if you also wish to use an image logo -->
        <!-- <img src="<?= $BASE_WEB ?>assets/img/logo.png" alt=""> -->
        <!-- <h1 class="sitename"> -->
        <img style="max-height: 80px" src="<?= $logoBase64 ?>" alt="">
        <!-- </h1> -->
      </a>

      <nav id="navmenu" class="navmenu">
        <ul>
          <li><a href="#hero" class="active">Inicio</a></li>
          <!-- <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#team">Team</a></li>
          <li class="dropdown"><a href="#"><span>Dropdown</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
            <ul>
              <li><a href="#">Dropdown 1</a></li>
              <li class="dropdown"><a href="#"><span>Deep Dropdown</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>
                <ul>
                  <li><a href="#">Deep Dropdown 1</a></li>
                  <li><a href="#">Deep Dropdown 2</a></li>
                  <li><a href="#">Deep Dropdown 3</a></li>
                  <li><a href="#">Deep Dropdown 4</a></li>
                  <li><a href="#">Deep Dropdown 5</a></li>
                </ul>
              </li>
              <li><a href="#">Dropdown 2</a></li>
              <li><a href="#">Dropdown 3</a></li>
              <li><a href="#">Dropdown 4</a></li>
            </ul>
          </li>
          <li><a href="#contact">Contact</a></li> -->
        </ul>
        <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>

    </div>
  </header>

  <main class="main">

    <!-- Hero Section -->
    <section id="hero" class="hero section dark-background">

      <div id="hero-carousel" data-bs-interval="5000" class="container carousel carousel-fade" data-bs-ride="carousel">

        <!-- Slide 1 -->
        <div class="carousel-item active">
          <div class="carousel-container">
            <h2 class="animate__animated animate__fadeInDown"><?= $configuracionWeb["encabezado"] ?></h2>
            <p class="animate__animated animate__fadeInUp"><?= $configuracionWeb["descripcion"] ?></p>
            <!-- <a href="#about" class="btn-get-started animate__animated animate__fadeInUp scrollto">Read More</a> -->
          </div>
        </div>

        <!-- Slide 2 -->
        <!-- <div class="carousel-item">
          <div class="carousel-container">
            <h2 class="animate__animated animate__fadeInDown">Lorem Ipsum Dolor</h2>
            <p class="animate__animated animate__fadeInUp">Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto.</p>
            <a href="#about" class="btn-get-started animate__animated animate__fadeInUp scrollto">Read More</a>
          </div>
        </div> -->

        <!-- Slide 3 -->
        <!-- <div class="carousel-item">
          <div class="carousel-container">
            <h2 class="animate__animated animate__fadeInDown">Sequi ea ut et est quaerat</h2>
            <p class="animate__animated animate__fadeInUp">Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto.</p>
            <a href="#about" class="btn-get-started animate__animated animate__fadeInUp scrollto">Read More</a>
          </div>
        </div> -->

        <a class="carousel-control-prev" href="#hero-carousel" role="button" data-bs-slide="prev">
          <span class="carousel-control-prev-icon bi bi-chevron-left" aria-hidden="true"></span>
        </a>

        <a class="carousel-control-next" href="#hero-carousel" role="button" data-bs-slide="next">
          <span class="carousel-control-next-icon bi bi-chevron-right" aria-hidden="true"></span>
        </a>

      </div>

      <svg class="hero-waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28 " preserveAspectRatio="none">
        <defs>
          <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
        </defs>
        <g class="wave1">
          <use xlink:href="#wave-path" x="50" y="3"></use>
        </g>
        <g class="wave2">
          <use xlink:href="#wave-path" x="50" y="0"></use>
        </g>
        <g class="wave3">
          <use xlink:href="#wave-path" x="50" y="9"></use>
        </g>
      </svg>

    </section><!-- /Hero Section -->

    <!-- Team Section -->
    <section id="team" class="team section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <h2>Ofertas</h2>
      </div><!-- End Section Title -->

      <div class="container">

        <div class="row">

          <?php

          $controllerCargosTrabajo = new CargoController($conn3);
          foreach ($puestosTrabajoPorUsuario as $puesto) {

            $img = $puesto["photo"] <> "" ? "" : "https://erp.medicalsoftplus.com/FE/Recursos/placeholderJob.jfif";
            $nombrePuesto = $controllerCargosTrabajo->obtenerPorId($puesto["titulo"])["nombre"];

          ?>
            <div class="col-lg-4 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="100">
              <div class="member">
                <!-- <img src="<?= $BASE_WEB ?>assets/img/team/team-1.jpg" class="img-fluid" alt=""> -->
                <img src="<?= $img ?>" class="img-fluid" alt="">
                <div class="member-content">
                  <h4><?= $puesto['descripcionBreve'] ?></h4>
                  <span><?= $nombrePuesto ?></span>
                  <div class="social">
                    <a data-bs-toggle="offcanvas" data-bs-target="#puesto<?= $puesto["id"] ?>" aria-controls="puesto<?= $puesto["id"] ?>" title="Ver detalle"><i class="bi bi-window-stack"></i></a>
                    <a title="Aplicar" onclick="aplicarAhora('<?= base64_encode($puesto['id']) ?>', '<?= base64_encode($nombrePuesto) ?>')"><i class="bi bi-briefcase-fill"></i></a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Offcanvas -->
            <div class="offcanvas custom-offcanvas-width offcanvas-end" tabindex="-1" id="puesto<?= $puesto["id"] ?>" aria-labelledby="puesto<?= $puesto["id"] ?>Label">
              <div class="offcanvas-header">
                <h4><?= $puesto['descripcionBreve'] ?></h4>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body">
                <span class="small text-muted"><b>Puesto:</b> <?= $nombrePuesto ?></span><br>
                <span class="small text-muted"><b>Ultima fecha de modificacion:</b> <?= $puesto["fechaActualizacion"] ?></span><br>
                <span class="small text-muted"><b>Fecha de cierre:</b> <?= $puesto["fechaCierre"] ?></span><br>
                <span class="small text-muted"><b>Jornada:</b> <?= $puesto["tipoTrabajo"] ?></span><br>
                <span class="small text-muted"><b>Vacantes:</b> <?= $puesto["numPosiciones"] ?></span><br>


                <p class="text-muted mt-2"><?= nl2br($puesto['descripcionLarga']) ?></p>

                <button class="btn btn-primary" onclick="aplicarAhora('<?= base64_encode($puesto['id']) ?>', '<?= base64_encode($nombrePuesto) ?>')"> <i class="bi bi-briefcase-fill"></i> Aplicar ahora</button>
              </div>
            </div>
            <!-- Offcanvas -->

          <?php } ?>



        </div>

      </div>

    </section><!-- /Team Section -->

    <?php if ($configuracionWeb["habilitarContactanos"] == "1") { ?>
      <!-- Contact Section -->
      <section id="contact" class="contact section">

        <!-- Section Title -->
        <div class="container section-title" data-aos="fade-up">
          <h2>Contactanos</h2>
          <!-- <p>Buscamos el mejor talento</p> -->
        </div><!-- End Section Title -->

        <div class="container" data-aos="fade" data-aos-delay="100">

          <div class="row gy-4">

            <div class="col-lg-4">
              <?php if ($configuracionWeb["direccion"] <> "") { ?>
                <div class="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                  <i class="bi bi-geo-alt flex-shrink-0"></i>
                  <div>
                    <h3>Direccion</h3>
                    <p><?= $configuracionWeb["direccion"] ?></p>
                  </div>
                </div>
              <?php } ?>

              <?php if ($configuracionWeb["telefono"] <> "") { ?>
                <div class="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                  <i class="bi bi-telephone flex-shrink-0"></i>
                  <div>
                    <h3>Telefono</h3>
                    <p><?= $configuracionWeb["telefono"] ?></p>
                  </div>
                </div>
              <?php } ?>

              <?php if ($configuracionWeb["email"] <> "") { ?>
                <div class="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                  <i class="bi bi-envelope flex-shrink-0"></i>
                  <div>
                    <h3>Correo</h3>
                    <p><?= $configuracionWeb["email"] ?></p>
                  </div>
                </div>
              <?php } ?>

            </div>

            <div class="col-lg-8">
              <form id="formMessage" class="php-email-form" data-aos="fade-up" data-aos-delay="200">
                <div class="row gy-4">

                  <input required type="hidden" id="idUsuario" value="<?= base64_encode($idUser) ?>">
                  <input required type="hidden" id="ip" value="<?= base64_encode($_SERVER['REMOTE_ADDR']) ?>">

                  <div class="col-md-6">
                    <input type="text" id="nombre" class="form-control" placeholder="Nombre *" required="">
                  </div>

                  <div class="col-md-6 ">
                    <input type="email" class="form-control" id="email" placeholder="Email *" required="">
                  </div>

                  <div class="col-md-12">
                    <input type="text" class="form-control" id="asunto" placeholder="Asunto *" required="">
                  </div>

                  <div class="col-md-12">
                    <textarea class="form-control" id="mensaje" rows="6" placeholder="Mensaje *" required=""></textarea>
                  </div>

                  <div class="col-md-12 text-center">
                    <!-- <div class="loading">Loading</div>
                    <div class="error-message"></div>
                    <div class="sent-message">Your message has been sent. Thank you!</div> -->

                    <button class="btn btn-primary" onclick="sendMessage()" type="button"><i class="bi bi-send-fill"></i> Enviar</button>
                  </div>

                </div>
              </form>
            </div><!-- End Contact Form -->

          </div>

        </div>

      </section><!-- /Contact Section -->
    <?php } ?>

  </main>

  <footer id="footer" class="footer light-background">
    <div class="container">
      <div class="social-links d-flex justify-content-center">
        <?= ($configuracionWeb["x"] <> ""  ? '<a href="' . $configuracionWeb["x"] . '" target="_blank"><i class="bi bi-twitter-x"></i></a>' : "") ?>
        <?= ($configuracionWeb["facebook"] <> ""  ? '<a href="' . $configuracionWeb["facebook"] . '" target="_blank"><i class="bi bi-facebook"></i></a>' : "") ?>
        <?= ($configuracionWeb["instagram"] <> ""  ? '<a href="' . $configuracionWeb["instagram"] . '" target="_blank"><i class="bi bi-instagram"></i></a>' : "") ?>
        <?= ($configuracionWeb["linkedIn"] <> ""  ? '<a href="' . $configuracionWeb["linkedIn"] . '" target="_blank"><i class="bi bi-linkedin"></i></a>' : "") ?>
      </div>
      <!-- <div class="container">
        <div class="copyright">
          <span>Copyright</span> <strong class="px-1 sitename">Avilon</strong> <span>All Rights Reserved</span>
        </div>
        <div class="credits">
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
      </div> -->
    </div>
  </footer>

  <!-- Scroll Top -->
  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

  <!-- Preloader -->
  <div id="preloader"></div>

  <!-- Vendor JS Files -->
  <script src="<?= $BASE_WEB ?>assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="<?= $BASE_WEB ?>assets/vendor/php-email-form/validate.js"></script>
  <script src="<?= $BASE_WEB ?>assets/vendor/aos/aos.js"></script>
  <script src="<?= $BASE_WEB ?>assets/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="<?= $BASE_WEB ?>assets/vendor/swiper/swiper-bundle.min.js"></script>

  <!-- Main JS File -->
  <script src="<?= $BASE_WEB ?>assets/js/main.js"></script>

</body>

</html>


<!-- The Modal -->
<div class="modal custom-fade fade" id="modalPostulacion">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title" id="header-postulacion"></h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
        <div class="col-md-12 row">

          <div class="col-md-12">
            <label>Numero de Documento*</label>
            <input class="form-control" type="text" id="numero_documento">
          </div>


          <input required type="hidden" id="idPuesto" value="">
          <input required type="hidden" id="idSitio" value="<?= base64_encode($idUser) ?>">

          <div class="col-md-6">
            <label>Nombres*</label>
            <input class="form-control" required type="text" id="nombre">
          </div>

          <div class="col-md-6">
            <label>Apellidos*</label>
            <input class="form-control" required type="text" id="apellido">
          </div>

          <div class="col-md-6">
            <label>Email*</label>
            <input class="form-control" required type="text" id="email">
          </div>

          <div class="col-md-6">
            <label>Telefono de contacto*</label>
            <input class="form-control" required type="text" id="telefono">
          </div>

          <div class="col-md-12">
            <label>Hoja de Vida o Curriculum Vitae (pdf)</label>
            <input class="form-control" type="file" id="archivo" accept="application/pdf">
          </div>

          <div class="col-md-12 mt-2">
            <label></label>
            <button style="width:100%" type="button" class="btn btn-primary" id="btnPostular" onclick="postularmeAhora()"><i class="bi bi-send-fill"></i> Postularme ahora</button>
          </div>


        </div>
      </div>

      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
      </div>

    </div>
  </div>
</div>



<style>
  .custom-offcanvas-width {
    width: 40vw !important;
  }

  .btn-primary {
    background-color: <?= $colorPrimario ?> !important;
    border: 0;
  }

  /* Animación personalizada de entrada */
  @keyframes slideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Animación personalizada de salida */
  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }

    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }

  /* Aplica la animación al modal */
  .modal.custom-fade .modal-dialog {
    animation: slideIn 0.5s ease-out;
  }

  .modal.custom-fade.fade.show .modal-dialog {
    animation: slideIn 0.5s ease-out;
  }

  .modal.custom-fade .modal-dialog {
    animation: slideOut 0.5s ease-in;
  }
</style>

<script>
  const colorPrimario = "<?= htmlspecialchars($colorPrimario) ?>";
  const colorSecundario = "<?= htmlspecialchars($colorSecundario) ?>";
  document.documentElement.style.setProperty('--color-primario', colorPrimario);
  document.documentElement.style.setProperty('--color-secundario', colorSecundario);


  function aplicarAhora(idBase64, nombreBase64) {
    let nombre = atob(nombreBase64);

    $("#modalPostulacion").modal("show");
    $("#modalPostulacion #header-postulacion").html(`<i class="bi bi-briefcase-fill"></i> Postulacion para puesto de ${nombre}`);
    $("#modalPostulacion #idPuesto").val(idBase64);
  }

  function postularmeAhora() {
    const formData = new FormData();
    const modal = $("#modalPostulacion");

    let isValid = true;
    $(modal).find("input").each((index, input) => {
      if (!isValid) return;
      const $input = $(input);
      if ($input.attr("required") !== undefined && $input.val() === "") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos marcados con (*)'
        });
        isValid = false;
        return;
      }

      if (input.type === "file") {
        formData.append($input.attr("id"), input.files[0]);
      } else if ($input.attr("id") === "idPuesto" || $input.attr("id") === "idSitio") {
        formData.append($input.attr("id"), atob($input.val()));
      } else {
        formData.append($input.attr("id"), $input.val());
      }
    });

    if (!isValid) return;
    formData.append("action", "crear");

    const url = "<?= $BASE_WEB ?>Ajax/AjaxPostulaciones.php";
    // console.log(url);

    $.ajax({
      url, // URL del servidor
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function(response) {
        response = response.trim();
        // console.log(response);
        // return;

        const dataJson = JSON.parse(response);
        const { icon, text, title } = dataJson;
        Swal.fire({ icon, title, text});

        if (icon == 'success') {
          setTimeout(() => {
            location.reload();
          }, 1000);
        }

        // Aquí puedes manejar la respuesta
      },
      error: function(xhr, status, error) {
        console.error("Error:", error);
      }
    });
  }

  function sendMessage() { 
    console.log("Llega a la funcion");
    

    const form = $("#formMessage");
    let formData = new FormData(); 
    let formIsValid = true;
    $(form).find("input, textarea").each((index, input) => {
      if(!formIsValid) return;
      const $input = $(input);
      if ($input.attr("required") !== undefined && $input.val() === "") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos marcados con (*)'
        });
        formIsValid = false;
        return;
      }

        let value = $input.val();
        if ($input.attr("id") == 'idUsuario' || $input.attr("id") == 'ip') {
          value = atob(value);
        }

        formData.append($input.attr("id"), value);
        
      })
      
    formData.append("action", "crear");
    if(!formIsValid) return;


    
    const url = "<?= $BASE_WEB ?>Ajax/AjaxMensajes.php";
    // console.log(url);

    $.ajax({
      url, // URL del servidor
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function(response) {
        response = response.trim();
        console.log(response);
        // return;

        const dataJson = JSON.parse(response);
        const { icon, text, title } = dataJson;
        Swal.fire({ icon, title, text});

        if (icon == 'success') {
          setTimeout(() => {
            location.reload();
          }, 1000);
        }

        // Aquí puedes manejar la respuesta
      },
      error: function(xhr, status, error) {
        console.error("Error:", error);
      }
    });
  }



</script>