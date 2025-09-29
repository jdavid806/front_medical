import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { formatDateDMY } from '../../../services/utilidades';
import { MedicalSupply } from '../supplies/interfaces';
import { MedicalSupplyManager } from '../../helpers/MedicalSupplyManager';

interface ProductDeliveryDetailDialogProps {
    visible: boolean;
    onHide: () => void;
    delivery: MedicalSupply | null;
}

export const ProductDeliveryDetailDialog: React.FC<ProductDeliveryDetailDialogProps> = ({
    visible,
    onHide,
    delivery
}) => {
    if (!delivery) return null;

    const [deliveryManager, setDeliveryManager] = useState<MedicalSupplyManager | null>(null);

    useEffect(() => {
        if (delivery) {
            setDeliveryManager(new MedicalSupplyManager(delivery));
        }
    }, [delivery]);

    const headerTemplate = (
        <div className="d-flex justify-content-between align-items-center w-100">
            <h4 className="mb-0">Detalle de Solicitud #{delivery.id}</h4>
            <Tag
                value={deliveryManager?.statusLabel}
                severity={deliveryManager?.statusSeverity}
                className="fs-6"
            />
        </div>
    );

    return (
        <Dialog
            header={headerTemplate}
            visible={visible}
            onHide={onHide}
            style={{ width: '90vw', maxWidth: '1200px' }}
            modal
        >
            <div className="container-fluid">
                {/* Información general de la solicitud */}
                <Card title="Información General" className="mb-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="fw-bold text-muted small">Solicitado por:</label>
                                <div className="d-flex align-items-center mt-1">
                                    <i className="fas fa-user me-2 text-primary"></i>
                                    <span>{deliveryManager?.requestedBy?.name || '--'}</span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="fw-bold text-muted small">Email:</label>
                                <div className="d-flex align-items-center mt-1">
                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                    <span>{deliveryManager?.requestedBy?.email || '--'}</span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="fw-bold text-muted small">Dirección:</label>
                                <div className="d-flex align-items-center mt-1">
                                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                    <span>{deliveryManager?.requestedBy?.address || '--'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="fw-bold text-muted small">Fecha de creación:</label>
                                <div className="d-flex align-items-center mt-1">
                                    <i className="fas fa-calendar me-2 text-primary"></i>
                                    <span>{formatDateDMY(delivery.created_at)}</span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="fw-bold text-muted small">Teléfono:</label>
                                <div className="d-flex align-items-center mt-1">
                                    <i className="fas fa-phone me-2 text-primary"></i>
                                    <span>{deliveryManager?.requestedBy?.phone || '--'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {delivery.observations && (
                        <div className="row">
                            <div className="col-12">
                                <label className="fw-bold text-muted small">Observaciones:</label>
                                <div className="mt-1 p-3 bg-light rounded">
                                    <i className="fas fa-sticky-note me-2 text-muted"></i>
                                    {delivery.observations}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Lista de productos solicitados */}
                <Card title={`Productos Solicitados (${delivery.products.length})`} className="mb-4">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {delivery.products.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{item.product.name}</div>
                                                <small className="text-muted">{item.product.description}</small>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-primary fs-6">{item.quantity}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Resumen del estado */}
                <Card title="Resumen del Estado">
                    <div className="row text-center">
                        <div className="col-md-4 mb-3">
                            <div className="border rounded p-3">
                                <i className="fas fa-boxes fa-2x text-primary mb-2"></i>
                                <div className="fw-bold fs-4">{delivery.products.length}</div>
                                <small className="text-muted">Productos solicitados</small>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="border rounded p-3">
                                <i className="fas fa-cubes fa-2x text-info mb-2"></i>
                                <div className="fw-bold fs-4">
                                    {delivery.products.reduce((total, item) => total + item.quantity, 0)}
                                </div>
                                <small className="text-muted">Total de unidades</small>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="border rounded p-3">
                                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                                <div className="fw-bold fs-4">{deliveryManager?.statusLabel}</div>
                                <small className="text-muted">Estado actual</small>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Dialog>
    );
};