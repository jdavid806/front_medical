<?php
include "../../menu.php";
include "../../header.php";
?>

<style>
    /* Estilos generales para el contenedor principal */
    .componente .content {
        max-width: 100%;
        width: 100%;
        margin: 0 auto;
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
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="FE_FCE">Facturacion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Ordenes De Compra</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="FormPuchaseOrders"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        FormPurchaseOrders
    } from './react-dist/invoices/form/FormPurchaseOrdersV2.js';
    import {
        thirdPartyService
    } from "./services/api/index.js";

    const patientId = new URLSearchParams(window.location.search).get('patient_id')

    let formPurchaseOrderProps = {}

    if (patientId) {
        const patientThirdParty = await thirdPartyService.getByExternalIdAndType({
            externalId: patientId,
            externalType: "client"
        });

        formPurchaseOrderProps.dataToEdit = {
            third_id: patientThirdParty.id,
            type: "quote_of"
        }

        formPurchaseOrderProps.fieldsConfig = {
            supplier: {
                disabled: true
            },
            type: {
                disabled: true
            }
        }

        formPurchaseOrderProps.title = "Crear Cotización | " + patientThirdParty.name
    }

    ReactDOMClient.createRoot(document.getElementById('FormPuchaseOrders')).render(
        React.createElement(FormPurchaseOrders, formPurchaseOrderProps)
    );
</script>
<?php
include "../../footer.php";
?>