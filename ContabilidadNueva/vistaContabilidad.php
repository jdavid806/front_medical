<?php
include "../menu.php";
include "../header.php";
?>
<style>
  /* Asegurar que el contenedor principal no cause overflow */
  .container-small {
    max-width: 100% !important;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Cuentas Contable</li>
      </ol>
    </nav>
    <div class="main-content">
      <div class="component-container">
        <h2>Contable</h2>
        <div id="NewAccountingAccount"></div>
      </div>
    </div>
  </div>
</div>
<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import { AccountingAccounts } from './react-dist/accounting/AccountingAccounts.js';
  ReactDOMClient.createRoot(document.getElementById('NewAccountingAccount')).render(
    React.createElement(AccountingAccounts)
  );
</script>

<?php
include "../footer.php";
?>