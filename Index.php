<?php

try {
  include __DIR__ . "/funciones/funciones.php";
  include __DIR__ . "/funciones/globals.php";
} catch (\Throwable $th) {
  echo $th->getMessage();
  die();
}

$_SESSION["ID"] = 1;
?>

<!DOCTYPE html>
<html lang="es" dir="ltr" data-navigation-type="default" data-navbar-horizontal-shape="default"
  class="chrome windows fontawesome-i2svg-active fontawesome-i2svg-complete navbar-vertical-collapsed">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="https://erp.medicalsoftplus.com/pseudoiconomedical.png" type="image/x-icon">

  <!-- ===============================================-->
  <!--    Document Title-->
  <!-- ===============================================-->
  <?php
  $url_completa = $_SERVER['REQUEST_URI'];
  function obtenerUltimaParteUrl($url)
  {
    // Analizamos la URL
    $url_componentes = parse_url($url);

    // Extraemos la ruta
    $ruta = $url_componentes['path'];

    // Eliminamos cualquier barra al final de la ruta
    $ruta = rtrim($ruta, '/');

    // Explotamos la ruta por la barra '/' y tomamos el último elemento
    $partes = explode('/', $ruta);
    $ultimaParte = end($partes);

    return $ultimaParte;
  }

  ?>
  <title>ERP - <?php echo obtenerUltimaParteUrl($url_completa); ?></title>

  <!-- ===============================================-->
  <!--    Favicons-->
  <!-- ===============================================-->
  <!-- <link rel="apple-touch-icon" sizes="180x180" href="<?= $BASE ?>assets/img/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?= $BASE ?>assets/img/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?= $BASE ?>assets/img/favicons/favicon-16x16.png">
    <link rel="shortcut icon" type="image/x-icon" href="<?= $BASE ?>assets/img/favicons/favicon.ico">
    <link rel="manifest" href="<?= $BASE ?>assets/img/favicons/manifest.json"> -->
  <meta name="msapplication-TileImage" content="<?= $BASE ?>assets/img/favicons/mstile-150x150.png">
  <meta name="theme-color" content="#ffffff">
  <script src="<?= $BASE ?>vendors/simplebar/simplebar.min.js"></script>
  <script src="<?= $BASE ?>assets/js/config.js"></script>

  <script src="<?= $BASE ?>editorNuevo.js"></script>

  <!-- ===============================================-->
  <!--    Stylesheets-->
  <!-- ===============================================-->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&amp;display=swap"
    rel="stylesheet">
  <link href="vendors/simplebar/simplebar.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
  <link href="assets/css/theme-rtl.css" type="text/css" rel="stylesheet" id="style-rtl">
  <link href="assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">
  <link href="assets/css/user-rtl.min.css" type="text/css" rel="stylesheet" id="user-style-rtl">
  <link href="assets/css/user.min.css" type="text/css" rel="stylesheet" id="user-style-default">
  <link href="assets/css/styles/theme.css" type="text/css" rel="stylesheet" id="user-style-pr-default">
  <script>
    var phoenixIsRTL = window.config.config.phoenixIsRTL;
    if (phoenixIsRTL) {
      var linkDefault = document.getElementById('style-default');
      var userLinkDefault = document.getElementById('user-style-default');
      linkDefault.setAttribute('disabled', true);
      userLinkDefault.setAttribute('disabled', true);
      document.querySelector('html').setAttribute('dir', 'rtl');
    } else {
      var linkRTL = document.getElementById('style-rtl');
      var userLinkRTL = document.getElementById('user-style-rtl');
      linkRTL.setAttribute('disabled', true);
      userLinkRTL.setAttribute('disabled', true);
    }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Orbitron:wght@400..900&display=swap"
    rel="stylesheet">

  <link href="<?= $BASE ?>vendors/leaflet/leaflet.css" rel="stylesheet">
  <link href="<?= $BASE ?>vendors/leaflet.markercluster/MarkerCluster.css" rel="stylesheet">
  <link href="<?= $BASE ?>vendors/leaflet.markercluster/MarkerCluster.Default.css" rel="stylesheet">

  <!-- DATATABLES -->
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap4.min.css">

  <!-- DATATABLES -->
  <style>
    /* Contenedor de partículas con posición fija */
    #particles-js-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      overflow: hidden;
    }

    #particles-js {
      width: 100%;
      height: 100%;
    }

    .container {
      position: relative;
      z-index: 1;
    }

    /* Personaliza los botones de paginación */
    .dataTables_wrapper .dataTables_paginate .paginate_button {
      padding: 0.5em;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button {
      margin: 0.2em;
      border-radius: 0.3em;
      border: 1px solid #007bff;
      color: #fff !important;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button.current,
    .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
      background-color: #007bff;
      color: #fff !important;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button.disabled {
      background-color: #e9ecef;
      border-color: #e9ecef;
      color: #fff !important;
    }

    .breadcrumb-item a {
      color: #1A99FB !important;
    }

    /* Asegurar que el main ocupe toda la altura */
    .main {
      min-height: 100vh;
      position: relative;
    }

    .content {
      position: relative;
      z-index: 2;
      padding: 0 !important;
    }
    .container-small{
      max-width: 48vw !important;
      margin-top: 50px !important;
    }
    html{
      overflow: clip !important;
    }

    @media (max-width: 1024px) {
  .container-small {
    max-width: 90vw !important;
    margin-top: 200px !important;
    margin-bottom: 20px !important;
  }
}

@media (max-width: 768px) {
  .container-small {
    max-width: 95vw !important;
    margin-top: 15px !important;
    margin-bottom: 15px !important;
    padding: 0 10px !important;
  }
  
  /* Asegurar que el contenido del login se vea bien en móviles */
  #LoginApp {
    width: 100% !important;
    margin-top: 90px !important;
  }
}

