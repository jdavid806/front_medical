<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="configUsuarios">Usuarios</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Especialidades</li>
            </ol>
        </nav>

        <div id="specialities">
        </div>
    </div>

    <script type="module">
        import React from "react";
        import ReactDOMClient from "react-dom/client";
        import SpecialityApp from '../../react-dist/fe-config/speciality/SpecialityApp.js';

        const rootElement = document.getElementById('specialities');
        if (rootElement) {
            ReactDOMClient.createRoot(rootElement).render(React.createElement(SpecialityApp));
        }
    </script>
</div>

<?php
include "../../footer.php";
?>