import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Button,
    InputText,
    Dropdown,
    Calendar,
    DataTable,
    Column,
    Toast,
    InputNumber,
    Checkbox
} from "primereact";

// Definición de tipos
type TypeOption = {
    id: number;
    name: string;
};

type Supplier = {
    id: number;
    name: string;
};

type CostCenterOption = {
    id: number;
    name: string;
};

type MakePaymentOption = {
    id: number;
    name: string;
};

type Product = {
    id: string;
    name: string;
};

type TaxOption = {
    id: number;
    name: string;
    rate: number;
};

type RetentionOption = {
    id: number;
    name: string;
    rate: number;
};

type PaymentMethod = {
    id: string;
    method: string | MakePaymentOption;
    authorizationNumber: string;
    value: number;
};

type BillingItem = {
    id: string;
    type: TypeOption | null;
    product: Product | string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    tax: TaxOption | number;
    retention: RetentionOption | number;
    totalValue: number;
};

type FormData = {
    noteType: TypeOption | null;
    elaborationDate: Date | null;
    supplier: Supplier | null;
    supplierInvoiceNumber: string;
    costCenter: CostCenterOption | null;
    consecutiveCode: string;
    applyDiscount: boolean;
};

export const FormDocumentSupport: React.FC = () => {
    const {
        control,
        handleSubmit,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            noteType: null,
            elaborationDate: null,
            supplier: null,
            supplierInvoiceNumber: '',
            costCenter: null,
            consecutiveCode: 'SP-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
            applyDiscount: false
        }
    });

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [billingItems, setBillingItems] = useState<BillingItem[]>([
        {
            id: generateId(),
            type: null,
            product: "",
            description: "",
            quantity: 0,
            unitPrice: 0,
            discount: 0,
            tax: 0,
            retention: 0,
            totalValue: 0,
        },
    ]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: generateId(),
            method: "",
            authorizationNumber: "",
            value: 0,
        },
    ]);

    // Helper function to generate unique IDs
    function generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    // Opciones del formulario
    const noteTypeOptions: TypeOption[] = [
        { id: 1, name: "Débito" },
        { id: 2, name: "Crédito" },
    ];

    const itemTypeOptions: TypeOption[] = [
        { id: 1, name: "Producto" },
        { id: 2, name: "Servicio" },
    ];

    const costCenterOptions: CostCenterOption[] = [
        { id: 1, name: "SOPORTE_TECNICO" },
        { id: 2, name: "MANTENIMIENTO" },
        { id: 3, name: "INFRAESTRUCTURA" },
        { id: 4, name: "DESARROLLO" },
    ];

    const productOptions: Product[] = [
        { id: "S001", name: "REPUESTO 1" },
        { id: "S002", name: "REPUESTO 2" },
        { id: "S003", name: "REPUESTO 3" },
        { id: "S004", name: "REPUESTO 4" },
    ];

    const supplierOptions: Supplier[] = [
        { id: 1, name: "PROVEEDOR 1" },
        { id: 2, name: "PROVEEDOR 2" },
        { id: 3, name: "PROVEEDOR 3" },
    ];

    const taxOptions: TaxOption[] = [
        { id: 0, name: "0%", rate: 0 },
        { id: 12, name: "12%", rate: 12 },
        { id: 14, name: "14%", rate: 14 },
    ];

    const retentionOptions: RetentionOption[] = [
        { id: 0, name: "No Aplica", rate: 0 },
        { id: 1, name: "1%", rate: 1 },
        { id: 2, name: "2%", rate: 2 },
        { id: 5, name: "5%", rate: 5 },
        { id: 10, name: "10%", rate: 10 },
    ];

    const paymentMethodOptions: MakePaymentOption[] = [
        { id: 1, name: "EFECTIVO" },
        { id: 2, name: "TARJETA_CREDITO" },
        { id: 3, name: "TRANSFERENCIA" },
        { id: 4, name: "CHEQUE" },
    ];

    // Funciones de cálculo en DOP
    const calculateLineTotal = (item: BillingItem): number => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const discount = Number(item.discount) || 0;
        const taxRate = typeof item.tax === 'object' ? item.tax.rate : Number(item.tax) || 0;
        const retentionRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;

        const subtotal = quantity * unitPrice;
        const discountAmount = subtotal * (discount / 100);
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (taxRate / 100);
        const retentionAmount = subtotalAfterDiscount * (retentionRate / 100);

        const lineTotal = subtotalAfterDiscount + taxAmount - retentionAmount;

        return parseFloat(lineTotal.toFixed(2));
    };

    const calculateSubtotal = (): number => {
        return billingItems.reduce((total, item) => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            return total + (quantity * unitPrice);
        }, 0);
    };

    const calculateTotalDiscount = (): number => {
        return billingItems.reduce((total, item) => {
            const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            const discount = Number(item.discount) || 0;
            return total + (subtotal * (discount / 100));
        }, 0);
    };

    const calculateTotalTax = (): number => {
        return billingItems.reduce((total, item) => {
            const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
            const subtotalAfterDiscount = subtotal - discountAmount;
            const taxRate = typeof item.tax === 'object' ? item.tax.rate : Number(item.tax) || 0;
            return total + (subtotalAfterDiscount * (taxRate / 100));
        }, 0);
    };

    const calculateSubtotalAfterDiscount = (): number => {
        return calculateSubtotal() - calculateTotalDiscount();
    };

    const calculateTotalWithholdingTax = (): number => {
        return billingItems.reduce((total, item) => {
            const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
            const subtotalAfterDiscount = subtotal - discountAmount;
            const retentionRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;
            return total + (subtotalAfterDiscount * (retentionRate / 100));
        }, 0);
    };

    const calculateTotal = (): number => {
        return billingItems.reduce((total, item) => {
            return total + calculateLineTotal(item);
        }, 0);
    };

    const calculateTotalPayments = (): number => {
        return paymentMethods.reduce((total, payment) => {
            return total + (Number(payment.value) || 0);
        }, 0);
    };

    const paymentCoverage = (): boolean => {
        const total = calculateTotal();
        const payments = calculateTotalPayments();
        return Math.abs(payments - total) < 0.01;
    };

    // Funciones para manejar items de facturación
    const addBillingItem = (): void => {
        setBillingItems([
            ...billingItems,
            {
                id: generateId(),
                type: null,
                product: "",
                description: "",
                quantity: 0,
                unitPrice: 0,
                discount: 0,
                tax: 0,
                retention: 0,
                totalValue: 0,
            },
        ]);
    };

    const removeBillingItem = (id: string): void => {
        if (billingItems.length > 1) {
            setBillingItems(prevItems => prevItems.filter(item => item.id !== id));
        }
    };

    const handleBillingItemChange = (id: string, field: keyof BillingItem, value: any): void => {
        setBillingItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // Funciones para manejar métodos de pago
    const addPaymentMethod = (): void => {
        setPaymentMethods([
            ...paymentMethods,
            {
                id: generateId(),
                method: "",
                authorizationNumber: "",
                value: 0,
            },
        ]);
    };

    const removePaymentMethod = (id: string): void => {
        if (paymentMethods.length > 1) {
            setPaymentMethods(prevPayments => prevPayments.filter(payment => payment.id !== id));
        }
    };

    const handlePaymentMethodChange = (id: string, field: keyof PaymentMethod, value: any): void => {
        setPaymentMethods(prevPayments =>
            prevPayments.map(payment =>
                payment.id === id ? { ...payment, [field]: value } : payment
            )
        );
    };

    // Funciones para guardar
    const save = (formData: FormData): void => {
        if (billingItems.length === 0) {
            window['toast'].show({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe agregar al menos un item de facturación',
                life: 5000
            });
            return;
        }

        if (paymentMethods.length === 0) {
            window['toast'].show({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe agregar al menos un método de pago',
                life: 5000
            });
            return;
        }

        if (!paymentCoverage()) {
            window['toast'].show({
                severity: 'error',
                summary: 'Error',
                detail: `Los métodos de pago (${calculateTotalPayments().toFixed(2)} DOP) no cubren el total (${calculateTotal().toFixed(2)} DOP)`,
                life: 5000
            });
            return;
        }

        const formatDate = (date: Date | null): string => {
            if (!date) return '';
            return date.toISOString();
        };

        const noteData = {
            noteType: formData.noteType ? formData.noteType.name : "",
            elaborationDate: formatDate(formData.elaborationDate),
            supplier: formData.supplier ? formData.supplier.name : "",
            supplierInvoiceNumber: formData.supplierInvoiceNumber || "",
            costCenter: formData.costCenter ? formData.costCenter.name : "",
            consecutiveCode: formData.consecutiveCode || "",
            applyDiscount: formData.applyDiscount || false,

            billingItems: billingItems.map(item => ({
                type: item.type ? item.type.name : "",
                product: typeof item.product === 'object' ? item.product.name : item.product,
                description: item.description || "",
                quantity: item.quantity || 0,
                unitPrice: item.unitPrice || 0,
                discount: item.discount || 0,
                tax: typeof item.tax === 'object' ? item.tax.rate : item.tax || 0,
                retention: typeof item.retention === 'object' ? item.retention.rate : item.retention || 0,
                lineTotal: calculateLineTotal(item),
            })),

            paymentMethods: paymentMethods.map(payment => ({
                method: typeof payment.method === 'object' ? payment.method.name : payment.method,
                authorizationNumber: payment.authorizationNumber || "",
                amount: payment.value || 0,
            })),

            subtotal: calculateSubtotal(),
            totalDiscount: calculateTotalDiscount(),
            subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
            totalTax: calculateTotalTax(),
            totalWithholdingTax: calculateTotalWithholdingTax(),
            grandTotal: calculateTotal(),
            currency: "DOP"
        };

        console.log("📄 Datos completos de la nota de soporte:", noteData);
    };

    const saveAndSend = (formData: FormData): void => {
        save(formData);
        console.log("Enviando nota de soporte...");
    };

    // Columnas para la tabla de items de facturación
    const billingItemColumns = [
        {
            field: "type",
            header: "Tipo",
            body: (rowData: BillingItem) => (
                <Dropdown
                    value={rowData.type}
                    options={itemTypeOptions}
                    optionLabel="name"
                    placeholder="Seleccione tipo"
                    className="w-100"
                    onChange={(e) => handleBillingItemChange(rowData.id, 'type', e.value)}
                />
            ),
        },
        {
            field: "product",
            header: "Producto",
            body: (rowData: BillingItem) => (
                <Dropdown
                    value={rowData.product}
                    options={productOptions}
                    optionLabel="name"
                    placeholder="Seleccione Producto"
                    className="w-100"
                    onChange={(e) => handleBillingItemChange(rowData.id, 'product', e.value)}
                />
            ),
        },
        {
            field: "description",
            header: "Descripción",
            body: (rowData: BillingItem) => (
                <InputText
                    value={rowData.description}
                    placeholder="Ingresar Descripción"
                    onChange={(e) => handleBillingItemChange(rowData.id, 'description', e.target.value)}
                />
            ),
        },
        {
            field: "quantity",
            header: "Cantidad",
            body: (rowData: BillingItem) => (
                <InputNumber
                    value={rowData.quantity}
                    placeholder="Cantidad"
                    className="w-100"
                    min={0}
                    onValueChange={(e) => handleBillingItemChange(rowData.id, 'quantity', e.value || 0)}
                />
            ),
        },
        {
            field: "unitPrice",
            header: "Valor unitario",
            body: (rowData: BillingItem) => (
                <InputNumber
                    value={rowData.unitPrice}
                    placeholder="Precio"
                    className="w-100"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    min={0}
                    onValueChange={(e) => handleBillingItemChange(rowData.id, 'unitPrice', e.value || 0)}
                />
            ),
        },
        {
            field: "discount",
            header: "% Dscto",
            body: (rowData: BillingItem) => (
                <InputNumber
                    value={rowData.discount}
                    placeholder="Descuento"
                    className="w-100"
                    suffix="%"
                    min={0}
                    max={100}
                    onValueChange={(e) => handleBillingItemChange(rowData.id, 'discount', e.value || 0)}
                />
            ),
        },
        {
            field: "tax",
            header: "Impuesto",
            body: (rowData: BillingItem) => (
                <Dropdown
                    value={rowData.tax}
                    options={taxOptions}
                    optionLabel="name"
                    placeholder="Seleccione Impuesto"
                    className="w-100"
                    onChange={(e) => handleBillingItemChange(rowData.id, 'tax', e.value)}
                />
            ),
        },
        {
            field: "retention",
            header: "Retención",
            body: (rowData: BillingItem) => (
                <Dropdown
                    value={rowData.retention}
                    options={retentionOptions}
                    optionLabel="name"
                    placeholder="Seleccione Retención"
                    className="w-100"
                    onChange={(e) => handleBillingItemChange(rowData.id, 'retention', e.value)}
                />
            ),
        },
        {
            field: "totalValue",
            header: "Valor total",
            body: (rowData: BillingItem) => (
                <InputNumber
                    value={calculateLineTotal(rowData)}
                    className="w-100"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    readOnly
                />
            ),
        },
        {
            field: "actions",
            header: "Acciones",
            body: (rowData: BillingItem) => (
                <Button
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => removeBillingItem(rowData.id)}
                    disabled={billingItems.length <= 1}
                    tooltip="Eliminar item"
                > <i className="fa-solid fa-trash"></i></Button>
            ),
        },
    ];

    return (
        <div className="container-fluid p-4">
            {/* Encabezado */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h1 className="h3 mb-0 text-primary">
                                <i className="pi pi-file-edit me-2"></i>
                                Crear Documento Soportes
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <form onSubmit={handleSubmit(save)}>
                        {/* Sección de Información Básica */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-user-edit me-2 text-primary"></i>
                                    Información básica
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Tipo *</label>
                                            <Controller
                                                name="noteType"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        options={noteTypeOptions}
                                                        optionLabel="name"
                                                        placeholder="Débito/Crédito"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Fecha de elaboración *</label>
                                            <Controller
                                                name="elaborationDate"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field }) => (
                                                    <Calendar
                                                        {...field}
                                                        placeholder="Seleccione fecha"
                                                        className="w-100"
                                                        showIcon
                                                        dateFormat="dd/mm/yy"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Proveedor *</label>
                                            <Controller
                                                name="supplier"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        options={supplierOptions}
                                                        optionLabel="name"
                                                        placeholder="Seleccione proveedor"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Número de factura proveedor *</label>
                                            <Controller
                                                name="supplierInvoiceNumber"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field }) => (
                                                    <InputText
                                                        {...field}
                                                        placeholder="Ingrese número de factura"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Centro de costo *</label>
                                            <Controller
                                                name="costCenter"
                                                control={control}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        options={costCenterOptions}
                                                        optionLabel="name"
                                                        placeholder="Seleccione centro"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Código consecutivo</label>
                                            <Controller
                                                name="consecutiveCode"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputText
                                                        {...field}
                                                        placeholder="Generado automáticamente"
                                                        className="w-100"
                                                        readOnly
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="d-flex align-items-center gap-2">
                                            <label htmlFor="applyDiscount" className="mb-0 ms-2">
                                                % Dscto
                                            </label>
                                            <Controller
                                                name="applyDiscount"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        inputId="applyDiscount"
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.checked)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Información de Facturación */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-shopping-cart me-2 text-primary"></i>
                                    Información de Facturación
                                </h2>
                                <Button
                                    icon="pi pi-plus"
                                    label="Añadir"
                                    className="btn btn-primary"
                                    onClick={addBillingItem}
                                />
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <DataTable
                                        value={billingItems}
                                        responsiveLayout="scroll"
                                        emptyMessage="No hay items agregados"
                                        className="p-datatable-sm"
                                        showGridlines
                                        stripedRows
                                    >
                                        {billingItemColumns.map((col, i) => (
                                            <Column
                                                key={i}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}
                                                style={{ minWidth: '150px' }}
                                            />
                                        ))}
                                    </DataTable>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Métodos de Pago */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-credit-card me-2 text-primary"></i>
                                    Métodos de Pago (DOP)
                                </h2>
                                <Button
                                    icon="pi pi-plus"
                                    label="Agregar Método"
                                    className="btn btn-primary"
                                    onClick={addPaymentMethod}
                                />
                            </div>
                            <div className="card-body">
                                {paymentMethods.map((payment) => (
                                    <div key={payment.id} className="row g-3 mb-3 align-items-end">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Método *</label>
                                                <Dropdown
                                                    value={payment.method}
                                                    options={paymentMethodOptions}
                                                    optionLabel="name"
                                                    placeholder="Seleccione método"
                                                    className="w-100"
                                                    onChange={(e) => handlePaymentMethodChange(payment.id, 'method', e.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">N° Autorización</label>
                                                <InputText
                                                    value={payment.authorizationNumber}
                                                    placeholder="Número de autorización"
                                                    className="w-100"
                                                    onChange={(e) => handlePaymentMethodChange(payment.id, 'authorizationNumber', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="form-label">Valor *</label>
                                                <InputNumber
                                                    value={payment.value}
                                                    placeholder="Valor"
                                                    className="w-100"
                                                    mode="currency"
                                                    currency="DOP"
                                                    locale="es-DO"
                                                    min={0}
                                                    onValueChange={(e) => handlePaymentMethodChange(payment.id, 'value', e.value || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <Button
                                                className="p-button-rounded p-button-danger p-button-text"
                                                onClick={() => removePaymentMethod(payment.id)}
                                                disabled={paymentMethods.length <= 1}
                                                tooltip="Eliminar método"
                                            > <i className="fa-solid fa-trash"></i></Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <div className="alert alert-info" style={{ background: "rgb(194 194 194 / 85%)", border: "none", color: "black" }}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>Total nota:</strong>
                                                    <InputNumber
                                                        value={calculateTotal()}
                                                        className="ms-2"
                                                        mode="currency"
                                                        currency="DOP"
                                                        locale="es-DO"
                                                        minFractionDigits={2}
                                                        maxFractionDigits={3}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <strong>Total pagos:</strong>
                                                    <InputNumber
                                                        value={calculateTotalPayments()}
                                                        className="ms-2"
                                                        mode="currency"
                                                        currency="DOP"
                                                        locale="es-DO"
                                                        minFractionDigits={2}
                                                        maxFractionDigits={3}
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    {!paymentCoverage() ? (
                                                        <span className="text-danger">
                                                            <i className="pi pi-exclamation-triangle me-1"></i>
                                                            Faltan {((calculateTotal() - calculateTotalPayments()).toFixed(2))} DOP
                                                        </span>
                                                    ) : (
                                                        <span className="text-success">
                                                            <i className="pi pi-check-circle me-1"></i>
                                                            Pagos completos
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Totales */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-calculator me-2 text-primary"></i>
                                    Totales (DOP)
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Subtotal</label>
                                            <InputNumber
                                                value={calculateSubtotal()}
                                                className="w-100"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Descuento</label>
                                            <InputNumber
                                                value={calculateTotalDiscount()}
                                                className="w-100"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Subtotal con descuento</label>
                                            <InputNumber
                                                value={calculateSubtotalAfterDiscount()}
                                                className="w-100"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Impuestos</label>
                                            <InputNumber
                                                value={calculateTotalTax()}
                                                className="w-100"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Retención</label>
                                            <InputNumber
                                                value={calculateTotalWithholdingTax()}
                                                className="w-100"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Total</label>
                                            <InputNumber
                                                value={calculateTotal()}
                                                className="w-100 font-weight-bold"
                                                mode="currency"
                                                currency="DOP"
                                                locale="es-DO"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex justify-content-end gap-3 mb-4">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                className="btn-info"
                                type="submit"
                            />
                            <Button
                                label="Guardar y Enviar"
                                icon="pi pi-send"
                                className="btn-info"
                                onClick={handleSubmit(saveAndSend)}
                                disabled={!paymentCoverage()}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <Toast ref={(el) => (window['toast'] = el)} />
        </div>
    );
};