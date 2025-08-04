<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Laboratorio</li>
            </ol>
        </nav>

        <div id="examsGeneralAppReact"></div>

    </div>
    <?php include "../footer.php"; ?>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import ExamGeneralApp from './react-dist/exams/ExamGeneralApp.js';

    ReactDOMClient.createRoot(document.getElementById('examsGeneralAppReact')).render(React.createElement(ExamGeneralApp));
</script>