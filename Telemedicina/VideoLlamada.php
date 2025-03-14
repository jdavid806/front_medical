<style>
    :root {
        --meet-dark: #202124;
        --meet-red: #ea4335;
        --meet-purple: #673ab7;
        --controls-bg: rgba(32, 33, 36, 0.95);
        --sidebar-width: 320px;
    }

    body {
        margin: 0;
        padding: 0;
        background-color: var(--meet-dark);
        color: white;
        font-family: 'Google Sans', Roboto, Arial, sans-serif;
        height: 100vh;
        overflow: hidden;
    }

    .main-container {
        height: 100vh;
        position: relative;
    }

    /* Área central con avatar */
    .center-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 80px);
    }

    .avatar-container {
        width: 200px;
        height: 200px;
        background-color: var(--meet-purple);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 72px;
        right: 130px;
        position: relative;
    }

    .avatar-controls {
        position: absolute;
        bottom: -10px;
        right: -10px;
        display: flex;
        gap: 4px;
    }

    .avatar-control-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(32, 33, 36, 0.8);
        border: none;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    /* Información inferior */
    .bottom-info {
        position: absolute;
        bottom: 100px;
        left: 24px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .meeting-code {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
    }

    /* Barra de controles */
    .controls-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 700px;
        height: 80px;
        background-color: var(--controls-bg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
    }

    .control-group {
        display: flex;
        gap: 8px;
    }

    .control-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .control-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .control-button.red {
        background-color: var(--meet-red);
    }

    /* Panel lateral de chat */
    .chat-panel {
        position: fixed;
        right: 0;
        top: 0;
        width: var(--sidebar-width);
        height: 100vh;
        background-color: white;
        color: #202124;
        display: flex;
        flex-direction: column;
    }

    .chat-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dadce0;
    }

    .chat-title {
        font-size: 16px;
        font-weight: 500;
    }

    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
    }

    .chat-settings {
        padding: 16px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dadce0;
    }

    .settings-text {
        color: #5f6368;
        font-size: 14px;
        text-align: center;
        margin: 8px 0;
    }

    .chat-input-container {
        margin-top: auto;
        padding: 16px;
        border-top: 1px solid #dadce0;
    }

    .chat-input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #f8f9fa;
        border-radius: 24px;
        padding: 8px 16px;
    }

    .chat-input {
        flex: 1;
        border: none;
        background: none;
        outline: none;
        padding: 8px;
        color: #202124;
    }

    .send-button {
        background: none;
        border: none;
        color: #1a73e8;
        cursor: pointer;
    }

    /* Toggle switch */
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 24px;
        float: right;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked+.slider {
        background-color: #1a73e8;
    }

    input:checked+.slider:before {
        transform: translateX(16px);
    }

    .fas fa-phone{
        color: white;
    }

    /* .local-video {
        background-color: #ea4335;

    }

    .remote-video {
        background-color: #4285f4;
    } */
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"></script>
<div class="main-container">
    <!-- Contenido central -->
    <div class="center-content">
        <div class="video-container">
            <video id="localVideo" class="local-video" autoplay muted></video>
            <video id="remoteVideo" class="remote-video" autoplay></video>
        </div>
    </div>



    <!-- Información inferior -->
    <div class="bottom-info">
        <div class="user-name">Deiby Potosí</div>
        <div class="meeting-code">swu-fgwj-fev</div>
    </div>

    <!-- Barra de controles -->
    <div class="controls-bar mt-4">
        <div class="control-group">
            <button class="control-button" title="Toggle microphone" onclick="toggleMic()">
                <i class="fas fa-microphone"></i>
            </button>
            <button class="control-button" title="Toggle camera" onclick="toggleCam()"> 
                <i class="fas fa-video"></i>
            </button>
        </div>

        <div class="control-group">
            <button class="control-button" title="Raise hand">
                <i class="fas fa-hand-paper">
                    <button id="startCall" class="control-button" title="Iniciar llamada">
                        <i class="fas fa-phone"></i> Iniciar llamada
                    </button>
                </i>
            </button>
            <button class="control-button" title="Share screen">
                <i class="fas fa-share-square"></i>
            </button>
            <button class="control-button" title="More options">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <button class="control-button" title="Grid view">
                <i class="fas fa-th"></i>
            </button>
            <button class="control-button" title="Chat">
                <i class="fas fa-comment-alt"></i>
            </button>
            <button class="control-button" title="Participants">
                <i class="fas fa-users"></i>
            </button>
            <button class="control-button red" title="End call">
                <i class="fas fa-phone-slash"></i>
            </button>
        </div>
    </div>


    <!-- Panel lateral de chat -->
    <div class="chat-panel">
        <!-- Cabecera del chat -->
        <div class="chat-header">
            <span class="chat-title">Mensajes en la llamada</span>
            <button class="close-button" onclick="toggleChat()">
                <i class="fas fa-times"></i>
            </button>
        </div>


        <!-- Área de mensajes -->
        <div class="chat-messages" id="chatMessages"></div>

        <!-- Entrada de chat -->
        <div class="chat-input-container">
            <div class="chat-input-wrapper">
                <input type="text" id="chatInput" class="chat-input" placeholder="Envía un mensaje a todos">
                <button class="send-button" onclick="sendMessage()" id="sendButton">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>

    </div>


