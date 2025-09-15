import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { SuppliesDeliveryForm } from "./SuppliesDeliveryForm";
import { SuppliesDeliveryFormModalProps, SuppliesDeliveryFormData } from "./interfaces";
import { Toast } from "primereact/toast";
import { useSendSuppliesRequest } from "./hooks/useSendSuppliesRequest";

export const SuppliesDeliveryFormModal = (props: SuppliesDeliveryFormModalProps) => {

    const { visible, onHide } = props;

    const { sendSuppliesRequest, toast } = useSendSuppliesRequest();

    const formId = "suppliesDeliveryForm";

    const handleSubmit = (data: SuppliesDeliveryFormData) => {
        console.log(data);
        sendSuppliesRequest(data);
    };

    return (<>
        <Dialog
            visible={visible}
            onHide={onHide}
            header="Solicitud de Insumos"
            style={{ width: '60vw' }}
        >
            <Toast ref={toast} />
            <SuppliesDeliveryForm formId={formId} onSubmit={handleSubmit} />
            <Divider />
            <div className="d-flex justify-content-end gap-2">
                <Button
                    label="Cancelar"
                    onClick={onHide}
                    className="btn btn-danger"
                />
                <Button
                    form={formId}
                    label="Enviar Solicitud"
                    className="btn btn-primary"
                />
            </div>
        </Dialog>
    </>)
}