import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { useBankAccountingReport } from './hooks/useBankAccountingReport';
import { MetodoPago, MovimientoPago } from './types/bankTypes';

export const BanksAccounting: React.FC = () => {
    // Estado para los datos de la tabla
    const { metodosPago, fetchBankAccountingReport, loading } = useBankAccountingReport();
    const [expandedRows, setExpandedRows] = useState<any>(null);

    // Estado para el filtro de fecha
    const [rangoFechas, setRangoFechas] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date()
    ]);

    useEffect(() => {
        aplicarFiltros();
    }, [rangoFechas]);

    const aplicarFiltros = () => {
        if (!rangoFechas || !rangoFechas[0] || !rangoFechas[1]) return;
        fetchBankAccountingReport({
            from: rangoFechas[0].toISOString(),
            to: rangoFechas[1].toISOString()
        });
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setRangoFechas(null);
    };

    // Formatear número para montos monetarios
    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Template para el tipo de método de pago
    const tipoTemplate = (rowData: MetodoPago) => {
        return (
            <span className={`badge ${rowData.tipo === 'sale' ? 'bg-success' : 'bg-warning'}`}>
                {rowData.tipo === 'sale' ? 'Venta' : 'Compra'}
            </span>
        );
    };

    // Template para indicar si es efectivo
    const efectivoTemplate = (rowData: MetodoPago) => {
        return (
            <span className={`badge ${rowData.es_efectivo ? 'bg-primary' : 'bg-secondary'}`}>
                {rowData.es_efectivo ? 'Sí' : 'No'}
            </span>
        );
    };

    // Template para expandir/contraer filas
    const rowExpansionTemplate = (data: MetodoPago) => {
        return (
            <div className="p-3">
                <h5>Bancos</h5>
                <DataTable
                    value={data.movimientos}
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                >
                    <Column field="fecha" header="Fecha" body={(rowData: MovimientoPago) => formatDate(rowData.fecha)} sortable />
                    <Column
                        field="monto"
                        header="Monto"
                        body={(rowData: MovimientoPago) => formatCurrency(parseFloat(rowData.monto))}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column field="banco_o_tarjeta" header="Banco/Tarjeta" body={(rowData: MovimientoPago) => rowData.banco_o_tarjeta || 'N/A'} />
                    <Column field="nro_referencia" header="N° Referencia" body={(rowData: MovimientoPago) => rowData.nro_referencia || 'N/A'} />
                    <Column field="cuenta" header="Cuenta" body={(rowData: MovimientoPago) => rowData.cuenta || 'N/A'} />
                    <Column field="notas" header="Notas" body={(rowData: MovimientoPago) => rowData.notas || 'N/A'} />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="container-fluid mt-4" style={{ padding: '0 15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Reporte de Métodos de Pago</h2>
                <Button
                    label="Exportar Reporte"
                    icon="pi pi-download"
                    className="btn btn-primary"
                    onClick={() => console.log('Exportar reporte')}
                />
            </div>

            <Card title="Filtros de Búsqueda" className="mb-4">
                <div className="row g-3">
                    {/* Filtro: Rango de fechas */}
                    <div className="col-md-6">
                        <label className="form-label">Rango de Fechas</label>
                        <Calendar
                            value={rangoFechas}
                            onChange={(e) => setRangoFechas(e.value)}
                            selectionMode="range"
                            readOnlyInput
                            dateFormat="dd/mm/yy"
                            placeholder="Seleccione rango de fechas"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="col-md-6 d-flex align-items-end gap-2">
                        <Button
                            label="Limpiar"
                            icon="pi pi-trash"
                            className="btn btn-phoenix-secondary"
                            onClick={limpiarFiltros}
                        />
                        <Button
                            label="Buscar"
                            className='btn btn-primary'
                            icon="pi pi-search"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Métodos de Pago y Movimientos">
                <DataTable
                    value={metodosPago}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron métodos de pago"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="metodo_pago"
                >
                    <Column expander style={{ width: '3em' }} />
                    <Column field="metodo_pago" header="Método de Pago" sortable />
                    <Column field="tipo" header="Tipo" body={tipoTemplate} sortable />
                    <Column field="es_efectivo" header="Es Efectivo" body={efectivoTemplate} sortable />
                    <Column
                        field="total"
                        header="Total"
                        body={(rowData: MetodoPago) => formatCurrency(rowData.total)}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column
                        field="movimientos"
                        header="N° Movimientos"
                        body={(rowData: MetodoPago) => rowData.movimientos.length}
                        style={{ textAlign: 'center' }}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};