import React from "react";
import { ComparativeStatusResultResponse } from "../../billing/reports/hooks/useComparativeStatusResult";
import { ComparativeAccount } from "../../billing/reports/StatusResult";

export const ComparativeStatusResultFormat: React.FC<{
    comparativeIncomeStatementData: ComparativeStatusResultResponse
}> = ({ comparativeIncomeStatementData }) => {

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

    const renderComparativeAccountTable = (accounts: ComparativeAccount[], title: string, period: 'current' | 'previous') => {
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title} ({period === 'current' ? 'Periodo Actual' : 'Periodo Anterior'})</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cuenta</th>
                            <th>Créditos</th>
                            <th>Débitos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => (
                            <tr key={account.codigo}>
                                <td>{account.codigo}</td>
                                <td>{account.nombre}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(account.total_creditos)}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(account.total_debitos)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return <>

        <div>
            <h3>Estado de Resultados Comparativo</h3>

            <table className="table table-bordered" style={{ width: '100%', marginBottom: '1rem' }}>
                <tbody>
                    <tr>
                        <th style={{ width: '50%', textAlign: 'left' }}>
                            <h4>Periodo Actual</h4>
                            <p className="mb-0">
                                {comparativeIncomeStatementData.periodo.desde.current} al {comparativeIncomeStatementData.periodo.hasta.current}
                            </p>
                        </th>
                        <th style={{ width: '50%', textAlign: 'right' }}>
                            <h4>Periodo Anterior</h4>
                            {comparativeIncomeStatementData.periodo.desde.previous} al {comparativeIncomeStatementData.periodo.hasta.previous}
                        </th>
                    </tr>
                </tbody>
            </table>

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
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Categoría</th>
                            <th scope="col">Total Créditos</th>
                            <th scope="col">Total Débitos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparativeIncomeStatementData.detalles.current.map((row) => (
                            <tr key={row.categoria}>
                                <td>{row.categoria}</td>
                                <td className="text-end">{formatCurrency(row.total_creditos)}</td>
                                <td className="text-end">{formatCurrency(row.total_debitos)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-4">
                <h5>Detalles por Categoría - Periodo Anterior</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Categoría</th>
                            <th scope="col">Total Créditos</th>
                            <th scope="col">Total Débitos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparativeIncomeStatementData.detalles.previous.map((row) => (
                            <tr key={row.categoria}>
                                <td>{row.categoria}</td>
                                <td className="text-end">{formatCurrency(row.total_creditos)}</td>
                                <td className="text-end">{formatCurrency(row.total_debitos)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current')}
            {renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')}
        </div>

        <style>{`
            body {
                margin: 0;
                padding: 0;
                color: #000;
                background: #fff;
            }

            .no-print {
                display: none !important;
            }

            .table {
                width: 100%;
                font-size: 12px;
                border-collapse: collapse;
            }

            .table td, .table th {
                border: 1px solid #ccc !important;
                padding: 4px 8px !important;
            }

            .table-secondary {
                background-color: #eaeaea !important;
            }

            .text-end {
                text-align: right !important;
            }
        `}</style>
    </>
};
