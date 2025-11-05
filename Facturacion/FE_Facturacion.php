<?php
include "../menu.php";
include "../header.php";
?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="HomeReportes">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Facturacions</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
              <div id="tabs-invoices"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        TabsBilling
    } from './react-dist/billing/TabsBilling.js';

    ReactDOMClient.createRoot(document.getElementById('tabs-invoices')).render(React.createElement(TabsBilling));
</script>

<?php
include "../footer.php";
?>