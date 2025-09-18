import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { PrescriptionPackagesForm } from "./PrescriptionPackagesForm";
import { useRef } from "react";
import { PrescriptionPackagesFormRef } from "./PrescriptionPackagesForm";
import { useCreatePrescriptionPackage } from "./hooks/useCreatePrescriptionPackage";
import { useUpdatePrescriptionPackage } from "./hooks/useUpdatePrescriptionPackage";
import { Toast } from "primereact/toast";

interface PrescriptionPackagesFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSave: () => void;
    packageId?: string;
}

export const PrescriptionPackagesFormModal = (props: PrescriptionPackagesFormModalProps) => {

    const { visible, onHide, onSave, packageId } = props;
    const { createPrescriptionPackage, toast: createToast } = useCreatePrescriptionPackage()
    const { updatePrescriptionPackage, toast: updateToast } = useUpdatePrescriptionPackage()

    const formRef = useRef<PrescriptionPackagesFormRef>(null);

    const handleSave = async () => {
        const formData = formRef.current?.getFormData();

        if (!formData) return;

        console.log('formData', formData);

        try {
            if (packageId) {
                await updatePrescriptionPackage(packageId, formData)
            } else {
                await createPrescriptionPackage(formData)
            }
            formRef.current?.resetForm()
            onSave()
            onHide()
        } catch (error) {
            console.log(error);
        }
    };

    const handleHide = () => {
        formRef.current?.resetForm()
        onHide()
    }

    return (<>
        <Dialog
            visible={visible}
            onHide={handleHide}
            header="Nuevo paquete"
            style={{ width: '90vw' }}
            dismissableMask
            draggable={false}
            footer={<>
                <Toast ref={createToast} />
                <Toast ref={updateToast} />
                <Divider />
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        label="Cancelar"
                        icon={<i className="fas fa-times me-2"></i>}
                        className="btn btn-danger"
                        onClick={handleHide}
                        type="button"
                    />
                    <Button
                        label="Guardar"
                        icon={<i className="fas fa-save me-2"></i>}
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSave}
                    />
                </div>
            </>}
        >
            <PrescriptionPackagesForm
                packageId={packageId}
                ref={formRef}
            />
        </Dialog>
    </>);
}