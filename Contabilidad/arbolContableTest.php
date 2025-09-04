<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="arbolContableReactRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        AccountingAccountsTree
    } from './react-dist/accounting/AccountingAccountsTree.js';

    const rootElement = document.getElementById('arbolContableReactRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(AccountingAccountsTree));
</script>

<?php include "../footer.php"; ?>