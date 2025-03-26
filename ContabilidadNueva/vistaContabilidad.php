<?php
include "../menu.php";
include "../header.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Orbitron:wght@400..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

  <style>
    * {
      font-family: "Open Sans" !important;
      font-size: initial;
    }
    
    /* Contenedor principal centrado */
    /* .main-content {
      display: flex;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
     */
    /* Contenedor del componente con ancho máximo */
    /* .component-container {
      width: 100%;
      max-width: 1200px; /* Ajusta según necesites */
    } */
  </style>
</head>

<body>
  

<div class="content">
<div class="container-small">   
<nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Contable</li>
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
</body>
</html>

