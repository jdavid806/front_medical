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
    Card,
    Checkbox,
    Divider
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

type Contact = {
    id: number;
    fullName: string;
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

type OrderItem = {
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
    supplier?: Supplier | null;
};

type FormData = {
    orderType: TypeOption | null;
    orderNumber: string;
    elaborationDate: Date | null;
    supplier: Supplier | null;
    supplierInvoiceNumber: string;
    contact: Contact | null;
    supplierPerItem: boolean;
    taxIncluded: boolean;
    discountPercentage: boolean;
};

export const FormPuchaseOrders: React.FC = () => {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            orderType: null,
            orderNumber: 'OC-' + new Date().getFullYear().toString().slice(-2) + '-' + Math.floor(Math.random() * 1000).toString().padStart(4, '0'),
            elaborationDate: null,
            supplier: null,
            supplierInvoiceNumber: '',
            contact: null,
            supplierPerItem: false,
            taxIncluded: false,
            discountPercentage: false
        }
    });

    const [visibleToast, setVisibleToast] = useState<boolean>(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([
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
            supplier: null
        },
    ]);

    // Helper function to generate unique IDs
    function generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    // Opciones del formulario
    const orderTypeOptions: TypeOption[] = [
        { id: 1, name: "Compra directa" },
        { id: 2, name: "Cotización" },
        { id: 3, name: "Servicios" },
    ];

    const itemTypeOptions: TypeOption[] = [
        { id: 1, name: "Producto" },
        { id: 2, name: "Servicio" },
    ];

    const productOptions: Product[] = [
        { id: "P001", name: "PRODUCTO 1" },
        { id: "P002", name: "PRODUCTO 2" },
        { id: "P003", name: "PRODUCTO 3" },
        { id: "P004", name: "PRODUCTO 4" },
    ];

    const supplierOptions: Supplier[] = [
        { id: 1, name: "PROVEEDOR 1" },
        { id: 2, name: "PROVEEDOR 2" },
        { id: 3, name: "PROVEEDOR 3" },
    ];

    const contactOptions: Contact[] = [
        { id: 1, fullName: "CONTACTO 1" },
        { id: 2, fullName: "CONTACTO 2" },
        { id: 3, fullName: "CONTACTO 3" },
    ];

    const supplierInvoiceOptions: TypeOption[] = [
        { id: 1, name: "FACT-001" },
        { id: 2, name: "FACT-002" },
        { id: 3, name: "FACT-003" },
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

    // Watch checkbox values
    const supplierPerItem = watch('supplierPerItem');
    const taxIncluded = watch('taxIncluded');
    const discountPercentage = watch('discountPercentage');

    // Funciones de cálculo
    const calculateLineTotal = (item: OrderItem): number => {
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
        return orderItems.reduce((total, item) => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            return total + (quantity * unitPrice);
        }, 0);
    };

    const calculateTotalDiscount = (): number => {
        return orderItems.reduce((total, item) => {
            const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            const discount = Number(item.discount) || 0;
            return total + (subtotal * (discount / 100));
        }, 0);
    };

    const calculateTotalTax = (): number => {
        return orderItems.reduce((total, item) => {
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
        return orderItems.reduce((total, item) => {
            const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
            const subtotalAfterDiscount = subtotal - discountAmount;
            const retentionRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;
            return total + (subtotalAfterDiscount * (retentionRate / 100));
        }, 0);
    };

    const calculateTotalNet = (): number => {
        return calculateSubtotalAfterDiscount() + calculateTotalTax() - calculateTotalWithholdingTax();
    };

    // Funciones para manejar items de orden
    const addOrderItem = (): void => {
        setOrderItems([
            ...orderItems,
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
                supplier: supplierPerItem ? null : watch('supplier')
            },
        ]);
    };

    const removeOrderItem = (id: string): void => {
        if (orderItems.length > 1) {
            setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
        }
    };

    const handleOrderItemChange = (id: string, field: keyof OrderItem, value: any): void => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // Funciones para guardar
    const saveOrder = (formData: FormData): void => {
        if (orderItems.length === 0) {
            setVisibleToast(true);
            return;
        }

        const formatDate = (date: Date | null): string => {
            if (!date) return '';
            return date.toISOString();
        };

        const orderData = {
            orderType: formData.orderType ? formData.orderType.name : "",
            orderNumber: formData.orderNumber || "",
            elaborationDate: formatDate(formData.elaborationDate),
            supplier: formData.supplier ? formData.supplier.name : "",
            supplierInvoiceNumber: formData.supplierInvoiceNumber || "",
            contact: formData.contact ? formData.contact.fullName : "",
            supplierPerItem: formData.supplierPerItem,
            taxIncluded: formData.taxIncluded,
            discountPercentage: formData.discountPercentage,

            orderItems: orderItems.map(item => ({
                type: item.type ? item.type.name : "",
                product: typeof item.product === 'object' ? item.product.name : item.product,
                description: item.description || "",
                quantity: item.quantity || 0,
                unitPrice: item.unitPrice || 0,
                discount: item.discount || 0,
                tax: typeof item.tax === 'object' ? item.tax.rate : item.tax || 0,
                retention: typeof item.retention === 'object' ? item.retention.rate : item.retention || 0,
                lineTotal: calculateLineTotal(item),
                supplier: item.supplier ? item.supplier.name : ""
            })),

            subtotal: calculateSubtotal(),
            totalDiscount: calculateTotalDiscount(),
            subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
            totalTax: calculateTotalTax(),
            totalWithholdingTax: calculateTotalWithholdingTax(),
            totalNet: calculateTotalNet(),
            currency: "DOP"
        };

        console.log("📄 Datos completos de la orden de compra:", orderData);
    };

    // Columnas para la tabla de items de orden
    const orderItemColumns = [
        {
            field: "type",
            header: "Tipo",
            body: (rowData: OrderItem) => (
                <Dropdown
                    value={rowData.type}
                    options={itemTypeOptions}
                    optionLabel="name"
                    placeholder="Seleccione tipo"
                    className="w-100"
                    onChange={(e) => handleOrderItemChange(rowData.id, 'type', e.value)}
                />
            ),
        },
        {
            field: "product",
            header: "Producto",
            body: (rowData: OrderItem) => (
                <Dropdown
                    value={rowData.product}
                    options={productOptions}
                    optionLabel="name"
                    placeholder="Seleccione Producto"
                    className="w-100"
                    onChange={(e) => handleOrderItemChange(rowData.id, 'product', e.value)}
                />
            ),
        },
        {
            field: "description",
            header: "Descripción",
            body: (rowData: OrderItem) => (
                <InputText
                    value={rowData.description}
                    placeholder="Ingresar Descripción"
                    onChange={(e) => handleOrderItemChange(rowData.id, 'description', e.target.value)}
                />
            ),
        },
        {
            field: "quantity",
            header: "Cantidad",
            body: (rowData: OrderItem) => (
                <InputNumber
                    value={rowData.quantity}
                    placeholder="Cantidad"
                    className="w-80"
                    min={0}
                    onValueChange={(e) => handleOrderItemChange(rowData.id, 'quantity', e.value || 0)}
                />
            ),
        },
        {
            field: "unitPrice",
            header: "Valor unitario",
            body: (rowData: OrderItem) => (
                <InputNumber
                    value={rowData.unitPrice}
                    placeholder="Precio"
                    className="w-100"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    min={0}
                    onValueChange={(e) => handleOrderItemChange(rowData.id, 'unitPrice', e.value || 0)}
                />
            ),
        },
        {
            field: "discount",
            header: "% Dscto",
            body: (rowData: OrderItem) => (
                <InputNumber
                    value={rowData.discount}
                    placeholder="Descuento"
                    className="w-100"
                    suffix="%"
                    min={0}
                    max={100}
                    onValueChange={(e) => handleOrderItemChange(rowData.id, 'discount', e.value || 0)}
                />
            ),
        },
        {
            field: "tax",
            header: "Impuesto cargo",
            body: (rowData: OrderItem) => (
                <Dropdown
                    value={rowData.tax}
                    options={taxOptions}
                    optionLabel="name"
                    placeholder="Seleccione Impuesto"
                    className="w-100"
                    onChange={(e) => handleOrderItemChange(rowData.id, 'tax', e.value)}
                />
            ),
        },
        {
            field: "retention",
            header: "Retención",
            body: (rowData: OrderItem) => (
                <Dropdown
                    value={rowData.retention}
                    options={retentionOptions}
                    optionLabel="name"
                    placeholder="Seleccione Retención"
                    className="w-100"
                    onChange={(e) => handleOrderItemChange(rowData.id, 'retention', e.value)}
                />
            ),
        },
        ...(supplierPerItem ? [{
            field: "supplier",
            header: "Proveedor",
            body: (rowData: OrderItem) => (
                <Dropdown
                    value={rowData.supplier}
                    options={supplierOptions}
                    optionLabel="name"
                    placeholder="Seleccione Proveedor"
                    className="w-100"
                    onChange={(e) => handleOrderItemChange(rowData.id, 'supplier', e.value)}
                />
            ),
        }] : []),
        {
            field: "totalValue",
            header: "Valor total",
            body: (rowData: OrderItem) => (
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
            body: (rowData: OrderItem) => (
                <Button
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={() => removeOrderItem(rowData.id)}
                    disabled={orderItems.length <= 1}
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
                                <i className="pi pi-shopping-cart me-2"></i>
                                Crear Orden de Compra
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <form onSubmit={handleSubmit(saveOrder)}>
                        {/* Sección de Información Básica */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-info-circle me-2 text-primary"></i>
                                    Información básica
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label className="form-label">Tipo *</label>
                                            <Controller
                                                name="orderType"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        options={orderTypeOptions}
                                                        optionLabel="name"
                                                        placeholder="Seleccione tipo"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label className="form-label">Número de orden</label>
                                            <Controller
                                                name="orderNumber"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputText
                                                        {...field}
                                                        className="w-100"
                                                        readOnly
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
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

                                    <div className="col-md-3">
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
                                                        disabled={supplierPerItem}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label className="form-label">N° Factura proveedor *</label>
                                            <Controller
                                                name="supplierInvoiceNumber"
                                                control={control}
                                                rules={{ required: 'Campo obligatorio' }}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        options={supplierInvoiceOptions}
                                                        optionLabel="name"
                                                        placeholder="Seleccione factura"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label className="form-label">Contacto</label>
                                            <Controller
                                                name="contact"
                                                control={control}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        {...field}
                                                        options={contactOptions}
                                                        optionLabel="fullName"
                                                        placeholder="Seleccione contacto"
                                                        className="w-100"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Checkboxes adicionales */}
                                    <div className="col-md-12 mt-3">
                                        <div className="d-flex flex-wrap align-items-center gap-4">
                                            <div className="flex align-items-center gap-2">
                                                <label htmlFor="supplierPerItem" className="mb-0 me-2 align-self-center me-2">
                                                    Proveedor por item
                                                </label>
                                                <Controller
                                                    name="supplierPerItem"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            inputId="supplierPerItem"
                                                            onChange={(e) => {
                                                                field.onChange(e.checked);
                                                                setOrderItems(prevItems =>
                                                                    prevItems.map(item => ({
                                                                        ...item,
                                                                        supplier: e.checked ? null : watch('supplier')
                                                                    }))
                                                                );
                                                            }}
                                                            checked={field.value}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="flex align-items-center gap-2">
                                                <label htmlFor="taxIncluded" className="mb-0 me-2 align-self-center">
                                                    Impuesto Cargo Incluido
                                                </label>
                                                <Controller
                                                    name="taxIncluded"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            inputId="taxIncluded"
                                                            onChange={(e) => field.onChange(e.checked)}
                                                            checked={field.value}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="flex align-items-center gap-2">
                                                <label htmlFor="discountPercentage" className="mb-0 me-2 align-self-center">
                                                    Descuento en porcentaje
                                                </label>
                                                <Controller
                                                    name="discountPercentage"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            inputId="discountPercentage"
                                                            onChange={(e) => field.onChange(e.checked)}
                                                            checked={field.value}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Items de la Orden */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">
                                    <i className="pi pi-list me-2 text-primary"></i>
                                    Items de la Orden
                                </h2>
                                <Button
                                    icon="pi pi-plus"
                                    label="Añadir Item"
                                    className="btn btn-primary"
                                    onClick={addOrderItem}
                                />
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <DataTable
                                        value={orderItems}
                                        responsiveLayout="scroll"
                                        emptyMessage="No hay items agregados"
                                        className="p-datatable-sm"
                                        showGridlines
                                        stripedRows
                                    >
                                        {orderItemColumns.map((col, i) => (
                                            <Column
                                                key={i}
                                                field={col.field}
                                                header={col.header}
                                                body={col.body}
                                                style={{ minWidth: '100%', width: '100%' }}
                                            />
                                        ))}
                                    </DataTable>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Totales - Mejorada */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-body p-0">
                                <div className="row justify-content-center">
                                    <div className="col-lg-8">
                                        <div className="p-4">
                                            <div className="text-center mb-3">
                                                <h3 className="h6 mb-4 font-weight-bold fs-5 text-info">Detalle de Montos</h3>
                                            </div>
                                            <div className="table-responsive d-flex justify-content-center">
                                                <table className="table table-borderless mb-0" style={{ maxWidth: '500px' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-end font-weight-bold pe-3">Subtotal:</td>
                                                            <td className="text-end" width="150px">
                                                                <InputNumber
                                                                    value={calculateSubtotal()}
                                                                    className="w-100 text-end border-0 bg-light"
                                                                    mode="currency"
                                                                    currency="DOP"
                                                                    locale="es-DO"
                                                                    readOnly
                                                                    inputClassName="text-end font-weight-bold"
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-end font-weight-bold pe-3">Descuentos:</td>
                                                            <td className="text-end">
                                                                <InputNumber
                                                                    value={calculateTotalDiscount()}
                                                                    className="w-100 text-end border-0 bg-light"
                                                                    mode="currency"
                                                                    currency="DOP"
                                                                    locale="es-DO"
                                                                    readOnly
                                                                    inputClassName="text-danger text-end"
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr className="border-top">
                                                            <td className="text-end font-weight-bold pe-3">Subtotal después de descuento:</td>
                                                            <td className="text-end">
                                                                <InputNumber
                                                                    value={calculateSubtotalAfterDiscount()}
                                                                    className="w-100 text-end border-0 bg-light"
                                                                    mode="currency"
                                                                    currency="DOP"
                                                                    locale="es-DO"
                                                                    readOnly
                                                                    inputClassName="text-end font-weight-bold"
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-end font-weight-bold pe-3">Impuestos ({calculateTotalTax() > 0 ? (calculateTotalTax() / calculateSubtotalAfterDiscount() * 100).toFixed(2) + '%' : '0%'}):</td>
                                                            <td className="text-end">
                                                                <InputNumber
                                                                    value={calculateTotalTax()}
                                                                    className="w-100 text-end border-0 bg-light"
                                                                    mode="currency"
                                                                    currency="DOP"
                                                                    locale="es-DO"
                                                                    readOnly
                                                                    inputClassName="text-end"
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-end font-weight-bold pe-3">Retención ({calculateTotalWithholdingTax() > 0 ? (calculateTotalWithholdingTax() / calculateSubtotalAfterDiscount() * 100).toFixed(2) + '%' : '0%'}):</td>
                                                            <td className="text-end">
                                                                <InputNumber
                                                                    value={-calculateTotalWithholdingTax()}
                                                                    className="w-100 text-end border-0 bg-light"
                                                                    mode="currency"
                                                                    currency="DOP"
                                                                    locale="es-DO"
                                                                    readOnly
                                                                    inputClassName="text-danger text-end"
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr className="border-top border-bottom">
                                                            <td className="text-end font-weight-bold pe-3">Total Neto:</td>
                                                            <td className="text-end">
                                                                <InputNumber
                                                                    value={calculateTotalNet()}
                                                                    className="w-100 text-end border-0 bg-light"
                                                                    mode="currency"
                                                                    currency="DOP"
                                                                    locale="es-DO"
                                                                    readOnly
                                                                    inputClassName="text-success text-end font-weight-bold fs-6"
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="mt-4 row justify-content-center">
                                                <div className="col-md-10">
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3 mb-md-0">
                                                            <div className="card bg-light h-100">
                                                                <div className="card-body p-3 text-center">
                                                                    <h4 className="h6 text-left mb-3 font-weight-bold">Resumen de Impuestos</h4>
                                                                    {taxOptions.filter(tax => tax.rate > 0).map(tax => {
                                                                        const taxAmount = orderItems.reduce((total, item) => {
                                                                            const taxRate = typeof item.tax === 'object' ? item.tax.rate : Number(item.tax) || 0;
                                                                            if (taxRate === tax.rate) {
                                                                                const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                                                                                const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
                                                                                const subtotalAfterDiscount = subtotal - discountAmount;
                                                                                return total + (subtotalAfterDiscount * (taxRate / 100));
                                                                            }
                                                                            return total;
                                                                        }, 0);

                                                                        return taxAmount > 0 ? (
                                                                            <div key={tax.id} className="d-flex justify-content-between mb-2">
                                                                                <span>IVA {tax.rate}%:</span>
                                                                                <span className="font-weight-bold">
                                                                                    {new Intl.NumberFormat('es-DO', {
                                                                                        style: 'currency',
                                                                                        currency: 'DOP'
                                                                                    }).format(taxAmount)}
                                                                                </span>
                                                                            </div>
                                                                        ) : null;
                                                                    })}
                                                                    {taxOptions.filter(tax => tax.rate > 0).every(tax => {
                                                                        const taxAmount = orderItems.reduce((total, item) => {
                                                                            const taxRate = typeof item.tax === 'object' ? item.tax.rate : Number(item.tax) || 0;
                                                                            if (taxRate === tax.rate) {
                                                                                const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                                                                                const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
                                                                                const subtotalAfterDiscount = subtotal - discountAmount;
                                                                                return total + (subtotalAfterDiscount * (taxRate / 100));
                                                                            }
                                                                            return total;
                                                                        }, 0);
                                                                        return taxAmount <= 0;
                                                                    }) && (
                                                                            <div className="text-muted">No hay impuestos aplicados</div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="card bg-light h-100">
                                                                <div className="card-body p-3 text-center">
                                                                    <h4 className="h6 text-muted mb-3 font-weight-bold">Resumen de Retenciones</h4>
                                                                    {retentionOptions.filter(ret => ret.rate > 0).map(ret => {
                                                                        const retAmount = orderItems.reduce((total, item) => {
                                                                            const retRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;
                                                                            if (retRate === ret.rate) {
                                                                                const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                                                                                const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
                                                                                const subtotalAfterDiscount = subtotal - discountAmount;
                                                                                return total + (subtotalAfterDiscount * (retRate / 100));
                                                                            }
                                                                            return total;
                                                                        }, 0);

                                                                        return retAmount > 0 ? (
                                                                            <div key={ret.id} className="d-flex justify-content-between mb-2">
                                                                                <span>Retención {ret.rate}%:</span>
                                                                                <span className="font-weight-bold text-danger">
                                                                                    {new Intl.NumberFormat('es-DO', {
                                                                                        style: 'currency',
                                                                                        currency: 'DOP'
                                                                                    }).format(retAmount)}
                                                                                </span>
                                                                            </div>
                                                                        ) : null;
                                                                    })}
                                                                    {retentionOptions.filter(ret => ret.rate > 0).every(ret => {
                                                                        const retAmount = orderItems.reduce((total, item) => {
                                                                            const retRate = typeof item.retention === 'object' ? item.retention.rate : Number(item.retention) || 0;
                                                                            if (retRate === ret.rate) {
                                                                                const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                                                                                const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
                                                                                const subtotalAfterDiscount = subtotal - discountAmount;
                                                                                return total + (subtotalAfterDiscount * (retRate / 100));
                                                                            }
                                                                            return total;
                                                                        }, 0);
                                                                        return retAmount <= 0;
                                                                    }) && (
                                                                            <div className="text-muted">No hay retenciones aplicadas</div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex justify-content-end gap-3 mb-4">
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                className="p-button-secondary"
                                type="button"
                            />
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                className="p-button-success"
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            </div>

            <Toast
                visible={visibleToast}
                onHide={() => setVisibleToast(false)}
                severity="error"
                summary="Error"
                detail="Debe agregar al menos un item a la orden"
                life={3000}
            />
        </div>
    );
};