@media (max-width: 480px) {
  .container-small {
    max-width: 100vw !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    padding: 0 5px !important;
  }
  
  /* Reducir partículas en móviles para mejor rendimiento */
  #particles-js-container {
    transform: scale(0.8);
  }
}

/* Asegurar que el body no tenga scroll en todos los dispositivos */
html, body {
  overflow: clip !important;
  height: 100%;
}

/* Mantener el contenedor principal centrado */
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.content {
  width: 100%;
}

  </style>

  <!-- SWEET ALERT -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
  <!-- Particles.js -->
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <!-- SWEET ALERT -->

  <!-- <link rel="stylesheet" href="monaros/css/main_bootstrap_sobreescritos_2.css"> -->

  <style>
    /*ALUSIVOS A LOS COLORES DE MONAROS*/
    .text-primary {
      color: #132030 !important;
    }

    .text-primary {
      color: #132030 !important;
    }

    .active {
      color: #132030 !important;
    }

    .btn-primary {
      background-color: #132030 !important;
    }

    .btn-info {
      background-color: #274161 !important;
    }

    .btn-infov2 {
      background-color: #bbd5e7 !important;
      color: #000000 !important
    }

    body,html,td,span{
    font-family: 'Inter', sans-serif !important;

    }
    
    h1,
    h2,
    h3,
    h4,
    li,
    button,label,th {
    font-family: 'Grift', sans-serif !important;

    }

    /* Para navegadores basados en Webkit (Chrome, Edge, Safari) */
    body::-webkit-scrollbar {
      border-radius: 5px;
      width: 10px;
    }

    body::-webkit-scrollbar-track {
      background: transparent;
    }

    body::-webkit-scrollbar-thumb {
      background-color: #888;
      border-radius: 10px;
      border: 2px solid #f1f1f1;
    }

    body::-webkit-scrollbar-thumb:hover {
      background-color: #555;
    }
    .content{
      display:flex;
      justify-content: space-around;
    }
  </style>
</head>

