import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import AccountingClosingForm from "../form/AccountingClosingForm";

interface AccountingClosingModalProps {
    isVisible: boolean;
    onSave: (data: any) => void;
    onClose: () => void;
    initialData?: any;
}

const AccountingClosingModal: React.FC<AccountingClosingModalProps> = ({
    isVisible,
    onSave,
    onClose,
    initialData,
}) => {
    const modalTitle = initialData ? `Editar Período ${initialData.year}` : "Nuevo Período Contable";

    return (
        <Dialog
            visible={isVisible}
            onHide={onClose}
            header={modalTitle}
            style={{ width: '50vw' }}
            modal
        >
            <AccountingClosingForm
                initialData={initialData}
                onSubmit={onSave}
                onCancel={onClose}
            />
        </Dialog>
    );
};

export default AccountingClosingModal;