import React from "react";
import { Card } from "primereact/card";
import { BalanceGeneralResponse } from "../../billing/reports/hooks/useBalanceGeneral";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Account } from "../../billing/reports/BalanceSheet";

export const BalanceGeneralFormat: React.FC<{
    balanceSheetData: BalanceGeneralResponse,
    date: string
}> = ({ balanceSheetData, date }) => {

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

    const renderAccountTable = (accounts: Account[], title: string) => {
        return (
            <div className="mb-4">
                <h5 className="mb-3">{title}</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>Código</th>
                            <th>Cuenta</th>
                            <th style={{ width: '180px', textAlign: 'right' }}>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterAccountsByType(accounts).map(account => (
                            <tr key={account.account_code}>
                                <td>{account.account_code}</td>
                                <td>{account.account_name}</td>
                                <td className="text-end">{formatCurrency(account.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return <>

        <h3>Balance general | {date}</h3>

        {renderAccountTable(balanceSheetData.categories.assets, "Activos")}
        {renderAccountTable(balanceSheetData.categories.liabilities, "Pasivos")}
        {renderAccountTable(balanceSheetData.categories.equity, "Patrimonio")}

        <div className="mt-4">
            <h5>Totales</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total Activos</strong></td>
                        <td className="text-end">{formatCurrency(balanceSheetData.totals.assets)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Pasivos</strong></td>
                        <td className="text-end">{formatCurrency(balanceSheetData.totals.liabilities)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Patrimonio</strong></td>
                        <td className="text-end">{formatCurrency(balanceSheetData.totals.equity)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td><strong>Diferencia</strong></td>
                        <td className="text-end">{formatCurrency(balanceSheetData.difference)}</td>
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