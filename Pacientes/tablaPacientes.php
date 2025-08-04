<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="patientsTableReact"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        PatientTablePage
    } from './react-dist/patients/pages/PatientTablePage.js';

    const rootElement = document.getElementById('patientsTableReact');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(PatientTablePage));
</script>

<?php include "../footer.php"; ?>