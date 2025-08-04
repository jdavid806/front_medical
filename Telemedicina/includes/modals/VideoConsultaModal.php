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
                                "Esta información junto con el enlace para ingresar a la sala fue enviada por correo
                                electrónico a
                                <strong class="small">user@test.com</strong> y por WhatsApp a <strong
                                    class="small">96385214</strong>"
                            </span>

                            <div class="container mt-4">
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <button class="btn btn-outline-primary w-100 rounded-pill" type="button"
                                            id="btnEntrar">
                                            <i class="fas fa-sign-in-alt me-2"></i>Entrar
                                        </button>
                                    </div>

                                    <div class="col-md-6">
                                        <button class="btn btn-outline-danger w-100 rounded-pill" type="button">
                                            <i class="fas fa-times me-2"></i>Finalizar
                                        </button>
                                    </div>

                                    <div class="col-12">
                                        <button class="btn btn-outline-info w-100 rounded-pill" type="button"
                                            id="btnCopiar">
                                            <i class="fas fa-link me-2"></i>Copiar enlace de invitación
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p id="roomLink" class="mt-3 text-center"></p> <!-- 📌 Agregado para mostrar el enlace -->
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        let roomId = ""; // 📌 Inicializamos roomId
        let userRole = ""; // 📌 Inicializamos userRole

        const socket = io("https://dev.monaros.co", {
            path: "/telemedicina/socket.io",
            transports: ["websocket"],
            query: { roomId, userRole }
        });

        const btnEntrar = document.getElementById("btnEntrar");
        const btnCopiar = document.getElementById("btnCopiar");
        const roomIdText = document.getElementById("roomIdText");
        const roomLinkContainer = document.getElementById("roomLink");

        function createRoom() {
            userRole = "doctor";
            socket.emit("create-room", userRole);
        }

        function joinRoom() {
            const inputRoomId = prompt("🔑 Ingresa el ID de la sala:");
            if (inputRoomId) {
                userRole = "paciente";
                socket.emit("join-room", { roomId: inputRoomId, role: userRole });
            }
        }

        socket.on("room-created", (newRoomId) => {
            roomId = newRoomId; // 📌 Guardamos el nuevo ID de sala
            const roomLink = `${window.location.origin}/videoLlamada?roomId=${roomId}`;
            roomIdText.textContent = roomId;
            roomLinkContainer.innerHTML = `
                <a href="${roomLink}" target="_blank">${roomLink}</a>
                <button onclick="copyToClipboard('${roomLink}')" class="btn btn-sm btn-outline-secondary ms-2">Copiar</button>
            `;
        });

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert("Enlace copiado al portapapeles");
            }).catch(err => console.error("Error al copiar:", err));
        }

        btnEntrar.addEventListener("click", createRoom);
        btnCopiar.addEventListener("click", () => copyToClipboard(window.location.origin + "/videoLlamada?roomId=" + roomId));
    });
</script>
