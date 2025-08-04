<div class="modal fade" id="verificationModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Verificar Medicamento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Información del medicamento seleccionado -->
                <div class="text-center mb-4">
                    <div class="fw-bold mb-2" id="medicamentoNombre">Seleccione un medicamento</div>
                    <div class="text-muted" id="medicamentoDescripcion">Descripción aquí...</div>
                </div>

                <!-- Selector de medicamentos -->
                <div class="mb-4">
                    <label class="form-label">Seleccionar Medicamento</label>
                    <select id="medicamentoSelect" class="form-select"></select>

                </div>

                <!-- Información adicional -->
                <!-- <div class="mb-4">
                    <label class="form-label">Lote</label>
                    <input type="text" class="form-control" id="medicamentoLote" placeholder="Ingresar número de lote">
                </div> -->

                <!-- <div class="mb-4">
                    <label class="form-label">Fecha de vencimiento</label>
                    <input type="date" class="form-control" id="medicamentoFechaVenc">
                </div> -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="verifyButton">Verificar</button>
            </div>
        </div>
    </div>
</div>
