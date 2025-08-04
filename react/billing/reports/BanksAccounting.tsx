import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';

// Definición de tipos TypeScript
type CuentaBancaria = {
    id: string;
    codigoCuentaContable: string;
    nombreCuentaContable: string;
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string;
    moneda: string;
    saldoDisponible: number;
    saldoContable: number;
    fechaApertura: Date;
    activa: boolean;
};

type FiltrosCuentasBancarias = {
    codigoCuenta: string;
    nombreBanco: string;
    numeroCuenta: string;
    tipoCuenta: string | null;
    moneda: string | null;
    estado: string | null;
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    incluirInactivas: boolean;
};

export const BanksAccounting: React.FC = () => {
    // Estado para los datos de la tabla
    const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancaria[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalSaldoDisponible, setTotalSaldoDisponible] = useState(0);
    const [totalSaldoContable, setTotalSaldoContable] = useState(0);

    // Estado para los filtros
    const [filtros, setFiltros] = useState<FiltrosCuentasBancarias>({
        codigoCuenta: '',
        nombreBanco: '',
        numeroCuenta: '',
        tipoCuenta: null,
        moneda: null,
        estado: null,
        fechaDesde: null,
        fechaHasta: null,
        incluirInactivas: false
    });

    // Opciones para los selects
    const opcionesEstado = [
        { label: 'Todas', value: null },
        { label: 'Activas', value: 'activa' },
        { label: 'Inactivas', value: 'inactiva' }
    ];

    const tiposCuenta = [
        { label: 'Ahorros', value: 'ahorros' },
        { label: 'Corriente', value: 'corriente' },
        { label: 'Nómina', value: 'nomina' },
        { label: 'Plazo fijo', value: 'plazo_fijo' }
    ];

    const monedas = [
        { label: 'DOP - Peso Dominicano', value: 'DOP' },
        { label: 'USD - Dólar Americano', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' }
    ];

    // Simular carga de datos
    useEffect(() => {
        setLoading(true);
        // Simulación de llamada a API
        setTimeout(() => {
            const datosMock: CuentaBancaria[] = [
                {
                    id: '1',
                    codigoCuentaContable: '110201',
                    nombreCuentaContable: 'Banco Popular Cuenta Corriente',
                    banco: 'Banco Popular',
                    numeroCuenta: '123456789',
                    tipoCuenta: 'corriente',
                    moneda: 'DOP',
                    saldoDisponible: 3500000,
                    saldoContable: 3500000,
                    fechaApertura: new Date(2020, 5, 15),
                    activa: true
                },
                {
                    id: '2',
                    codigoCuentaContable: '110202',
                    nombreCuentaContable: 'Banco BHD Ahorros',
                    banco: 'Banco BHD',
                    numeroCuenta: '987654321',
                    tipoCuenta: 'ahorros',
                    moneda: 'USD',
                    saldoDisponible: 15000,
                    saldoContable: 15000,
                    fechaApertura: new Date(2021, 2, 10),
                    activa: true
                },
                {
                    id: '3',
                    codigoCuentaContable: '110203',
                    nombreCuentaContable: 'ScotiaBank Nómina',
                    banco: 'Scotiabank',
                    numeroCuenta: '456789123',
                    tipoCuenta: 'nomina',
                    moneda: 'DOP',
                    saldoDisponible: 500000,
                    saldoContable: 500000,
                    fechaApertura: new Date(2019, 11, 5),
                    activa: false
                },
                {
                    id: '4',
                    codigoCuentaContable: '110204',
                    nombreCuentaContable: 'Banco Reservas Plazo Fijo',
                    banco: 'Banco de Reservas',
                    numeroCuenta: '321654987',
                    tipoCuenta: 'plazo_fijo',
                    moneda: 'DOP',
                    saldoDisponible: 2000000,
                    saldoContable: 2000000,
                    fechaApertura: new Date(2022, 7, 20),
                    activa: true
                },
            ];

            setCuentasBancarias(datosMock);
            calcularTotales(datosMock);
            setLoading(false);
        }, 1000);
    }, []);

    // Calcular totales
    const calcularTotales = (datos: CuentaBancaria[]) => {
        let totalDisp = 0;
        let totalCont = 0;

        datos.forEach(item => {
            totalDisp += item.saldoDisponible;
            totalCont += item.saldoContable;
        });

        setTotalRegistros(datos.length);
        setTotalSaldoDisponible(totalDisp);
        setTotalSaldoContable(totalCont);
    };

    // Manejadores de cambio de filtros
    const handleFilterChange = (field: keyof FiltrosCuentasBancarias, value: any) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Función para aplicar filtros
    const aplicarFiltros = () => {
        setLoading(true);
        // Simulación de filtrado
        setTimeout(() => {
            const datosFiltrados = cuentasBancarias.filter(cuenta => {
                // Filtro por código de cuenta contable
                if (filtros.codigoCuenta &&
                    !cuenta.codigoCuentaContable.includes(filtros.codigoCuenta)) {
                    return false;
                }

                // Filtro por nombre de banco
                if (filtros.nombreBanco &&
                    !cuenta.banco.toLowerCase().includes(filtros.nombreBanco.toLowerCase())) {
                    return false;
                }

                // Filtro por número de cuenta
                if (filtros.numeroCuenta &&
                    !cuenta.numeroCuenta.includes(filtros.numeroCuenta)) {
                    return false;
                }

                // Filtro por tipo de cuenta
                if (filtros.tipoCuenta &&
                    cuenta.tipoCuenta !== filtros.tipoCuenta) {
                    return false;
                }

                // Filtro por moneda
                if (filtros.moneda &&
                    cuenta.moneda !== filtros.moneda) {
                    return false;
                }

                // Filtro por estado
                if (filtros.estado === 'activa' && !cuenta.activa) {
                    return false;
                }
                if (filtros.estado === 'inactiva' && cuenta.activa) {
                    return false;
                }

                // Filtro por fecha de apertura
                if (filtros.fechaDesde &&
                    new Date(cuenta.fechaApertura) < new Date(filtros.fechaDesde)) {
                    return false;
                }
                if (filtros.fechaHasta &&
                    new Date(cuenta.fechaApertura) > new Date(filtros.fechaHasta)) {
                    return false;
                }

                // Filtro por incluir inactivas
                if (!filtros.incluirInactivas && !cuenta.activa) {
                    return false;
                }

                return true;
            });

            setCuentasBancarias(datosFiltrados);
            calcularTotales(datosFiltrados);
            setLoading(false);
        }, 500);
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            codigoCuenta: '',
            nombreBanco: '',
            numeroCuenta: '',
            tipoCuenta: null,
            moneda: null,
            estado: null,
            fechaDesde: null,
            fechaHasta: null,
            incluirInactivas: false
        });
        // Aquí podrías también resetear los datos a su estado original
    };

    // Función para redirigir a movimientos contables
    const redirectToMovimientos = (cuenta: CuentaBancaria) => {
        const params = new URLSearchParams();
        params.append('cuentaId', cuenta.id);
        params.append('codigoCuenta', cuenta.codigoCuentaContable);
        params.append('nombreCuenta', encodeURIComponent(cuenta.nombreCuentaContable));
        params.append('banco', encodeURIComponent(cuenta.banco));
        params.append('numeroCuenta', cuenta.numeroCuenta);
        params.append('moneda', cuenta.moneda);

        window.location.href = `ReportesMovimientoAuxiliar?${params.toString()}`;
    };

    // Formatear número para saldos monetarios
    const formatCurrency = (value: number, currency: string = 'DOP') => {
        return value.toLocaleString('es-DO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Formatear fecha
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Templates para columnas clickeables
    const saldoDisponibleTemplate = (rowData: CuentaBancaria) => {
        return (
            <span
                className="text-primary cursor-pointer"
                style={{ textDecoration: 'underline' }}
                onClick={() => redirectToMovimientos(rowData)}
            >
                {formatCurrency(rowData.saldoDisponible, rowData.moneda)}
            </span>
        );
    };

    const saldoContableTemplate = (rowData: CuentaBancaria) => {
        return (
            <span
                className="text-primary cursor-pointer"
                style={{ textDecoration: 'underline' }}
                onClick={() => redirectToMovimientos(rowData)}
            >
                {formatCurrency(rowData.saldoContable, rowData.moneda)}
            </span>
        );
    };

    // Template para el estado (activo/inactivo)
    const estadoTemplate = (rowData: CuentaBancaria) => {
        return (
            <span className={`badge ${rowData.activa ? 'bg-success' : 'bg-secondary'}`}>
                {rowData.activa ? 'Activa' : 'Inactiva'}
            </span>
        );
    };

    // Footer para los totales
    const footerTotales = (
        <div className="grid">
            <div className="col-12 md:col-4">
                <strong>Total Registros:</strong> {totalRegistros}
            </div>
            <div className="col-12 md:col-4">
                <strong>Total Saldo Disponible:</strong>
                <span
                    className="text-primary cursor-pointer ml-2"
                    style={{ textDecoration: 'underline' }}
                    onClick={() => (window.location.href = "ReportesMovimientoAuxiliar")}
                >
                    {formatCurrency(totalSaldoDisponible)}
                </span>
            </div>
            <div className="col-12 md:col-4">
                <strong>Total Saldo Contable:</strong>
                <span
                    className="text-primary cursor-pointer ml-2"
                    style={{ textDecoration: 'underline' }}
                    onClick={() => (window.location.href = "ReportesMovimientoAuxiliar")}
                >
                    {formatCurrency(totalSaldoContable)}
                </span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid mt-4" style={{ padding: '0 15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Gestión de Cuentas Bancarias</h2>
                <Button
                    label="Nueva Cuenta Bancaria"
                    icon="pi pi-plus"
                    className="btn btn-primary"
                    onClick={() => console.log('Nueva cuenta bancaria')}
                />
            </div>

            <Card title="Filtros de Búsqueda" className="mb-4">
                <div className="row g-3">
                    {/* Filtro: Código cuenta contable */}
                    <div className="col-md-4">
                        <label className="form-label">Código Cuenta Contable</label>
                        <InputText
                            value={filtros.codigoCuenta}
                            onChange={(e) => handleFilterChange('codigoCuenta', e.target.value)}
                            placeholder="Buscar por código..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Nombre del banco */}
                    <div className="col-md-4">
                        <label className="form-label">Nombre del Banco</label>
                        <InputText
                            value={filtros.nombreBanco}
                            onChange={(e) => handleFilterChange('nombreBanco', e.target.value)}
                            placeholder="Buscar por banco..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Número de cuenta */}
                    <div className="col-md-4">
                        <label className="form-label">Número de Cuenta</label>
                        <InputText
                            value={filtros.numeroCuenta}
                            onChange={(e) => handleFilterChange('numeroCuenta', e.target.value)}
                            placeholder="Buscar por número..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Tipo de cuenta */}
                    <div className="col-md-3">
                        <label className="form-label">Tipo de Cuenta</label>
                        <Dropdown
                            value={filtros.tipoCuenta}
                            options={tiposCuenta}
                            onChange={(e) => handleFilterChange('tipoCuenta', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Moneda */}
                    <div className="col-md-3">
                        <label className="form-label">Moneda</label>
                        <Dropdown
                            value={filtros.moneda}
                            options={monedas}
                            onChange={(e) => handleFilterChange('moneda', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione moneda"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Estado */}
                    <div className="col-md-3">
                        <label className="form-label">Estado</label>
                        <Dropdown
                            value={filtros.estado}
                            options={opcionesEstado}
                            onChange={(e) => handleFilterChange('estado', e.value)}
                            optionLabel="label"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Rango de fechas */}
                    <div className="col-md-3">
                        <label className="form-label">Fecha Apertura Desde</label>
                        <Calendar
                            value={filtros.fechaDesde}
                            onChange={(e) => handleFilterChange('fechaDesde', e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Fecha Apertura Hasta</label>
                        <Calendar
                            value={filtros.fechaHasta}
                            onChange={(e) => handleFilterChange('fechaHasta', e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="dd/mm/aaaa"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    {/* Filtro: Incluir inactivas */}
                    <div className="col-md-12">
                        <div className="field-checkbox">
                            <Checkbox
                                inputId="incluirInactivas"
                                checked={filtros.incluirInactivas}
                                onChange={(e) => handleFilterChange('incluirInactivas', e.checked)}
                            />
                            <label htmlFor="incluirInactivas" className="ml-2">Incluir cuentas inactivas</label>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="col-12 d-flex justify-content-end gap-2">
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
            <Card title="Cuentas Bancarias">
                <DataTable
                    value={cuentasBancarias}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    emptyMessage="No se encontraron cuentas bancarias"
                    className="p-datatable-striped p-datatable-gridlines"
                    responsiveLayout="scroll"
                    footer={footerTotales}
                >
                    <Column field="codigoCuentaContable" header="Código Contable" sortable />
                    <Column field="nombreCuentaContable" header="Nombre Cuenta" sortable />
                    <Column field="banco" header="Banco" sortable />
                    <Column field="numeroCuenta" header="Número de Cuenta" sortable />
                    <Column field="tipoCuenta" header="Tipo de Cuenta" sortable />
                    <Column field="moneda" header="Moneda" sortable />
                    <Column
                        field="saldoDisponible"
                        header="Saldo Disponible"
                        body={saldoDisponibleTemplate}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column
                        field="saldoContable"
                        header="Saldo Contable"
                        body={saldoContableTemplate}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column
                        field="fechaApertura"
                        header="Fecha Apertura"
                        body={(rowData) => formatDate(rowData.fechaApertura)}
                        sortable
                    />
                    <Column
                        field="activa"
                        header="Estado"
                        body={estadoTemplate}
                        sortable
                    />
                </DataTable>
            </Card>
        </div>
    );
};