<body>
  <!-- Contenedor para las partículas -->
  <div id="particles-js-container">
    <div id="particles-js"></div>
  </div>

  <div class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center d-none"
    id="loading-screen">
    <div class="text-center d-flex flex-column gap-2 justify-content-center align-items-center">
      <img src="/logo_monaros_sinbg_light.png" alt="phoenix" width="125">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <style>
    #loading-screen {
      background: #fff;
      z-index: 100000;
    }
        /* Establece la fuente y el color de fondo para que los tonos turquesa brillen */
            body {
            font-family: 'Inter', sans-serif;
            background-color: #0D1721; /* Un azul oscuro/negro profundo para contraste */
            color: #FFFFFF;
            height: 100vh;
            margin: 0;
            overflow: hidden; /* Oculta barras de desplazamiento */
        }
        /* El contenedor de las partículas debe ocupar toda la pantalla */
        #particles-js {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1;
        }
        /* Contenido de ejemplo sobre las partículas */
        .content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding-top: 20vh;
        }
  </style>

  <script type="importmap">
    {
    "imports": {
      "react": "https://esm.sh/react@19/?dev",
      "react-dom/client": "https://esm.sh/react-dom@19/client?dev",
      "react-bootstrap": "https://esm.sh/react-bootstrap@2.10.9?dev",
      "datatables.net-react": "https://esm.sh/datatables.net-react@1.0.0?dev",
      "datatables.net-bs5": "https://esm.sh/datatables.net-bs5@2.2.2?dev",
      "choices.js": "https://esm.sh/choices.js@10.2.0?dev",
      "primereact": "https://esm.sh/primereact?dev",
      "primereact/api": "https://esm.sh/primereact/api?dev",
      "primereact/utils": "https://esm.sh/primereact/utils?dev",
      "primereact/button": "https://esm.sh/primereact/button?dev",
      "primereact/calendar": "https://esm.sh/primereact/calendar?dev",
      "primereact/dropdown": "https://esm.sh/primereact/dropdown?dev",
      "primereact/inputtext": "https://esm.sh/primereact/inputtext?dev",
      "primereact/multiselect": "https://esm.sh/primereact/multiselect?dev",
      "primereact/inputnumber": "https://esm.sh/primereact/inputnumber?dev",
      "primereact/stepper": "https://esm.sh/primereact/stepper?dev",
      "primereact/stepperpanel": "https://esm.sh/primereact/stepperpanel?dev",
      "primereact/accordion": "https://esm.sh/primereact/accordion?dev",
      "primereact/checkbox": "https://esm.sh/primereact/checkbox?dev",
      "primereact/selectbutton": "https://esm.sh/primereact/selectbutton?dev",
      "react-hook-form": "https://esm.sh/react-hook-form@7.54.2?dev",
      "sweetalert2": "https://esm.sh/sweetalert2?dev",
      "primereact/editor": "https://esm.sh/primereact/editor?dev",
      "quill": "https://esm.sh/quill?dev",
      "pusher-js": "https://esm.sh/pusher-js?dev",
      "primereact/dialog": "https://esm.sh/primereact/dialog?dev",
      "uuid": "https://esm.sh/uuid?dev",
      "primereact/tabview": "https://esm.sh/primereact/tabview?dev",
      "react-beautiful-dnd": "https://esm.sh/react-beautiful-dnd?dev",
      "primereact/inputtextarea": "https://esm.sh/primereact/inputtextarea?dev",
      "primereact/divider": "https://esm.sh/primereact/divider?dev",
      "primereact/password": "https://esm.sh/primereact/password?dev",
      "primereact/card": "https://esm.sh/primereact/card?dev",
      "primereact/panel": "https://esm.sh/primereact/panel?dev",
      "primereact/tag": "https://esm.sh/primereact/tag?dev",
      "primereact/scrollpanel": "https://esm.sh/primereact/scrollpanel?dev",
      "primereact/splitbutton": "https://esm.sh/primereact/splitbutton?dev",
      "primereact/datatable": "https://esm.sh/primereact/datatable?dev",
      "primereact/column": "https://esm.sh/primereact/column?dev",
      "primereact/badge": "https://esm.sh/primereact/badge?dev",
      "primereact/inputswitch":"https://esm.sh/primereact/inputswitch?dev",
      "primereact/toolbar":"https://esm.sh/primereact/toolbar?dev",
      "primereact/radiobutton":"https://esm.sh/primereact/radiobutton?dev",
      "primereact/tooltip":"https://esm.sh/primereact/tooltip?dev",
      "primereact/treetable":"https://esm.sh/primereact/treetable?dev",
      "primereact/treenode":"https://esm.sh/primereact/treenode?dev",
      "primereact/confirmdialog":"https://esm.sh/primereact/confirmdialog?dev",
      "primereact/toast":"https://esm.sh/primereact/toast?dev",
      "primereact/confirmpopup":"https://esm.sh/primereact/confirmpopup?dev",
      "primereact/confirmpopup":"https://esm.sh/primereact/confirmpopup?dev",
      "primereact/fileupload":"https://esm.sh/primereact/fileupload?dev",
      "primereact/progressspinner":"https://esm.sh/primereact/progressspinner?dev",
      "primereact/message":"https://esm.sh/primereact/message?dev",
      "primereact/autocomplete":"https://esm.sh/primereact/autocomplete?dev",
      "primereact/menu":"https://esm.sh/primereact/menu?dev",
      "primereact/hooks":"https://esm.sh/primereact/hooks?dev",
      "primereact/progressbar":"https://esm.sh/primereact/progressbar?dev",
      "primereact/row":"https://esm.sh/primereact/row?dev",
      "primereact/columngroup":"https://esm.sh/primereact/columngroup?dev",
      "primereact/paginator":"https://esm.sh/primereact/paginator?dev",
      "primereact/steps":"https://esm.sh/primereact/steps?dev",
      "primereact/breadcrumb": "https://esm.sh/primereact/breadcrumb?dev",
      "primereact/menubar" : "https://esm.sh/primereact/menubar?dev",
      "primereact/avatar" : "https://esm.sh/primereact/avatar?dev",
      "primereact/inputotp" : "https://esm.sh/primereact/inputotp?dev",
      "primereact/galleria" : "https://esm.sh/primereact/galleria?dev",
      "jspdf": "https://esm.sh/jspdf?dev",
      "jspdf-autotable": "https://esm.sh/jspdf-autotable?dev",
      "react-dom/server": "https://esm.sh/react-dom/server?dev"
    }
  }
