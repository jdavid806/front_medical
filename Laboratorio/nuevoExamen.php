<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Examenes</li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-12">
                <div class="row align-items-center justify-content-between">
                    <div class="col-md-6">
                        <h2 class="mb-0">Editor de formularios</h2>
                        <div class="col-3">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-0 g-md-4 g-xl-6 p-3">
                <div class="col-md-12 col-lg-12 col-xl-12">
                    <div class="container mt-4 w-100 mw-100">
                        <!-- Contenedor de tabs -->
                        <ul class="nav nav-tabs" id="formContainer"> </ul>
                        <!-- Contenedor de contenido de tabs -->
                        <div class="tab-content mt-3" id="tabsContainer">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <script src="vendors/tinymce/tinymce.min.js"></script> -->
</div>

<?php
include "../footer.php";
?>
<script type="module" src="./Laboratorio/js/formCreador.js"></script>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        FormBuilder
    } from './react-dist/components/form-builder/FormBuilder.js';

    ReactDOMClient.createRoot(document.getElementById('formBuilderReact')).render(React.createElement(FormBuilder));
</script>

<div id="formBuilderReact"></div>