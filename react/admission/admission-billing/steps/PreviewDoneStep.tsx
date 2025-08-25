import React, { useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Panel } from "primereact/panel";
import { Badge } from "primereact/badge";
import { calculateTotal, calculatePaid, calculateChange } from "../utils/helpers";
import { paymentMethodOptions } from "../utils/constants";

interface PreviewAndDoneStepProps {
    formData: any;
    prevStep: () => void;
    onHide: () => void;
    onPrint: () => void;
    onSubmit: () => Promise<void>;
}

const PreviewDoneStep: React.FC<PreviewAndDoneStepProps> = ({
    formData,
    prevStep,
    onHide,
    onPrint,
    onSubmit
}) => {
    const [isDone, setIsDone] = useState(false);

    const total = calculateTotal(formData.products, formData.billing.facturacionEntidad);
    const paid = calculatePaid(formData.payments);
    const change = calculateChange(total, paid);
    const balance = total - paid;

    const handleFinish = async () => {
        try {
            await onSubmit();
            setIsDone(true);
        } catch (error) {
            console.error('Error finishing invoice:', error);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2
        }).format(value);
    };

    const paymentMethodTemplate = (rowData: any) => {
        const methodLabel = paymentMethodOptions.find(m => m.value === rowData.method)?.label || rowData.method;

        return (
            <div className="d-flex align-items-center">
                <i className={`pi ${rowData.method === 'CASH' ? 'pi-money-bill' : 'pi-credit-card'} mr-2`}></i>
                <span>{methodLabel}</span>
            </div>
        );
    };

    const priceBodyTemplate = (rowData: any) => {
        return <span className="fw-bold">{formatCurrency(rowData.currentPrice)}</span>;
    };

    const taxBodyTemplate = (rowData: any) => {
        return <Tag value={`${rowData.tax}%`} severity="info" className="p-tag-rounded" />;
    };

    const subtotalBodyTemplate = (rowData: any) => {
        const subtotal = rowData.currentPrice * rowData.quantity * (1 + rowData.tax / 100);
        return <span className="fw-bold">{formatCurrency(subtotal)}</span>;
    };

    const paymentAmountTemplate = (rowData: any) => {
        return <span className="font-bold">{formatCurrency(rowData.total)}</span>;
    };

    const paymentChangeTemplate = (rowData: any) => {
        return <span className="font-bold">{formatCurrency(rowData.change)}</span>;
    };

    if (isDone) {
        return (
            <div className="text-center py-6 px-4 bg-light rounded-3 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <i className="pi pi-check-circle text-6xl text-success mb-4"></i>
                <h2 className="mb-3 fw-bold">¡Factura Generada Exitosamente!</h2>
                <p className="text-lg text-muted mb-5">La transacción ha sido completada y guardada en el sistema</p>

                <div className="d-flex justify-content-center gap-3">
                    <Button
                        label="Imprimir Factura"
                        icon="pi pi-print mr-2"
                        className="btn btn-outline-primary btn-lg"
                        onClick={onPrint}
                    />
                    <Button
                        label="Volver al Inicio"
                        icon="pi pi-home mr-2"
                        className="btn btn-primary btn-lg"
                        onClick={onHide}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0 text-primary">
                    <i className="pi pi-file-invoice me-2"></i>
                    Vista Previa de Factura
                </h2>
            </div>

            <Panel header="Datos del Cliente" toggleable className="mb-4 shadow-sm">
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3 p-3 bg-light rounded">
                            <label className="d-block text-muted small mb-1">Nombre completo</label>
                            <h5 className="mb-0">{`${formData.patient.firstName} ${formData.patient.lastName}`}</h5>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 p-3 bg-light rounded">
                            <label className="d-block text-muted small mb-1">Documento</label>
                            <h5 className="mb-0">{formData.patient.documentNumber}</h5>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 p-3 bg-light rounded">
                            <label className="d-block text-muted small mb-1">Ciudad</label>
                            <h5 className="mb-0">{formData.patient.city}</h5>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3 p-3 bg-light rounded">
                            <label className="d-block text-muted small mb-1">Fecha</label>
                            <h5 className="mb-0">{new Date().toLocaleDateString()}</h5>
                        </div>
                    </div>
                </div>
            </Panel>

            <Panel header="Detalles de la Factura" toggleable className="mb-4 shadow-sm">
                <div className="mb-4">
                    <DataTable
                        value={formData.products}
                        className="p-datatable-sm"
                        scrollable
                        scrollHeight="300px"
                        stripedRows
                        size="small"
                        tableStyle={{ minWidth: '50rem' }}
                    >
                        <Column field="id" header="#" headerStyle={{ width: '50px' }}></Column>
                        <Column field="description" header="Descripción" headerStyle={{ minWidth: '200px' }}></Column>
                        <Column field="quantity" header="Cantidad" headerStyle={{ width: '100px' }} body={(rowData) => (
                            <Badge value={rowData.quantity} severity="info"></Badge>
                        )}></Column>
                        <Column field="price" header="Precio Unitario" body={priceBodyTemplate}></Column>
                        <Column field="tax" header="Impuesto" body={taxBodyTemplate}></Column>
                        <Column field="total" header="Subtotal" body={subtotalBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Divider />

                <div className="row">
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <Panel header="Métodos de Pago" toggleable>
                            <DataTable
                                value={formData.payments}
                                className="p-datatable-sm"
                                stripedRows
                                size="small"
                            >
                                <Column field="method" header="Método" body={paymentMethodTemplate}></Column>
                                <Column field="amount" header="Monto" body={paymentAmountTemplate}></Column>
                                <Column field="change" header="Cambio" body={paymentChangeTemplate}></Column>
                            </DataTable>
                        </Panel>
                    </div>

                    <div className="col-lg-6">
                        <Panel header="Resumen de Pagos" toggleable>
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Subtotal:</span>
                                    <span className="fw-bold">{formatCurrency(total)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Total a Pagar:</span>
                                    <span className="fw-bold">{formatCurrency(total)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Pagado:</span>
                                    <span className="fw-bold text-success">{formatCurrency(paid)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">
                                        {balance > 0 ? 'Saldo Pendiente:' : 'Cambio a Devolver:'}
                                    </span>
                                    <span className={`fw-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>
                                        {formatCurrency(Math.abs(balance))}
                                    </span>
                                </div>
                                <Divider />
                                <div className="d-flex justify-content-between align-items-center pt-2">
                                    <span className="h5 mb-0">Total Factura:</span>
                                    <span className="h4 mb-0 text-primary">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </Panel>
                    </div>
                </div>
            </Panel>

            <div className="d-flex justify-content-center gap-3 mt-5 mb-4">
                <Button
                    label="Imprimir Factura"
                    icon={<i className="fas fa-file-pdf"></i>}
                    className="btn btn-primary btn-lg px-4"
                    onClick={onPrint}
                />
                <Button
                    label="Guardar Factura"
                    icon={<i className="fa fa-cart-plus"></i>}
                    className="btn btn-primary btn-lg px-4"
                    onClick={handleFinish}
                />
            </div>
        </div>
    );
};

export default PreviewDoneStep;