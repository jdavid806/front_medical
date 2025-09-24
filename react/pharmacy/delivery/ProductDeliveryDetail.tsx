import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDateDMY } from "../../../services/utilidades";
import { useProductDelivery } from "./hooks/useProductDelivery";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager";
import "../../extensions/number.extensions";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useLoggedUser } from "../../users/hooks/useLoggedUser";
import { Button } from "primereact/button";
import { ProductDeliveryDetailDialog } from "./ProductDeliveryDetailDialog";
import { useProductDeliveryDetailFormat } from "../../documents-generation/hooks/useProductDeliveryDetailFormat";
import { useVerifyAndSaveProductDelivery } from "./hooks/useVerifyAndSaveProductDelivery";

interface ProductDeliveryDetailProps {
    deliveryId: string;
}

export const ProductDeliveryDetail = ({ deliveryId }: ProductDeliveryDetailProps) => {
    const { delivery, getDelivery } = useProductDelivery();
    const { loggedUser } = useLoggedUser();
    const { generateFormat } = useProductDeliveryDetailFormat();
    const { verifyAndSaveProductDelivery } = useVerifyAndSaveProductDelivery();

    const [deliveryManager, setDeliveryManager] = useState<MedicalSupplyManager | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        getDelivery(deliveryId);
    }, [deliveryId]);

    useEffect(() => {
        if (delivery) {
            setDeliveryManager(new MedicalSupplyManager(delivery));
        }
    }, [delivery]);

    const handlePrint = () => {
        if (!delivery || !deliveryManager) return;
        generateFormat({
            delivery: delivery,
            deliveryManager: deliveryManager,
            type: 'Impresion'
        });
    };

    const handleVerifyAndSaveProductDelivery = async () => {
        if (!delivery || !deliveryManager) return;
        try {
            const response = await verifyAndSaveProductDelivery(delivery.id.toString());
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <>
            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center gap-2">
                    <b>Solicitud #{delivery?.id}</b>
                    <Tag
                        value={deliveryManager?.statusLabel}
                        severity={deliveryManager?.statusSeverity}
                        className="fs-6"
                    />
                </div>
                <p>Creado: {formatDateDMY(delivery?.created_at)}</p>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title">Información del solicitante</h6>

                                <div className="mb-2">
                                    <strong>Nombre: </strong>
                                    <span>{deliveryManager?.requestedBy?.name || '--'}</span>
                                </div>

                                <div className="mb-2">
                                    <strong>Correo electrónico: </strong>
                                    <span>{deliveryManager?.requestedBy?.email || '--'}</span>
                                </div>

                                <div className="mb-2">
                                    <strong>Teléfono: </strong>
                                    <span>{deliveryManager?.requestedBy?.phone || '--'}</span>
                                </div>

                                <div className="mb-2">
                                    <strong>Dirección: </strong>
                                    <span>{deliveryManager?.requestedBy?.address || '--'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title">Gestionado por</h6>

                                <div className="mb-2">
                                    <strong>Nombre: </strong>
                                    <span>{`${loggedUser?.first_name || ''} ${loggedUser?.middle_name || ''} ${loggedUser?.last_name || ''} ${loggedUser?.second_last_name || ''}`}</span>
                                </div>

                                <div className="mb-2">
                                    <strong>Correo electrónico: </strong>
                                    <span>{loggedUser?.email}</span>
                                </div>

                                <div className="mb-2">
                                    <strong>Teléfono: </strong>
                                    <span>{loggedUser?.phone}</span>
                                </div>

                                <div className="mb-2">
                                    <strong>Dirección: </strong>
                                    <span>{loggedUser?.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CustomPRTable
                    data={deliveryManager?.products}
                    columns={[
                        { field: 'product.name', header: 'Insumos' },
                        { field: 'quantity', header: 'Cantidad' }
                    ]}
                    disablePaginator
                    disableReload
                    disableSearch
                />
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                            <i className="fas fa-file-prescription text-primary me-2 fs-4"></i>
                            <div>
                                <div className="fw-medium">Solicitud #{delivery?.id}</div>
                                <div className="text-muted small">{deliveryManager?.requestedBy?.name || '--'} - {formatDateDMY(delivery?.created_at)}</div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setDialogVisible(true)}>
                                <i className="fas fa-eye me-1"></i> Ver solicitud
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={handlePrint}>
                                <i className="fas fa-print me-1"></i> Imprimir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                    <Button
                        icon={<i className="fas fa-check me-2"></i>}
                        label="Entregar Productos"
                        className="btn btn-sm btn-primary"
                        onClick={handleVerifyAndSaveProductDelivery}
                    />
                </div>
            </div>

            <ProductDeliveryDetailDialog
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                delivery={delivery}
            />
        </>
    );
};