</script>

  <main class="main" id="top">
    <div class="content">
      <div class="container-small">
        <div id="LoginApp"></div>
      </div>
    </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Paleta de colores de tu marca
            const brandColors = ["#244255", "#29F6C1", "#1A99FB", "#24D7DE"];
            // Configuración de particles.js
            const particlesConfig = {
                particles: {
                    number: {
                        value: 150, // ¡Aumentado a 150 para mayor densidad!
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: brandColors // Usa la matriz de colores para que las partículas sean aleatorias
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.6, // Ligeramente más opaco para que destaquen
                        random: true,
                        anim: {
                            enable: false,
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 140,
                        color: "#244255", // Usamos Azul Profundo para las líneas
                        opacity: 0.5,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2.5, // Ligeramente más rápido
                        direction: "none",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "grab"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 160, // Distancia de agarre un poco mayor
                            line_linked: {
                                opacity: 1
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            };
            // Inicializa particles.js si la librería está cargada
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', particlesConfig);
            } else {
                console.error("particles.js no está cargado.");
            }
        });
    </script>
    <script type="module">
      import React from "react";
      import ReactDOMClient from "react-dom/client";
      import {
        LoginApp
      } from './react-dist/login/LoginApp.js';

      const appointmentFormModalRef = React.createRef();

      document.addEventListener('DOMContentLoaded', function() {
        const rootElement = document.getElementById('LoginApp');
        ReactDOMClient.createRoot(rootElement).render(React.createElement(LoginApp));
      });
    </script>
  </main>
</body>

</html>