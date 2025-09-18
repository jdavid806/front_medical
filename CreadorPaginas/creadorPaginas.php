<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div id="creadorPaginasRoot"></div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        WebCreatorApp
    } from './react-dist/web-creator/WebCreatorApp.js';

    const rootElement = document.getElementById('creadorPaginasRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(WebCreatorApp));
</script>

<?php include "../footer.php"; ?>