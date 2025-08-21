import { EntitiesDTO } from "./entitiesDTO";

export type ToastSeverity =
    | "info"
    | "success"
    | "warn"
    | "error"
    | "secondary"
    | "contrast";

export interface EntitiesConfigTableProps {
    onEditItem?: (id: string) => void;
    entities?: EntitiesDTO[];
    loading?: boolean;
    onDeleteItem?: (id: string) => void;
}

export interface Filtros {
    name: string;
    document_type: string | null;
    city_id: string;
}