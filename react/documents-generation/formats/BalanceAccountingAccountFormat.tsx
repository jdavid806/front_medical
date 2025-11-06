import React from "react";
import { BalanceCuentaContable } from "../../billing/reports/hooks/useBalanceAccountingAccount";

export const BalanceAccountingAccountFormat: React.FC<{
    balanceData: BalanceCuentaContable[],
    dateRange: string
}> = ({ balanceData, dateRange }) => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const renderBalanceTable = () => {
        return (
            <div className="mb-4">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '75px' }}>Código</th>
                            <th style={{ width: '150px' }}>Nombre de Cuenta</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Saldo Inicial</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Total Débito</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Total Crédito</th>
                            <th style={{ width: '100px', textAlign: 'right' }}>Saldo Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balanceData.map(account => (
                            <tr key={account.cuenta_id}>
                                <td>{account.cuenta_codigo || 'Sin código'}</td>
                                <td>{account.cuenta_nombre || 'Sin nombre'}</td>
                                <td className="text-end">{formatCurrency(+account.saldo_inicial)}</td>
                                <td className="text-end">{formatCurrency(account.debe_total)}</td>
                                <td className="text-end">{formatCurrency(account.haber_total)}</td>
                                <td className="text-end" style={{
                                    fontWeight: 'bold',
                                    color: account.saldo_final < 0 ? '#e74c3c' : account.saldo_final > 0 ? '#27ae60' : '#000000'
                                }}>
                                    {formatCurrency(account.saldo_final)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const calculateTotals = () => {
        const totals = balanceData.reduce((acc, account) => ({
            saldoInicial: acc.saldoInicial + +account.saldo_inicial,
            debeTotal: acc.debeTotal + account.debe_total,
            haberTotal: acc.haberTotal + account.haber_total,
            saldoFinal: acc.saldoFinal + account.saldo_final
        }), {
            saldoInicial: 0,
            debeTotal: 0,
            haberTotal: 0,
            saldoFinal: 0
        });

        return totals;
    };

    const totals = calculateTotals();

    return <>
        <h3>Balance de Prueba por Cuenta Contable | {dateRange}</h3>

        {renderBalanceTable()}

        <div className="mt-4">
            <h5>Totales</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total Saldo Inicial</strong></td>
                        <td className="text-end">{formatCurrency(totals.saldoInicial)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Débito</strong></td>
                        <td className="text-end">{formatCurrency(totals.debeTotal)}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Crédito</strong></td>
                        <td className="text-end">{formatCurrency(totals.haberTotal)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td><strong>Total Saldo Final</strong></td>
                        <td className="text-end">{formatCurrency(totals.saldoFinal)}</td>
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