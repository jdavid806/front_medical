import React, { useState, useEffect, CSSProperties } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';
import { useGeneralJournal } from './hooks/useGeneralJournal';

// Definición de tipos TypeScript
type BalanceCuentaContable = {
    codigo: string;
    nombre: string;
    nivel: number;
    saldoAnterior: number;
    debito: number;
    credito: number;
    saldoActual: number;
    naturaleza: 'Deudor' | 'Acreedor';
    tieneMovimientos: boolean;
};

type FiltrosBusqueda = {
    cuentaContable: string;
    incluyeSinMovimientos: boolean;
    anioFiscal: Date | null;
    mesInicial: number | null;
    mesFinal: number | null;
    naturaleza: string | null;
};

export const BalanceAccountingAccount: React.FC = () => {
    const [dates, setDates] = useState<any>(null);
    const [expandedRows, setExpandedRows] = useState<any>(null);
    const [groupedData, setGroupedData] = useState<any[]>([]);

    const { dateRange, setDateRange, generalJournal, fetchGeneralJournal, loading } = useGeneralJournal();

    const formatCurrency = (value: string) => {
        return value ? `$${parseFloat(value).toFixed(2)}` : '';
    };

    // Agrupa los datos por cuenta
    const groupByAccount = (data: any[]) => {
        const grouped: { [key: string]: any[] } = {};

        data.forEach(item => {
            const cuenta = item.cuenta || 'Sin cuenta';
            if (!grouped[cuenta]) {
                grouped[cuenta] = [];
            }
            grouped[cuenta].push(item);
        });

        // Convertir el objeto agrupado en un array para la DataTable
        return Object.keys(grouped).map(cuenta => ({
            cuenta,
            totalDebe: grouped[cuenta].reduce((sum, item) => sum + parseFloat(item.debe || 0), 0),
            totalHaber: grouped[cuenta].reduce((sum, item) => sum + parseFloat(item.haber || 0), 0),
            items: grouped[cuenta]
        }));
    };

    useEffect(() => {
        if (generalJournal) {
            setGroupedData(groupByAccount(generalJournal));
        }
    }, [generalJournal]);

    // Columnas para la tabla principal (agrupada por cuenta)
    const mainColumns = [
        {
            field: 'cuenta',
            header: 'Cuenta',
            body: (rowData: any) => rowData.cuenta || 'Sin cuenta'
        },
        {
            field: 'totalDebe',
            header: 'Total Debe',
            body: (rowData: any) => formatCurrency(rowData.totalDebe.toString()),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'totalHaber',
            header: 'Total Haber',
            body: (rowData: any) => formatCurrency(rowData.totalHaber.toString()),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'saldo',
            header: 'Saldo',
            body: (rowData: any) => {
                const saldo = rowData.totalDebe - rowData.totalHaber;
                return formatCurrency(saldo.toString());
            },
            style: { textAlign: 'right', fontWeight: 'bold' } as CSSProperties
        }
    ];

    // Columnas para la tabla expandida (detalle por asiento)
    const detailColumns = [
        { field: 'fecha', header: 'Fecha', body: (rowData: any) => new Date(rowData.fecha).toLocaleDateString() },
        { field: 'numero_asiento', header: 'N° Asiento' },
        { field: 'tercero', header: 'Tercero', body: (rowData: any) => rowData.tercero || 'Sin tercero' },
        {
            field: 'debe',
            header: 'Debe',
            body: (rowData: any) => formatCurrency(rowData.debe),
            style: { textAlign: 'right' } as CSSProperties
        },
        {
            field: 'haber',
            header: 'Haber',
            body: (rowData: any) => formatCurrency(rowData.haber),
            style: { textAlign: 'right' } as CSSProperties
        },
        { field: 'descripcion', header: 'Descripción' }
    ];

    // Plantilla para la expansión de filas
    const rowExpansionTemplate = (rowData: any) => {
        return (
            <div className="p-3">
                <DataTable
                    value={rowData.items}
                    className="p-datatable-gridlines"
                    tableStyle={{ minWidth: '100%' }}
                >
                    {detailColumns.map((col, i) => (
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
            </div>
        );
    };

    const expandAll = () => {
        const expanded: { [key: string]: boolean } = {};
        groupedData.forEach(item => {
            expanded[item.cuenta] = true;
        });
        setExpandedRows(expanded);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expandir Todo" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Colapsar Todo" onClick={collapseAll} text />
        </div>
    );

    return (
        <div className="container-fluid mt-4">
            <Card title="Balance de Prueba por Cuenta" className="mb-3">
                <div className="row mb-4">
                    <div className="col-md-4">
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
                </div>

                <DataTable
                    value={groupedData}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="cuenta"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    stripedRows
                    className="p-datatable-gridlines"
                    emptyMessage="No se encontraron movimientos"
                    tableStyle={{ minWidth: "100%" }}
                    header={header}
                >
                    <Column expander style={{ width: '3rem' }} />
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

