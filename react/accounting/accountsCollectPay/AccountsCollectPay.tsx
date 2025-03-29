import React, { useState, useMemo } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Dropdown } from 'primereact/dropdown';

type AccountItem = {
    id: string;
    invoice_date: string;
    due_date: string;
    supplier_name: string;
    supplier_id: string;
    fiscal_number: string;
    price: number;
    tax: number;
    withholdings: number;
    total: number;
    days_to_pay: number;
    status: 'pending' | 'paid' | 'overdue';
    details: {
        description: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
    }[];
};

type Supplier = {
    id: string;
    name: string;
};

// Datos mock mejorados
const mockSuppliers: Supplier[] = [
    { id: '1', name: 'Distribuidora Alimentos S.A.' },
    { id: '2', name: 'Tecnología Avanzada Ltda.' },
    { id: '3', name: 'Suministros Médicos Unidos' },
    { id: '4', name: 'Construcciones Modernas' },
    { id: '5', name: 'Servicios Corporativos' },
];

const productDescriptions = [
    "Materiales de construcción",
    "Equipos electrónicos",
    "Suministros de oficina",
    "Servicios profesionales",
    "Productos alimenticios",
    "Insumos médicos",
    "Herramientas industriales",
    "Mobiliario",
    "Software",
    "Equipos de seguridad"
];

const randomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const randomDays = (): number => Math.floor(Math.random() * 90) + 1;

const generateDetails = () => {
    const count = Math.floor(Math.random() * 4) + 1;
    return Array.from({ length: count }, (_, i) => ({
        description: productDescriptions[Math.floor(Math.random() * productDescriptions.length)],
        quantity: Math.floor(Math.random() * 10) + 1,
        unit_price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
        subtotal: 0
    })).map(item => ({
        ...item,
        subtotal: parseFloat((item.quantity * item.unit_price).toFixed(2))
    }));
};

