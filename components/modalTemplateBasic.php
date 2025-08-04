<div class="modal fade" id="modalPlantilla" tabindex="-1" aria-labelledby="modalPlantillaLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalPlantillaLabel">Seleccionar Plantilla</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <select id="plantillaSelect" class="form-select">
                    <option value="">Seleccione una plantilla</option>
                    <option value="Plantilla 1">Plantilla 1</option>
                    <option value="Plantilla 2">Plantilla 2</option>
                    <option value="Plantilla 3">Plantilla 3</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="applyTemplate">Aplicar</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.querySelectorAll('.open-template-modal').forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault();
            const textareaId = this.getAttribute('data-textarea-id');
            const modal = new bootstrap.Modal(document.getElementById('modalPlantilla'));
            document.getElementById('applyTemplate').setAttribute('data-textarea-id', textareaId);
            modal.show();
        });
    });

    document.getElementById('applyTemplate').addEventListener('click', function() {
        const textareaId = this.getAttribute('data-textarea-id');
        const selectedTemplate = document.getElementById('plantillaSelect').value;
        // console.log(textareaId, selectedTemplate);

        if (selectedTemplate && textareaId) {
            tinymce.get(textareaId).setContent(selectedTemplate);
        }
        bootstrap.Modal.getInstance(document.getElementById('modalPlantilla')).hide();
    });
</script>