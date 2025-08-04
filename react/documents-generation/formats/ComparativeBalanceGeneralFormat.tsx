import React from "react";
import { Card } from "primereact/card";
import { BalanceGeneralResponse } from "../../billing/reports/hooks/useBalanceGeneral";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Account, ComparativeAccount } from "../../billing/reports/BalanceSheet";
import { ComparativeBalanceGeneralResponse } from "../../billing/reports/hooks/useComparativeBalanceGeneral";

export const ComparativeBalanceGeneralFormat: React.FC<{
    comparativeBalanceSheetData: ComparativeBalanceGeneralResponse
}> = ({ comparativeBalanceSheetData }) => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const filterAccountsByType = <T extends { account_code: string }>(accounts: T[]): T[] => {
        return accounts.filter(account =>
            account.account_code.startsWith('1') ||
            account.account_code.startsWith('2') ||
            account.account_code.startsWith('3')
        );
    };

    const renderComparativeAccountTable = (accounts: ComparativeAccount[], title: string) => {
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title}</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Código</th>
                            <th style={{ width: '200px' }}>Cuenta</th>
                            <th style={{ textAlign: 'right', width: '100px' }}>Periodo 1</th>
                            <th style={{ textAlign: 'right', width: '100px' }}>Periodo 2</th>
                            <th style={{ textAlign: 'right', width: '100px' }}>Diferencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterAccountsByType(accounts).map((rowData, index) => (
                            <tr key={index}>
                                <td>{rowData.account_code}</td>
                                <td>{rowData.account_name}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(rowData.balance_period_1)}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(rowData.balance_period_2)}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(rowData.difference)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return <>

        <table className="table table-bordered" style={{ width: '100%', marginBottom: '1rem' }}>
            <tbody>
                <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>
                        <h4>Periodo 1</h4>
                        <p className="mb-0">{comparativeBalanceSheetData.period_1}</p>
                    </th>
                    <th style={{ width: '50%', textAlign: 'right' }}>
                        <h4>Periodo 2</h4>
                        <p className="mb-0">{comparativeBalanceSheetData.period_2}</p>
                    </th>
                </tr>
            </tbody>
        </table>


        {renderComparativeAccountTable(comparativeBalanceSheetData.comparison.assets, "Activos")}
        {renderComparativeAccountTable(comparativeBalanceSheetData.comparison.liabilities, "Pasivos")}
        {renderComparativeAccountTable(comparativeBalanceSheetData.comparison.equity, "Patrimonio")}

        <div className="mt-4">
            <h5>Totales Comparativos</h5>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Cuenta</th>
                        <th className="text-end">Periodo 1</th>
                        <th className="text-end">Periodo 2</th>
                        <th className="text-end">Diferencia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Total Activos</strong></td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_1)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_2)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.difference)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Pasivos</strong></td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_1)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_2)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.difference)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Patrimonio</strong></td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_1)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_2)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.difference)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td><strong>Resultado del Ejercicio</strong></td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_1)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_2)}</td>
                        <td className="text-end">{formatCurrency(comparativeBalanceSheetData.summary.result_comparison.difference)}</td>
                    </tr>
                </tbody>
            </table>
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