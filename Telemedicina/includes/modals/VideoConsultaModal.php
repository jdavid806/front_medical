
<div class="modal fade" id="modalVideoConsulta" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Video consulta</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Código de sala:</label>
                                        <span class="small" id="roomIdText">Generando...</span>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Apertura:</label>
                                        <span class="small">2024-10-03 16:36:56</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-2">
                                        <label class="form-label fw-bold">Estado:</label>
                                        <span class="small">Abierta</span>
                                    </div>
                                </div>
                            </div>
                            <span class="text text-info small">"Esta información junto con el enlace para ingresar a la
                                sala fue enviada por correo electrónico a <strong class="small">user@test.com</strong> y
                                por WhatsApp a <strong class="small">96385214</strong>"</span>

                            <div class="container mt-4">
                                <div class="row g-2">
                                    <!-- Botón Entrar -->
                                    <div class="col-md-6">
                                        <button class="btn btn-outline-primary w-100 rounded-pill" id="btnEntrar">
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
                                        <button class="btn btn-outline-info w-100 rounded-pill" id="btnCopiar">
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
                <button class="btn btn-primary" type="button">Aceptar</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"></script>
<script>
    const socket = io("http://consultorio2.medicalsoft.ai", {
        path: "/telemedicina/socket.io",
        transports: ["websocket"]
    });

    // Cuando se abre el modal, se genera una sala si es un doctor
    document.getElementById("modalVideoConsulta").addEventListener("show.bs.modal", () => {
        const role = "doctor"; 
        socket.emit("create-room", role);
        document.getElementById("roomIdText").textContent = "Generando...";
    });

    // Escuchar cuando se crea la sala
    socket.on("room-created", (roomId) => {
        console.log("🆕 Sala creada con ID:", roomId);
        
        // Actualizar el texto del código de sala en el modal
        document.getElementById("roomIdText").textContent = roomId;

        // Generar enlace de la sala
        const roomLink = `${window.location.origin}/videoLlamada?roomId=${roomId}`;

        // Configurar botón de entrar
        document.getElementById("btnEntrar").onclick = () => {
            window.open(roomLink, "_blank");
        };

        // Configurar botón de copiar enlace
        document.getElementById("btnCopiar").onclick = () => copyToClipboard(roomLink);
    });

    // Función para copiar enlace al portapapeles
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("✅ Enlace copiado al portapapeles");
        }).catch(err => {
            console.error("❌ Error al copiar:", err);
        });
    }
</script>

