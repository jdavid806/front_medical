import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { PrescriptionDto } from '../../models/models';
import { MedicationPrescriptionManager } from './helpers/MedicationPrescriptionManager';

interface MedicationDeliveryDetailDialogProps {
    visible: boolean;
    onHide: () => void;
    prescription: PrescriptionDto | null;
}

export const MedicationDeliveryDetailDialog: React.FC<MedicationDeliveryDetailDialogProps> = ({
    visible,
    onHide,
    prescription
}) => {
    if (!prescription) return null;

    const [medicationPrescriptionManager, setMedicationPrescriptionManager] = useState<MedicationPrescriptionManager | null>(null);

    useEffect(() => {
        if (prescription) {
            setMedicationPrescriptionManager(new MedicationPrescriptionManager(prescription));
        }
    }, [prescription]);

    const headerTemplate = (
        <div className="d-flex justify-content-between align-items-center w-100">
            <h4 className="mb-0">Detalle de Solicitud #{prescription.id}</h4>
            <Tag
                value={medicationPrescriptionManager?.statusLabel}
                severity={medicationPrescriptionManager?.statusSeverity}
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
                <div className="row mb-3">
                    <div className="col-md-6">
                        <Card title="Información del paciente">
                            <div className="mb-2">
                                <strong>Nombre: </strong>
                                <span>{medicationPrescriptionManager?.patient?.name || '--'}</span>
                            </div>

                            <div className="mb-2">
                                <strong>Correo electrónico: </strong>
                                <span>{medicationPrescriptionManager?.patient?.email || '--'}</span>
                            </div>

                            <div className="mb-2">
                                <strong>Teléfono: </strong>
                                <span>{medicationPrescriptionManager?.patient?.phone || '--'}</span>
                            </div>

                            <div className="mb-2">
                                <strong>Dirección: </strong>
                                <span>{medicationPrescriptionManager?.patient?.address || '--'}</span>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <Card title="Médico Prescriptor">
                            <div className="mb-2">
                                <strong>Nombre: </strong>
                                <span>{`${medicationPrescriptionManager?.prescriber?.name || ''}`}</span>
                            </div>

                            <div className="mb-2">
                                <strong>Correo electrónico: </strong>
                                <span>{medicationPrescriptionManager?.prescriber?.email || '--'}</span>
                            </div>

                            <div className="mb-2">
                                <strong>Teléfono: </strong>
                                <span>{medicationPrescriptionManager?.prescriber?.phone || '--'}</span>
                            </div>

                            <div className="mb-2">
                                <strong>Dirección: </strong>
                                <span>{medicationPrescriptionManager?.prescriber?.address || '--'}</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Lista de productos solicitados */}
                <Card title={`Medicamentos Solicitados (${prescription.recipe_items.length})`} className="mb-4">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Medicamento</th>
                                    <th className="text-center">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.recipe_items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{item.medication}</div>
                                                <small className="text-muted">{item.concentration}</small>
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
                                <div className="fw-bold fs-4">{medicationPrescriptionManager?.products.length}</div>
                                <small className="text-muted">Medicamentos solicitados</small>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="border rounded p-3">
                                <i className="fas fa-cubes fa-2x text-info mb-2"></i>
                                <div className="fw-bold fs-4">
                                    {medicationPrescriptionManager?.products.reduce((total, item) => total + item.quantity, 0)}
                                </div>
                                <small className="text-muted">Total de unidades</small>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="border rounded p-3">
                                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                                <div className="fw-bold fs-4">{medicationPrescriptionManager?.statusLabel}</div>
                                <small className="text-muted">Estado actual</small>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Dialog>
    );
};