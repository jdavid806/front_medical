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
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeContabilidad">Pacientes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Telemedicina</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <h2>Telemedicina</h2>
                <div id="TelemedicinaMain"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
import React from "react"
import ReactDOMClient from "react-dom/client"
import {
    TelemedicinaMain
} from './react-dist/telemedicine/TelemedicinaMain.js';

ReactDOMClient.createRoot(document.getElementById('TelemedicinaMain')).render(
    React.createElement(TelemedicinaMain)
);
</script>
<?php
include "../footer.php";
?>