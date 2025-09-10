import { Nullable } from "primereact/ts-helpers";

export interface ReporteModalProps {
    visible: boolean;
    onHide: () => void;
}

export interface FiltrosReporte {
    fechaDesde: Nullable<Date>;
    fechaHasta: Nullable<Date>;
    tipoReporte: string;
    formato: string;
}