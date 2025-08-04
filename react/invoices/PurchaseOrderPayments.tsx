import React from "react";
import { usePurchaseOrderPayments } from "./hooks/usePurchaseOrderPayments";
import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { formatDate } from "../../services/utilidades";

type PurchaseOrderPaymentsProps = {
    purchaseOrderId: string
}

type PurchaseOrderPaymentsTableItem = {
    id: string;
    created_at: string;
    total_amount: string;
    payment_method: string;
    observations: string;
}

export const PurchaseOrderPayments: React.FC<PurchaseOrderPaymentsProps> = ({ purchaseOrderId }) => {
    const { purchaseOrderPayments, fetchPurchaseOrderPayments } = usePurchaseOrderPayments();
    const [mappedPurchaseOrderPayments, setMappedPurchaseOrderPayments] = useState<PurchaseOrderPaymentsTableItem[]>([]);
    const [totalPaid, setTotalPaid] = useState<number>(0);
    const [remainingAmount, setRemainingAmount] = useState<number>(0);
    const [purchaseOrderTotal, setPurchaseOrderTotal] = useState<number>(0);

    useEffect(() => {
        fetchPurchaseOrderPayments({ purchaseOrderId });
    }, [purchaseOrderId]);

    useEffect(() => {
        if (purchaseOrderPayments.data.length > 0) {
            // Mapear los pagos para la tabla
            setMappedPurchaseOrderPayments(purchaseOrderPayments.data.map(payment => ({
                id: payment.attributes.id.toString(),
                created_at: formatDate(payment.attributes.created_at),
                total_amount: payment.attributes.total_amount,
                payment_method: payment.includes.payments[0].payment_method_name,
                observations: payment.attributes.observations
            })));

            // Calcular total abonado
            const paid = purchaseOrderPayments.data.reduce((sum, payment) =>
                sum + parseFloat(payment.attributes.paid_amount), 0);
            setTotalPaid(paid);

            // Obtener el total de la orden de compra
            const poTotal = parseFloat(purchaseOrderPayments.data[0].includes.purchase_order.total_amount);
            setPurchaseOrderTotal(poTotal);

            // Calcular saldo pendiente
            setRemainingAmount(poTotal - paid);
        }
    }, [purchaseOrderPayments.data]);

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-primary bg-opacity-10 text-white">
                            <h5 className="card-title mb-0">Resumen de Pagos</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-info bg-opacity-10">
                                        <div className="text-muted small">Total Orden de Compra</div>
                                        <div className="fw-bold fs-4">${purchaseOrderTotal.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-success bg-opacity-10">
                                        <div className="text-muted small">Total Abonado</div>
                                        <div className="fw-bold fs-4">${totalPaid.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className={`p-3 border rounded ${remainingAmount > 0 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                                        <div className="text-muted small">Saldo Pendiente</div>
                                        <div className="fw-bold fs-4">${remainingAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-primary bg-opacity-10 text-white">
                            <h5 className="card-title mb-0">Historial de Abonos</h5>
                        </div>
                        <div className="card-body">
                            <DataTable value={mappedPurchaseOrderPayments} tableStyle={{ minWidth: '50rem' }} className="mt-3">
                                <Column field="created_at" header="Fecha" />
                                <Column field="total_amount" header="Monto" body={(rowData) => `$${rowData.total_amount}`} />
                                <Column field="payment_method" header="Método de pago" />
                                <Column field="observations" header="Observaciones" />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};