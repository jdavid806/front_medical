<?php
include "./includes/modals/FacturaElectronica.php";
?>
<div class="modal fade" id="modalTipoFactura" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addVacacionesModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content bg-body-highlight p-6">
            <div class="modal-header justify-content-center border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-Authv2"><i class="fas fa-file-signature"></i> Tipo de Facturación</h3>
                <button class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>

            <div class="modal-footer border-0 pt-6 px-0 pb-0 justify-content-center">
                <div class="d-flex justify-content-center w-100">
                    <button class="btn btn-primary mx-2 my-0" id="button-save-normal"><i class="fas fa-bookmark"></i> &nbsp; Normal</button>
                    <button class="btn btn-info mx-2 my-0" id="button-save-salud" data-bs-toggle="modal" data-bs-target="#invoiceElectronicModal"><i class="fas fa-bookmark"></i> &nbsp; Facturación Electronica</button>



                    <!-- <button id="generateNoteCreditBtn" class="btn btn-success">Generar Nota de Credito</button>

                    <button id="generateNoteDebitBtn" class="btn btn-success">Generar Nota de Débito</button> -->
                </div>
            </div>
        </div>
    </div>
</div>

<input type="hidden" id="facturaType" value="">

<script>
    function setFacturaType(value) {
        document.getElementById('facturaType').value = value;
        document.getElementById('facturaTypeModal').value = value; // Pasar el valor al modal
        // Cerrar el modal actual (puedes usar el ID del modal actual o una clase común)
        $('#modalTipoFactura').modal('hide');
        // Aquí puedes agregar el código para abrir otro modal si es necesario
        if (value === 1 || value === 2) {
            $('#modalNuevaFacturaCliente').modal('show');
        }
    }

    
</script>