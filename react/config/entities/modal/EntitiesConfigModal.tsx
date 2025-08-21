import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import EntitiesConfigForm from "../form/EntitiesConfigForm";
import { EntitieConfigModalProps } from "../interfaces/entitiesModal";



const EntitiesConfigModal: React.FC<EntitieConfigModalProps> = ({
    isVisible,
    onSave,
    initialData,
    onClose,
    closable = true,
    loading,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [formHasChanges, setFormHasChanges] = useState(false);

    const handleCloseAttempt = () => {
        if (closable) {
            if (formHasChanges) {
                setShowConfirm(true);
            } else {
                onClose();
            }
        }
    };

    const handleConfirmClose = () => {
        setShowConfirm(false);
        onClose();
    };

    const handleSave = async (data: any) => {
        try {
            await onSave(data);
            onClose();
        } catch (error) {
            console.error("Error saving tax:", error);
        }
    };

    const modalTitle =
        initialData && initialData.name
            ? `Editar Entidad - ${initialData.name}`
            : "Nuevo Entidad";

    return (
        <>
            <CustomModal
                show={isVisible}
                onHide={handleCloseAttempt}
                title={modalTitle}
                size="lg"
            >
                <EntitiesConfigForm
                    formId="taxForm"
                    onSubmit={handleSave}
                    initialData={initialData}
                    onCancel={handleCloseAttempt}
                    loading={loading}
                />
            </CustomModal>

            <Dialog
                visible={showConfirm}
                onHide={() => setShowConfirm(false)}
                header="Confirmar"
                footer={
                    <div>
                        <Button
                            label="No"
                            className="p-button-text"
                            onClick={() => setShowConfirm(false)}
                        />
                        <Button
                            label="Sí, descartar"
                            className="p-button-danger"
                            onClick={handleConfirmClose}
                        />
                    </div>
                }
            >
                <p>¿Estás seguro que deseas descartar los cambios?</p>
            </Dialog>
        </>
    );
};

export default EntitiesConfigModal;