</div>


<script>
const socket = io("https://dev.medicalsoft.ai", {
    path: "/telemedicina/socket.io",
    transports: ["websocket"]
});


    const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");
    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.getElementById("remoteVideo");
    const startCallBtn = document.getElementById("startCall");


    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get("roomId");

    socket.emit("join-room", roomId); // ✅ Unirse a la sala
    console.log("📢 Te uniste a la sala:", roomId);

    let localStream;

    async function getMedia() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            console.log("🎥 Cámara y micrófono activados");
        } catch (error) {
            console.error("❌ Error al obtener la cámara/micrófono:", error);
        }
    }

    getMedia(); // Iniciar la cámara al cargar

    // 📡 Evento cuando se recibe el stream remoto
    peerConnection.ontrack = event => {
        if (!remoteVideo.srcObject) {
            remoteVideo.srcObject = event.streams[0];
            console.log("📡 Stream remoto recibido");
        }
    };

    // 🧊 Manejo de ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log("📤 Enviando candidato ICE:", event.candidate);
            socket.emit("candidate", { roomId, candidate: event.candidate });
        }
    };

    
    peerConnection.onconnectionstatechange = () => {
        console.log("🔗 Estado de conexión WebRTC:", peerConnection.connectionState);
    };

    
    startCallBtn.addEventListener("click", async () => {
        console.log("📞 Iniciando llamada...");
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer }); // ✅ Ahora incluye roomId
        console.log("📤 Oferta enviada:", offer);
    });

        socket.on("offer", async offer => {
        console.log("Oferta recibida:", offer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer }); // ✅ Ahora incluye roomId
        console.log("Respuesta enviada:", answer);
    });

    // 📩 Recibir respuesta
    socket.on("answer", async answer => {
        console.log("📩 Respuesta recibida:", answer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // 📩 Recibir candidatos ICE
    socket.on("candidate", async candidate => {
        console.log("📩 Candidato ICE recibido:", candidate);
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error("❌ Error al agregar candidato ICE:", error);
        }
    });

 
    socket.on("receive-message", ({ message, user }) => {
        console.log("📩 Nuevo mensaje recibido:", message, "de", user);

        if (!chatMessages) {
            console.error("❌ No se encontró el contenedor chatMessages");
            return;
        }


        chatMessages.innerHTML += `
            <div class="chat-message">
                <strong>${user}:</strong> ${message}
            </div>`;
        
        scrollToBottom();
    });


    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        socket.emit("send-message", { roomId, message, user: socket.id });
        console.log("📤 Mensaje enviado:", message);

 
        chatMessages.innerHTML += `
            <div class="chat-message self">
                <strong>Tú:</strong> ${message}
            </div>`;
        
        chatInput.value = "";
        scrollToBottom();
    }

  
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatInput) {
        chatInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });
    }
</script>

