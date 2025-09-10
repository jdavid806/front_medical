import { CitaTelemedicina } from "./TelemedicinaTypes";

export interface VideoConsultaModalProps {
    visible: boolean;
    onHide: () => void;
    cita: CitaTelemedicina | null;
}