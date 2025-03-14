<div class="modal fade" id="modalVideoConsulta" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Video consulta</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <!-- Agregamos los detalles de la cita -->
                        <div class="mb-3">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Código de sala:</label>
                                        <span id="roomIdText" class="small text-primary">CFHFG65H5GF4H8...</span>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Apertura:</label>
                                        <span class="small">2024-10-03 16:36:56</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Estado:</label>
                                        <span class="small text-success">Abierta</span>
                                    </div>
                                </div>
                            </div>
                            <span class="text-info small">
                                "Esta información junto con el enlace para ingresar a la sala fue enviada por correo electrónico a 
                                <strong class="small">user@test.com</strong> y por WhatsApp a <strong class="small">96385214</strong>"
                            </span>

                            <div class="container mt-4">
                                <div class="row g-2">
                                    <!-- Botón Entrar -->
                                    <div class="col-md-6">
                                        <button class="btn btn-outline-primary w-100 rounded-pill" type="button" id="btnEntrar">
                                            <i class="fas fa-sign-in-alt me-2"></i>Entrar
                                        </button>
                                    </div>

                                    <!-- Botón Finalizar -->
                                    <div class="col-md-6">
                                        <button class="btn btn-outline-danger w-100 rounded-pill" type="button">
                                            <i class="fas fa-times me-2"></i>Finalizar
                                        </button>
                                    </div>

                                    <!-- Botón Copiar enlace de invitación -->
                                    <div class="col-12">
                                        <button class="btn btn-outline-info w-100 rounded-pill" type="button" id="btnCopiar">
                                            <i class="fas fa-link me-2"></i>Copiar enlace de invitación
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button">Okay</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", () => {

        console.log("Script ejecutado");
        // Obtener elementos
        const btnEntrar = document.getElementById("btnEntrar");
        const btnCopiar = document.getElementById("btnCopiar");
        const roomIdText = document.getElementById("roomIdText");

        // Verificar si ya hay un Room ID o generar uno nuevo
        let roomId = roomIdText.textContent.trim();
        if (!roomId || roomId.includes("...")) {
            roomId = Math.random().toString(36).substring(2, 10); // Generar Room ID único
            roomIdText.textContent = roomId; // Mostrar en la interfaz
        }

        // Crear la URL con el roomId
        let salaUrl = `https://dev.monaros.ai/videoLlamada?room=${roomId}`;
        console.log("URL de la sala:", salaUrl); // Para depuración

        // Evento para el botón "Entrar"
        btnEntrar.addEventListener("click", () => {
            window.location.href = salaUrl;
        });

        // Evento para copiar el enlace de la sala
        btnCopiar.addEventListener("click", () => {
            navigator.clipboard.writeText(salaUrl)
                .then(() => alert("Enlace copiado al portapapeles."))
                .catch(err => console.error("Error al copiar:", err));
        });
    });
</script>

