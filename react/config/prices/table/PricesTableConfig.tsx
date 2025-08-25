import React, { useState } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { useDebounce } from 'primereact/hooks';
import { ProductDTO } from '../hooks/usePricesConfigTable';

type PriceTablesConfigProps = {
    prices: ProductDTO[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
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

export const PricesTableConfig: React.FC<PriceTablesConfigProps> = ({ onEditItem, prices, onDeleteItem }) => {

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

    // Global search filter state
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, debounceGlobalFilterValue, setGlobalFilterValue] = useDebounce('', 500);

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
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditPrice(rowData);
                    }}
                >
                    <i className="fas fa-pencil-alt"></i>
                </Button>
                <Button
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePrice(rowData);
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
    const handleDeletePrice = (price: PriceItem) => {
        onDeleteItem(price.id.toString());
    };


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

    // Handle global filter change
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Table header with search
    const tableHeader = () => {
        return (
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Listado de Precios</h5>
                <InputText 
                    value={globalFilterValue} 
                    onChange={onGlobalFilterChange} 
                    placeholder="Buscar por nombre..." 
                    className="w-auto"
                />
            </div>
        );
    };


    return (
        <div className="container-fluid mt-4" style={{ width: '100%', padding: '0 15px' }}>
            <DataTable
                value={prices}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-striped p-datatable-gridlines"
                emptyMessage="No se encontraron precios"
                responsiveLayout="scroll"
                tableStyle={{ minWidth: '50rem' }}
                globalFilterFields={['name']}
                filters={filters}
                header={tableHeader}
            >
                <Column field="Cups" header="Cups"
                    body={(rowData) => rowData.barcode}
                    sortable style={styles.tableCell} />
                <Column field="name" header="Nombre" sortable style={styles.tableCell} />
                <Column field="attentionType"
                    header="Tipo de Atención"
                    body={(rowData) => {
                        const attentionTypeMap: { [key: string]: string } = {
                            PROCEDURE: "Procedimiento",
                            CONSULTATION: "Consulta",
                            LABORATORY: "Laboratorio",
                            REHABILITATION: "Rehabilitación",
                            OPTOMETRY: "Optometría"
                        };
                        return attentionTypeMap[rowData.attention_type] || rowData.attention_type || "";
                    }}
                    sortable style={styles.tableCell} />
                <Column
                    header="Precio Público"
                    body={(rowData) => currencyFormat(rowData.sale_price)}
                    sortable
                    style={styles.tableCell}
                />
                <Column
                    header="Copago"
                    body={(rowData) => currencyFormat(rowData.copayment)}
                    sortable
                    style={styles.tableCell}
                />
                {/* <Column
                    field="createdAt"
                    header="Fecha Creación"
                    sortable
                    style={styles.tableCell}
                /> */}
                <Column
                    header="Acciones"
                    body={actionBodyTemplate}
                    style={{ ...styles.tableCell, width: '120px', textAlign: 'center' }}
                />
            </DataTable>
        </div>
    );
};