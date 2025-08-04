import React from "react";
import { Card } from "primereact/card";
import { BalanceGeneralResponse } from "../../billing/reports/hooks/useBalanceGeneral";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { StatusResultResponse } from "../../billing/reports/hooks/useStatusResult";
import { Account } from "../../billing/reports/StatusResult";

export const StatusResultFormat: React.FC<{
    incomeStatementData: StatusResultResponse
}> = ({ incomeStatementData }) => {

    const formatCurrency = (value: number | string) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numValue);
    };

    const renderAccountTable = (accounts: Account[], title: string) => {
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title}</h5>
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
                        {accounts.map((account) => (
                            <tr key={account.codigo}>
                                <td>{account.codigo}</td>
                                <td>{account.nombre}</td>
                                <td className="text-end">{formatCurrency(account.total_creditos)}</td>
                                <td className="text-end">{formatCurrency(account.total_debitos)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return <>

        <h3>Estado de Resultados ({incomeStatementData.periodo.desde} al {incomeStatementData.periodo.hasta})</h3>

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
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Total Créditos</th>
                        <th>Total Débitos</th>
                    </tr>
                </thead>
                <tbody>
                    {incomeStatementData.detalles.map((detalle) => (
                        <tr key={detalle.categoria}>
                            <td>{detalle.categoria}</td>
                            <td className="text-end">{formatCurrency(detalle.total_creditos)}</td>
                            <td className="text-end">{formatCurrency(detalle.total_debitos)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")}

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