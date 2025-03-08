<div class="modal fade" id="modalBasicTemplate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addConsentModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <form class="needs-validation modal-content" novalidate>
            <div class="modal-header">
                <h5 class="mb-0" id="header-modal-price">Nueva Plantilla</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="col-md-12 row gap-3">
                    <div class="col-md-12 mb-1">
                        <label class="mb-0" for="basicTemplateName">Nombre de la plantilla</label>
                        <input type="text" class="form-control" id="basicTemplateName" required>
                        <div class="invalid-feedback">Por favor ingrese un nombre válido.</div>
                    </div>
                </div>
                <div class="col-md-12 row gap-3">
                    <div class="col-md-12 mb-1">
                        <label class="mb-0" for="price">Contenido</label>
                        <textarea name="content" id="content" class="form-control" rows="6" required></textarea>
                        <div class="invalid-feedback">Por favor ingrese un contenido.</div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION['ID'] ?>">

            <div class="modal-footer">
                <button type="button" class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button type="button" class="btn btn-primary my-0" onclick="onSubmitConsent()" id="button-save-price"><i class="fas fa-bookmark"></i> &nbsp; Crear Plantilla</button>
            </div>
        </form>
    </div>
</div>