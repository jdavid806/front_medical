import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useSocket } from '../hooks/useSocket';
import Chat from './Chat';

export const VideoCall: React.FC = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [chatVisible, setChatVisible] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const toast = useRef<Toast>(null);
    const socket = useSocket();

    useEffect(() => {
        const configuration = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" }
            ]
        };

        const pc = new RTCPeerConnection(configuration);
        peerConnectionRef.current = pc;

        // Manejar tracks remotos
        pc.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            }
        };

        // Manejar candidatos ICE
        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit('ice-candidate', event.candidate);
            }
        };

        return () => {
            pc.close();
        };
    }, []);

    // Configurar medios locales
    useEffect(() => {
        const setupMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Agregar tracks a la conexión peer
                if (peerConnectionRef.current) {
                    stream.getTracks().forEach(track => {
                        peerConnectionRef.current!.addTrack(track, stream);
                    });
                }
            } catch (error) {
                console.error('Error accediendo a medios:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo acceder a la cámara/micrófono'
                });
            }
        };

        setupMedia();
    }, []);

    // Configurar eventos de socket
    useEffect(() => {
        if (!socket) return;

        socket.on('offer', async (offer) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(offer);
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit('answer', answer);
            }
        });

        socket.on('answer', async (answer) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(answer);
            }
        });

        socket.on('ice-candidate', async (candidate) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(candidate);
            }
        });

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    }, [socket]);

    const createOffer = async () => {
        if (peerConnectionRef.current && socket) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit('offer', offer);
        }
    };

    const toggleMute = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!track.enabled);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOn(!track.enabled);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (isScreenSharing) {
                // Volver a la cámara normal
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (peerConnectionRef.current) {
                    const videoTrack = stream.getVideoTracks()[0];
                    const sender = peerConnectionRef.current.getSenders().find(
                        s => s.track && s.track.kind === 'video'
                    );

                    if (sender) {
                        await sender.replaceTrack(videoTrack);
                    }

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }

                    setLocalStream(stream);
                }

                setIsScreenSharing(false);
            } else {
                // Compartir pantalla
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

                if (peerConnectionRef.current) {
                    const videoTrack = screenStream.getVideoTracks()[0];
                    const sender = peerConnectionRef.current.getSenders().find(
                        s => s.track && s.track.kind === 'video'
                    );

                    if (sender) {
                        await sender.replaceTrack(videoTrack);
                    }

                    if (screenVideoRef.current) {
                        screenVideoRef.current.srcObject = screenStream;
                    }
                }

                setIsScreenSharing(true);

                // Cuando se deje de compartir pantalla
                screenStream.getVideoTracks()[0].onended = () => {
                    toggleScreenShare();
                };
            }
        } catch (error) {
            console.error('Error compartiendo pantalla:', error);
        }
    };

    const leaveCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        // Lógica para salir de la llamada
        if (socket) {
            socket.emit('leave-call');
        }
    };

    // Actualizar hora cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const toggleChat = () => {
        setChatVisible(!chatVisible);
        if (chatVisible) {
            setUnreadMessages(0);
        }
    };

    return (
        <div className="video-llamada-container">
            <Toast ref={toast} />

            <Card className="video-section">
                <div className="flex justify-content-between align-items-center p-3 border-bottom-1 surface-border">
                    <div>
                        <div className="text-xl font-bold">Video Llamada</div>
                        <div className="text-color-secondary">{time}</div>
                    </div>
                    <div>
                        <Button
                            icon={chatVisible ? "pi pi-comments" : "pi pi-comment"}
                            className="p-button-text"
                            onClick={toggleChat}
                            badge={unreadMessages > 0 ? unreadMessages.toString() : null}
                        />
                    </div>
                </div>

                <div className="video-container p-4">
                    <div className="main-video">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full border-round"
                        />
                        <div className="user-info">Usuario Remoto</div>
                    </div>

                    <div className="pip-video">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full border-round"
                        />
                        <div className="user-info">Tú</div>
                    </div>

                    {/* Video de pantalla compartida (oculto) */}
                    <video
                        ref={screenVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="hidden"
                    />

                    <div className="footer-controls flex justify-content-center gap-2 mt-4">
                        <Button
                            icon={isMuted ? "pi pi-microphone-slash" : "pi pi-microphone"}
                            className="p-button-rounded"
                            onClick={toggleMute}
                            tooltip={isMuted ? "Activar micrófono" : "Desactivar micrófono"}
                        />
                        <Button
                            icon={isVideoOn ? "pi pi-video" : "pi pi-video-slash"}
                            className="p-button-rounded"
                            onClick={toggleVideo}
                            tooltip={isVideoOn ? "Apagar cámara" : "Encender cámara"}
                        />
                        <Button
                            icon="pi pi-desktop"
                            className={`p-button-rounded ${isScreenSharing ? 'p-button-success' : ''}`}
                            onClick={toggleScreenShare}
                            tooltip={isScreenSharing ? "Dejar de compartir" : "Compartir pantalla"}
                        />
                        <Button
                            icon="pi pi-phone"
                            className="p-button-rounded p-button-danger"
                            onClick={leaveCall}
                            tooltip="Finalizar llamada"
                        />
                    </div>
                </div>
            </Card>

            <Dialog
                visible={chatVisible}
                onHide={() => setChatVisible(false)}
                position="right"
                style={{ width: '350px', height: '100vh' }}
                className="chat-dialog"
                showHeader={false}
                dismissableMask
            >
                <Chat onNewMessage={() => setUnreadMessages(prev => prev + 1)} />
            </Dialog>
        </div>
    );
};

