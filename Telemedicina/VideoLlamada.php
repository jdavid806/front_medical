<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Video Llamada</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href = "./Telemedicina/styles/videoLLamada.css"
</head>
<body>
    <!-- App Container -->
    <div class="app-container">
        <div class="main-wrapper">
            <!-- Video Section -->
            <div class="video-section">
                <!-- Header -->
                <header class="header">
                    <div class="d-flex align-items-center">
                        <div class="ms-2">
                            <div class="meeting-info">Video Llamada</div>
                            <div class="time-info">12:07 PM</div>
                        </div>
                    </div>
                    <div class="header-controls">                       
                        <button class="chat-toggle-btn" id="chatToggleBtn" title="Toggle chat">
                            <i class="fas fa-comment-alt"></i>
                        </button>
                    </div>
                </header>

                <!-- Video Container -->
                <div class="video-container">
                    <!-- Main Video -->
                    <div class="main-video">
                        <div class="video-wrapper">
                            <div class="video-placeholder">
                                <i class="fas fa-user-circle fa-5x mb-2"></i>
                                <div>Usuario Remoto</div>
                            </div>
                            <div class="user-info">Usuario Remoto</div>
                        </div>
                    </div>

                    <!-- PIP Video -->
                    <div class="pip-video">
                        <div class="video-wrapper">
                            <div class="video-placeholder">
                                <i class="fas fa-user-circle fa-2x"></i>
                                <div style="font-size: 12px;">Tú</div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Controls -->
                    <div class="footer-controls">
                        <button class="control-btn" id="startCallBtn" title="Start Call">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="control-btn" id="muteBtn" title="Mute microphone">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <button class="control-btn" id="videoBtn" title="Turn off camera">
                            <i class="fas fa-video"></i>
                        </button>
                        <button class="control-btn" title="Present now">
                            <i class="fas fa-desktop"></i>
                        </button>             
                        <button class="control-btn danger" title="Leave call">
                            <i class="fas fa-phone-slash"></i>
                        </button>
                    </div>
                    
                    <!-- Chat Floating Button for Mobile -->
                    <button class="chat-float-btn" id="mobileChatBtn">
                        <i class="fas fa-comment-alt"></i>
                        <span class="badge">3</span>
                    </button>
                </div>
            </div>

            <!-- Chat Section for Desktop -->
            <div class="chat-section">
                <div class="chat-header">
                    <h5 class="mb-0">Mensajes</h5>
                    <button class="btn btn-sm text-white" id="closeChatBtnDesktop">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-messages">
                    <div class="message message-received">
                        <div class="message-sender">Usuario Remoto</div>
                        <div>Hola, ¿cómo estás?</div>
                        <div class="message-time">12:05 PM</div>
                    </div>
                    <div class="message message-received">
                        <div class="message-sender">Sistema de Seguridad</div>
                        <div>Reunión protegida</div>
                        <div class="message-time">12:06 PM</div>
                    </div>
                    <div class="message message-received">
                        <div class="message-sender">Seleccionar</div>
                        <div>Por favor selecciona una opción</div>
                        <div class="message-time">12:06 PM</div>
                    </div>
                </div>
                
                <div class="chat-input">
                    <input type="text" class="input-message" placeholder="Escribe un mensaje...">
                    <button class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Chat Container for Mobile -->
        <div class="chat-container-mobile" id="chatContainerMobile">
            <div class="chat-header">
                <h5 class="mb-0">Mensajes</h5>
                <button class="btn btn-sm text-white" id="closeChatBtnMobile">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages">
                <div class="message message-received">
                    <div class="message-sender">Usuario Remoto</div>
                    <div>Hola, ¿cómo estás?</div>
                    <div class="message-time">12:05 PM</div>
                </div>
                <div class="message message-received">
                    <div class="message-sender">Sistema de Seguridad</div>
                    <div>Reunión protegida</div>
                    <div class="message-time">12:06 PM</div>
                </div>
                <div class="message message-received">
                    <div class="message-sender">Seleccionar</div>
                    <div>Por favor selecciona una opción</div>
                    <div class="message-time">12:06 PM</div>
                </div>
            </div>
            
            <div class="chat-input">
                <input type="text" class="input-message" placeholder="Escribe un mensaje...">
                <button class="send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const mobileChatBtn = document.getElementById('mobileChatBtn');
            const chatContainerMobile = document.getElementById('chatContainerMobile');
            const closeChatBtnMobile = document.getElementById('closeChatBtnMobile');
            const muteBtn = document.getElementById('muteBtn');
            const videoBtn = document.getElementById('videoBtn');
            
            // First, set the correct viewport height
            function setAppHeight() {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
            
            // Call on initial load
            setAppHeight();
            
            // Reset on resize (but with debouncing)
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(setAppHeight, 250);
            });
            
            // Toggle chat on mobile
            if (mobileChatBtn && chatContainerMobile) {
                mobileChatBtn.addEventListener('click', function() {
                    chatContainerMobile.classList.add('active');
                });
            }
            
            if (closeChatBtnMobile && chatContainerMobile) {
                closeChatBtnMobile.addEventListener('click', function() {
                    chatContainerMobile.classList.remove('active');
                });
            }
            
            // Toggle mute state
            if (muteBtn) {
                muteBtn.addEventListener('click', function() {
                    this.classList.toggle('muted');
                    const icon = this.querySelector('i');
                    if (this.classList.contains('muted')) {
                        icon.classList.remove('fa-microphone');
                        icon.classList.add('fa-microphone-slash');
                    } else {
                        icon.classList.remove('fa-microphone-slash');
                        icon.classList.add('fa-microphone');
                    }
                });
            }
            
            // Toggle video state
            if (videoBtn) {
                videoBtn.addEventListener('click', function() {
                    this.classList.toggle('muted');
                    const icon = this.querySelector('i');
                    if (this.classList.contains('muted')) {
                        icon.classList.remove('fa-video');
                        icon.classList.add('fa-video-slash');
                    } else {
                        icon.classList.remove('fa-video-slash');
                        icon.classList.add('fa-video');
                    }
                });
            }
            
            // Prevent zoom on iOS
            document.addEventListener('touchmove', function (event) {
                if (event.scale !== 1) {
                    event.preventDefault();
                }
            }, { passive: false });
            
            // Ensure controls are visible on mobile
            if (window.innerWidth <= 768) {
                setTimeout(function() {
                    window.scrollTo(0, 1);
                }, 100);
            }
        });
    </script>
</body>
</html>

<script src="./Telemedicina/scripts/config.js"></script>
<script src="./Telemedicina/scripts/chat.js"></script>
<script src="./Telemedicina/scripts/videoLLamada.js"></script>