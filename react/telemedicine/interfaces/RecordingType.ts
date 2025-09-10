import { CitaTelemedicina } from "./TelemedicinaTypes";

export interface GrabacionModalProps {
    visible: boolean;
    onHide: () => void;
    cita: CitaTelemedicina | null;
}

export interface Grabacion {
    id: number;
    fecha: string;
    nombre: string;
    archivo: string;
}
