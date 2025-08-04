import React, { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { useThirdParties } from '../hooks/useThirdParties';
import { TerceroFormData, ThirdPartyModal } from '../modals/ThridPartiesModal';
import { confirmDialog } from 'primereact/confirmdialog';
import { useThirdPartyCreate } from '../hooks/useThirdPartyCreate';
import { useThirdPartyUpdate } from '../hooks/useThirdPartyUpdate';
import { useThirdPartyDelete } from '../hooks/useThirdPartyDelete';
type Severity = "primary" | "success" | "info" | "warning" | "secondary" | "danger" | "contrast";

type Contact = {
    document_type: string;
    document_number: string;
    email: string;
    phone: string;
    address: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    second_last_name?: string;
    full_name: string;
    date_of_birth: string;
};

export type Tercero = {
    id: number;
    //external_id: string | null;
    name: string;
    type: string;
    //created_at: string;
    //updated_at: string;
    document_type: string;
    document_number: string;
    email: string;
    phone: string;
    address: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    second_last_name?: string;
    //full_name: string;
    date_of_birth: string | null;
};

type FiltrosBusqueda = {
    tipoTercero: string | null;
    documento: string | null;
    nombre: string | null;
    fechaDesde: Date | null;
    fechaHasta: Date | null;
};

export const ThridPartiesTable: React.FC = () => {
    // Usamos el hook para obtener los datos
    const { thirdParties, fetchThirdParties, loading } = useThirdParties();
    const { createThirdParty } = useThirdPartyCreate();
    const { updateThirdParty } = useThirdPartyUpdate();
    const { deleteThirdParty } = useThirdPartyDelete();
    const [error, setError] = useState<string | null>(null);

    // Estado para el modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTercero, setSelectedTercero] = useState<Tercero | null>(null);
    const [initialData, setInitialData] = useState<TerceroFormData | null>(null);

    // Estado para los filtros
    const [filtros, setFiltros] = useState<FiltrosBusqueda>({
        tipoTercero: null,
        documento: null,
        nombre: null,
        fechaDesde: null,
        fechaHasta: null
    });

    // Opciones para los selects
    const tiposTercero = [
        { label: 'Cliente', value: 'client' },
        { label: 'Proveedor', value: 'provider' },
        { label: 'Entidad', value: 'entity' },
    ];


    // Función para manejar la creación
    const handleSaveTercero = async (formData: TerceroFormData) => {
        try {
            if (selectedTercero) {
                await updateThirdParty(selectedTercero.id.toString(), {
                    name: formData.contact.name,
                    type: formData.type,
                    document_type: formData.contact.document_type,
                    document_number: formData.contact.document_number,
                    email: formData.contact.email,
                    phone: formData.contact.phone,
                    address: formData.contact.address,
                    first_name: formData.contact.first_name,
                    middle_name: formData.contact.middle_name,
                    last_name: formData.contact.last_name,
                    second_last_name: formData.contact.second_last_name,
                    date_of_birth: formData.contact.date_of_birth,
                });
            } else {
                const res = await createThirdParty({
                    name: formData.contact.name,
                    type: formData.type,
                    document_type: formData.contact.document_type,
                    document_number: formData.contact.document_number,
                    email: formData.contact.email,
                    phone: formData.contact.phone,
                    address: formData.contact.address,
                    first_name: formData.contact.first_name,
                    middle_name: formData.contact.middle_name,
                    last_name: formData.contact.last_name,
                    second_last_name: formData.contact.second_last_name,
                    date_of_birth: formData.contact.date_of_birth,
                });
            }
            fetchThirdParties();
            setModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    // Función para manejar la edición de un tercero
    const handleEditTercero = (tercero: Tercero) => {
        setInitialData({
            type: tercero?.type || '',
            contact: {
                name: tercero?.name || '',
                document_type: tercero?.document_type || '',
                document_number: tercero?.document_number || '',
                email: tercero?.email || '',
                phone: tercero?.phone || '',
                address: tercero?.address || '',
                first_name: tercero?.first_name || '',
                middle_name: tercero?.middle_name || '',
                last_name: tercero?.last_name || '',
                second_last_name: tercero?.second_last_name || '',
                date_of_birth: tercero?.date_of_birth || '',
            }
        });
        setSelectedTercero(tercero);
        setModalVisible(true);
    };

    const handleDeleteTercero = async (tercero: Tercero) => {
        const confirmed = await deleteThirdParty(tercero.id.toString());
        if (confirmed) fetchThirdParties();
    };



    // Manejadores de cambio de filtros
    const handleFilterChange = (field: keyof FiltrosBusqueda, value: any) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Función para aplicar filtros
    const aplicarFiltros = async () => {
        try {
            // Aquí deberías implementar la lógica para filtrar
            // Puedes pasar los filtros al hook si acepta parámetros
            // Por ahora solo manejamos el estado de error
            setError(null);
        } catch (err) {
            setError('Ocurrió un error al aplicar los filtros');
        }
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            tipoTercero: null,
            documento: null,
            nombre: null,
            fechaDesde: null,
            fechaHasta: null
        });
        setError(null);
    };

    const actionBodyTemplate = (rowData: Tercero) => {
        return (
            <div className="flex flex-row gap-2" style={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    className="p-button-rounded p-button-text p-button-sm"
                    tooltip="Editar"
                    tooltipOptions={{ position: 'top' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditTercero(rowData);
                    }}
                > <i className="fas fa-pencil-alt"></i></Button>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    tooltip="Eliminar"
                    tooltipOptions={{ position: 'top' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTercero(rowData);
                    }}
                > <i className="fa-solid fa-trash"></i></Button>
            </div>
        );
    };

    // Mostrar tipo de tercero con tag de color
    const tipoTerceroTemplate = (rowData: Tercero) => {
        const tipoMap: Record<string, { severity: Severity, label: string }> = {
            client: { severity: 'success', label: 'Cliente' },
            provider: { severity: 'info', label: 'Proveedor' },
            entity: { severity: 'primary', label: 'Entidad' }
        };

        const { severity = 'secondary', label = rowData.type } = tipoMap[rowData.type] || {};

        return <Tag value={label} severity={severity} />;
    };

    // Estilos
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

    return (
        <div className="container-fluid mt-4" style={{ width: '100%', padding: '0 15px' }}>
            {/* Modal para crear/editar terceros */}
            <ThirdPartyModal
                visible={modalVisible}
                onHide={() => {
                    setModalVisible(false);
                    setSelectedTercero(null);
                }}
                onSubmit={handleSaveTercero}
                onEdit={handleSaveTercero}
                initialData={initialData}
                loading={false}
                error={null}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                <Button
                    label="Crear Nuevo Tercero"
                    icon="pi pi-file-edit"
                    className="btn btn-primary"
                    onClick={() => {
                        setInitialData(null);
                        setModalVisible(true)
                    }}
                />
            </div>

            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    {/* Filtro: Tipo de tercero */}
                    <div className="col-md-6 col-lg-3">
                        <label style={styles.formLabel}>Tipo de tercero</label>
                        <Dropdown
                            value={filtros.tipoTercero}
                            options={tiposTercero}
                            onChange={(e) => handleFilterChange('tipoTercero', e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
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
                    <div className="col-md-6 ">
                        <label style={styles.formLabel}>Fecha de creación</label>
                        <Calendar
                            value={filtros.fechaDesde}
                            onChange={(e) => handleFilterChange('fechaDesde', e.value)}
                            dateFormat="dd/mm/yy"
                            placeholder="Seleccione fecha"
                            className="w-100"
                            showIcon
                        />
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
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className='btn btn-primary'
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla de resultados */}
            <Card title="Listado de Terceros" style={styles.card}>
                {error ? (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                ) : (
                    <DataTable
                        value={thirdParties || []}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        loading={loading}
                        className="p-datatable-striped p-datatable-gridlines"
                        emptyMessage="No se encontraron terceros"
                        responsiveLayout="scroll"
                        tableStyle={{ minWidth: '50rem' }}
                    >
                        <Column field="id" header="ID" sortable style={styles.tableCell} />
                        <Column
                            field="type"
                            header="Tipo"
                            sortable
                            body={tipoTerceroTemplate}
                            style={styles.tableCell}
                        />
                        <Column
                            header="Documento"
                            body={(rowData: Tercero) => `${rowData.document_number}`}
                            sortable
                            style={styles.tableCell}
                        />
                        <Column
                            header="Nombre Completo"
                            body={(rowData: Tercero) => rowData.name}
                            sortable
                            style={styles.tableCell}
                        />
                        <Column
                            header="Email"
                            body={(rowData: Tercero) => rowData.email}
                            sortable
                            style={styles.tableCell}
                        />
                        <Column
                            header="Teléfono"
                            body={(rowData: Tercero) => rowData.phone}
                            sortable
                            style={styles.tableCell}
                        />
                        <Column
                            header="Dirección"
                            body={(rowData: Tercero) => rowData.address}
                            sortable
                            style={styles.tableCell}
                        />
                        <Column
                            header="Acciones"
                            body={actionBodyTemplate}
                            style={{ ...styles.tableCell, width: '120px', textAlign: 'center' }}
                        />
                    </DataTable>
                )}
            </Card>
        </div>
    );
};