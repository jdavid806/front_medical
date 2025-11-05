<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="specialtyPastMedicalHistoryDetailRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        SpecialtyPastMedicalHistoryDetail
    } from './react-dist/past-medical-history/SpecialtyPastMedicalHistoryDetail.js';

    const rootElement = document.getElementById('specialtyPastMedicalHistoryDetailRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(SpecialtyPastMedicalHistoryDetail));
</script>

<?php include "../footer.php"; ?>