import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDateDMY } from "../../../services/utilidades";
import { useProductDelivery } from "./hooks/useProductDelivery";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager";
import "../../extensions/number.extensions";

interface ProductDeliveryDetailProps {
    deliveryId: string;
}

export const ProductDeliveryDetail = ({ deliveryId }: ProductDeliveryDetailProps) => {

    const { delivery, getDelivery } = useProductDelivery();

    const [deliveryManager, setDeliveryManager] = useState<MedicalSupplyManager | null>(null);

    useEffect(() => {
        getDelivery(deliveryId);
    }, [deliveryId]);

    useEffect(() => {
        if (delivery) {
            setDeliveryManager(new MedicalSupplyManager(delivery));
        }
    }, [delivery]);

    return (
        <>
            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center gap-2">
                    <h5 className="card-title">Pedido #{delivery?.id}</h5>
                    <Tag value="En espera" />
                </div>
                <p>Creado: {formatDateDMY(delivery?.created_at)}</p>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex flex-column gap-2">
                            <b>Detalles de productos</b>
                            <div className="d-flex justify-content-between align-items-center gap-2">
                                <span>Subtotal</span>
                                <span>{deliveryManager?.getSubtotal().currency()}</span>
                            </div>

                            <span>Impuestos</span>
                            <span>Descuento</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};