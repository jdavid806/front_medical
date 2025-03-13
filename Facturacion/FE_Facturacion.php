<?php
include "../menu.php";
include "../header.php";
include "./includes/modals/FacturaElectronica.php";
include "./includes/modals/NoteCreditModal.php";
include "./includes/modals/NoteDebitModal.php";
// include "./includes/modals/EntidadModal.php";
include "./includes/modals/DocumentoSoporteModal.php";
include "./includes/modals/CustomerModal.php";
?>

<link rel="stylesheet" href="./assets/css/styles.css">
<style>
  .board {
    display: flex;
    gap: 20px;
    overflow-x: auto;
  }

  .column-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .column-title {
    font-size: 18px;
    margin-bottom: 10px;
    text-align: center;
  }

  .column {
    width: 250px;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 20em;
  }

  .task {
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    cursor: grab;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .task strong {
    display: block;
  }

  .task p {
    margin: 5px 0;
  }

  .view-patient-btn {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    text-align: center;
    display: block;
  }

  .view-patient-btn:hover {
    background-color: #0056b3;
  }

  /* Estilos por estado */
  .column[data-status="Pendientes"] .task {
    background-color: #d3d3d3;
  }

  .column[data-status="En espera de consulta"] .task {
    background-color: #add8e6;
  }

  .column[data-status="En consulta"] .task {
    background-color: #90ee90;
  }

  .column[data-status="Consulta finalizada"] .task {
    background-color: #32cd32;
  }

  .column[data-status="Pre admisión"] .task {
    background-color: rgb(220, 94, 153);
  }

  /* Tema oscuro */
  html[data-bs-theme="dark"] .task {
    color: #000;
  }
</style>

<div class="componente">
  <div class="content">
    <div class="container-small">
      <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
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
                    <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas"
                      data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pestañas -->
        <ul class="nav nav-underline fs-9 p-3" id="antecedentesTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="personales-tab" data-bs-toggle="tab" href="#personales" role="tab">
              <i class="fas fa-file-invoice-dollar"></i> Facturación Ventas
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="citas-tab" data-bs-toggle="tab" href="#citas" role="tab">
              <i class="fas fa-file-alt"></i> Nota débito
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="salaDeEspera-tab" data-bs-toggle="tab" href="#salaDeEspera" role="tab">
              <i class="fas fa-file-invoice"></i> Nota crédito
            </a>
          </li>
        </ul>

        <div class="tab-content mt-3" id="antecedentesTabsContent">
          <!-- Tab de Facturacion Ventas -->
          <div class="tab-pane fade show active" id="personales" role="tabpanel">

            <div class="tab-pane fade show active" id="personales" role="tabpanel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Facturacion Ventas</h4>
                  </div>
                  <div class="col-6 text-end">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-plus"></i> &nbsp; Nuevo
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalCustomerModal">Facturacion Cliente</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEntity">Facturacion Entidad</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNewNoteCredit">Nota Crédito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNewNoteDebit">Nota Débito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoDocumentoSoporte">Documento soporte</a></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="w-50 me-3">
                  <label class="form-label" for="datepicker1">Fecha de inicio</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker1" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
                <div class="w-50">
                  <label class="form-label" for="datepicker2">Fecha de fin</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker2" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
              </div>
            </div>

            <table id="admissionsTable" class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th class="align-middle custom-td">N° de Factura</th>
                  <th class="align-middle custom-td">Fecha</th>
                  <th class="align-middle custom-td">Encargado</th>
                  <th class="align-middle custom-td">Cliente</th>
                  <th class="align-middle custom-td">Identificacion</th>
                  <th class="align-middle custom-td">Tipo</th>
                  <th class="align-middle white-space-nowrap pe-0 p-3"></th>
                </tr>
              </thead>
              <tbody class="list">
                <tr>
                  <td>564</td>
                  <td>2022-01-01</td>
                  <td>Maria Cruz</td>
                  <td>Luis Perez</td>
                  <td>12345678</td>
                  <td>Factura</td>
                  <td class="align-middle white-space-nowrap pe-0 p-3">
                    <div class="btn-group me-1">
                      <button class="btn dropdown-toggle mb-1 btn-info" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Acciones</button>
                      <div class="dropdown-menu">

                        <a class="dropdown-item" href="#"><i class="fas fa-eye"></i> Ver</a>
                        <a class="dropdown-item" href="#"><i class="fas fa-download"></i> Descargar</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Nota crédito</a>
                        <a class="dropdown-item" href="#">Nota débito</a>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tab de Nota de debito -->

          <div class="tab-pane fade" id="citas" role="tabpanel">
            <div class="tab-pane fade show active" id="personales" role="tabpanel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Nota de debito</h4>
                  </div>
                  <div class="col-6 text-end">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-plus"></i> &nbsp; Nuevo
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalTipoFactura">Facturacion Cliente</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaFacturaEmpresa">Facturacion Entidad</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(1, true)">Nota Crédito</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(2, true)">Nota Débito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoDocumentoSoporte">Documento soporte</a></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="w-50 me-3">
                  <label class="form-label" for="datepicker1">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker1" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
                <div class="w-50">
                  <label class="form-label" for="datepicker2">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker2" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
              </div>
            </div>

            <table id="admissionsTable" class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th class="align-middle custom-td">N° de Nota</th>
                  <th class="align-middle custom-td">N° de Factura</th>
                  <th class="align-middle custom-td">Fecha</th>
                  <th class="align-middle custom-td">Encargado</th>
                  <th class="align-middle custom-td">Cliente/Proveedor</th>
                  <th class="align-middle custom-td">NIT/CC</th>
                  <th class="align-middle custom-td">Tipo</th>
                  <th class="align-middle white-space-nowrap pe-0 p-3">Acciones</th>
                </tr>
              </thead>
              <tbody class="list">
                <tr>
                  <td>22276742</td>
                  <td>49895</td>
                  <td>2025-02-18</td>
                  <td>Vendedor #10</td>
                  <td>Importaciones Internacionales SA </td>
                  <td>22921810</td>
                  <td>Nota de crédito</td>
                  <td class="align-middle white-space-nowrap pe-0 p-3">
                    <button class="btn btn-success me-1 mb-1" type="button">
                      <i class="fas fa-eye"></i> &nbsp; Previsualizar
                    </button>
                    <i class="fas fa-down-long"></i>
                    <i class="fas fa-bars"></i>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          <!-- Tab de Nota de crédito -->
          <div class="tab-pane fade" id="salaDeEspera" role="tabpanel">

            <div class="tab-pane fade show active" id="salaDeEspera" role="tabpanel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class=" col-12 row mb-4"
                  id="scrollspyFacturacionVentas">
                  <div class="col-6">
                    <h4 class="mb-1" id="scrollspyFacturacionVentas">Nota de crédito</h4>
                  </div>
                  <div class="col-6 text-end">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-plus"></i> &nbsp; Nuevo
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalTipoFactura">Facturacion Cliente</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaFacturaEmpresa">Facturacion Entidad</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(1, true)">Nota Crédito</a></li>
                        <li><a class="dropdown-item" onclick="notaDC(2, true)">Nota Débito</a></li>
                        <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoDocumentoSoporte">Documento soporte</a></li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="w-50 me-3">
                  <label class="form-label" for="datepicker1">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker1" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
                <div class="w-50">
                  <label class="form-label" for="datepicker2">Start Date</label>
                  <input class="form-control datetimepicker flatpickr-input" id="datepicker2" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                </div>
              </div>
            </div>

            <table id="admissionsTable" class="table table-sm fs-9 mb-0 tableDataTableSearch">
              <thead>
                <tr>
                  <th class="align-middle custom-td">N° de Nota</th>
                  <th class="align-middle custom-td">N° de Factura</th>
                  <th class="align-middle custom-td">Fecha</th>
                  <th class="align-middle custom-td">Encargado</th>
                  <th class="align-middle custom-td">Cliente/Proveedor</th>
                  <th class="align-middle custom-td">NIT/CC</th>
                  <th class="align-middle custom-td">Tipo</th>
                  <th class="align-middle white-space-nowrap pe-0 p-3">Acciones</th>
                </tr>
              </thead>
              <tbody class="list">
                <tr>
                  <td>22276742</td>
                  <td>49895</td>
                  <td>2025-02-18</td>
                  <td>Vendedor #10</td>
                  <td>Importaciones Internacionales SA </td>
                  <td>22921810</td>
                  <td>Nota de crédito</td>
                  <td class="align-middle white-space-nowrap pe-0 p-3">
                    <button class="btn btn-success me-1 mb-1" type="button">
                      <i class="fas fa-eye"></i> &nbsp; Previsualizar
                    </button>
                    <i class="fas fa-down-long"></i>
                    <i class="fas fa-bars"></i>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>


        </div>
      </div>
    </div>
  </div>
</div>

<template id="template-consulta">
  <tr>
    <td id="nombre" class="align-middle custom-td"></td>
    <td id="documento" class="align-middle custom-td"></td>
    <td id="fecha-consulta" class="align-middle custom-td"></td>
    <td id="hora-consulta" class="align-middle custom-td"></td>
    <td id="profesional" class="align-middle custom-td"></td>
    <td id="entidad" class="align-middle custom-td"></td>
    <td id="estado" class="align-middle custom-td"></td>
    <td class="align-middle white-space-nowrap pe-0 p-3">

      <div class="btn-group me-1">
        <button class="btn dropdown-toggle mb-1 btn-primary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Acciones</button>
        <div class="dropdown-menu">

          <a href="#" class="dropdown-item" id="generar-admision"> Generar admisión
          </a>
          <a class="dropdown-item" href="#"> Generar link de pago</a>

        </div>
      </div>
    </td>
  </tr>
</template>

<template id="template-all-citas">
  <tr>
    <td class="fs-9 align-middle">
      <div class="form-check mb-0 fs-8">
        <input class="form-check-input" type="checkbox">
      </div>
    </td>
    <td id="nombre" class="align-middle custom-td"></td>
    <td id="documento" class="align-middle custom-td"></td>
    <td id="fecha-consulta" class="align-middle custom-td"></td>
    <td id="hora-consulta" class="align-middle custom-td"></td>
    <td id="profesional" class="align-middle custom-td"></td>
    <td id="entidad" class="align-middle custom-td"></td>
    <td id="estado" class="align-middle custom-td"></td>
    <td class="align-middle white-space-nowrap pe-0 p-3">
    </td>
  </tr>
</template>

<!-- Modal facturacion entidad -->
<!-- Se pasó para acá para que tome los select Multiple -->
<div class="modal fade" id="modalEntity" tabindex="-1" style="display: none;" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Facturacion Entidad</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <div class="card theme-wizard mb-5" data-theme-wizard="data-theme-wizard">
          <div class="card-header bg-body-highlight pt-3 pb-2 border-bottom-0">
            <ul class="nav justify-content-between nav-wizard nav-wizard-success" role="tablist">
              <li class="nav-item" role="presentation"><a class="nav-link active fw-semibold" href="#bootstrap-wizard-validation-tab1" data-bs-toggle="tab" data-wizard-step="1" aria-selected="true" role="tab">
                  <div class="text-center d-inline-block"><span class="nav-item-circle-parent">
                      <span class="nav-item-circle d-flex">
                        <svg class="svg-inline--fa fa-user" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                          <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm0 32c-70.7 0-128 57.3-128 128v16c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-16c0-70.7-57.3-128-128-128z"></path>
                        </svg>
                      </span></span><span class="d-none d-md-block mt-1 fs-9">Información básica</span></div>
                </a></li>
              <li class="nav-item" role="presentation">
                <a class="nav-link fw-semibold" href="#bootstrap-wizard-validation-tab2" data-bs-toggle="tab" data-wizard-step="2" aria-selected="false" tabindex="-1" role="tab">
                  <div class="text-center d-inline-block">
                    <span class="nav-item-circle-parent">
                      <span class="nav-item-circle d-flex">
                        <svg class="svg-inline--fa fa-file-invoice" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-invoice" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg="">
                          <path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.3 0-24-10.7-24-24zm-64 0V48h-72v88c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8zM152 288h80c8.8 0 16 7.2 16 16s-7.2 16-16 16h-80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 64c0-8.8 7.2-16 16-16h80c8.8 0 16 7.2 16 16s-7.2 16-16 16h-80c-8.8 0-16-7.2-16-16zm152-136h-80c-8.8 0-16 7.2-16 16s7.2 16 16 16h80c8.8 0 16-7.2 16-16s-7.2-16-16-16zm-160 80c0 8.8-7.2 16-16 16s-16-7.2-16-16 7.2-16 16-16 16 7.2 16 16z"></path>
                        </svg>
                      </span>
                    </span>
                    <span class="d-none d-md-block mt-1 fs-9">Información de facturación</span>
                  </div>
                </a>
              </li>

              <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab3" data-bs-toggle="tab" data-wizard-step="3" aria-selected="false" tabindex="-1" role="tab">
                  <div class="text-center d-inline-block">
                    <span class="nav-item-circle-parent"><span class="nav-item-circle d-flex"><svg class="svg-inline--fa fas fa-money-bill-wave-alt" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="money-bill-wave-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg="">
                          <path fill="currentColor" d="M621.3 54.6C573.2 38.2 522.2 32 471 32c-96.1 0-192.2 42-288.3 42C136 74 90.1 58 52.7 41.3 46.5 38.5 40 34.6 32 34.6c-26.5 0-32 40-32 79.5v285c0 38.8 5.4 79.1 32 79.1 8 0 14.5-3.9 20.7-6.7C90.1 454 136 470 182.7 470c96.1 0 192.2-42 288.3-42 51.2 0 102.2 6.2 150.3 22.6 53.4 17.4 86.7 10.2 86.7-38.4V93c0-38.6-33.3-55.8-86.7-38.4zM144 271.8c0-37 35.8-66.8 80-66.8s80 29.8 80 66.8-35.8 66.8-80 66.8-80-29.8-80-66.8zm215.5 78.7c-3.3-3.3-5.3-7.9-5.3-12.8 0-9.9 8-17.9 17.9-17.9h16.3c7.7 0 13.9 6.2 13.9 13.9s-6.2 13.9-13.9 13.9c-7.4 0-13.4 6-13.4 13.4 0 6.9 6 13.4 13.4 13.4h14.3c18.4 0 33.2-14.9 33.2-33.2V270c0-18.4-14.9-33.2-33.2-33.2h-14.2c-24.6 0-44.6 20-44.6 44.6 0 9.9 3.2 19 9.1 26.6 6.2 8 5 18.9-2.9 25.8l-46.8 42.2c-4.9 4.4-7.6 10.4-7.6 16.7 0 13.5 11 24.5 24.5 24.5h64.3c7.7 0 13.9 6.2 13.9 13.9s-6.2 13.9-13.9 13.9h-16.3c-24.6 0-44.6-20-44.6-44.6 0-9.9-3.2-19-9.1-26.6-6.2-8-5-18.9 2.9-25.8l46.8-42.2c4.9-4.4 7.6-10.4 7.6-16.7 0-13.5-11-24.5-24.5-24.5h-64.3c-7.7 0-13.9-6.2-13.9-13.9s6.2-13.9 13.9-13.9h16.3c24.6 0 44.6 20 44.6 44.6 0 9.9 3.2 19 9.1 26.6 6.2 8 5 18.9-2.9 25.8L359.5 350.5zm225 21.9c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z"></path>
                        </svg></span></span><span class="d-none d-md-block mt-1 fs-9">Métodos de pago</span>
                  </div>
                </a></li>
              <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab4" data-bs-toggle="tab" data-wizard-step="4" aria-selected="false" tabindex="-1" role="tab">
                  <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span class="nav-item-circle d-flex"><svg class="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                          <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
                        </svg></span></span><span class="d-none d-md-block mt-1 fs-9">Hecho</span></div>
                </a></li>
            </ul>
          </div>
          <div class="card-body pt-4 pb-0">
            <div class="tab-content">
              <!-- Información básica -->
              <div class="tab-pane active" role="tabpanel" aria-labelledby="bootstrap-wizard-validation-tab1" id="bootstrap-wizard-validation-tab1">
                <form class="needs-validation was-validated" id="wizardValidationForm1" novalidate="novalidate" data-wizard-form="1">
                  <!-- Información básica -->
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Información básica</h5>
                      <div class="row g-3 mb-3">
                        <!-- <div class="col-sm-4">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-seller">Vendedor*</label>
                            <input class="form-control" type="text" name="seller" placeholder="Vendedor" required="required" id="bootstrap-wizard-validation-wizard-seller" data-wizard-seller="true">
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div> -->
                        <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-date-preparation">Fecha de elaboración*</label>
                            <input class="form-control" type="date" name="date-preparation" placeholder="Fecha de elaboración" required="required" id="bootstrap-wizard-validation-wizard-date-preparation" data-wizard-date-preparation="true">
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-date-expiry">Fecha de vencimiento*</label>
                            <input class="form-control" type="date" name="date-expiry" placeholder="Fecha de vencimiento" required="required" id="bootstrap-wizard-validation-wizard-date-expiry" data-wizard-date-expiry="true">
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                      </div>

                      <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-entity">Entidad</label>
                            <select class="form-select" name="entity" id="bootstrap-wizard-validation-entity">
                              <option value="">Seleccionar</option>
                              <option value="entidad1">Entidad 1</option>
                              <option value="entidad2">Entidad 2</option>
                              <option value="entidad3">Entidad 3</option>
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                        <!-- <div class="col-sm-4">
                          <div class="mb-2">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-authorisation-number">Número de Autorizacion*</label>
                            <input class="form-control" type="number" name="authorisation-number" placeholder="úmero de Autorizacion" required="required" id="bootstrap-wizard-validation-wizard-authorisation-number" data-wizard-confirm-password="true">
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div> -->
                        <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-entity">Centro de costo</label>
                            <select class="form-select" name="entity" id="bootstrap-wizard-validation-entity">
                              <option value="">Seleccionar</option>
                              <option value="centro1">Centro 1</option>
                              <option value="centro2">Centro 2</option>
                              <option value="centro3">Centro 3</option>
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Filtrar -->
                  <div class="card mt-3">
                    <div class="card-body">
                      <h5 class="card-title">Filtrar</h5>

                      <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-procedureModal">Procedimiento</label>
                            <select class="form-select" id="procedureModal">
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-specialityModal">Especialistas</label>
                            <select class="form-select" id="specialityModal">
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-patientsModal">Pacientes</label>
                            <select class="form-select" id="patientsModal">
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>

                        <!-- <div class="col-sm-6">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-procedure">Procedimiento</label>
                            <input class="form-control" type="text" name="procedure" placeholder="Procedimiento" id="procedure" required="required">
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div> -->
                        <!-- <div class="input-group mt-3">
                          <div class="form-floating">
                            <select class="form-select" id="speciality">
                            </select>
                          </div>
                        </div> -->
                        <!-- <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-entity">Especialista</label>
                            <select class="form-select" name="entity" id="bootstrap-wizard-validation-entity">
                              <option value="">Seleccionar</option>
                              <option value="especialidad1">Especialidad 1</option>
                              <option value="especialidad2">Especialidad 2</option>
                              <option value="especialidad3">Especialidad 3</option>
                            </select>
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div> -->
                        <!-- <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-date-expiry">Paciente*</label>
                            <input class="form-control" type="text" name="date-expiry" placeholder="Fecha de vencimiento" required="required" id="bootstrap-wizard-validation-wizard-date-expiry" data-wizard-date-expiry="true">
                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div> -->

                        <!-- <div class="col-sm-6">
                          <div class="mb-2 mb-sm-0">
                            <label class="form-label" for="start-date-procedure">Fecha de Inicio - Procedimiento*</label>
                            <input class="form-control datetimepicker flatpickr-input" name="start-date-procedure" id="start-date-procedure" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly" required="required">

                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label" for="seller">Fecha Fin - Procedimiento*</label>
                            <input class="form-control datetimepicker flatpickr-input" name="date-end-procedure" id="date-end-procedure" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly" required="required">

                            <div class="invalid-feedback">El campo es obligatorio</div>
                          </div>
                        </div> -->

                        <div class="col-sm-6">
                          <div class="mb-2">
                            <label class="form-label" for="rangeDate">
                              Fecha Inicio - Fin Procedimiento
                            </label>
                            <input class="form-control datetimepicker flatpickr-input" id="rangeDate" type="text" placeholder="Desde: dd/mm/aaaa - Hasta: dd/mm/aaaa" data-options="{&quot;mode&quot;:&quot;range&quot;,&quot;dateFormat&quot;:&quot;d/m/y&quot;,&quot;disableMobile&quot;:true}" readonly="readonly" required="required">

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>


              </div>

              <!-- Información de facturación -->
              <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-validation-tab2" id="bootstrap-wizard-validation-tab2">
                <div class="card">
                  <div id="tableExample3" data-list="{&quot;valueNames&quot;:[&quot;name&quot;,&quot;email&quot;,&quot;age&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                    <div class="search-box mb-3 mx-auto">
                      <form class="position-relative">
                        <input class="form-control search-input search form-control-sm" type="search" placeholder="Search" aria-label="Search">
                        <svg class="svg-inline--fa fa-magnifying-glass search-box-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                          <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                        </svg><!-- <span class="fas fa-search search-box-icon"></span> Font Awesome fontawesome.com -->
                      </form>
                    </div>
                    <div class="table-responsive">
                      <table class="table table-striped table-sm fs-9 mb-0">
                        <thead>
                          <tr>
                            <th class="sort border-top border-translucent ps-3" data-sort="name">Paciente</th>
                            <th class="sort border-top" data-sort="email">Fecha</th>
                            <th class="sort border-top" data-sort="age">Procedimiento</th>
                            <th class="sort border-top" data-sort="age">Autorización</th>
                            <th class="sort border-top" data-sort="age">Valor unitario</th>
                            <th class="sort border-top" data-sort="age">Valor total</th>
                            <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                          </tr>
                        </thead>
                        <tbody class="list">
                          <tr>
                            <td class="align-middle ps-3 name">Anna</td>
                            <td class="align-middle email">2025-10-05</td>
                            <td class="align-middle age">Null</td>
                            <td class="align-middle age">Null</td>
                            <td class="align-middle age">2000</td>
                            <td class="align-middle age">2000</td>
                            <td class="align-middle white-space-nowrap text-end pe-0">

                              <div class="form-check">
                                <input class="form-check-input" id="flexCheckDefault" type="checkbox" value="" />
                              </div>
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                    <div class="d-flex justify-content-between mt-3"><span class="d-none d-sm-inline-block" data-list-info="data-list-info">1 to 5 <span class="text-body-tertiary"> Items of </span>43</span>
                      <div class="d-flex"><button class="page-link disabled" data-list-pagination="prev" disabled=""><svg class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
                          </svg><!-- <span class="fas fa-chevron-left"></span> Font Awesome fontawesome.com --></button>
                        <ul class="mb-0 pagination">
                          <li class="active"><button class="page" type="button" data-i="1" data-page="5">1</button></li>
                          <li><button class="page" type="button" data-i="2" data-page="5">2</button></li>
                          <li><button class="page" type="button" data-i="3" data-page="5">3</button></li>
                          <li class="disabled"><button class="page" type="button">...</button></li>
                        </ul><button class="page-link pe-0" data-list-pagination="next"><svg class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                            <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
                          </svg><!-- <span class="fas fa-chevron-right"></span> Font Awesome fontawesome.com --></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Métodos de pago -->
              <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab3" id="bootstrap-wizard-tab3">
                <div class="card mt-4">
                  <div class="card-body">
                    <h5 class="card-title">Detalles de la factura</h5>
                    <div class="container text-center">
                      <div class="row row-cols-2">
                        <div class="col p-2">
                          <div class="card">
                            <div class="card-body">
                              <h4 class="card-title">Lista de Método de Pago</h4>
                              <table class="table">
                                <thead>
                                  <tr>
                                    <th scope="col" class="small">#</th>
                                    <th scope="col" class="small">Método de Pago</th>
                                    <th scope="col" class="small">Valor</th>
                                    <th scope="col" class="small">N° de Comprobante</th>
                                    <th scope="col" class="small"></th>
                                  </tr>
                                </thead>
                                <tbody id="paymentTableBody">
                                  <tr></tr>
                                </tbody>
                              </table>

                            </div>
                          </div>
                        </div>
                        <div class="col p-2">
                          <div class="card">
                            <div class="card-body">
                              <h4 class="card-title">Método de Pago</h4>

                              <div class="row g-3">
                                <div class="col-sm-3 col-md-6 col-lg-12">
                                  <label class="form-label" for="methodPayment">Método de pago</label>
                                  <select class="form-select" id="methodPayment">
                                    <option selected="selected">Seleccionar</option>
                                    <?php foreach ($paymentMethods as $key => $value) { ?>
                                      <option value="<?= $key ?>"><?= $value ?></option>
                                    <?php } ?>
                                  </select>
                                </div>
                                <div class="col-sm-3 col-md-6 col-lg-12">
                                  <label class="form-label" for="amount">Valor</label>
                                  <input class="form-control" id="amount" type="number">
                                </div>
                                <div class="col-sm-3 col-md-6 col-lg-12">
                                  <label class="form-label" for="amount">N° de Comprobante</label>
                                  <input class="form-control" id="amount" type="number">
                                </div>
                                <div class="col-sm-3 col-md-6 col-lg-12">
                                  <button class="btn btn-primary w-100 rounded-pill" type="button" id="payButton"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row row cols-6">
                        <div class="col p-2">
                          <div class="card">
                            <div class="card-body">
                              <h4 class="card-title">Resumen</h4>
                              <div class="px-0">
                                <div class="table-responsive scrollbar">
                                  <table class="table fs-9 text-body mb-0">
                                    <tbody>
                                      <tr>
                                        <td class="fw-semibold text-start">Total Facturado</td>
                                        <td class="text-end">0.00</td>

                                      </tr>
                                      <tr>
                                        <td class="fw-semibold text-start">Total Pagado</td>
                                        <td class="text-end">0.00</td>
                                      </tr>
                                      <tr>
                                        <td class="fw-semibold text-start">Número de Autorización</td>
                                        <td class="text-end">No aplica</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab4" id="bootstrap-wizard-tab4">
                <div class="row flex-center pb-8 pt-4 gx-3 gy-4">
                  <div class="col-12 col-sm-auto">
                    <div class="text-center text-sm-start">
                      <h5 class="mb-3">Felicidades!</h5>
                      <p class="text-body-emphasis fs-9">La admisión medica a sido completada exitosamente </p><!-- <a class="btn btn-primary px-6" href="../../modules/forms/wizard.html">Acciones</a> -->

                      <div class="btn-group me-1">
                        <button class="btn dropdown-toggle mb-1 btn-secondary" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Acciones</button>
                        <div class="dropdown-menu">

                          <a class="dropdown-item" href="#">Imprimir factura</a>
                          <a class="dropdown-item" href="#">Enviar factura</a>
                          <a class="dropdown-item" href="citasControl">Finalizar factura</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <!-- Footer -->
          <div class="card-footer border-top-0" data-wizard-footer="data-wizard-footer">
            <div class="d-flex pager wizard list-inline mb-0"><button class="d-none btn btn-link ps-0" type="button" data-wizard-prev-btn="data-wizard-prev-btn"><svg class="svg-inline--fa fa-chevron-left me-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                  <g transform="translate(160 256)">
                    <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                      <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" transform="translate(-160 -256)"></path>
                    </g>
                  </g>
                </svg><!-- <span class="fas fa-chevron-left me-1" data-fa-transform="shrink-3"></span> Font Awesome fontawesome.com -->Anterior</button>
              <div class="flex-1 text-end"><button class="btn btn-primary px-6 px-sm-6" type="submit" data-wizard-next-btn="data-wizard-next-btn">Siguiente<svg class="svg-inline--fa fa-chevron-right ms-1" data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                    <g transform="translate(160 256)">
                      <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                        <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" transform="translate(-160 -256)"></path>
                      </g>
                    </g>
                  </svg><!-- <span class="fas fa-chevron-right ms-1" data-fa-transform="shrink-3"> </span> Font Awesome fontawesome.com --></button></div>
            </div>
          </div>
        </div>

      </div>
      <!-- <div class="modal-footer"><button class="btn btn-primary" type="button">Aceptar</button><button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button></div> -->
    </div>
  </div>
</div>

<script type="module">
  import {
    appointmentService,
    userService,
    patientService,
    admissionService,
  } from './services/api/index.js';

  document.addEventListener("DOMContentLoaded", async function() {

    const bulkSelectEl = document.getElementById('bulk-select-example');
    const bulkActionsEl = document.getElementById('bulk-select-actions');

    bulkSelectEl.addEventListener('change', function() {
      if (this.checked) {
        bulkActionsEl.classList.remove('d-node')
      } else {
        bulkActionsEl.classList.add('d-none')
      }
    })

    function generarDetalleCitas(appointments) {
      console.log(appointments);
    }

    // Inicializar columnas como áreas de arrastre
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => {
      new Sortable(column, {
        group: "shared", // Permite mover tareas entre columnas
        animation: 150,
        onAdd: function(evt) {
          const task = evt.item;
          const newColumn = evt.to;
          const status = newColumn.getAttribute("data-status");
          const taskId = task.getAttribute("data-id");

          Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres mover la tarea a '${status}'?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, mover',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

              console.log(`Tarea con ID '${taskId}' movida a '${status}'`);
              // Llamada AJAX para guardar el cambio en el servidor (preparado para implementación futura)
            } else {

              evt.from.appendChild(task);
            }
          });
        }
      });
    });

    function updateTableAdmissions(list, template, admissiones) {
      list.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

      admissiones.forEach(consulta => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('#nombre').textContent = `${consulta.patient.first_name} ${consulta.patient.last_name}`;
        clone.querySelector('#documento').textContent = consulta.patient.document_number;
        clone.querySelector('#fecha-consulta').textContent = consulta.appointment_date;
        clone.querySelector('#hora-consulta').textContent = consulta.appointment_time;
        clone.querySelector('#profesional').textContent = `${consulta.user_availability.user} ${consulta.user_availability.user.last_name}`;
        clone.querySelector('#entidad').textContent = consulta.patient.social_security.eps;
        // Verifica el estado de `is_active` y asigna el contenido de `#estado`
        if (consulta.patient.is_active) {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-primary">Activo</span>';
        } else {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-secondary">Inactivo</span>';
        }

        clone.querySelector('#generar-admision').href = `generar_admision?id_cita=${consulta.id}`;
        list.appendChild(clone);
      });
    }

    function updateTableAppointments(list, template, appointments) {
      list.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

      appointments.forEach(consulta => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.form-check-input').setAttribute('data-bulk-select-row', JSON.stringify(consulta));
        clone.querySelector('#nombre').textContent = `${consulta.patient.first_name} ${consulta.patient.last_name}`;
        clone.querySelector('#documento').textContent = consulta.patient.document_number;
        clone.querySelector('#fecha-consulta').textContent = consulta.appointment_date;
        clone.querySelector('#hora-consulta').textContent = consulta.appointment_time;
        clone.querySelector('#profesional').textContent = `${consulta.user_availability.user.first_name} ${consulta.user_availability.user.last_name}`;
        clone.querySelector('#entidad').textContent = consulta.patient.social_security.eps;
        // Verifica el estado de `is_active` y asigna el contenido de `#estado`
        if (consulta.patient.is_active) {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-primary">Activo</span>';
        } else {
          clone.querySelector('#estado').innerHTML = '<span class="badge badge-phoenix badge-phoenix-secondary">Inactivo</span>';
        }
        list.appendChild(clone);
      });
    }



    const appointments = await appointmentService.getAll();
    const admissiones = await admissionService.getAdmisionsAll();

    console.log(admissiones.pati);


    const admissionsTable = document.getElementById('admissionsTableBody');
    const appointmentsTable = document.getElementById('allAppointments');
    const templateAdmissions = document.getElementById('template-consulta');
    const templateAppointments = document.getElementById('template-all-citas');

    console.log(appointmentsTable);


    updateTableAdmissions(admissionsTable, templateAdmissions, admissiones);
    //updateTableAppointments(appointmentsTable, templateAppointments, appointments);

    const selectMedico = document.getElementById("selectMedico");
    const selectPaciente = document.getElementById("selectPaciente");
    const selectMedicoCitas = document.getElementById("selectMedicoCitas");
    const selectPacienteCitas = document.getElementById("selectPacienteCitas");
    const rangoFechasCitas = document.getElementById("rangoFechasCitas");

    selectMedico.addEventListener("change", function() {
      filterAdmissions(admissionsTable, selectMedico, selectPaciente);
    });
    selectPaciente.addEventListener("change", function() {
      filterAdmissions(admissionsTable, selectMedico, selectPaciente);
    });
    selectMedicoCitas.addEventListener("change", function() {
      filterAppointments(appointmentsTable, selectMedicoCitas, selectPacienteCitas);
    });
    selectPacienteCitas.addEventListener("change", function() {
      filterAppointments(appointmentsTable, selectMedicoCitas, selectPacienteCitas);
    });
    rangoFechasCitas.addEventListener("change", function() {
      filterAppointments(appointmentsTable, selectMedicoCitas, selectPacienteCitas, rangoFechasCitas);
    });

    async function cargarMedicos(select) {
      const medicos = await userService.getAll();
      console.log(medicos);

      const options = medicos.map((medico) => {
        return `<option value="${medico.id}">${medico.first_name} ${medico.last_name}</option>`;
      });
      select.innerHTML += options.join("");
    }

    async function cargarPacientes(select) {
      const pacientes = await patientService.getAll();
      const options = pacientes.map((paciente) => {
        return `<option value="${paciente.id}">${paciente.first_name} ${paciente.last_name}</option>`;
      });
      select.innerHTML += options.join("");
    }

    cargarMedicos(selectMedico);
    cargarPacientes(selectPaciente);
    cargarMedicos(selectMedicoCitas);
    cargarPacientes(selectPacienteCitas);

    function parseDate(input) {
      const [day, month, year] = input.split('/');
      // Convertir año a 4 dígitos (asumiendo siglo XXI)
      const fullYear = parseInt(year) + 2000;
      // Mes en JavaScript es 0-based (0 = Enero)
      const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));

      // Validar que la fecha sea correcta
      if (
        date.getFullYear() !== fullYear ||
        date.getMonth() + 1 !== parseInt(month) ||
        date.getDate() !== parseInt(day)
      ) {
        return null;
      }
      return date;
    }

    function filterAdmissions(list, selectMedico, selectPaciente) {
      const selectedDoctor = selectMedico.value;
      const selectedPatient = selectPaciente.value;

      const filteredAppointments = admissiones.filter((appointment) => {
        return appointment.is_active &&
          (
            (selectedDoctor ? appointment.user_availability.user.id == selectedDoctor : true) &&
            (selectedPatient ? appointment.patient_id == selectedPatient : true)
          )
      });

      console.log(selectedDoctor, selectedPatient, appointments, filteredAppointments);

      updateTableAdmissions(list, templateAdmissions, filteredAppointments);
    }

    function filterAppointments(list, selectMedico, selectPaciente, rangoFechas = null) {
      const selectedDoctor = selectMedico.value;
      const selectedPatient = selectPaciente.value;
      const selectedDate = rangoFechas?.value;
      let startDate = null
      let endDate = null

      if (rangoFechas) {
        const [startStr, endStr] = selectedDate?.split(' to ');

        startDate = parseDate(startStr);
        if (endStr) {
          endDate = parseDate(endStr);
        }
      }

      const filteredAppointments = appointments.filter((appointment) => {
        return appointment.is_active &&
          (
            (selectedDoctor ? appointment.user_availability.user.id == selectedDoctor : true) &&
            (selectedPatient ? appointment.patient_id == selectedPatient : true) &&
            (startDate && endDate ?
              Date.parse(appointment.appointment_date) >= startDate.getTime() &&
              Date.parse(appointment.appointment_date) <= endDate.getTime() :
              true)
          )
      });

      console.log(selectedDoctor, selectedPatient, appointments, filteredAppointments);


      updateTableAppointments(list, templateAppointments, filteredAppointments);
    }
  });

  function generarTurno() {
    const identificacion = document.getElementById('identificacion').value;
    const motivo = document.getElementById('motivo').value;
    const asistenciaPreferencial = document.getElementById('asistenciaPreferencial').value;
    const turno = 'G' + Math.floor(Math.random() * 100);
    const fecha = new Date().toLocaleDateString();

    // Verificar si se ingresó asistencia preferencial
    const asistenciaHtml = asistenciaPreferencial ? `<p><strong>Preferencial:</strong> ${asistenciaPreferencial}</p>` : '';

    const ticketHtml = `
        <div class="card ticket">
            <div class="card-body">
                <h4 class="text-center mb-2">Turno: ${turno}</h4>
                <p><strong>ID:</strong> ${identificacion}</p>
                <p><strong>Motivo:</strong> ${motivo}</p>
                ${asistenciaHtml} <!-- Se agrega solo si tiene valor -->
                <h6 class="w-100 text-end">${fecha}</h6>
            </div>
        </div>
    `;

    document.getElementById('ticket-container').innerHTML = ticketHtml;
  }
