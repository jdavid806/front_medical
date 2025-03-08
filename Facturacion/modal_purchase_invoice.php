<link rel="stylesheet" href="/ventasPet/Facturacion/styles/dynamic_forms.css">
<div class="modal fade modal-xl" id="modalPurchaseInvoice" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nueva Factura de compras</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body modal-steps">
                <div class="steps-container form_config_purchase_invoice_v2_steps mb-4">
                </div>

                <form id="formInvoice" class="needs-validation form_config_purchase_invoice_v2" novalidate>

                    <div class="wizard-content form_config_purchase_invoice_v2">
                    </div>

                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="wizardForm">Finalizar</button>
            </div>
        </div>
    </div>
</div>

<script>
</script>