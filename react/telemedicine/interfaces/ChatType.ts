export interface ChatProps {
    onNewMessage?: () => void;
}

export interface MensajeChat {
    id: number;
    sender: string;
    message: string;
    time: string;
    isOwn: boolean;
}