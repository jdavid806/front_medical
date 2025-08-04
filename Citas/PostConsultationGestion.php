<?php
include "../menu.php";
include "../header.php";

?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Post consulta</a></li>
                <li class="breadcrumb-item"><a href="postConsultationGestion">Gestion de post-consulta</a></li>
            </ol>
        </nav>
    </div>

    <div id="post-consultation-gestion-content">

    </div>

</div>



<?php
include "../footer.php"; ?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PostConsultationGestion
    } from './react-dist/appointments/PostConsultationGestion.js';

    ReactDOMClient.createRoot(document.getElementById('post-consultation-gestion-content')).render(React.createElement(PostConsultationGestion));
</script>