<?php
include "../menu.php";
include "../header.php";

?>

<style>
  .container-small {
    max-width: 100% !important;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .custom-btn {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }

  .custom-btn i {
    margin-right: 5px;
  }
</style>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Control de Cierre de Caja</li>
      </ol>
    </nav>

    <div id="cashControlReportReact"></div>

  </div>
</div>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    CierreCaja
  } from './react-dist/cash-control/CashControlReport.js';

  ReactDOMClient.createRoot(document.getElementById('cashControlReportReact')).render(React.createElement(CierreCaja));
</script>

<?php include "../footer.php"; ?>