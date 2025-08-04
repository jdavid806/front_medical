<?php
include "../menu.php";
include "../header.php";
?>

<link rel="stylesheet" href="../assets/css/styles.css">
<style>
  /* Estilos generales para el contenedor principal */
  .componente .content {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
  }

  /* Estilos para las pestañas */
  #facturacionReports {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
  }

  #facturacionReports .nav-item {
    flex-shrink: 0;
  }

  /* Estilos para el contenido de las pestañas */
  .tab-content {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .tab-pane {
    width: 100%;
    max-width: 100%;
  }

  /* Contenedores React */
  #react-container-salesInvoices,
  #react-container-purchaseInvoices,
  #react-container-citas,
  #react-container-sala {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  /* Ajustes para el breadcrumb */
  .breadcrumb {
    max-width: 100%;
    overflow-x: hidden;
  }

  /* Ajustes para el título y botones */
  .row.mt-4 {
    max-width: 100%;
    width: 100%;
  }

  /* Asegurar que el contenedor principal no cause overflow */
  .container-small {
    max-width: 100%;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  /* Ajustes para pantallas pequeñas */
  @media (max-width: 768px) {
    #facturacionReports {
      display: block;
      white-space: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .nav-item {
      display: inline-block;
      float: none;
    }
  }
</style>

<div class="componente">
  <div class="content">
    <div class="container-small">
      <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
          <li class="breadcrumb-item active" onclick="location.reload()">Facturación</li>
        </ol>
      </nav>
      <div class="row mt-4">
        <div class="row">
          <div class="col-12">
            <div class="col-10">
              <div class="col-12 row col-md-auto">
                <div class="col-6">
                  <h2 class="mb-0">Facturación</h2>
                </div>
                <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">
                </div>
              </div>
              <div class="col-12 col-md-auto">
                <div class="d-flex">
                  <div class="flex-1 d-md-none">
                    <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2"
                      data-phoenix-toggle="offcanvas" data-phoenix-target="#productFilterColumn"><span
                        class="fa-solid fa-bars"></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pestañas -->
        <ul class="nav nav-underline fs-9 p-3" id="facturacionReports" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="facturacionVentas-tab" data-bs-toggle="tab" href="#facturacionVentas"
              role="tab" onclick="loadReactComponent('SalesInvoices')">
              <i class="fas fa-file-invoice-dollar"></i> Facturación Ventas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="facturacionCompras-tab" data-bs-toggle="tab" href="#facturacionCompras" role="tab"
              onclick="loadReactComponent('PurchaseInvoices')">
              <i class="fas fa-file-invoice-dollar"></i> Facturación compras
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="facturacionEntidad-tab" data-bs-toggle="tab" href="#facturacionEntidad" role="tab"
              onclick="loadReactComponent('BillingEntity')">
              <i class="fas fa-file-invoice-dollar"></i> Facturación X Entidad
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="debitCreditNotes-tab" data-bs-toggle="tab" href="#debitCreditNotes" role="tab"
              onclick="loadReactComponent('DebitCreditNotes')">
              <i class="fas fa-file-alt"></i> Nota débito/créditos
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="ordenesCompras-tab" data-bs-toggle="tab" href="#ordenesCompras" role="tab"
              onclick="loadReactComponent('PurchaseOrders')">
              <i class="fas fa-file-invoice"></i> Ordenes de compras
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="facturacionVentas" role="tabpanel">
            <div id="react-container-salesInvoices"></div>
          </div>
          <div class="tab-pane fade" id="facturacionCompras" role="tabpanel">
            <div id="react-container-purchaseInvoices"></div>
          </div>
          <div class="tab-pane fade" id="facturacionEntidad" role="tabpanel">

            <div style="display: flex; justify-content: flex-end; margin: 10px;">
              <button aria-label="Nueva Facturación Entidad" class="btn btn-primary p-button p-component"
                data-pc-name="button" data-pc-section="root">
                <span class="p-button-label p-c" data-pc-section="label" onClick="openModalEntity()">
                  Nueva Facturación Entidad
                </span>
              </button>
            </div>

            <div id="react-container-billingEntity"></div>
          </div>
          <div class="tab-pane fade" id="debitCreditNotes" role="tabpanel">
            <div id="react-container-debitCreditNotes"></div>
          </div>
          <div class="tab-pane fade" id="soporteDocumento" role="tabpanel">
            <div id="react-container-supportDocuments"></div>
          </div>
        </div>
        <div class="tab-pane fade" id="ordenesCompras" role="tabpanel">
          <div id="react-container-purchaseOrders"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

<script>
  function openModalEntity() {
    $('#modalEntity').modal('show');
    console.log('Modal abierto');
  }

  // Función para cargar dinámicamente los componentes React
  let currentRoot = null;

  function loadReactComponent(componentName) {
    // Determinar el ID del contenedor basado en el componente
    let containerId;
    switch (componentName) {
      case 'SalesInvoices':
        containerId = 'react-container-salesInvoices';
        break;
      case 'PurchaseInvoices':
        containerId = 'react-container-purchaseInvoices';
        break;
      case 'BillingEntity':
        containerId = 'react-container-billingEntity';
        break;
      case 'DebitCreditNotes':
        containerId = 'react-container-debitCreditNotes';
        break;
      case 'PurchaseOrders':
        containerId = 'react-container-purchaseOrders';
        break;
      default:
        containerId = 'react-container-salesInvoices';
    }

    // Limpiar cualquier script anterior
    const oldScript = document.getElementById('react-component-script');
    if (oldScript) {
      oldScript.remove();
    }

    // Crear un script para cargar el componente dinámicamente
    const script = document.createElement('script');
    script.id = 'react-component-script';
    script.type = 'module';
    script.innerHTML = `
                        import React from "react";
                        import ReactDOMClient from "react-dom/client";
                        import { ${componentName} } from './react-dist/invoices/${componentName}.js';
                        
                        const container = document.getElementById('${containerId}');
                        
                        // Limpiar la raíz anterior si existe
                        if (currentRoot) {
                            currentRoot.unmount();
                        }
                        
                        currentRoot = ReactDOMClient.createRoot(container);
                        currentRoot.render(React.createElement(${componentName}));
                    `;

    // Agregar el script al documento
    document.body.appendChild(script);
  }
  // Cargar el componente inicial (Estado de resultados)
  document.addEventListener('DOMContentLoaded', function () {
    loadReactComponent('SalesInvoices');
  });
</script>

<?php
include "../footer.php";
include "./includes/modals/FacturaElectronica.php";
include "./includes/modals/modalNotaCredito.php";
include "./includes/modals/modalNotaDebito.php";
include "./includes/modals/NoteCreditModal.php";
include "./includes/modals/NoteDebitModal.php";
include "./includes/modals/EntidadModal.php";
include "./includes/modals/DocumentoSoporteModal.php";
include "./includes/modals/CustomerModal.php";
?>