<div class="modal fade" id="nuevaRemisionModal" tabindex="-1" aria-labelledby="nuevaRemisionModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="nuevaRemisionModalLabel">Nueva Evolución</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formNuevaRemision">
                    <!-- Campo Título -->
                    <div class="mb-3">
                        <label for="tituloRemision" class="form-label">Título</label>
                        <input type="text" class="form-control" id="tituloRemision" placeholder="Ingrese el título de la Remision" required>
                    </div>

                    <!-- Text Area Descripción -->
                    <div class="mb-3">
                        <label for="textAreaRemision" class="form-label">Descripción</label>
                        <textarea class="form-control" id="textAreaRemision" rows="4" placeholder="Describa la Remision del paciente" required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" form="formNuevaRemision" class="btn btn-primary">Guardar Evolución</button>
            </div>
        </div>
    </div>
</div>