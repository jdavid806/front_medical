import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useStatusResult } from './hooks/useStatusResult';
import { useComparativeStatusResult } from './hooks/useComparativeStatusResult';
import { useStatusResultFormat } from '../../documents-generation/hooks/useStatusResultFormat';
import { useComparativeStatusResultFormat } from '../../documents-generation/hooks/useComparativeStatusResultFormat';

export type Account = {
    codigo: string;
    nombre: string;
    categoria: string;
    total_creditos: string;
    total_debitos: string;
};

export type ComparativeAccount = {
    codigo: string;
    nombre: string;
    categoria: string;
    total_creditos: string;
    total_debitos: string;
};

type IncomeStatementData = {
    periodo: {
        desde: string;
        hasta: string;
    };
    resumen: {
        ingresos: number;
        costos: number;
        gastos: number;
        utilidad_bruta: number;
        utilidad_neta: number;
    };
    detalles: {
        categoria: string;
        total_creditos: string;
        total_debitos: string;
    }[];
    cuentas: Account[];
};

type ComparativeIncomeStatementData = {
    periodo: {
        desde: {
            current: string;
            previous: string;
            difference: number | null;
            percentage_change: number | null;
        };
        hasta: {
            current: string;
            previous: string;
            difference: number | null;
            percentage_change: number | null;
        };
    };
    resumen: {
        ingresos: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        costos: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        gastos: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        utilidad_bruta: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
        utilidad_neta: {
            current: number;
            previous: number;
            difference: number;
            percentage_change: number | null;
        };
    };
    detalles: {
        current: {
            categoria: string;
            total_creditos: string;
            total_debitos: string;
        }[];
        previous: {
            categoria: string;
            total_creditos: string;
            total_debitos: string;
        }[];
        difference: number | null;
        percentage_change: number | null;
    };
    cuentas: {
        current: ComparativeAccount[];
        previous: ComparativeAccount[];
        difference: number | null;
        percentage_change: number | null;
    };
};

