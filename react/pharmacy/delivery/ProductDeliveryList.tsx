import React, { useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useSuppliesDeliveries } from "../supplies/hooks/useSuppliesDeliveries";
import { formatDateDMY } from "../../../services/utilidades";
import { MedicalSupply } from "../supplies/interfaces";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager";

interface ProductDeliveryListProps {
    onDeliverySelect: (delivery: MedicalSupply) => void;
}

export const ProductDeliveryList = ({ onDeliverySelect }: ProductDeliveryListProps) => {
    const { suppliesDeliveries } = useSuppliesDeliveries();
    const [expandedObservations, setExpandedObservations] = useState<number | null>(null);

    const toggleObservations = (deliveryId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedObservations(expandedObservations === deliveryId ? null : deliveryId);
    };

    const truncateObservations = (text: string, maxLines: number = 3) => {
        if (!text) return 'Sin observaciones';

        const lines = text.split('\n');
        if (lines.length <= maxLines) return text;

        return lines.slice(0, maxLines).join('\n');
    };

    const getRemainingObservations = (text: string, maxLines: number = 3) => {
        if (!text) return '';
        const lines = text.split('\n');
        return lines.slice(maxLines).join('\n');
    };

    return (
        <>
            <h5 className="card-title mb-4">Pedidos Pendientes</h5>

            <div className="input-group mb-4">
                <InputText
                    placeholder="Buscar por # o nombre..."
                    id="searchOrder"
                    className="w-100"
                />
            </div>

            <Divider className="my-3" />

            <div className="d-flex flex-column gap-4">
                {suppliesDeliveries.map((delivery) => {
                    const manager = new MedicalSupplyManager(delivery);
                    const truncatedObs = truncateObservations(delivery.observations || '');
                    const remainingObs = getRemainingObservations(delivery.observations || '');
                    const shouldTruncate = delivery.observations && delivery.observations.split('\n').length > 3;

                    return (
                        <div
                            key={delivery.id}
                            className="card shadow-sm border-0 cursor-pointer hover-shadow"
                            onClick={() => onDeliverySelect(delivery)}
                            style={{
                                transition: 'all 0.2s ease',
                                borderRadius: '8px'
                            }}
                        >
                            <div className="card-body p-3">
                                {/* Header con número de solicitud y estado */}
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h6 className="card-title mb-0 fw-bold text-primary">
                                            Solicitud #{delivery.id}
                                        </h6>
                                        <span
                                            className={`badge fs-7 bg-${manager.statusSeverity}`}
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            {manager.statusLabel}
                                        </span>
                                    </div>
                                    <div>
                                        <small className="text-muted fw-medium">
                                            {formatDateDMY(delivery.created_at)}
                                        </small>
                                    </div>
                                </div>

                                {/* Observaciones */}
                                <div className="mb-3">
                                    <div className="d-flex align-items-start gap-2">
                                        <span className="fw-semibold text-dark fs-7 min-width-fit">
                                            Observaciones:
                                        </span>
                                        <div className="flex-grow-1">
                                            <p
                                                className="mb-1 text-dark fs-7 lh-sm"
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: '1.4'
                                                }}
                                            >
                                                {expandedObservations === delivery.id
                                                    ? delivery.observations || 'Sin observaciones'
                                                    : truncatedObs
                                                }
                                                {shouldTruncate && expandedObservations !== delivery.id && (
                                                    <span className="text-muted">...</span>
                                                )}
                                            </p>
                                            {shouldTruncate && (
                                                <button
                                                    className="btn btn-link p-0 text-primary fs-7 text-decoration-none"
                                                    onClick={(e) => toggleObservations(delivery.id, e)}
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    {expandedObservations === delivery.id ? 'Ver menos' : 'Ver más'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Información adicional */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <div className="d-flex align-items-center gap-1">
                                            <small className="fw-semibold text-muted fs-7">
                                                Fecha solicitud:
                                            </small>
                                            <small className="text-dark fs-7">
                                                {formatDateDMY(delivery.created_at)}
                                            </small>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <small className="fw-semibold text-muted fs-7">
                                                Solicitante:
                                            </small>
                                            <small className="text-dark fs-7">
                                                {manager?.requestedBy?.name || '--'}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <style>{`
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                }
                .min-width-fit {
                    min-width: 110px;
                }
                .fs-7 {
                    font-size: 0.875rem !important;
                }
                .fs-9 {
                    font-size: 0.75rem !important;
                }
                .lh-sm {
                    line-height: 1.4 !important;
                }
            `}</style>
        </>
    );
};