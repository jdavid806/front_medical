<?php
include "../menu.php";
include "../header.php";
?>
<style>
  .nav-item-circle {
    background-color: #0dcaf0;
    /* Color "info" */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    /* Ajusta el tamaño del círculo */
    height: 40px;
    /* Ajusta el tamaño del círculo */
    border-radius: 50%;
    /* Hace que el fondo sea circular */
  }
</style>
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
                                <div class="col-sm-4">
                                    <div class="mb-2 mb-sm-0">
                                        <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-seller">Vendedor*</label>
                                        <input class="form-control" type="text" name="seller" placeholder="Vendedor" required="required" id="bootstrap-wizard-validation-wizard-seller" data-wizard-seller="true">
                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="mb-2">
                                        <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-date-preparation">Fecha de elaboración*</label>
                                        <input class="form-control" type="date" name="date-preparation" placeholder="Fecha de elaboración" required="required" id="bootstrap-wizard-validation-wizard-date-preparation" data-wizard-date-preparation="true">
                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="mb-2">
                                        <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-date-expiry">Fecha de vencimiento*</label>
                                        <input class="form-control" type="date" name="date-expiry" placeholder="Fecha de vencimiento" required="required" id="bootstrap-wizard-validation-wizard-date-expiry" data-wizard-date-expiry="true">
                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-sm-4">
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
                                <div class="col-sm-4">
                                    <div class="mb-2">
                                        <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-authorisation-number">Número de Autorizacion*</label>
                                        <input class="form-control" type="number" name="authorisation-number" placeholder="úmero de Autorizacion" required="required" id="bootstrap-wizard-validation-wizard-authorisation-number" data-wizard-confirm-password="true">
                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
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
                                <div class="col-sm-4">
                                    <div class="mb-2 mb-sm-0">
                                        <label class="form-label text-body" for="bootstrap-wizard-validation-procedure">Procedimiento</label>
                                        <input class="form-control" type="text" name="procedure" placeholder="Procedimiento" id="procedure" required="required">
                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
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
                                </div>
                                <div class="col-sm-4">
                                    <div class="mb-2">
                                        <label class="form-label text-body" for="bootstrap-wizard-validation-wizard-date-expiry">Paciente*</label>
                                        <input class="form-control" type="text" name="date-expiry" placeholder="Fecha de vencimiento" required="required" id="bootstrap-wizard-validation-wizard-date-expiry" data-wizard-date-expiry="true">
                                        <div class="invalid-feedback">El campo es obligatorio</div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
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

