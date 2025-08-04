import React from "react";
import { CustomModal } from "../../components/CustomModal";
import { InventoryService } from "../../../services/api/classes/inventoryServices";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from "../../../services/alertManagerImported";
import { InventariableFormInputs } from "./interfaces/InventariableForm";
import InventariableForm from "./InventariableForm";

interface InventariableFormModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

export const InventariableFormModal: React.FC<InventariableFormModalProps> = ({
    show,
    onHide,
    onSuccess,
}) => {
    const inventoryService = new InventoryService();
    const formId = "inventariable-form-modal";

    const handleSubmit = async (data: InventariableFormInputs) => {
        try {
            const payload = {
                name: data.name,
                //category_product_id: data.category,
                reference: data.reference,
                minimum_stock: Number(data.minimum_stock) || 0,
                maximum_stock: Number(data.maximum_stock) || 0,
                description: data.description || "",
                //weight: data.weight || 0,
                brand_id: data.brand || "",
                sale_price: Number(data.sale_price) || 0,
            };

            // console.log("Payload para API:", payload);
            await inventoryService.createInventariable(payload);

            SwalManager.success();

            onHide();
            onSuccess?.();
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error);
            throw error;
        }
    };

    return (
        <CustomModal show={show} onHide={onHide} title="Crear Nuevo Producto Inventariable">
            <InventariableForm formId={formId} onHandleSubmit={handleSubmit} />
        </CustomModal>
    );
};
