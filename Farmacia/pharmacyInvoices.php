<?php
include "../menu.php";
include "../header.php";
?>
<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeMarketing">Farmacia</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Facturas de farmacia
                </li>
            </ol>
        </nav>
        <div class="container">
            <h1 class="section-title">Facturas de farmacia</h1>

            <div id="PharmacyApp"></div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PharmacyApp
    } from './react-dist/pharmacy/PharmacyApp.js';

    ReactDOMClient.createRoot(document.getElementById('PharmacyApp')).render(React.createElement(PharmacyApp));
</script>