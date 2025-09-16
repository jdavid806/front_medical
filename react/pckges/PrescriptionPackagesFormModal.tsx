import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { PrescriptionPackagesForm } from "./PrescriptionPackagesForm";

interface PrescriptionPackagesFormModalProps {
    visible: boolean;
    onHide: () => void;
    packageId?: string;
}

export const PrescriptionPackagesFormModal = (props: PrescriptionPackagesFormModalProps) => {

    const formId = `prescription-packages-form-modal-${props.packageId}`;

    const { visible, onHide, packageId } = props;

    return (<>

        <Dialog
            visible={visible}
            onHide={onHide}
            header="Nuevo paquete"
            style={{ width: '90vw' }}
            dismissableMask
            draggable={false}
            footer={<>
                <Divider />
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        label="Cancelar"
                        icon={<i className="fas fa-times"></i>}
                        className="btn btn-danger"
                        onClick={onHide}
                    />
                    <Button
                        label="Guardar"
                        icon={<i className="fas fa-save"></i>}
                        className="btn btn-primary"
                        type="submit"
                        form={formId}
                    />
                </div>
            </>}
        >
            <PrescriptionPackagesForm formId={formId} packageId={packageId} />
        </Dialog>
    </>);
}