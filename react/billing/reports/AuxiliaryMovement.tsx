import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { useAuxiliaryMovementReport } from './hooks/useAuxiliaryMovementReport';
import { CuentaContable, Movimiento } from '../../accounting/types/bankTypes';

export const AuxiliaryMovement: React.FC = () => {
    // Estado para los datos de la tabla
    const { cuentasContables, fetchAuxiliaryMovementReport, loading } = useAuxiliaryMovementReport();
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalSaldoFinal, setTotalSaldoFinal] = useState(0);
    const [expandedRows, setExpandedRows] = useState<any>(null);

    // Estado para el filtro de fecha
    const [rangoFechas, setRangoFechas] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date()
    ]);

    useEffect(() => {
        aplicarFiltros();
    }, [rangoFechas]);

    // Cargar datos mockeados
    useEffect(() => {
        calcularTotales(cuentasContables);
    }, [cuentasContables]);

    const calcularTotales = (datos: CuentaContable[]) => {
        let totalReg = 0;
        let totalSaldo = 0;

        datos.forEach(cuenta => {
            totalReg += cuenta.movimientos.length;
            totalSaldo += cuenta.saldo_final;
        });

        setTotalRegistros(totalReg);
        setTotalSaldoFinal(totalSaldo);
    };

    const aplicarFiltros = () => {
        if (!rangoFechas || !rangoFechas[0] || !rangoFechas[1]) return;
        fetchAuxiliaryMovementReport({
            from: rangoFechas[0].toISOString(),
            to: rangoFechas[1].toISOString()
        });
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setRangoFechas(null);
    };

    // Formatear número para saldos monetarios
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

    // Template para expandir/contraer filas
    const rowExpansionTemplate = (data: CuentaContable) => {
        return (
            <div className="p-3">
                <h5>Movimientos de la cuenta {data.cuenta} - {data.nombre}</h5>
                <DataTable
                    value={data.movimientos}
                    size="small"
                    responsiveLayout="scroll"
                >
                    <Column field="fecha" header="Fecha" body={(rowData: Movimiento) => formatDate(rowData.fecha)} />
                    <Column field="asiento" header="Asiento" />
                    <Column field="descripcion" header="Descripción" />
                    <Column field="tercero" header="Tercero" />
                    <Column
                        field="debit"
                        header="Débito"
                        body={(rowData: Movimiento) => formatCurrency(parseFloat(rowData.debit))}
                        style={{ textAlign: 'right' }}
                    />
                    <Column
                        field="credit"
                        header="Crédito"
                        body={(rowData: Movimiento) => formatCurrency(rowData.credit)}
                        style={{ textAlign: 'right' }}
                    />
                    <Column
                        field="saldo"
                        header="Saldo"
                        body={(rowData: Movimiento) => formatCurrency(rowData.saldo)}
                        style={{ textAlign: 'right' }}
                    />
                </DataTable>
            </div>
        );
    };

    // Footer para los totales
    const footerTotales = (
        <div className="grid">
            <div className="col-12 md:col-6">
                <strong>Total Movimientos:</strong> {totalRegistros}
            </div>
            <div className="col-12 md:col-6">
                <strong>Total Saldo Final:</strong>
                <span className="text-primary cursor-pointer ml-2">
                    {formatCurrency(totalSaldoFinal)}
                </span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid mt-4" style={{ padding: '0 15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Movimiento Auxiliar x Cuenta Contable</h2>
                {/* <Button
                    label="Exportar Reporte"
                    icon="pi pi-download"
                    className="btn btn-primary"
                    onClick={() => console.log('Exportar reporte')}
                /> */}
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
            <Card title="Cuentas Contables y Movimientos">
                <DataTable
                    value={cuentasContables}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron cuentas contables"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    footer={footerTotales}
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="cuenta"
                >
                    <Column expander style={{ width: '3em' }} />
                    <Column field="cuenta" header="Código Cuenta" sortable />
                    <Column field="nombre" header="Nombre Cuenta" sortable />
                    <Column
                        field="saldo_inicial"
                        header="Saldo Inicial"
                        body={(rowData: CuentaContable) => formatCurrency(parseFloat(rowData.saldo_inicial))}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column
                        field="saldo_final"
                        header="Saldo Final"
                        body={(rowData: CuentaContable) => formatCurrency(rowData.saldo_final)}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column
                        field="movimientos"
                        header="N° Movimientos"
                        body={(rowData: CuentaContable) => rowData.movimientos.length}
                        style={{ textAlign: 'center' }}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};