<!DOCTYPE html>
<html lang="en-US" dir="ltr" data-navigation-type="default" data-navbar-horizontal-shape="default">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <!-- ===============================================-->
    <!--    Document Title-->
    <!-- ===============================================-->
    <title>Medicalsoft</title>


    <!-- ===============================================-->
    <!--    Favicons-->
    <!-- ===============================================-->
    <link rel="apple-touch-icon" sizes="180x180" href="../../../assets/img/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../../assets/img/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../../assets/img/favicons/favicon-16x16.png">
    <link rel="shortcut icon" type="image/x-icon" href="../../../assets/img/favicons/favicon.ico">
    <link rel="manifest" href="../../../assets/img/favicons/manifest.json">
    <meta name="msapplication-TileImage" content="../../../assets/img/favicons/mstile-150x150.png">
    <meta name="theme-color" content="#ffffff">
    <script src="../../../vendors/simplebar/simplebar.min.js"></script>
    <script src="../../../assets/js/config.js"></script>


    <!-- ===============================================-->
    <!--    Stylesheets-->
    <!-- ===============================================-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&amp;display=swap"
        rel="stylesheet">
    <link href="../../../vendors/simplebar/simplebar.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css">
    <link href="../../../assets/css/theme-rtl.css" type="text/css" rel="stylesheet" id="style-rtl">
    <link href="../../../assets/css/theme.min.css" type="text/css" rel="stylesheet" id="style-default">
    <link href="../../../assets/css/user-rtl.min.css" type="text/css" rel="stylesheet" id="user-style-rtl">
    <link href="../../../assets/css/user.min.css" type="text/css" rel="stylesheet" id="user-style-default">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

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
</head>


<body>

    <!-- ===============================================-->
    <!--    Main Content-->
    <!-- ===============================================-->
    <main class="main" id="top">
        <div class="container-fluid bg-body-tertiary dark__bg-gray-1200">
        
            <div class="row flex-center position-relative min-vh-100 g-0 py-5" id="particles-js" >
                <div class="col-11 col-sm-10 col-xl-8">
                    <div class="card border border-translucent auth-card shadow-lg"
                        style="border-radius: 1rem; overflow: hidden;">

                        <div class="row g-0 w-100 h-100">
                            <!-- Contenedor izquierdo con la imagen -->
                            <div class="col-md-6 col-lg-7 d-none d-md-flex align-items-center">
                                <img src="../medical_index.jpg" alt="login form" class="img-fluid"
                                    style="border-radius: 1rem 0 0 1rem; width: 100%; height: 100%; object-fit: cover;">
                            </div>

                            <!-- Contenedor derecho con el formulario -->
                            <div class="col-md-6 col-lg-5 d-flex align-items-center justify-content-center p-4">
                                <div class="auth-form-box text-center w-100">
                                    <img src="../logo_monaros_sinbg_light.png" style="width: 50%;"
                                        alt="Logo Medicalsoft" class="mb-3" />
                                    <h4 class="text-body-highlight">Recuperar tu</h4>
                                    <p class="text-body-tertiary">Escribe tu contraseña nueva</p>

                                    <form class="mt-4">
                                        <input type="hidden" id="username" value="">

                                        <div class="position-relative mb-3">
                                            <input class="form-control form-icon-input pe-6" id="password"
                                                type="password" placeholder="Nueva contraseña"
                                                data-password-input="data-password-input" />
                                            <button type="button"
                                                class="btn px-3 py-0 h-100 position-absolute top-0 end-0 fs-7 text-body-tertiary"
                                                data-password-toggle="data-password-toggle">
                                                <span class="uil uil-eye show"></span>
                                                <span class="uil uil-eye-slash hide"></span>
                                            </button>
                                        </div>
                                        <div class="position-relative mb-3">
                                            <input class="form-control form-icon-input pe-6" id="confirmPassword"
                                                type="password" placeholder="Confirmar nueva contraseña"
                                                data-password-input="data-password-input" />
                                            <button type="button"
                                                class="btn px-3 py-0 h-100 position-absolute top-0 end-0 fs-7 text-body-tertiary"
                                                data-password-toggle="data-password-toggle">
                                                <span class="uil uil-eye show"></span>
                                                <span class="uil uil-eye-slash hide"></span>
                                            </button>
                                        </div>
                                        <button class="btn btn-outline-dark w-100" id="btnForgotPass"
                                            type="submit">Reiniciar contraseña</button>
                                    </form>
                                    <ul class="list-unstyled mt-2" id="password-requirements">
                                        <li id="requirement-length" style="color: red;"> Mínimo 8 caracteres</li>
                                        <li id="requirement-uppercase" style="color: red;"> Al menos 1 mayúscula</li>
                                        <li id="requirement-special" style="color: red;"> Al menos 1 caracter especial
                                            (!@#$...)</li>
                                    </ul>


                                </div>
                            </div>
                        </div> <!-- Fin de row g-0 w-100 h-100 -->

                    </div>
                </div>
            </div>
        </div>
    </main>



    <script>
        var navbarTopStyle = window.config.config.phoenixNavbarTopStyle;
        var navbarTop = document.querySelector('.navbar-top');
        if (navbarTopStyle === 'darker') {
            navbarTop.setAttribute('data-navbar-appearance', 'darker');
        }

        var navbarVerticalStyle = window.config.config.phoenixNavbarVerticalStyle;
        var navbarVertical = document.querySelector('.navbar-vertical');
        if (navbarVertical && navbarVerticalStyle === 'darker') {
            navbarVertical.setAttribute('data-navbar-appearance', 'darker');
        }
    </script>
    </main>
 
    <script src="login/forgotPassword.js"></script>
        
</body>

</html>
