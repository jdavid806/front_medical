import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { UserAvailabilityTableItem } from '../../models/models';

export interface UserAvailabilityTableProps {
    availabilities: UserAvailabilityTableItem[];
    onEditItem?: (id: string) => void;
    onDeleteItem?: (id: string) => void;
    loading?: boolean;
    onReload?: () => void;
}

export const UserAvailabilityTable: React.FC<UserAvailabilityTableProps> = ({
    availabilities,
    onEditItem,
    onDeleteItem,
    loading = false,
    onReload
}) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [availabilityToDelete, setAvailabilityToDelete] = useState<UserAvailabilityTableItem | null>(null);
    const [filteredAvailabilities, setFilteredAvailabilities] = useState<UserAvailabilityTableItem[]>([]);
    const [filtros, setFiltros] = useState({
        doctorName: "",
        appointmentType: "",
        daysOfWeek: "",
        branchName: "",
    });
    const toast = useRef<Toast>(null);

    // Opciones para días de la semana
    const daysOfWeekOptions = [
        { label: "Todos", value: "" },
        { label: "Lunes", value: "Lunes" },
        { label: "Martes", value: "Martes" },
        { label: "Miércoles", value: "Miércoles" },
        { label: "Jueves", value: "Jueves" },
        { label: "Viernes", value: "Viernes" },
        { label: "Sábado", value: "Sábado" },
        { label: "Domingo", value: "Domingo" }
    ];

    // Función para sincronizar los datos filtrados
    const syncFilteredData = () => {
        let result = [...availabilities];

        // Filtro por nombre de doctor
        if (filtros.doctorName) {
            result = result.filter((availability) =>
                availability.doctorName.toLowerCase().includes(filtros.doctorName.toLowerCase())
            );
        }

        // Filtro por tipo de cita
        if (filtros.appointmentType) {
            result = result.filter((availability) =>
                availability.appointmentType.toLowerCase().includes(filtros.appointmentType.toLowerCase())
            );
        }

        // Filtro por día de la semana
        if (filtros.daysOfWeek) {
            result = result.filter((availability) =>
                availability.daysOfWeek.toLowerCase().includes(filtros.daysOfWeek.toLowerCase())
            );
        }

        // Filtro por sucursal
        if (filtros.branchName) {
            result = result.filter((availability) =>
                availability.branchName.toLowerCase().includes(filtros.branchName.toLowerCase())
            );
        }

        setFilteredAvailabilities(result);
    };

    // Sincroniza cuando cambian las availabilities o los filtros
    useEffect(() => {
        syncFilteredData();
    }, [availabilities, filtros]);

    const handleFilterChange = (field: string, value: any) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearchChange = (searchValue: string) => {
        console.log("Search value:", searchValue);
    };

    const limpiarFiltros = () => {
        setFiltros({
            doctorName: "",
            appointmentType: "",
            daysOfWeek: "",
            branchName: "",
        });
    };

    const handleRefresh = async () => {
        limpiarFiltros();

        if (onReload) {
            await onReload();
        }
    };

    const showToast = (severity: any, summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const confirmDelete = (availability: UserAvailabilityTableItem) => {
        setAvailabilityToDelete(availability);
        setDeleteDialogVisible(true);
    };

    const deleteAvailability = async () => {
        if (availabilityToDelete && onDeleteItem) {
            await onDeleteItem(availabilityToDelete.id);
            showToast("success", "Éxito", `Disponibilidad eliminada correctamente`);

            // Refrescar después de eliminar
            if (onReload) {
                await onReload();
            }
        }
        setDeleteDialogVisible(false);
        setAvailabilityToDelete(null);
    };

    const deleteDialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
                label="Eliminar"
                icon="pi pi-check"
                className="p-button-danger"
                onClick={deleteAvailability}
            />
        </div>
    );

    const TableMenu: React.FC<{
        rowData: UserAvailabilityTableItem,
        onEdit: (id: string) => void,
        onDelete: (availability: UserAvailabilityTableItem) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            console.log("Editando disponibilidad con ID:", rowData.id);
            onEdit(rowData.id);
        };

        const handleDelete = () => {
            console.log("Solicitando eliminar disponibilidad con ID:", rowData.id);
            onDelete(rowData);
        };

        return (
            <div style={{ position: "relative" }}>
                <Button
                    className="btn-primary flex items-center gap-2"
                    onClick={(e) => menu.current?.toggle(e)}
                    aria-controls={`popup_menu_${rowData.id}`}
                    aria-haspopup
                >
                    Acciones
                    <i className="fas fa-cog ml-2"></i>
                </Button>
                <Menu
                    model={[
                        {
                            label: "Editar",
                            icon: <i className="fas fa-edit me-2"></i>,
                            command: handleEdit,
                        },
                        {
                            label: "Eliminar",
                            icon: <i className="fas fa-trash me-2"></i>,
                            command: handleDelete,
                        }
                    ]}
                    popup
                    ref={menu}
                    id={`popup_menu_${rowData.id}`}
                    appendTo={document.body}
                    style={{ zIndex: 9999 }}
                />
            </div>
        );
    };

    const actionBodyTemplate = (rowData: UserAvailabilityTableItem) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <TableMenu
                    rowData={rowData}
                    onEdit={onEditItem ? onEditItem : () => { }}
                    onDelete={confirmDelete}
                />
            </div>
        );
    };

    // Función para formatear la hora
    const formatTime = (time: string) => {
        if (!time) return "N/A";
        return time;
    };

    // Mapear los datos para la tabla
    const tableItems = filteredAvailabilities.map(availability => ({
        id: availability.id,
        doctorName: availability.doctorName,
        appointmentType: availability.appointmentType,
        daysOfWeek: availability.daysOfWeek,
        startTime: formatTime(availability.startTime),
        endTime: formatTime(availability.endTime),
        branchName: availability.branchName,
        actions: availability
    }));

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'doctorName',
            header: 'Usuario',
            sortable: true
        },
        {
            field: 'appointmentType',
            header: 'Tipo de Cita',
            sortable: true
        },
        {
            field: 'daysOfWeek',
            header: 'Día de la Semana',
            sortable: true
        },
        {
            field: 'startTime',
            header: 'Hora de Inicio',
            sortable: true
        },
        {
            field: 'endTime',
            header: 'Hora de Fin',
            sortable: true
        },
        {
            field: 'branchName',
            header: 'Sucursal',
            sortable: true
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: any) => actionBodyTemplate(rowData.actions),
            exportable: false
        }
    ];

    return (
        <div className="w-100">
            <Toast ref={toast} />

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                visible={deleteDialogVisible}
                style={{ width: "450px" }}
                header="Confirmar"
                modal
                footer={deleteDialogFooter}
                onHide={() => setDeleteDialogVisible(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i
                        className="fas fa-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem", color: "#F8BB86" }}
                    />
                    {availabilityToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar la disponibilidad de <b>{availabilityToDelete.doctorName}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <div className="card mb-3">
                <div className="card-body">
                    <Accordion>
                        <AccordionTab header="Filtros">
                            <div className="row">
                                <div className="col-md-6 col-lg-3">
                                    <label className="form-label">
                                        Día de la Semana
                                    </label>
                                    <Dropdown
                                        value={filtros.daysOfWeek}
                                        options={daysOfWeekOptions}
                                        onChange={(e) => handleFilterChange("daysOfWeek", e.value)}
                                        optionLabel="label"
                                        placeholder="Seleccione día"
                                        className="w-100"
                                        showClear
                                    />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <CustomPRTable
                        columns={columns}
                        data={tableItems}
                        loading={loading}
                        onSearch={handleSearchChange}
                        onReload={handleRefresh}
                    />
                </div>
            </div>
        </div>
    );
};