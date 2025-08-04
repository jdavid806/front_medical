import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
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
            <div className="mb-4">
                <h5 className="mb-3">{title}</h5>
                <DataTable value={accounts} className="p-datatable-sm" showGridlines>
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
            </div>
        );
    };

    const renderComparativeAccountTable = (accounts: ComparativeAccount[], title: string, period: 'current' | 'previous') => {
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title} ({period === 'current' ? 'Periodo Actual' : 'Periodo Anterior'})</h5>
                <DataTable value={accounts} className="p-datatable-sm" showGridlines>
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
            </div>
        );
    };

    const renderSimpleReport = () => {
        return (
            <div>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Rango de fechas</label>
                        <Calendar
                            value={dateRange}
                            onChange={(e) => setDateRange(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione un rango de fechas"
                        />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                        <Button
                            label="Generar Reporte"
                            icon="pi pi-refresh"
                            className="btn btn-primary"
                            onClick={fetchStatusResult}
                        />
                        <Button icon={<i className='fas fa-file-pdf'></i>} label="Exportar a PDF" className="mr-2" onClick={exportToPdfSimpleReport} />
                    </div>
                </div>

                <Card title={`Estado de Resultados (${incomeStatementData.periodo.desde} al ${incomeStatementData.periodo.hasta})`}>
                    <div className="mb-4">
                        <h5>Resumen</h5>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <td><strong>Ingresos</strong></td>
                                    <td className="text-end">{formatCurrency(incomeStatementData.resumen.ingresos)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Costos</strong></td>
                                    <td className="text-end">{formatCurrency(incomeStatementData.resumen.costos)}</td>
                                </tr>
                                <tr className="table-secondary">
                                    <td><strong>Utilidad Bruta</strong></td>
                                    <td className="text-end">{formatCurrency(incomeStatementData.resumen.utilidad_bruta)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Gastos</strong></td>
                                    <td className="text-end">{formatCurrency(incomeStatementData.resumen.gastos)}</td>
                                </tr>
                                <tr className="table-success">
                                    <td><strong>Utilidad Neta</strong></td>
                                    <td className="text-end">{formatCurrency(incomeStatementData.resumen.utilidad_neta)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-4">
                        <h5>Detalles por Categoría</h5>
                        <DataTable value={incomeStatementData.detalles} className="p-datatable-sm" showGridlines>
                            <Column field="categoria" header="Categoría" />
                            <Column
                                field="total_creditos"
                                header="Total Créditos"
                                body={(rowData) => formatCurrency(rowData.total_creditos)}
                                style={{ textAlign: 'right', width: '150px' }}
                            />
                            <Column
                                field="total_debitos"
                                header="Total Débitos"
                                body={(rowData) => formatCurrency(rowData.total_debitos)}
                                style={{ textAlign: 'right', width: '150px' }}
                            />
                        </DataTable>
                    </div>

                    {renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")}
                </Card>
            </div>
        );
    };

    const renderComparativeReport = () => {
        return (
            <div>
                <div className="row mb-4">
                    <div className="col-md-5">
                        <label className="form-label">Periodo Actual</label>
                        <Calendar
                            value={dateRangePeriodOne}
                            onChange={(e) => setDateRangePeriodOne(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione rango de fechas"
                        />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Periodo Anterior</label>
                        <Calendar
                            value={dateRangePeriodTwo}
                            onChange={(e) => setDateRangePeriodTwo(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            className="w-100"
                            placeholder="Seleccione rango de fechas"
                        />
                    </div>
                    <div className="col-md-12 d-flex align-items-end gap-2">
                        <Button
                            label="Comparar"
                            icon="pi pi-refresh"
                            className="btn btn-primary w-100"
                            onClick={fetchComparativeStatusResult}
                        />
                        <Button icon={<i className='fas fa-file-pdf'></i>} label="Exportar a PDF" className="mr-2" onClick={exportToPdfComparativeReport} />
                    </div>
                </div>

                <Card title="Estado de Resultados Comparativo">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h6>Periodo Actual</h6>
                                    <p className="mb-0">
                                        {comparativeIncomeStatementData.periodo.desde.current} al {comparativeIncomeStatementData.periodo.hasta.current}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h6>Periodo Anterior</h6>
                                    <p className="mb-0">
                                        {comparativeIncomeStatementData.periodo.desde.previous} al {comparativeIncomeStatementData.periodo.hasta.previous}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5>Resumen Comparativo</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th className="text-end">Periodo Actual</th>
                                    <th className="text-end">Periodo Anterior</th>
                                    <th className="text-end">Diferencia</th>
                                    <th className="text-end">% Cambio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Ingresos</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.ingresos.current)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.ingresos.previous)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.ingresos.difference)}</td>
                                    <td className="text-end">{formatPercentage(comparativeIncomeStatementData.resumen.ingresos.percentage_change)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Costos</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.costos.current)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.costos.previous)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.costos.difference)}</td>
                                    <td className="text-end">{formatPercentage(comparativeIncomeStatementData.resumen.costos.percentage_change)}</td>
                                </tr>
                                <tr className="table-secondary">
                                    <td><strong>Utilidad Bruta</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.utilidad_bruta.current)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.utilidad_bruta.previous)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.utilidad_bruta.difference)}</td>
                                    <td className="text-end">{formatPercentage(comparativeIncomeStatementData.resumen.utilidad_bruta.percentage_change)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Gastos</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.gastos.current)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.gastos.previous)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.gastos.difference)}</td>
                                    <td className="text-end">{formatPercentage(comparativeIncomeStatementData.resumen.gastos.percentage_change)}</td>
                                </tr>
                                <tr className="table-success">
                                    <td><strong>Utilidad Neta</strong></td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.utilidad_neta.current)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.utilidad_neta.previous)}</td>
                                    <td className="text-end">{formatCurrency(comparativeIncomeStatementData.resumen.utilidad_neta.difference)}</td>
                                    <td className="text-end">{formatPercentage(comparativeIncomeStatementData.resumen.utilidad_neta.percentage_change)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-4">
                        <h5>Detalles por Categoría - Periodo Actual</h5>
                        <DataTable
                            value={comparativeIncomeStatementData.detalles.current}
                            className="p-datatable-sm"
                            showGridlines
                        >
                            <Column field="categoria" header="Categoría" />
                            <Column
                                field="total_creditos"
                                header="Total Créditos"
                                body={(rowData) => formatCurrency(rowData.total_creditos)}
                                style={{ textAlign: 'right', width: '150px' }}
                            />
                            <Column
                                field="total_debitos"
                                header="Total Débitos"
                                body={(rowData) => formatCurrency(rowData.total_debitos)}
                                style={{ textAlign: 'right', width: '150px' }}
                            />
                        </DataTable>
                    </div>

                    <div className="mb-4">
                        <h5>Detalles por Categoría - Periodo Anterior</h5>
                        <DataTable
                            value={comparativeIncomeStatementData.detalles.previous}
                            className="p-datatable-sm"
                            showGridlines
                        >
                            <Column field="categoria" header="Categoría" />
                            <Column
                                field="total_creditos"
                                header="Total Créditos"
                                body={(rowData) => formatCurrency(rowData.total_creditos)}
                                style={{ textAlign: 'right', width: '150px' }}
                            />
                            <Column
                                field="total_debitos"
                                header="Total Débitos"
                                body={(rowData) => formatCurrency(rowData.total_debitos)}
                                style={{ textAlign: 'right', width: '150px' }}
                            />
                        </DataTable>
                    </div>

                    {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current')}
                    {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')}
                </Card>
            </div>
        );
    };

    return (
        <div className="container-fluid mt-4">
            <Card title="Reporte de Estados de Resultados">
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Un Período">
                        {renderSimpleReport()}
                    </TabPanel>
                    <TabPanel header="Comparativa">
                        {renderComparativeReport()}
                    </TabPanel>
                </TabView>
            </Card>
        </div>
    );
};