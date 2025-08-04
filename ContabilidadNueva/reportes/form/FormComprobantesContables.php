<?php
include "../../../menu.php";
include "../../../header.php";


?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Crear Comprobante Contable</li>
            </ol>
        </nav>
        <div class="container">
            <div className="container-fluid p-4">
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h1 className="h3 mb-0 text-primary">
                                    <i className="pi pi-file-edit me-2"></i>
                                    Crear nuevo comprobante contable
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="crearComprobanteContables"></div>
            </div>
        </div>
    </div>

    <script type="module">
        import React from "react"
        import ReactDOMClient from "react-dom/client"
        import {
            FormAccoutingVouchers
        } from './react-dist/billing/reports/form/FormAccoutingVouchers.js';

        ReactDOMClient.createRoot(document.getElementById('crearComprobanteContables')).render(React.createElement(FormAccoutingVouchers));
    </script>



    <?php include "../../../footer.php"; ?>