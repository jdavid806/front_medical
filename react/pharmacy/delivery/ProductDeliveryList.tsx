import React from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useSuppliesDeliveries } from "../supplies/hooks/useSuppliesDeliveries";
import { formatDateDMY } from "../../../services/utilidades";
import { MedicalSupply } from "../supplies/interfaces";

interface ProductDeliveryListProps {
    onDeliverySelect: (delivery: MedicalSupply) => void;
}

export const ProductDeliveryList = ({ onDeliverySelect }: ProductDeliveryListProps) => {
    const { suppliesDeliveries } = useSuppliesDeliveries();
    return (
        <>
            <h5 className="card-title">Pedidos Pendientes</h5>
            <div className="input-group">
                <InputText
                    placeholder="Buscar por # o nombre..."
                    id="searchOrder"
                    className="w-100"
                />
            </div>
            <Divider />
            <div className="d-flex flex-column gap-2">
                {suppliesDeliveries.map((delivery) => (
                    <div
                        key={delivery.id}
                        className="d-flex flex-column gap-2 cursor-pointer"
                        onClick={() => onDeliverySelect(delivery)}
                    >
                        <div className="d-flex justify-content-between align-items-center gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <b className="card-title mb-0 fs-9">Solicitud #{delivery.id}</b>
                                <span className={`badge bg-warning`}>Pendiente</span>
                            </div>
                            <div>
                                <span className="fs-9">{formatDateDMY(delivery.created_at)}</span>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <span className="fw-bold">Observaciones: </span><span>{delivery.observations || 'Sin observaciones'}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <span className="fw-bold">Fecha de solicitud: </span><span>{formatDateDMY(delivery.created_at)}</span>
                        </div>
                        <Divider />
                    </div>
                ))}
            </div>
        </>
    );
};