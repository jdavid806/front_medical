import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { CSSProperties } from "react";
import { ThirdPartyBalance, useBalanceThirdParty } from "./hooks/useBalanceThirdParty";
import { ThirdPartyDropdown } from "../../fields/dropdowns/ThirdPartyDropdown";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange";

interface TrialBalanceByThirdPartyProps {
    fetchData: (startDate: string, endDate: string) => Promise<any[]>;
}

export const BalanceThirdParty: React.FC<TrialBalanceByThirdPartyProps> = () => {
    const [expandedRows, setExpandedRows] = useState<any>(null);

    const {
        dateRange,
        setDateRange,
        thirdPartyId,
        setThirdPartyId,
        balanceThirdParty,
        loading,
        startAccount,
        endAccount,
        setStartAccount,
        setEndAccount
    } = useBalanceThirdParty();

    const formatCurrency = (value: number) => {
        return `$${value.toFixed(2)}`;
    };

    // Columnas para la tabla principal
    const mainColumns = [
        {
            field: 'tercero_nombre',
            header: 'Tercero',
            body: (rowData: ThirdPartyBalance) => rowData.tercero_nombre || 'Sin tercero'
        },
        {
            field: 'debe_total',
            header: 'Total Debe',
            body: (rowData: ThirdPartyBalance) => formatCurrency(rowData.debe_total),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'haber_total',
            header: 'Total Haber',
            body: (rowData: ThirdPartyBalance) => formatCurrency(rowData.haber_total),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'saldo_final',
            header: 'Saldo',
            body: (rowData: ThirdPartyBalance) => (<>
                <span style={{
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
                }}>
                    {formatCurrency(rowData.saldo_final)}
                </span>
            </>),
        }
    ];

    return (
        <div className="container-fluid mt-4">
            <Card title="Balance de Prueba por Tercero" className="mb-3">
                <div className="d-flex gap-2 mb-3">
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
                    <ThirdPartyDropdown
                        value={thirdPartyId}
                        handleChange={(e: any) => setThirdPartyId(e.value)}
                    />
                    <AccountingAccountsRange
                        startValue={startAccount}
                        endValue={endAccount}
                        handleStartChange={(e: any) => setStartAccount(e.value)}
                        handleEndChange={(e: any) => setEndAccount(e.value)}
                    />
                </div>

                <DataTable
                    value={balanceThirdParty}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    dataKey="tercero_id"
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