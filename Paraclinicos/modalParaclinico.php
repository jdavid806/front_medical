<div class="modal fade" id="modalAgregarParaclinico" tabindex="-1" aria-labelledby="modalAgregarParaclinicoLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalAgregarParaclinicoLabel">Nuevo paraclínico</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formAgregarParaclinico">
                    <div class="mb-3">
                        <label for="fecha" class="form-label">Fecha</label>
                        <input type="date" class="form-control" id="fecha">
                    </div>
                    <div class="mb-3">
                        <label for="tipo" class="form-label">Tipo</label>
                        <input type="text" class="form-control" id="tipo">
                    </div>
                    <div class="mb-3">
                        <label for="comentarios" class="form-label">Comentarios (Opcional)</label>
                        <textarea class="form-control" id="comentarios" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="adjunto" class="form-label">Adjuntar resultados de exámenes</label>
                        <input class="form-control" type="file" id="adjunto"
                            accept="image/png, image/jpeg, application/pdf">
                        <small class="text-muted">Haz clic para cargar o arrastra y suelta PNG, JPG o PDF (max.
                            20MB)</small>
                    </div>
                    <div class="mb-3" id="previewContainer" style="display: none;">
                        <label class="form-label">Previsualización:</label>
                        <div id="previewContent"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" id="btnGuardarParaclinico" class="btn btn-primary">Guardar</button>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('adjunto').addEventListener('change', function(event) {
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    const file = event.target.files[0];

    if (file) {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            previewContainer.style.display = 'block';
            if (file.type.startsWith('image/')) {
                previewContent.innerHTML =
                    `<img src="${e.target.result}" alt="Previsualización de imagen" class="img-fluid rounded mt-2">`;
            } else if (file.type === 'application/pdf') {
                previewContent.innerHTML =
                    `<embed src="${e.target.result}" type="application/pdf" class="w-100 mt-2" style="height: 500px;">`;
            } else {
                previewContent.innerHTML =
                    '<p class="text-danger">Formato no soportado para previsualización.</p>';
            }
        };

        fileReader.readAsDataURL(file);
    } else {
        previewContainer.style.display = 'none';
        previewContent.innerHTML = '';
    }
});

document.getElementById('btnGuardarParaclinico').addEventListener('click', function() {
    // console.log('Guardar paraclinico');
    const fecha = document.getElementById('fecha').value;
    const tipo = document.getElementById('tipo').value;
    const comentarios = document.getElementById('comentarios').value;

    let dataParaclinico = {
        date: fecha,
        type: tipo,
        comments: comentarios
    };

    console.log(dataParaclinico);
});
</script>