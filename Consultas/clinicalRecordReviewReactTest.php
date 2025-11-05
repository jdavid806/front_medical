<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="clinicalRecordReviewRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        ClinicalRecordReview
    } from './react-dist/clinical-records/ClinicalRecordReview.js';

    const rootElement = document.getElementById('clinicalRecordReviewRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(ClinicalRecordReview));
</script>

<?php include "../footer.php"; ?>