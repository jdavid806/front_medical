<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="specialtyPastMedicalHistoryFormRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        SpecialtyPastMedicalHistoryForm
    } from './react-dist/past-medical-history/SpecialtyPastMedicalHistoryForm.js';

    const rootElement = document.getElementById('specialtyPastMedicalHistoryFormRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(SpecialtyPastMedicalHistoryForm));
</script>

<?php include "../footer.php"; ?>