const generateAccountData = (type: 'receivable' | 'payable'): AccountItem[] => {
    const items: AccountItem[] = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    for (let i = 1; i <= 15; i++) {
        const invoiceDate = randomDate(oneYearAgo, today);
        const dueDays = randomDays();
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + dueDays);

        const supplier = mockSuppliers[Math.floor(Math.random() * mockSuppliers.length)];
        const details = generateDetails();
        const price = details.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = type === 'receivable' ? price * 0.18 : price * 0.16;
        const withholdings = type === 'receivable' ? price * 0.03 : price * 0.02;
        const total = price + tax - withholdings;
        const daysToPay = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const status = daysToPay < 0 ? 'overdue' : 'pending';

        items.push({
            id: `${type === 'receivable' ? 'rcv' : 'pay'}-${i}`,
            invoice_date: invoiceDate,
            due_date: dueDate.toISOString().split('T')[0],
            supplier_name: supplier.name,
            supplier_id: supplier.id,
            fiscal_number: `FAC-${Math.floor(Math.random() * 10000)}-${new Date(invoiceDate).getFullYear()}`,
            price: parseFloat(price.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            withholdings: parseFloat(withholdings.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            days_to_pay: daysToPay,
            status,
            details
        });
    }

    return items.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
};

export const AccountsCollectPay = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
    const [selectedDateRange, setSelectedDateRange] = useState<Nullable<(Date | null)[]>>(null);
    const [selectedDueDateRange, setSelectedDueDateRange] = useState<Nullable<(Date | null)[]>>(null);
    const [selectedDaysToPay, setSelectedDaysToPay] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Generar datos mock
    const allReceivable = useMemo(() => generateAccountData('receivable'), []);
    const allPayable = useMemo(() => generateAccountData('payable'), []);

    // Filtrar datos
    const filterItems = (items: AccountItem[]) => {
        return items.filter(item => {
            // Filtro por proveedor
            if (selectedSupplierIds.length > 0 && !selectedSupplierIds.includes(item.supplier_id)) {
                return false;
            }

            // Filtro por rango de fechas de factura
            if (selectedDateRange && selectedDateRange[0] && selectedDateRange[1]) {
                const invoiceDate = new Date(item.invoice_date);
                const startDate = new Date(selectedDateRange[0]);
                const endDate = new Date(selectedDateRange[1]);
                endDate.setHours(23, 59, 59, 999);

                if (invoiceDate < startDate || invoiceDate > endDate) {
                    return false;
                }
            }

            // Filtro por rango de fechas de vencimiento
            if (selectedDueDateRange && selectedDueDateRange[0] && selectedDueDateRange[1]) {
                const dueDate = new Date(item.due_date);
                const startDate = new Date(selectedDueDateRange[0]);
                const endDate = new Date(selectedDueDateRange[1]);
                endDate.setHours(23, 59, 59, 999);

                if (dueDate < startDate || dueDate > endDate) {
                    return false;
                }
            }

            // Filtro por días para pagar
            if (selectedDaysToPay) {
                const [min, max] = selectedDaysToPay.split('-').map(Number);
                if (selectedDaysToPay === '60+') {
                    if (item.days_to_pay < 60) return false;
                } else if (max) {
                    if (item.days_to_pay < min || item.days_to_pay > max) return false;
                } else {
                    if (item.days_to_pay !== min) return false;
                }
            }

            return true;
        });
    };

    const accountsReceivable = useMemo(() => filterItems(allReceivable),
        [allReceivable, selectedSupplierIds, selectedDateRange, selectedDueDateRange, selectedDaysToPay]);

    const accountsPayable = useMemo(() => filterItems(allPayable),
        [allPayable, selectedSupplierIds, selectedDateRange, selectedDueDateRange, selectedDaysToPay]);

    const loadingReceivable = false;
    const loadingPayable = false;

    const daysToPayOptions = [
        { label: 'Todos', value: null },
        { label: 'Próximos a vencer (1-5 días)', value: '1-5' },
        { label: '6-10 días', value: '6-10' },
        { label: '11-15 días', value: '11-15' },
        { label: '16-25 días', value: '16-25' },
        { label: '26-35 días', value: '26-35' },
        { label: '36-45 días', value: '36-45' },
        { label: 'Más de 60 días', value: '60+' }
    ];

    const formatoDinero = (cantidad: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(cantidad);
    };

    const obtenerFechaFormateada = (fechaStr: string) => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string, days: number) => {
        if (status === 'paid') return <span className="badge bg-success">Pagado</span>;
        if (status === 'overdue') return <span className="badge bg-danger">Vencido</span>;
        if (days <= 5) return <span className="badge bg-warning text-dark">Por vencer ({days}d)</span>;
        return <span className="badge bg-primary">Pendiente ({days}d)</span>;
    };

    const renderItemDetails = (details: AccountItem['details']) => (
        <div className="mt-3">
            <h5 className="mb-3">Detalle de Factura</h5>
            <div className="table-responsive">
                <table className="table table-bordered table-sm">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '50%' }}>Descripción</th>
                            <th className="text-center">Cantidad</th>
                            <th className="text-end">Precio Unitario</th>
                            <th className="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((detail, idx) => (
                            <tr key={idx}>
                                <td>{detail.description}</td>
                                <td className="text-center">{detail.quantity}</td>
                                <td className="text-end">{formatoDinero(detail.unit_price)}</td>
                                <td className="text-end">{formatoDinero(detail.subtotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAccountItem = (item: AccountItem) => (
        <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
                    <span className="fw-bold">{item.fiscal_number}</span>
                    <span className="badge bg-secondary">{item.supplier_name}</span>
                </div>

                <div className="d-flex gap-4">
                    <div className="text-end">
                        <small className="text-muted d-block">Fecha Factura</small>
                        <span>{obtenerFechaFormateada(item.invoice_date)}</span>
                    </div>

                    <div className="text-end">
                        <small className="text-muted d-block">Fecha Vencimiento</small>
                        <span className={item.status === 'overdue' ? 'text-danger fw-bold' : ''}>
                            {obtenerFechaFormateada(item.due_date)}
                        </span>
                    </div>

                    <div className="text-end">
                        <small className="text-muted d-block">Total</small>
                        <span className="fw-bold">{formatoDinero(item.total)}</span>
                    </div>

                    <div className="text-center">
                        <small className="text-muted d-block">Estado</small>
                        {getStatusBadge(item.status, item.days_to_pay)}
                    </div>
                </div>
            </div>

            {renderItemDetails(item.details)}

            <div className="mt-3 row g-3">
                <div className="col-md-3">
                    <div className="p-2 bg-light rounded">
                        <small className="text-muted d-block">Precio</small>
                        <span>{formatoDinero(item.price)}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="p-2 bg-light rounded">
                        <small className="text-muted d-block">Impuesto</small>
                        <span>{formatoDinero(item.tax)}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="p-2 bg-light rounded">
                        <small className="text-muted d-block">Retenciones</small>
                        <span>{formatoDinero(item.withholdings)}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="p-2 bg-light rounded">
                        <small className="text-muted d-block">Días para pagar</small>
                        <span className={item.days_to_pay <= 5 ? 'text-danger fw-bold' : ''}>
                            {item.days_to_pay} días
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAccordionItems = (items: AccountItem[], loading: boolean) => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            );
        }

        if (!items || items.length === 0) {
            return (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <p className="text-muted">No se encontraron registros con los filtros aplicados</p>
                </div>
            );
        }

        return (
            <div className="accordion custom-accordion">
                {items.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                        <div key={`acc-item-${item.id}`} className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
                                    type="button"
                                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                    aria-expanded={isExpanded}
                                >
                                    <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                                        <span className="fw-bold">{item.fiscal_number} - {item.supplier_name}</span>
                                        <div className="d-flex gap-4">
                                            <span>{obtenerFechaFormateada(item.due_date)}</span>
                                            <span className="fw-bold">{formatoDinero(item.total)}</span>
                                            {getStatusBadge(item.status, item.days_to_pay)}
                                        </div>
                                    </div>
                                </button>
                            </h2>
                            <div
                                className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
                                style={{ transition: 'height 0.3s ease' }}
                            >
                                <div className="accordion-body p-0">
                                    {renderAccountItem(item)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container-fluid py-3">
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h2 className="h5 mb-0">Gestión de Cuentas</h2>
                </div>
                <div className="card-body p-0">
                    <div className="accordion mb-3">
                        <div className="accordion-item border-0">
                            <h2 className="accordion-header" id="filters">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#filtersCollapse"
                                    aria-expanded="false"
                                    aria-controls="filtersCollapse"
                                >
                                    <i className="fas fa-filter me-2"></i> Filtros
                                </button>
                            </h2>
                            <div
                                id="filtersCollapse"
                                className="accordion-collapse collapse p-3"
                                aria-labelledby="filters"
                            >
                                <div className="row g-3">
                                    <div className="col-lg-3 col-md-6">
                                        <label htmlFor="supplierFilter" className="form-label">
                                            Proveedor
                                        </label>
                                        <MultiSelect
                                            id="supplierFilter"
                                            options={mockSuppliers}
                                            optionLabel="name"
                                            optionValue="id"
                                            filter
                                            placeholder="Seleccione proveedores"
                                            className="w-100"
                                            value={selectedSupplierIds}
                                            onChange={(e) => setSelectedSupplierIds(e.value)}
                                            showClear
                                        />
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <label htmlFor="dateRange" className="form-label">
                                            Fecha de Factura
                                        </label>
                                        <Calendar
                                            id="dateRange"
                                            selectionMode="range"
                                            dateFormat="dd/mm/yy"
                                            value={selectedDateRange}
                                            onChange={(e) => setSelectedDateRange(e.value)}
                                            className="w-100"
                                            placeholder="Seleccione un rango"
                                        />
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <label htmlFor="dueDateRange" className="form-label">
                                            Fecha de Vencimiento
                                        </label>
                                        <Calendar
                                            id="dueDateRange"
                                            selectionMode="range"
                                            dateFormat="dd/mm/yy"
                                            value={selectedDueDateRange}
                                            onChange={(e) => setSelectedDueDateRange(e.value)}
                                            className="w-100"
                                            placeholder="Seleccione un rango"
                                        />
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <label htmlFor="daysToPay" className="form-label">
                                            Días para pagar
                                        </label>
                                        <Dropdown
                                            id="daysToPay"
                                            options={daysToPayOptions}
                                            optionLabel="label"
                                            optionValue="value"
                                            value={selectedDaysToPay}
                                            onChange={(e) => setSelectedDaysToPay(e.value)}
                                            className="w-100"
                                            placeholder="Seleccione días"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TabView
                        activeIndex={activeTab}
                        onTabChange={(e) => setActiveTab(e.index)}
                        className="px-3"
                    >
                        <TabPanel header="Cuentas por Cobrar" className="p-0">
                            {renderAccordionItems(accountsReceivable, loadingReceivable)}
                        </TabPanel>
                        <TabPanel header="Cuentas por Pagar" className="p-0">
                            {renderAccordionItems(accountsPayable, loadingPayable)}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
};