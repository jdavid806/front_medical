import React, { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TabPanel, TabView } from "primereact/tabview";

interface PaymentMethod {
    id: number;
    codigo: string;
    nombre: string;
    relacionCon: string;
    cuentaContable: string;
    medioPago: string[];
    enUso: boolean;
    fechaCreacion: string;
    [key: string]: any;
}

interface DropdownOption {
    label: string;
    value: string;
}

export const NewPaymentMethod: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Estados para General
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');

    // Estados para Pago en línea
    const [editingRowOnline, setEditingRowOnline] = useState<number | null>(null);
    const [editingFieldOnline, setEditingFieldOnline] = useState<string | null>(null);
    const [editingValueOnline, setEditingValueOnline] = useState<string>('');

    // Filtros para General
    const [filters, setFilters] = useState<{
        global: { value: string | null; matchMode: FilterMatchMode };
        codigo: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
        nombre: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
        relacionCon: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
        cuentaContable: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
    }>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        relacionCon: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        cuentaContable: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });

    // Filtros para Pago en línea
    const [filtersOnline, setFiltersOnline] = useState<{
        global: { value: string | null; matchMode: FilterMatchMode };
        codigo: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
        nombre: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
        relacionCon: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
        cuentaContable: { operator: FilterOperator; constraints: { value: string | null; matchMode: FilterMatchMode }[] };
    }>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        relacionCon: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        cuentaContable: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });

    // Opciones para dropdowns
    const relacionOptions: DropdownOption[] = [
        { label: 'Proveedor', value: 'proveedor' },
        { label: 'Cliente', value: 'cliente' },
        { label: 'Empleado', value: 'empleado' },
        { label: 'Socio', value: 'socio' },
        { label: 'Contratista', value: 'contratista' }
    ];

    const medioPagoOptions: DropdownOption[] = [
        { label: 'Transferencia', value: 'transferencia' },
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Tarjeta crédito', value: 'tarjeta_credito' },
        { label: 'Tarjeta débito', value: 'tarjeta_debito' },
        { label: 'Débito automático', value: 'debito_automatico' }
    ];

    // Datos mock para General
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: 1,
            codigo: "EFC",
            nombre: "Efectivo",
            relacionCon: "proveedor",
            cuentaContable: "11050501 - Caja general",
            medioPago: ["efectivo"],
            enUso: true,
            fechaCreacion: "2023-01-15"
        },
        {
            id: 2,
            codigo: "CRE",
            nombre: "Crédito",
            relacionCon: "cliente",
            cuentaContable: "13050501 - Clientes nacionales",
            medioPago: ["tarjeta_credito"],
            enUso: true,
            fechaCreacion: "2023-02-20"
        }
    ]);

    // Datos mock para Pago en línea
    const [paymentMethodsOnline, setPaymentMethodsOnline] = useState<PaymentMethod[]>([
        {
            id: 1,
            codigo: "PAY",
            nombre: "PayPal",
            relacionCon: "cliente",
            cuentaContable: "11050502 - Cuentas en línea",
            medioPago: ["transferencia"],
            enUso: true,
            fechaCreacion: "2023-04-15"
        },
        {
            id: 2,
            codigo: "MP",
            nombre: "Mercado Pago",
            relacionCon: "cliente",
            cuentaContable: "13050502 - Clientes en línea",
            medioPago: ["tarjeta_credito", "tarjeta_debito"],
            enUso: true,
            fechaCreacion: "2023-05-20"
        }
    ]);

    // Funciones para edición de celdas (General)
    const onCellClick = (rowIndex: number, field: string, value: any) => {
        setEditingRow(rowIndex);
        setEditingField(field);
        setEditingValue(value);
    };

    const onCellEditComplete = (e: { rowIndex: number, field: string, value: any }) => {
        const updatedData = [...paymentMethods];
        updatedData[e.rowIndex][e.field] = e.value;
        setPaymentMethods(updatedData);
        setEditingRow(null);
        setEditingField(null);
    };

    // Funciones para edición de celdas (Pago en línea)
    const onCellClickOnline = (rowIndex: number, field: string, value: any) => {
        setEditingRowOnline(rowIndex);
        setEditingFieldOnline(field);
        setEditingValueOnline(value);
    };

    const onCellEditCompleteOnline = (e: { rowIndex: number, field: string, value: any }) => {
        const updatedData = [...paymentMethodsOnline];
        updatedData[e.rowIndex][e.field] = e.value;
        setPaymentMethodsOnline(updatedData);
        setEditingRowOnline(null);
        setEditingFieldOnline(null);
    };

    // Renderizado de celdas editables (General)
    const renderCellEditor = (rowData: PaymentMethod, field: string, rowIndex: number) => {
        if (editingRow === rowIndex && editingField === field) {
            return (
                <InputText
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => onCellEditComplete({ rowIndex, field, value: editingValue })}
                    onKeyPress={(e) => e.key === 'Enter' && onCellEditComplete({ rowIndex, field, value: editingValue })}
                />
            );
        }
        return <span onClick={() => onCellClick(rowIndex, field, rowData[field])}>{rowData[field]}</span>;
    };

    // Renderizado de celdas editables (Pago en línea)
    const renderCellEditorOnline = (rowData: PaymentMethod, field: string, rowIndex: number) => {
        if (editingRowOnline === rowIndex && editingFieldOnline === field) {
            return (
                <InputText
                    autoFocus
                    value={editingValueOnline}
                    onChange={(e) => setEditingValueOnline(e.target.value)}
                    onBlur={() => onCellEditCompleteOnline({ rowIndex, field, value: editingValueOnline })}
                    onKeyPress={(e) => e.key === 'Enter' && onCellEditCompleteOnline({ rowIndex, field, value: editingValueOnline })}
                />
            );
        }
        return <span onClick={() => onCellClickOnline(rowIndex, field, rowData[field])}>{rowData[field]}</span>;
    };

    // Templates comunes para ambas tablas
    const relacionConBodyTemplate = (rowData: PaymentMethod) => {
        const option = relacionOptions.find(opt => opt.value === rowData.relacionCon);
        return option ? option.label : rowData.relacionCon;
    };

    const medioPagoBodyTemplate = (rowData: PaymentMethod) => {
        return rowData.medioPago.map(mp => {
            const option = medioPagoOptions.find(opt => opt.value === mp);
            return option ? (
                <span key={mp} className="badge bg-primary me-1">
                    {option.label}
                </span>
            ) : null;
        });
    };

    const fechaBodyTemplate = (rowData: PaymentMethod) => {
        return new Date(rowData.fechaCreacion).toLocaleDateString('es-CO');
    };

    // Handlers para switches (General)
    const onEnUsoChange = (rowIndex: number, value: boolean) => {
        const updatedData = [...paymentMethods];
        updatedData[rowIndex].enUso = value;
        setPaymentMethods(updatedData);
    };

    // Handlers para switches (Pago en línea)
    const onEnUsoChangeOnline = (rowIndex: number, value: boolean) => {
        const updatedData = [...paymentMethodsOnline];
        updatedData[rowIndex].enUso = value;
        setPaymentMethodsOnline(updatedData);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h2 className="h4 mb-0">Gestión de Métodos de Pago</h2>
                </div>

                <div className="card-body">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        {/* Pestaña General */}
                        <TabPanel header="General" leftIcon="pi pi-list me-2">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="p-input-icon-left w-100">
                                        <i className="pi pi-search" />
                                        <InputText
                                            placeholder="Buscar en todos los campos..."
                                            className="w-100"
                                            onInput={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                setFilters({
                                                    ...filters,
                                                    global: { value: target.value, matchMode: FilterMatchMode.CONTAINS }
                                                });
                                            }}
                                        />
                                    </span>
                                </div>

                                <DataTable
                                    value={paymentMethods}
                                    paginator
                                    rows={5}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    filters={filters}
                                    globalFilterFields={['codigo', 'nombre', 'relacionCon', 'cuentaContable']}
                                    emptyMessage="No se encontraron métodos de pago"
                                    editMode="cell"
                                    responsiveLayout="scroll"
                                    className="border-0"
                                >
                                    <Column
                                        field="enUso"
                                        header="En Uso"
                                        body={(rowData, { rowIndex }) => (
                                            <InputSwitch
                                                checked={rowData.enUso}
                                                onChange={(e) => onEnUsoChange(rowIndex, e.value)}
                                            />
                                        )}
                                        style={{ width: '90px' }}
                                    />

                                    <Column
                                        field="codigo"
                                        header="Código"
                                        filter
                                        filterPlaceholder="Buscar código"
                                        body={(rowData, { rowIndex }) => renderCellEditor(rowData, 'codigo', rowIndex)}
                                        sortable
                                    />

                                    <Column
                                        field="nombre"
                                        header="Nombre"
                                        filter
                                        filterPlaceholder="Buscar nombre"
                                        body={(rowData, { rowIndex }) => renderCellEditor(rowData, 'nombre', rowIndex)}
                                        sortable
                                    />

                                    <Column
                                        field="relacionCon"
                                        header="Relación con"
                                        filter
                                        filterPlaceholder="Buscar relación"
                                        body={relacionConBodyTemplate}
                                        sortable
                                    />

                                    <Column
                                        field="cuentaContable"
                                        header="Cuenta Contable"
                                        filter
                                        filterPlaceholder="Buscar cuenta"
                                        body={(rowData, { rowIndex }) => renderCellEditor(rowData, 'cuentaContable', rowIndex)}
                                        sortable
                                    />

                                    <Column
                                        field="medioPago"
                                        header="Medio de pago D. Electrónico"
                                        body={medioPagoBodyTemplate}
                                    />

                                    <Column
                                        field="fechaCreacion"
                                        header="Fecha Creación"
                                        body={fechaBodyTemplate}
                                        sortable
                                    />
                                </DataTable>
                            </div>
                        </TabPanel>

                        {/* Pestaña Pago en línea */}
                        <TabPanel header="Pago en línea" leftIcon="pi pi-globe me-2">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="p-input-icon-left w-100">
                                        <i className="pi pi-search" />
                                        <InputText
                                            placeholder="Buscar en todos los campos..."
                                            className="w-100"
                                            onInput={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                setFiltersOnline({
                                                    ...filtersOnline,
                                                    global: { value: target.value, matchMode: FilterMatchMode.CONTAINS }
                                                });
                                            }}
                                        />
                                    </span>
                                </div>

                                <DataTable
                                    value={paymentMethodsOnline}
                                    paginator
                                    rows={5}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    filters={filtersOnline}
                                    globalFilterFields={['codigo', 'nombre', 'relacionCon', 'cuentaContable']}
                                    emptyMessage="No se encontraron métodos de pago en línea"
                                    editMode="cell"
                                    responsiveLayout="scroll"
                                    className="border-0"
                                >
                                    <Column
                                        field="enUso"
                                        header="En Uso"
                                        body={(rowData, { rowIndex }) => (
                                            <InputSwitch
                                                checked={rowData.enUso}
                                                onChange={(e) => onEnUsoChangeOnline(rowIndex, e.value)}
                                            />
                                        )}
                                        style={{ width: '90px' }}
                                    />

                                    <Column
                                        field="codigo"
                                        header="Código"
                                        filter
                                        filterPlaceholder="Buscar código"
                                        body={(rowData, { rowIndex }) => renderCellEditorOnline(rowData, 'codigo', rowIndex)}
                                        sortable
                                    />

                                    <Column
                                        field="nombre"
                                        header="Nombre"
                                        filter
                                        filterPlaceholder="Buscar nombre"
                                        body={(rowData, { rowIndex }) => renderCellEditorOnline(rowData, 'nombre', rowIndex)}
                                        sortable
                                    />

                                    <Column
                                        field="relacionCon"
                                        header="Relación con"
                                        filter
                                        filterPlaceholder="Buscar relación"
                                        body={relacionConBodyTemplate}
                                        sortable
                                    />

                                    <Column
                                        field="cuentaContable"
                                        header="Cuenta Contable"
                                        filter
                                        filterPlaceholder="Buscar cuenta"
                                        body={(rowData, { rowIndex }) => renderCellEditorOnline(rowData, 'cuentaContable', rowIndex)}
                                        sortable
                                    />

                                    <Column
                                        field="medioPago"
                                        header="Medio de pago D. Electrónico"
                                        body={medioPagoBodyTemplate}
                                    />

                                    <Column
                                        field="fechaCreacion"
                                        header="Fecha Creación"
                                        body={fechaBodyTemplate}
                                        sortable
                                    />
                                </DataTable>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>

                <div className="card-footer bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Total métodos: {paymentMethods.length} |
                            Total métodos en línea: {paymentMethodsOnline.length}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};