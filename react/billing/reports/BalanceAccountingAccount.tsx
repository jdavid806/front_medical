import React, { useState, useEffect, CSSProperties } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { BalanceCuentaContable, useBalanceAccountingAccount } from './hooks/useBalanceAccountingAccount';
import { formatDateRange, formatPrice } from '../../../services/utilidades';
import { useBalanceAccountingAccountFormat } from '../../documents-generation/hooks/useBalanceAccountingAccountFormat';
import { AccountingAccountsDropdown } from '../../fields/dropdowns/AccountingAccountsDropdown';

export const BalanceAccountingAccount: React.FC = () => {
    const [expandedRows, setExpandedRows] = useState<any>(null);

    const { dateRange, setDateRange, accountId, setAccountId, balanceAccountingAccount, loading } = useBalanceAccountingAccount();
    const { generarFormatoBalanceAccountingAccount } = useBalanceAccountingAccountFormat();

    // Columnas para la tabla principal
    const mainColumns = [
        {
            field: 'cuenta_codigo',
            header: 'Código',
            body: (rowData: BalanceCuentaContable) => rowData.cuenta_codigo || 'Sin código'
        },
        {
            field: 'cuenta_nombre',
            header: 'Nombre de Cuenta',
            body: (rowData: BalanceCuentaContable) => rowData.cuenta_nombre || 'Sin nombre'
        },
        {
            field: 'saldo_inicial',
            header: 'Saldo Inicial',
            body: (rowData: BalanceCuentaContable) => formatPrice(rowData.saldo_inicial),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'debe_total',
            header: 'Total Débito',
            body: (rowData: BalanceCuentaContable) => formatPrice(rowData.debe_total),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'haber_total',
            header: 'Total Crédito',
            body: (rowData: BalanceCuentaContable) => formatPrice(rowData.haber_total),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'saldo_final',
            header: 'Saldo Final',
            body: (rowData: BalanceCuentaContable) => (<span style={{
                textAlign: 'right',
                fontWeight: 'bold',
                color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
            }}>
                {formatPrice(rowData.saldo_final)}
            </span>)
        }
    ];

    const exportToPdfComparativeReport = () => {
        generarFormatoBalanceAccountingAccount(balanceAccountingAccount, formatDateRange(dateRange), 'Impresion');
    };

    return (
        <div className="container-fluid mt-4">
            <Card className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className='d-flex gap-2 align-items-center'>
                        <div className="d-flex flex-column">
                            <label htmlFor="dateRange" className="form-label">Rango de fechas</label>
                            <Calendar
                                id="dateRange"
                                selectionMode="range"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.value)}
                                className="w-100"
                                showIcon
                                dateFormat="dd/mm/yy"
                                placeholder="Seleccione un rango"
                                appendTo={document.body}
                            />
                        </div>
                        <AccountingAccountsDropdown
                            value={accountId}
                            handleChange={(e: any) => setAccountId(e.value)}
                        />
                    </div>
                    <div>
                        <Button icon={<i className='fas fa-file-pdf'></i>} label="Exportar a PDF" className="mr-2" onClick={exportToPdfComparativeReport} />
                    </div>
                </div>

                <DataTable
                    value={balanceAccountingAccount}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    dataKey="cuenta_id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    stripedRows
                    className="p-datatable-gridlines"
                    emptyMessage="No se encontraron movimientos"
                    tableStyle={{ minWidth: "100%" }}
                >
                    {mainColumns.map((col, i) => (
                        <Column
                            key={i}
                            field={col.field}
                            header={col.header}
                            body={col.body}
                            style={col.style}
                            sortable
                        />
                    ))}
                </DataTable>
            </Card>
        </div>
    );
};