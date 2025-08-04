import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProductDTO } from '../hooks/usePricesConfigTable';

type Severity = "success" | "info" | "warning" | "secondary" | "danger" | "contrast";

type PriceTablesConfigProps = {
    prices: ProductDTO[]
    onEditItem: (id: string) => void
}

type PriceItem = {
    id: number;
    name: string;
    code: string;
    attentionType: string;
    publicPrice: number;
    copayment: number;
    createdAt: string;
};


type FiltrosBusqueda = {
    tipoAtencion: string | null;
    codigo: string | null;
    nombre: string | null;
    fechaDesde: Date | null;
    fechaHasta: Date | null;
};

export const PricesTableConfig: React.FC<PriceTablesConfigProps> = ({ onEditItem, prices }) => {
    // Sample data


    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState<PriceItem | null>(null);
    const [activeTab, setActiveTab] = useState('prices');

    // Filtros state
    const [filtros, setFiltros] = useState<FiltrosBusqueda>({
        tipoAtencion: null,
        codigo: null,
        nombre: null,
        fechaDesde: null,
        fechaHasta: null
    });

    // Options for dropdowns
    const tiposAtencion = [
        { label: 'Consulta', value: 'Consulta' },
        { label: 'Laboratorio', value: 'Laboratorio' },
        { label: 'Imágenes', value: 'Imágenes' },
        { label: 'Procedimiento', value: 'Procedimiento' }
    ];

    // Estilos consistentes con ThirdPartiesTable
    const styles = {
        card: {
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
        },
        cardTitle: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#333'
        },
        tableHeader: {
            backgroundColor: '#f8f9fa',
            color: '#495057',
            fontWeight: 600
        },
        tableCell: {
            padding: '0.75rem 1rem'
        },
        formLabel: {
            fontWeight: 500,
            marginBottom: '0.5rem',
            display: 'block'
        }
    };

    // Action buttons template
    const actionBodyTemplate = (rowData: PriceItem) => {
        return (
            <div className="flex flex-row items-center gap-2" style={{ display: 'inline-flex' }}>
                <Button
                    className="p-button-rounded p-button-text p-button-sm"
                    tooltip="Editar"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditPrice(rowData);
                    }}
                >
                    <i className="fas fa-pencil-alt"></i>
                </Button>
                <Button
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    tooltip="Eliminar"
                    onClick={(e) => {
                        e.stopPropagation();
                        // handleDeletePrice(rowData);
                    }}
                >
                    <i className="fa-solid fa-trash"></i>
                </Button>
            </div>
        );
    };

    // Currency format for Dominican Peso (DOP)
    const currencyFormat = (value: number) => {
        return new Intl.NumberFormat('es-DO', {
            style: 'currency',
            currency: 'DOP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };



    // Handle edit price
    const handleEditPrice = (price: PriceItem) => {
        onEditItem(price.id.toString());
        setModalVisible(true);
    };

    // Handle delete price
    // const handleDeletePrice = (price: PriceItem) => {
    //     confirmDialog({
    //         message: `¿Estás seguro de eliminar el precio para "${price.name}"?`,
    //         header: 'Confirmar eliminación',
    //         icon: 'pi pi-exclamation-triangle',
    //         acceptLabel: 'Sí, eliminar',
    //         rejectLabel: 'Cancelar',
    //         accept: () => {
    //             setPrices(prices.filter(p => p.id !== price.id));
    //         }
    //     });
    // };


    // Handle filter changes
    const handleFilterChange = (field: keyof FiltrosBusqueda, value: any) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Apply filters
    const aplicarFiltros = () => {
        // Implementar lógica de filtrado aquí
        console.log('Aplicando filtros:', filtros);
    };

    // Clear filters
    const limpiarFiltros = () => {
        setFiltros({
            tipoAtencion: null,
            codigo: null,
            nombre: null,
            fechaDesde: null,
            fechaHasta: null
        });
    };




    return (
        <div className="container-fluid mt-4" style={{ width: '100%', padding: '0 15px' }}>
            {/* Filtros de búsqueda */}
            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    {/* Filtro: Tipo de atención */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Tipo de atención</label>
                        <Dropdown
                            value={filtros.tipoAtencion}
                            options={tiposAtencion}
                            onChange={(e) => handleFilterChange('tipoAtencion', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Código */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Código</label>
                        <InputText
                            value={filtros.codigo || ''}
                            onChange={(e) => handleFilterChange('codigo', e.target.value)}
                            placeholder="Buscar por código..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Nombre */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Nombre</label>
                        <InputText
                            value={filtros.nombre || ''}
                            onChange={(e) => handleFilterChange('nombre', e.target.value)}
                            placeholder="Buscar por nombre..."
                            className="w-100"
                        />
                    </div>

                    {/* Filtro: Rango de fechas */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Fecha de creación</label>
                        <Calendar
                            value={filtros.fechaDesde}
                            onChange={(e) => handleFilterChange('fechaDesde', e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="Desde"
                            className="w-100"
                            showIcon
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="col-12 d-flex justify-content-end gap-2">
                        <Button
                            label="Limpiar"
                            icon="pi pi-trash"
                            className="p-button-secondary"
                            onClick={limpiarFiltros}
                        />
                        <Button
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className="p-button-primary"
                            onClick={aplicarFiltros}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de precios */}
            <Card title="Listado de Precios" style={styles.card}>
                <DataTable
                    value={prices}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron precios"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column field="code" header="Código" sortable style={styles.tableCell} />
                    <Column field="name" header="Nombre" sortable style={styles.tableCell} />
                    <Column field="attentionType" header="Tipo de Atención" sortable style={styles.tableCell} />
                    <Column
                        header="Precio Público"
                        body={(rowData) => currencyFormat(rowData.publicPrice)}
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        header="Copago"
                        body={(rowData) => currencyFormat(rowData.copayment)}
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="createdAt"
                        header="Fecha Creación"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        header="Acciones"
                        body={actionBodyTemplate}
                        style={{ ...styles.tableCell, width: '120px', textAlign: 'center' }}
                    />
                </DataTable>
            </Card>
        </div>
    );
};