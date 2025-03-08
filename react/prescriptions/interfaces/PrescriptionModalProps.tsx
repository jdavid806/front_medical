interface PrescriptionModalProps {
    show: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onHide?: () => void;
}
