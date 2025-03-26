import React, { useState } from "react";
import {
    TabView,
    TabPanel,
    DataTable,
    Column,
    InputText,
    InputSwitch,
    Dropdown,
    Button,
    Calendar,
    MultiSelect,
    FilterMatchMode,
    FilterOperator
} from "primereact";


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
interface NewMethod {
    nombre: string;
    codigo: string;
    cuentaContable: string;
    medioPago: string[]; // Cambiado de never[] a string[]
}
export const NewPaymentMethod: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const [newMethod, setNewMethod] = useState<NewMethod>({
        nombre: '',
        codigo: '',
        cuentaContable: '',
        medioPago: [] // Ahora es un string[] vacío en lugar de never[]
    });

    // Filtros para la tabla
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

    // Datos mock
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
        },
        {
            id: 3,
            codigo: "TD",
            nombre: "Tarjeta Débito",
            relacionCon: "cliente",
            cuentaContable: "1110501 - Billetera privada",
            medioPago: ["tarjeta_debito", "transferencia"],
            enUso: false,
            fechaCreacion: "2023-03-10"
        }
    ]);

    // Funciones para edición de celdas
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

    const onEnUsoChange = (rowIndex: number, value: boolean) => {
        const updatedData = [...paymentMethods];
        updatedData[rowIndex].enUso = value;
        setPaymentMethods(updatedData);
    };

    // Funciones para el formulario de nuevo método
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMethod(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (e: { value: string[] }) => {
        setNewMethod(prev => ({
            ...prev,
            medioPago: e.value
        }));
    };
    const handleAddMethod = () => {
        const newId = Math.max(...paymentMethods.map(p => p.id), 0) + 1;
        const newPaymentMethod: PaymentMethod = {
            id: newId,
            codigo: newMethod.codigo,
            nombre: newMethod.nombre,
            relacionCon: "proveedor",
            cuentaContable: newMethod.cuentaContable,
            medioPago: newMethod.medioPago,
            enUso: true,
            fechaCreacion: new Date().toISOString().split('T')[0]
        };

        setPaymentMethods([...paymentMethods, newPaymentMethod]);
        setNewMethod({
            nombre: '',
            codigo: '',
            cuentaContable: '',
            medioPago: []
        });
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h2 className="h4 mb-0">Gestión de Métodos de Pago</h2>
                </div>

                <div className="card-body">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        {/* Pestaña de Métodos Existentes */}
                        <TabPanel header="Métodos de Pago" leftIcon="pi pi-list me-2">
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
                                        header="Medio de Pago"
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

                        {/* Pestaña para agregar nuevo método */}
                        <TabPanel header="Nuevo Método" leftIcon="pi pi-plus me-2">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Método</label>
                                        <InputText
                                            id="nombre"
                                            name="nombre"
                                            value={newMethod.nombre}
                                            onChange={handleInputChange}
                                            className="w-100"
                                            placeholder="Ej: Transferencia Bancaria"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="codigo" className="form-label">Código</label>
                                        <InputText
                                            id="codigo"
                                            name="codigo"
                                            value={newMethod.codigo}
                                            onChange={handleInputChange}
                                            className="w-100"
                                            placeholder="Ej: TRF"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="cuentaContable" className="form-label">Cuenta Contable</label>
                                        <InputText
                                            id="cuentaContable"
                                            name="cuentaContable"
                                            value={newMethod.cuentaContable}
                                            onChange={handleInputChange}
                                            className="w-100"
                                            placeholder="Ej: 11050501 - Caja general"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="medioPago" className="form-label">Medios de Pago</label>
                                        <MultiSelect
                                            id="medioPago"
                                            value={newMethod.medioPago}
                                            options={medioPagoOptions}
                                            onChange={handleMultiSelectChange}
                                            placeholder="Seleccione medios"
                                            className="w-100"
                                            filter
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <Button
                                    label="Agregar Método"
                                    icon="pi pi-check"
                                    className="p-button-primary"
                                    onClick={handleAddMethod}
                                    disabled={!newMethod.nombre || !newMethod.codigo}
                                />
                            </div>
                        </TabPanel>
                    </TabView>
                </div>

                <div className="card-footer bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Total métodos: {paymentMethods.length}</small>
                    </div>
                </div>
            </div>
        </div>
    );
};