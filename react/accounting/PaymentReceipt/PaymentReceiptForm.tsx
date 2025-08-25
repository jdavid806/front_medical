import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ReciboPago {
    id: string;
    numeroRecibo: string;
    tipo: string;
    proveedor: string;
    fecha: Date;
    costo: string;
    origenDinero: string;
    valorPagado: number;
    estado: string;
    observaciones: string;
}

interface FiltrosRecibos {
    numeroRecibo: string;
    proveedor: string;
    tipo: string | null;
    fechaInicio: Date | null;
    fechaFin: Date | null;
    valorMinimo: number | null;
    valorMaximo: number | null;
    estado: string | null;
}

export const RecibosPagos: React.FC = () => {
    // Estado para los datos
    const [recibos, setRecibos] = useState<ReciboPago[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    
    // Estado para el modal
    const [showModal, setShowModal] = useState<boolean>(false);
    const [reciboEdit, setReciboEdit] = useState<ReciboPago | null>(null);
    
    // Estado para los filtros
    const [filtros, setFiltros] = useState<FiltrosRecibos>({
        numeroRecibo: "",
        proveedor: "",
        tipo: null,
        fechaInicio: null,
        fechaFin: null,
        valorMinimo: null,
        valorMaximo: null,
        estado: null
    });

    // Opciones para dropdowns
    const tiposRecibo = [
        { label: 'RP - 1 - recibo de pago egreso', value: 'RP - 1 - recibo de pago egreso' }
    ];

    const estadosRecibo = [
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Pagado', value: 'Pagado' },
        { label: 'Anulado', value: 'Anulado' },
        { label: 'Rechazado', value: 'Rechazado' }
    ];

    // Cargar datos iniciales
    useEffect(() => {
        setLoading(true);
        // Simular carga de API
        setTimeout(() => {
            const mockData: ReciboPago[] = [
                {
                    id: "1",
                    numeroRecibo: "RP-2023-0001",
                    tipo: "RP - 1 - recibo de pago egreso",
                    proveedor: "Proveedor Ejemplo 1",
                    fecha: new Date(2023, 5, 15),
                    costo: "opcion1",
                    origenDinero: "opcion1",
                    valorPagado: 15000,
                    estado: "Pagado",
                    observaciones: "Pago por servicios profesionales"
                },
                {
                    id: "2",
                    numeroRecibo: "RP-2023-0002",
                    tipo: "RP - 1 - recibo de pago egreso",
                    proveedor: "Proveedor Ejemplo 2",
                    fecha: new Date(2023, 5, 18),
                    costo: "opcion2",
                    origenDinero: "opcion2",
                    valorPagado: 23500,
                    estado: "Pendiente",
                    observaciones: "Compra de materiales"
                }
            ];
            setRecibos(mockData);
            setLoading(false);
        }, 1000);
    }, []);

    // Manejadores de filtros
    const handleFilterChange = (field: keyof FiltrosRecibos, value: any) => {
        setFiltros(prev => ({ ...prev, [field]: value }));
    };

    const aplicarFiltros = () => {
        setLoading(true);
        // Aquí iría la llamada a la API con los filtros
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const limpiarFiltros = () => {
        setFiltros({
            numeroRecibo: "",
            proveedor: "",
            tipo: null,
            fechaInicio: null,
            fechaFin: null,
            valorMinimo: null,
            valorMaximo: null,
            estado: null
        });
    };

    // Formateadores
    const formatCurrency = (value: number): string => {
        return value.toLocaleString('es-DO', {
            style: 'currency',
            currency: 'DOP'
        });
    };

    const formatDate = (value: Date): string => {
        return value.toLocaleDateString('es-DO');
    };

    // Estilo para tags de estado
    const getEstadoSeverity = (estado: string) => {
        switch(estado) {
            case 'Pagado': return 'success';
            case 'Pendiente': return 'warning';
            case 'Anulado':
            case 'Rechazado': return 'danger';
            default: return null;
        }
    };

    // Acciones para la tabla
    const accionesBodyTemplate = (rowData: ReciboPago) => {
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-button-text"
                    tooltip="Editar"
                    onClick={() => {
                        setReciboEdit(rowData);
                        setShowModal(true);
                    }}
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger p-button-text"
                    tooltip="Anular"
                    onClick={() => anularRecibo(rowData.id)}
                    disabled={rowData.estado === 'Anulado'}
                />
                <Button 
                    icon="pi pi-download" 
                    className="p-button-rounded p-button-info p-button-text"
                    tooltip="Descargar"
                    onClick={() => descargarRecibo(rowData.id)}
                />
            </div>
        );
    };

    const anularRecibo = (id: string) => {
        // Lógica para anular recibo
        setRecibos(recibos.map(r => 
            r.id === id ? {...r, estado: 'Anulado'} : r
        ));
    };

    const descargarRecibo = (id: string) => {
        // Lógica para descargar recibo
        console.log(`Descargando recibo ${id}`);
    };

    // Manejar submit del modal
    const handleSubmitRecibo = (formData: any) => {
        if (reciboEdit) {
            // Editar recibo existente
            setRecibos(recibos.map(r => 
                r.id === reciboEdit.id ? {...r, ...formData} : r
            ));
        } else {
            // Crear nuevo recibo
            const nuevoRecibo: ReciboPago = {
                id: Math.random().toString(36).substring(2, 9),
                numeroRecibo: `RP-2023-${(recibos.length + 1).toString().padStart(4, '0')}`,
                estado: 'Pendiente',
                ...formData
            };
            setRecibos([...recibos, nuevoRecibo]);
        }
        
        setShowModal(false);
        setReciboEdit(null);
    };

    return (
        <div className="container-fluid mt-4">
            {/* Botón para nuevo recibo */}
            <div className="mb-3 text-end">
                <Button 
                    label="Nuevo Recibo" 
                    icon="pi pi-plus" 
                    className="p-button-primary"
                    onClick={() => {
                        setReciboEdit(null);
                        setShowModal(true);
                    }}
                />
            </div>

            {/* Card de filtros */}
            <Card title="Filtros de Búsqueda" className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Número de Recibo</label>
                        <InputText
                            value={filtros.numeroRecibo}
                            onChange={(e) => handleFilterChange('numeroRecibo', e.target.value)}
                            placeholder="Ej: RP-2023-0001"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Proveedor</label>
                        <InputText
                            value={filtros.proveedor}
                            onChange={(e) => handleFilterChange('proveedor', e.target.value)}
                            placeholder="Nombre del proveedor"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Tipo</label>
                        <Dropdown
                            value={filtros.tipo}
                            options={tiposRecibo}
                            onChange={(e) => handleFilterChange('tipo', e.value)}
                            placeholder="Seleccionar tipo"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Estado</label>
                        <Dropdown
                            value={filtros.estado}
                            options={estadosRecibo}
                            onChange={(e) => handleFilterChange('estado', e.value)}
                            placeholder="Seleccionar estado"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Fecha desde</label>
                        <Calendar
                            value={filtros.fechaInicio}
                            onChange={(e) => handleFilterChange('fechaInicio', e.value)}
                            dateFormat="dd/mm/yy"
                            className="w-full"
                            showIcon
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Fecha hasta</label>
                        <Calendar
                            value={filtros.fechaFin}
                            onChange={(e) => handleFilterChange('fechaFin', e.value)}
                            dateFormat="dd/mm/yy"
                            className="w-full"
                            showIcon
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Valor mínimo</label>
                        <InputText
                            value={filtros.valorMinimo || ''}
                            onChange={(e) => handleFilterChange('valorMinimo', parseFloat(e.target.value) || null)}
                            type="number"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 md:col-6 lg:col-3">
                        <label className="block mb-2">Valor máximo</label>
                        <InputText
                            value={filtros.valorMaximo || ''}
                            onChange={(e) => handleFilterChange('valorMaximo', parseFloat(e.target.value) || null)}
                            type="number"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="col-12 flex justify-content-end gap-2 mt-3">
                        <Button
                            label="Limpiar"
                            icon="pi pi-filter-slash"
                            className="p-button-secondary"
                            onClick={limpiarFiltros}
                        />
                        <Button
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className="p-button-primary"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Recibos de Pago">
                <DataTable
                    value={recibos}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    emptyMessage="No se encontraron recibos"
                    responsiveLayout="scroll"
                >
                    <Column field="numeroRecibo" header="Número" sortable />
                    <Column field="proveedor" header="Proveedor" sortable />
                    <Column field="tipo" header="Tipo" sortable />
                    <Column 
                        field="fecha" 
                        header="Fecha" 
                        sortable 
                        body={(rowData) => formatDate(rowData.fecha)} 
                    />
                    <Column 
                        field="valorPagado" 
                        header="Valor" 
                        sortable 
                        body={(rowData) => formatCurrency(rowData.valorPagado)} 
                    />
                    <Column 
                        field="estado" 
                        header="Estado" 
                        sortable 
                        body={(rowData) => (
                            <Tag 
                                value={rowData.estado} 
                                severity={getEstadoSeverity(rowData.estado)} 
                            />
                        )} 
                    />
                    <Column 
                        header="Acciones" 
                        body={accionesBodyTemplate} 
                        style={{ width: '180px' }}
                    />
                </DataTable>
            </Card>

            {/* Modal para crear/editar recibos */}
            <PaymentReceiptModal
                visible={showModal}
                onHide={() => {
                    setShowModal(false);
                    setReciboEdit(null);
                }}
                onSubmit={handleSubmitRecibo}
                initialData={reciboEdit || undefined}
            />
        </div>
    );
};