export const StatusResult: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const { dateRange, setDateRange, statusResult: incomeStatementData, fetchStatusResult } = useStatusResult();
    const { dateRangePeriodOne, setDateRangePeriodOne, dateRangePeriodTwo, setDateRangePeriodTwo, comparativeStatusResult: comparativeIncomeStatementData, fetchComparativeStatusResult } = useComparativeStatusResult();
    const { generateStatusResultFormat } = useStatusResultFormat();
    const { generateComparativeStatusResultFormat } = useComparativeStatusResultFormat();

    const formatCurrency = (value: number | string) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numValue);
    };

    const formatPercentage = (value: number | null) => {
        if (value === null) return 'N/A';
        return new Intl.NumberFormat('es-DO', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    const getPercentageColor = (value: number | null) => {
        if (value === null) return 'secondary';
        return value > 0 ? 'success' : value < 0 ? 'danger' : 'info';
    };

    const exportToPdfSimpleReport = () => {
        generateStatusResultFormat(
            incomeStatementData,
            'Impresion'
        );
    };

    const exportToPdfComparativeReport = () => {
        generateComparativeStatusResultFormat(comparativeIncomeStatementData, 'Impresion');
    };

    const renderAccountTable = (accounts: Account[], title: string) => {
        return (
            <Panel header={title} toggleable className="mb-4">
                <DataTable
                    value={accounts}
                    className="p-datatable-sm"
                    showGridlines
                    paginator
                    rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuentas"
                >
                    <Column field="codigo" header="Código" style={{ width: '120px' }} />
                    <Column field="nombre" header="Cuenta" />
                    <Column
                        field="total_creditos"
                        header="Créditos"
                        body={(rowData) => formatCurrency(rowData.total_creditos)}
                        style={{ textAlign: 'right', width: '150px' }}
                    />
                    <Column
                        field="total_debitos"
                        header="Débitos"
                        body={(rowData) => formatCurrency(rowData.total_debitos)}
                        style={{ textAlign: 'right', width: '150px' }}
                    />
                </DataTable>
            </Panel>
        );
    };

    const renderComparativeAccountTable = (accounts: ComparativeAccount[], title: string, period: 'current' | 'previous') => {
        return (
            <Panel
                header={`${title} (${period === 'current' ? 'Periodo Actual' : 'Periodo Anterior'})`}
                toggleable
                className="mb-4"
            >
                <DataTable
                    value={accounts}
                    className="p-datatable-sm"
                    showGridlines
                    paginator
                    rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuentas"
                >
                    <Column field="codigo" header="Código" style={{ width: '100px' }} />
                    <Column field="nombre" header="Cuenta" style={{ width: '200px' }} />
                    <Column
                        field="total_creditos"
                        header="Créditos"
                        body={(rowData) => formatCurrency(rowData.total_creditos)}
                        style={{ textAlign: 'right', width: '150px' }}
                    />
                    <Column
                        field="total_debitos"
                        header="Débitos"
                        body={(rowData) => formatCurrency(rowData.total_debitos)}
                        style={{ textAlign: 'right', width: '150px' }}
                    />
                </DataTable>
            </Panel>
        );
    };

    const renderSimpleReport = () => {
        return (
            <div>
                {/* Filtros */}
                <Card className="mb-4 shadow-sm">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Rango de Fechas</label>
                            <Calendar
                                value={dateRange}
                                onChange={(e) => setDateRange(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                className="w-100"
                                placeholder="Seleccione un rango de fechas"
                                showIcon
                            />
                        </div>
                        <div className="col-md-6 d-flex gap-2">
                            <Button
                                label="Generar Reporte"
                                className=" p-btn-primary flex-grow-1"
                                onClick={fetchStatusResult}
                            > <i className="fa fa-refresh" aria-hidden="true"></i>
                            </Button>
                            <Button
                                icon="pi pi-file-pdf"
                                label="Exportar PDF"
                                className="p-button-danger flex-grow-1"
                                onClick={exportToPdfSimpleReport}
                            />
                        </div>
                    </div>
                </Card>

                {/* Reporte Principal */}
                <Card
                    title={
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Estado de Resultados</span>
                            <Badge
                                value={`${incomeStatementData.periodo.desde} al ${incomeStatementData.periodo.hasta}`}
                                className="p-2"
                            />
                        </div>
                    }
                    className="shadow-sm"
                >
                    {/* Resumen */}
                    <Panel header="Resumen Ejecutivo" toggleable className="mb-4">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="card border-0 bg-light-success">
                                    <div className="card-body text-center">
                                        <i className="pi pi-arrow-up-right text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <h5 className="text-success">{formatCurrency(incomeStatementData.resumen.ingresos)}</h5>
                                        <small className="text-muted">Ingresos Totales</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 bg-light-warning">
                                    <div className="card-body text-center">
                                        <i className="pi pi-chart-line text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <h5 className="text-warning">{formatCurrency(incomeStatementData.resumen.utilidad_bruta)}</h5>
                                        <small className="text-muted">Utilidad Bruta</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 bg-light-primary">
                                    <div className="card-body text-center">
                                        <i className="pi pi-dollar text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
                                        <h5 className="text-primary">{formatCurrency(incomeStatementData.resumen.utilidad_neta)}</h5>
                                        <small className="text-muted">Utilidad Neta</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <table className="table table-hover">
                            <tbody>
                                <tr>
                                    <td className="fw-semibold">Ingresos</td>
                                    <td className="text-end text-success fw-bold">{formatCurrency(incomeStatementData.resumen.ingresos)}</td>
                                </tr>
                                <tr>
                                    <td className="fw-semibold">Costos</td>
                                    <td className="text-end text-danger fw-bold">{formatCurrency(incomeStatementData.resumen.costos)}</td>
                                </tr>
                                <tr className="table-active">
                                    <td className="fw-bold">Utilidad Bruta</td>
                                    <td className="text-end fw-bold">{formatCurrency(incomeStatementData.resumen.utilidad_bruta)}</td>
                                </tr>
                                <tr>
                                    <td className="fw-semibold">Gastos</td>
                                    <td className="text-end text-warning fw-bold">{formatCurrency(incomeStatementData.resumen.gastos)}</td>
                                </tr>
                                <tr className="table-success">
                                    <td className="fw-bold">Utilidad Neta</td>
                                    <td className="text-end fw-bold">{formatCurrency(incomeStatementData.resumen.utilidad_neta)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Panel>

                    {/* Detalles por Categoría */}
                    <Panel header="Detalles por Categoría" toggleable className="mb-4">
                        <DataTable
                            value={incomeStatementData.detalles}
                            className="p-datatable-sm"
                            showGridlines
                            paginator
                            rows={5}
                        >
                            <Column field="categoria" header="Categoría" />
                            <Column
                                field="total_creditos"
                                header="Total Créditos"
                                body={(rowData) => formatCurrency(rowData.total_creditos)}
                                style={{ textAlign: 'right' }}
                            />
                            <Column
                                field="total_debitos"
                                header="Total Débitos"
                                body={(rowData) => formatCurrency(rowData.total_debitos)}
                                style={{ textAlign: 'right' }}
                            />
                        </DataTable>
                    </Panel>

                    {renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")}
                </Card>
            </div>
        );
    };

    const renderComparativeReport = () => {
        return (
            <div>
                {/* Filtros Comparativos */}
                <Card className="mb-4 shadow-sm">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Periodo Actual</label>
                            <Calendar
                                value={dateRangePeriodOne}
                                onChange={(e) => setDateRangePeriodOne(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                className="w-100"
                                placeholder="Seleccione rango de fechas"
                                showIcon
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Periodo Anterior</label>
                            <Calendar
                                value={dateRangePeriodTwo}
                                onChange={(e) => setDateRangePeriodTwo(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                className="w-100"
                                placeholder="Seleccione rango de fechas"
                                showIcon
                            />
                        </div>
                        <div className="col-md-4 d-flex gap-2">
                            <Button
                                label="Comparar"
                                className="p-btn-primary w-100"
                                onClick={fetchComparativeStatusResult}
                            >
                                <i className="fa fa-refresh me-2"></i>
                            </Button>
                            <Button
                                label="Exportar PDF"
                                className="p-button-danger w-100"
                                onClick={exportToPdfComparativeReport}
                            >
                                <i className="fas fa-file-pdf"></i>
                            </Button>
                        </div>
                    </div>

                </Card >

                {/* Reporte Comparativo */}
                < Card title="Estado de Resultados Comparativo" className="shadow-sm" >
                    {/* Periodos */}
                    < div className="row mb-4" >
                        <div className="col-md-6">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <i className="pi pi-calendar mr-3" style={{ fontSize: '2rem' }}></i>
                                        <div>
                                            <h6 className="mb-1 text-white font-medium">Periodo Actual</h6>
                                            <p className="mb-0 fw-bold">
                                                {comparativeIncomeStatementData.periodo.desde.current} al {comparativeIncomeStatementData.periodo.hasta.current}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card bg-secondary text-white">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <i className="pi pi-calendar-times mr-3" style={{ fontSize: '2rem' }}></i>
                                        <div>
                                            <h6 className="mb-1 text-white font-medium  ">Periodo Anterior</h6>
                                            <p className="mb-0 fw-bold">
                                                {comparativeIncomeStatementData.periodo.desde.previous} al {comparativeIncomeStatementData.periodo.hasta.previous}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >

                    {/* Resumen Comparativo */}
                    < Panel header="Resumen Comparativo" toggleable className="mb-4" >
                        <DataTable
                            value={[
                                { concepto: 'Ingresos', ...comparativeIncomeStatementData.resumen.ingresos },
                                { concepto: 'Costos', ...comparativeIncomeStatementData.resumen.costos },
                                { concepto: 'Utilidad Bruta', ...comparativeIncomeStatementData.resumen.utilidad_bruta },
                                { concepto: 'Gastos', ...comparativeIncomeStatementData.resumen.gastos },
                                { concepto: 'Utilidad Neta', ...comparativeIncomeStatementData.resumen.utilidad_neta }
                            ]}
                            className="p-datatable-sm"
                            showGridlines
                        >
                            <Column field="concepto" header="Concepto" />
                            <Column
                                header="Periodo Actual"
                                body={(rowData) => formatCurrency(rowData.current)}
                                style={{ textAlign: 'right' }}
                            />
                            <Column
                                header="Periodo Anterior"
                                body={(rowData) => formatCurrency(rowData.previous)}
                                style={{ textAlign: 'right' }}
                            />
                            <Column
                                header="Diferencia"
                                body={(rowData) => (
                                    <span className={`fw-bold ${rowData.difference > 0 ? 'text-success' :
                                        rowData.difference < 0 ? 'text-danger' : 'text-muted'
                                        }`}>
                                        {formatCurrency(rowData.difference)}
                                    </span>
                                )}
                                style={{ textAlign: 'right' }}
                            />
                            <Column
                                header="% Cambio"
                                body={(rowData) => (
                                    <Badge
                                        value={formatPercentage(rowData.percentage_change)}
                                        severity={getPercentageColor(rowData.percentage_change)}
                                    />
                                )}
                                style={{ textAlign: 'center' }}
                            />
                        </DataTable>
                    </Panel >

                    {/* Detalles Comparativos */}
                    < div className="row" >
                        <div className="col-md-6">
                            <Panel header="Detalles - Periodo Actual" toggleable className="h-100">
                                <DataTable
                                    value={comparativeIncomeStatementData.detalles.current}
                                    className="p-datatable-sm"
                                    showGridlines
                                    paginator
                                    rows={5}
                                >
                                    <Column field="categoria" header="Categoría" />
                                    <Column
                                        field="total_creditos"
                                        header="Créditos"
                                        body={(rowData) => formatCurrency(rowData.total_creditos)}
                                        style={{ textAlign: 'right' }}
                                    />
                                    <Column
                                        field="total_debitos"
                                        header="Débitos"
                                        body={(rowData) => formatCurrency(rowData.total_debitos)}
                                        style={{ textAlign: 'right' }}
                                    />
                                </DataTable>
                            </Panel>
                        </div>
                        <div className="col-md-6">
                            <Panel header="Detalles - Periodo Anterior" toggleable className="h-100">
                                <DataTable
                                    value={comparativeIncomeStatementData.detalles.previous}
                                    className="p-datatable-sm"
                                    showGridlines
                                    paginator
                                    rows={5}
                                >
                                    <Column field="categoria" header="Categoría" />
                                    <Column
                                        field="total_creditos"
                                        header="Créditos"
                                        body={(rowData) => formatCurrency(rowData.total_creditos)}
                                        style={{ textAlign: 'right' }}
                                    />
                                    <Column
                                        field="total_debitos"
                                        header="Débitos"
                                        body={(rowData) => formatCurrency(rowData.total_debitos)}
                                        style={{ textAlign: 'right' }}
                                    />
                                </DataTable>
                            </Panel>
                        </div>
                    </div >

                    {/* Cuentas Comparativas */}
                    {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current')}
                    {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')}
                </Card >
            </div >
        );
    };

    return (
        <div className="container-fluid mt-4">
            <Card
                title={
                    <div className="d-flex align-items-center">
                        <i className="pi pi-chart-line mr-3 text-primary" style={{ fontSize: '1.5rem' }}></i>
                        <span>Reporte de Estados de Resultados</span>
                    </div>
                }
                className="shadow border-0"
            >
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                    panelContainerClassName="p-3"
                >
                    <TabPanel
                        header={
                            <div className="d-flex align-items-center">
                                <i className="pi pi-chart-bar mr-2"></i>
                                <span>Reporte Simple</span>
                            </div>
                        }
                    >
                        {renderSimpleReport()}
                    </TabPanel>
                    <TabPanel
                        header={
                            <div className="d-flex align-items-center">
                                <i className="pi pi-chart-line mr-2"></i>
                                <span>Análisis Comparativo</span>
                            </div>
                        }
                    >
                        {renderComparativeReport()}
                    </TabPanel>
                </TabView>
            </Card>
        </div>
    );
};