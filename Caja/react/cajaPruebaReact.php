<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content mt-3">
    <div class="container-small mt-3">
        <div id="cajaModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        CashRegisterApp
    } from './react-dist/cash-register/CashRegisterApp.js';

    const rootElement = document.getElementById('cajaModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(CashRegisterApp));
</script>

<?php include "../../footer.php"; ?>