<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        PatientAsyncTable
    } from './react-dist/patients/PatientAsyncTable.js';

    const rootElement = document.getElementById('appointmentModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(PatientAsyncTable));
</script>

<?php include "../footer.php"; ?>