<?php
include "../../../menu.php";
include "../../../header.php";
?>

<div class="componente">
    <div class="content">

        <div id="billing-by-entity-modal"></div>

    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        BillingByEntity
    } from './react-dist/billing/by-entity/modal.js';

    ReactDOMClient.createRoot(document.getElementById('billing-by-entity-modal')).render(React.createElement(BillingByEntity));
</script>

<?php
include "../../../footer.php";
?>