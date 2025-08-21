export interface EntitieConfigModalProps {
    isVisible: boolean;
    onSave: (data: any) => Promise<void>;
    initialData?: any;
    onClose: () => void;
    closable?: boolean;
    loading?: boolean;
}