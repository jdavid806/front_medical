<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Control citas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Admisiones</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">      
                <div id="admissionAppReact"></div>
            </div>
        </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        AdmissionApp
    } from './react-dist/admission/AdmissionApp.js';

    ReactDOMClient.createRoot(document.getElementById('admissionAppReact')).render(React.createElement(AdmissionApp));
</script>

<?php
include "../footer.php";
?>