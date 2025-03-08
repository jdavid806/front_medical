<div class="modal fade" id="modalSignature" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalSignatureModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <form class="needs-validation modal-content bg-body-highlight p-6" novalidate>
            <div class="modal-header justify-content-between border-0 p-0 mb-2">
                <h3 class="mb-0" id="header-modal-signature">Añadir firma</h3>
                <button type="button" class="btn btn-sm btn-phoenix-secondary" data-bs-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times text-danger"></i>
                </button>
            </div>
            <div class="modal-body px-0">
                <div id="contenido-pagina">

                    <label for="selectFirma">Seleccione una opción:</label>
                    <select id="selectFirma" class="form-control" onchange="cambiarMetodoFirma()">
                        <option value="">Seleccione</option>
                        <option value="cargar">Cargar firma</option>
                        <option value="dibujar">Dibujar firma</option>
                    </select>
                    <div id="firmaContainer" class="mt-3">
                        <input type="file" id="firmaFile" class="form-control" accept="image/*" style="display: none;">
                        <div id="firmaCanvasContainer" style="display: none;" class="text-end">
                            <canvas id="firmaCanvas" class="w-100" height="100" style="border:1px solid #000;"></canvas>
                            <button type="button" class="btn btn-danger mt-2" onclick="limpiarCanvas()">Borrar</button>
                        </div>
                    </div>

                </div>
            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION['ID'] ?>">

            <div class="modal-footer border-0 pt-6 px-0 pb-0">
                <button type="button" class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button type="button" class="btn btn-primary my-0" onclick="onSubmitTemplateConsent()" id="button-save-price"><i class="fas fa-bookmark"></i> &nbsp; Crear Firma</button>
            </div>
        </form>
    </div>
</div>


<script>
    function cambiarMetodoFirma() {
        let firmaFile = document.getElementById("firmaFile");
        let firmaCanvasContainer = document.getElementById("firmaCanvasContainer");
        let seleccion = document.getElementById("selectFirma").value;

        firmaFile.style.display = "none";
        firmaCanvasContainer.style.display = "none";

        if (seleccion === "cargar") {
            firmaFile.style.display = "block";
        } else if (seleccion === "dibujar") {
            firmaCanvasContainer.style.display = "block";
            inicializarCanvas();
        }
    }

    function inicializarCanvas() {
        let canvas = document.getElementById("firmaCanvas");
        let ctx = canvas.getContext("2d");
        let dibujando = false;

        // Ajustar el tamaño real del canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = 200;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.lineCap = "round";

        canvas.addEventListener("mousedown", function(e) {
            dibujando = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });

        canvas.addEventListener("mousemove", function(e) {
            if (dibujando) {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
        });

        canvas.addEventListener("mouseup", function() {
            dibujando = false;
        });

        canvas.addEventListener("mouseleave", function() {
            dibujando = false;
        });
    }

    function limpiarCanvas() {
        let canvas = document.getElementById("firmaCanvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
</script>