</script>

<?php
include "../footer.php";
?>
<script>
  const procedimientos = [{
      id: 1,
      nombre: "procedimiento 1"
    },
    {
      id: 2,
      nombre: "procedimiento 2"
    },
    {
      id: 3,
      nombre: "procedimiento 3"
    }
  ];
  const especialistas = [{
      id: 1,
      nombre: "especialista 1"
    },
    {
      id: 2,
      nombre: "especialista 2"
    },
    {
      id: 3,
      nombre: "especialista 3"
    }
  ];

  const pacientes = [{
      id: "11000",
      nombre: "paciente 1"
    },
    {
      id: "90192",
      nombre: "paciente 2"
    },
    {
      id: "9201",
      nombre: "paciente 3"
    }
  ];


  function cargarProcedimientos() {
    const selectProcedimientos = document.getElementById('procedureModal');

    selectProcedimientos.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los procedimientos";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectProcedimientos.appendChild(placeholderOption);

    procedimientos.forEach(procedimiento => {
      const optionProc = document.createElement('option');

      optionProc.value = procedimiento.id;
      optionProc.textContent = procedimiento.nombre;

      selectProcedimientos.appendChild(optionProc);
    });
  }

  function cargarEspecialistas() {
    const selectEspecialistas = document.getElementById('specialityModal');

    selectEspecialistas.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los especialistas";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectEspecialistas.appendChild(placeholderOption);

    especialistas.forEach(especialista => {
      const optionEsp = document.createElement('option');

      optionEsp.value = especialista.id;
      optionEsp.textContent = especialista.nombre;

      selectEspecialistas.appendChild(optionEsp);
    });
  }

  function cargarPacientes() {
    const selectPacientes = document.getElementById('patientsModal');

    selectPacientes.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los pacientes";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectPacientes.appendChild(placeholderOption);

    pacientes.forEach(paciente => {
      const optionPac = document.createElement('option');

      optionPac.value = paciente.id;
      optionPac.textContent = paciente.nombre;

      selectPacientes.appendChild(optionPac);
    });
  }

  
  function configurarSelectProcedimientosMultiple() {
    const procedureModal = document.getElementById('procedureModal');

    procedureModal.setAttribute('multiple', 'multiple');

    // Choices.js
    if (typeof Choices !== 'undefined') {
      const choices = new Choices(procedureModal, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }


  function configurarSelectEspecialistasMultiple() {
    const specialityModal = document.getElementById('specialityModal');
    specialityModal.setAttribute('multiple', 'multiple');

    if (typeof Choices !== 'undefined') {
      const choices = new Choices(specialityModal, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  function configurarSelectPacientesMultiple() {
    const patientsModal = document.getElementById('patientsModal');
    patientsModal.setAttribute('multiple', 'multiple');

    if (typeof Choices !== 'undefined') {
      const choices = new Choices(patientsModal, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    cargarProcedimientos(procedimientos);
    cargarEspecialistas(especialistas);
    cargarPacientes(pacientes);
    configurarSelectProcedimientosMultiple();
    configurarSelectEspecialistasMultiple();
    configurarSelectPacientesMultiple();
  });
</script>

<script src="./assets/js/main.js"></script>