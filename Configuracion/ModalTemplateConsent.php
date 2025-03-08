<div class="modal fade" id="modalTemplateConsent" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addConsentModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <form class="needs-validation modal-content bg-body-highlight p-6" novalidate>
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-price">Nuevo Plantilla - Consentimiento</h3>
                <button type="button" class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">
                    <div class="row gap-2">
                        <div class="col-auto field"> <span required="">[[NOMBRE_PACIENTE]]</span>
                            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[DOCUMENTO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[NOMBRE_DOCTOR]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[EDAD]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[FECHAACTUAL]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[FECHANACIMIENTO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[TELEFONO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[CORREOELECTRONICO]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                        <div class="col-auto field"> <span>[[CIUDAD]]</span> <button type="button" class="btn btn-outline-secondary btn-sm" onclick="showMessage(this)"><i class="far fa-copy"></i></button>
                            <div class="valid-feedback">Elemento copiado</div>
                        </div>
                    </div>
                    <div class="pagina col-md-12 row gap-3">
                        <div class="col-md-12 mb-1">
                            <label class="mb-0" for="price">Título</label>
                            <input type="text" class="form-control" placeholder="Título">
                            <div class="invalid-feedback">Por favor ingrese un título válido.</div>
                        </div>
                    </div>
                    <div class="pagina col-md-12 row gap-3">
                        <div class="col-md-12 mb-1">
                            <label class="mb-0" for="price">Descripcion</label>
                            <textarea name="descriptionTemplate" id="descriptionTemplate" class="form-control"></textarea>
                            <div class="invalid-feedback">Por favor ingrese una descripcion válida.</div>
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION['ID'] ?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button type="button" class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button type="button" class="btn btn-primary my-0" onclick="onSubmitTemplateConsent()" id="button-save-price"><i class="fas fa-bookmark"></i> &nbsp; Crear Consentimiento</button>
            </div>
        </form>
    </div>
</div>


<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6.3.1-12/skins/ui/oxide/skin.min.css" referrerpolicy="origin"></script>

<script type="module">
    import {
        templateService,
    } from './services/api/index.js';

    function showMessage(button) {
        // Buscar el div de valid-feedback que está asociado al botón presionado
        var messageDiv = button.parentElement.querySelector('.valid-feedback');

        // Mostrar el mensaje y cambiar su color
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'green';

        // Opcional: Ocultar el mensaje después de 2 segundos
        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 2000);
    }
    document.addEventListener("DOMContentLoaded", function() {
        tinymce
            .init({
                selector: "#descriptionTemplate",
                plugins: "table code advtable lists fullscreen",
            })
            .then((editors) => console.log("Inicialización exitosa"))
            .catch((error) => console.error("Error:", error));

        document.querySelectorAll(".field button").forEach(button => {
            button.addEventListener("click", function() {
                let text = this.previousElementSibling.textContent.trim();
                navigator.clipboard.writeText(text).then(() => {
                    console.log("Texto copiado: ", text);
                }).catch(err => {
                    console.error("Error al copiar: ", err);
                });
            });
        });
    });
</script>