<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="systemConfigReactTest"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        SystemConfigApp
    } from './react-dist/config/system-config/SystemConfigApp.js';

    const rootElement = document.getElementById('systemConfigReactTest');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(SystemConfigApp));
</script>

<?php include "../../footer.php"; ?>