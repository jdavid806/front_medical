<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeMarketing">Marketing</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Mensajeria masiva
                </li>
            </ol>
        </nav>
        <div class="container">
            <h1 class="section-title">Mensajeria masiva</h1>

            <div id="massMessageApp"></div>
        </div>
    </div>
</div>

<?php
include "../../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        MassMessageApp
    } from './react-dist/marketing/mass-message/MassMessageApp.js';

    ReactDOMClient.createRoot(document.getElementById('massMessageApp')).render(React.createElement(MassMessageApp));
</script>