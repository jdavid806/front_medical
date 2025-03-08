<?php
include "../menu.php";
include "../header.php";

?>
<div class="content">
    <div class="container-medium">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Facturas de compras</li>
            </ol>
        </nav>
        <div class="d-flex justify-content-between align-items-end mb-4">
            <h2 class="mb-0">Facturas de compras</h2>
            <div><button class="btn btn-phoenix-secondary me-2"><svg class="svg-inline--fa fa-download me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                        <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                    </svg><!-- <span class="fa-solid fa-download me-sm-2"></span> Font Awesome fontawesome.com --><span class="d-none d-sm-inline-block">Descargar Factura</span></button><button class="btn btn-phoenix-secondary"><svg class="svg-inline--fa fa-print me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="print" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                        <path fill="currentColor" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                    </svg><!-- <span class="fa-solid fa-print me-sm-2"></span> Font Awesome fontawesome.com --><span class="d-none d-sm-inline-block">Imprimir</span></button></div>
        </div>
        <div class="bg-body dark__bg-gray-1100 p-4 mb-4 rounded-2">
            <div class="row g-4">
                <div class="col-12 col-lg-3">
                    <div class="row g-4 g-lg-2">
                        <div class="col-12 col-sm-6 col-lg-12">
                            <div class="row align-items-center g-0">
                                <div class="col-auto col-lg-6 col-xl-5">
                                    <h6 class="mb-0 me-3">Factura No :</h6>
                                </div>
                                <div class="col-auto col-lg-6 col-xl-7">
                                    <p class="fs-9 text-body-secondary fw-semibold mb-0">#FLR978282</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-lg-12">
                            <div class="row align-items-center g-0">
                                <div class="col-auto col-lg-6 col-xl-5">
                                    <h6 class="me-3">Fecha de Factura :</h6>
                                </div>
                                <div class="col-auto col-lg-6 col-xl-7">
                                    <p class="fs-9 text-body-secondary fw-semibold mb-0">19.06.2019</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-lg-5">
                    <div class="row g-4 gy-lg-5">
                        <div class="col-12 col-lg-8">
                            <h6 class="mb-2 me-3">Vendido por :</h6>
                            <p class="fs-9 text-body-secondary fw-semibold mb-0">PhoenixMart<br>36 greendowm road, California, Usa</p>
                        </div>
                        <div class="col-12 col-lg-4">
                            <h6 class="mb-2"> PAN No :</h6>
                            <p class="fs-9 text-body-secondary fw-semibold mb-0">XVCJ963782008</p>
                        </div>
                        <div class="col-12 col-lg-4">
                            <h6 class="mb-2"> GST Reg No :</h6>
                            <p class="fs-9 text-body-secondary fw-semibold mb-0">IX9878123TC</p>
                        </div>
                        <div class="col-12 col-lg-4">
                            <h6 class="mb-2"> Orden No :</h6>
                            <p class="fs-9 text-body-secondary fw-semibold mb-0">A-8934792734</p>
                        </div>
                        <div class="col-12 col-lg-4">
                            <h6 class="mb-2"> Fecha de Orden :</h6>
                            <p class="fs-9 text-body-secondary fw-semibold mb-0">19.06.2019</p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-lg-4">
                    <div class="row g-4">
                        <div class="col-12 col-lg-6">
                            <h6 class="mb-2"> Dirección de facturación :</h6>
                            <div class="fs-9 text-body-secondary fw-semibold mb-0">
                                <p class="mb-2">John Doe,</p>
                                <p class="mb-2">36, Gree Donwtonwn,<br>Golden road, FL,</p>
                                <p class="mb-2">johndoe@jeemail.com</p>
                                <p class="mb-0">+334933029030</p>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <h6 class="mb-2"> Dirección de envío :</h6>
                            <div class="fs-9 text-body-secondary fw-semibold mb-0">
                                <p class="mb-2">John Doe,</p>
                                <p class="mb-2">36, Gree Donwtonwn,<br>Golden road, FL,</p>
                                <p class="mb-2">johndoe@jeemail.com</p>
                                <p class="mb-0">+334933029030</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="px-0">
            <div class="table-responsive scrollbar">
                <table class="table fs-9 text-body mb-0">
                    <thead class="bg-body-secondary">
                        <tr>
                            <th scope="col" style="width: 24px;"></th>
                            <th scope="col" style="min-width: 60px;">SL NO.</th>
                            <th scope="col" style="min-width: 360px;">Productos</th>
                            <th class="ps-5" scope="col" style="min-width: 150px;">Color</th>
                            <th scope="col" style="width: 60px;">Tamaño</th>
                            <th class="text-end" scope="col" style="width: 80px;">Cantidad</th>
                            <th class="text-end" scope="col" style="width: 100px;">Precio</th>
                            <th class="text-end" scope="col" style="width: 138px;">Tax Rate</th>
                            <th class="text-center" scope="col" style="width: 80px;">Tipo impuesto</th>
                            <th class="text-end" scope="col" style="min-width: 92px;">Impuesto</th>
                            <th class="text-end" scope="col" style="min-width: 60px;">Total</th>
                            <th scope="col" style="width: 24px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border-0"></td>
                            <td class="align-middle">1</td>
                            <td class="align-middle">
                                <p class="line-clamp-1 mb-0 fw-semibold">Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management &amp; Skin Temperature Trends, Carbon/Graphite, One Size (S &amp; L Bands)</p>
                            </td>
                            <td class="align-middle ps-5">Glossy black</td>
                            <td class="align-middle text-body-tertiary fw-semibold">XL</td>
                            <td class="align-middle text-end text-body-highlight fw-semibold">2</td>
                            <td class="align-middle text-end fw-semibold">$299</td>
                            <td class="align-middle text-end">2.5%</td>
                            <td class="align-middle text-center fw-semibold">VAT</td>
                            <td class="align-middle text-end fw-semibold">$199</td>
                            <td class="align-middle text-end fw-semibold">$398</td>
                            <td class="border-0"></td>
                        </tr>
                        <tr>
                            <td class="border-0"></td>
                            <td class="align-middle">2</td>
                            <td class="align-middle">
                                <p class="line-clamp-1 mb-0 fw-semibold">2021 Apple 12.9-inch iPad Pro (Wi‑Fi, 128GB) - Space Gray</p>
                            </td>
                            <td class="align-middle ps-5">Black</td>
                            <td class="align-middle text-body-tertiary fw-semibold">Pro</td>
                            <td class="align-middle text-end text-body-highlight fw-semibold">1</td>
                            <td class="align-middle text-end fw-semibold">$199</td>
                            <td class="align-middle text-end">2.75%</td>
                            <td class="align-middle text-center fw-semibold">VAT</td>
                            <td class="align-middle text-end fw-semibold">$199</td>
                            <td class="align-middle text-end fw-semibold">$398</td>
                            <td class="border-0"></td>
                        </tr>
                        <tr>
                            <td class="border-0"></td>
                            <td class="align-middle border-0">1</td>
                            <td class="align-middle border-0">
                                <p class="line-clamp-1 mb-0 fw-semibold">PlayStation 5 DualSense Wireless Controller</p>
                            </td>
                            <td class="align-middle ps-5 border-0">White</td>
                            <td class="align-middle text-body-tertiary fw-semibold border-0">Regular</td>
                            <td class="align-middle text-end text-body-highlight fw-semibold border-0">1</td>
                            <td class="align-middle text-end fw-semibold border-0">$185</td>
                            <td class="align-middle text-end border-0">3.5%</td>
                            <td class="align-middle text-center fw-semibold border-0">VAT</td>
                            <td class="align-middle text-end fw-semibold border-0">$199</td>
                            <td class="align-middle text-end fw-semibold border-0">$398</td>
                            <td class="border-0"></td>
                        </tr>
                        <tr class="bg-body-secondary">
                            <td></td>
                            <td class="align-middle fw-semibold" colspan="9">Subtotal</td>
                            <td class="align-middle text-end fw-bold">$398</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="border-0"></td>
                            <td colspan="6"></td>
                            <td class="align-middle fw-bold ps-15" colspan="2">Gastos de envío</td>
                            <td class="align-middle text-end fw-semibold" colspan="2">$50</td>
                            <td class="border-0"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="6"></td>
                            <td class="align-middle fw-bold ps-15" colspan="2">Descuento/Vale</td>
                            <td class="align-middle text-end fw-semibold text-danger" colspan="2">-$50</td>
                            <td></td>
                        </tr>
                        <tr class="bg-body-secondary">
                            <td class="align-middle ps-4 fw-bold text-body-highlight" colspan="3">Total general</td>
                            <td class="align-middle fw-bold text-body-highlight" colspan="7">Trescientos noventa y ocho USD</td>
                            <td class="align-middle text-end fw-bold">$398</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="text-end py-9 border-bottom"><img class="mb-3" src="../../../assets/img/logos/phoenix-mart.png" alt="">
                <h4>Firmante autorizado</h4>
            </div>
            <div class="text-center py-4 mb-9">
                <p class="mb-0">Thank you for buying with Phoenix | 2022 © <a href="https://themewagon.com/">Themewagon</a></p>
            </div>
        </div>
        <div class="d-flex justify-content-between"><button class="btn btn-primary"><svg class="svg-inline--fa fa-bag-shopping me-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bag-shopping" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                    <path fill="currentColor" d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path>
                </svg><!-- <span class="fa-solid fa-bag-shopping me-2"></span> Font Awesome fontawesome.com -->Ver más artículos</button>
            <div><button class="btn btn-phoenix-secondary me-2"><svg class="svg-inline--fa fa-download me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                        <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                    </svg><!-- <span class="fa-solid fa-download me-sm-2"></span> Font Awesome fontawesome.com --><span class="d-none d-sm-inline-block">Descargar Factura</span></button><button class="btn btn-phoenix-secondary"><svg class="svg-inline--fa fa-print me-sm-2" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="print" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                        <path fill="currentColor" d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
                    </svg><!-- <span class="fa-solid fa-print me-sm-2"></span> Font Awesome fontawesome.com --><span class="d-none d-sm-inline-block">Imprimir</span></button></div>
        </div>
    </div>
</div>

<?php include "../footer.php"; ?>