import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { UserAbsenceDto } from '../../models/models';
import { formatDateDMY } from '../../../services/utilidades';

type UserAbsenceTableItem = {
    id: string
    doctorName: string
    reason: string
    startDate: string
    endDate: string
    startDateObj: Date
    endDateObj: Date
}

type UserAbsenceTableProps = {
    items: UserAbsenceDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
    loading?: boolean
    onReload?: () => void
}

export const UserAbsenceTable: React.FC<UserAbsenceTableProps> = ({
    items,
    onEditItem,
    onDeleteItem,
    loading = false,
    onReload
}) => {
    const [tableItems, setTableItems] = useState<UserAbsenceTableItem[]>([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [absenceToDelete, setAbsenceToDelete] = useState<UserAbsenceTableItem | null>(null);
    const [filteredItems, setFilteredItems] = useState<UserAbsenceTableItem[]>([]);
    const [filtros, setFiltros] = useState({
        doctorName: "",
        reason: "",
        selectedDates: null as Date[] | null, // Array de fechas seleccionadas
    });
    const toast = useRef<Toast>(null);

    // Función para convertir string a Date
    const parseDate = (dateString: string): Date => {
        if (!dateString) return new Date();

        const parts = dateString.split('/');
        if (parts.length === 3) {
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date(dateString);
    };

    useEffect(() => {
        const mappedItems: UserAbsenceTableItem[] = items.map(item => {
            const startDateStr = formatDateDMY(item.start_date);
            const endDateStr = formatDateDMY(item.end_date);

            return {
                id: item.id,
                doctorName: `${item.user.first_name} ${item.user.middle_name} ${item.user.last_name} ${item.user.second_last_name}`.trim(),
                reason: item.reason,
                startDate: startDateStr,
                endDate: endDateStr,
                startDateObj: parseDate(startDateStr),
                endDateObj: parseDate(endDateStr)
            }
        })
        setTableItems(mappedItems);
    }, [items])

    // Función para sincronizar los datos filtrados
    const syncFilteredData = () => {
        let result = [...tableItems];


        if (filtros.selectedDates && filtros.selectedDates.length > 0) {
            result = result.filter((item) => {
                const itemStartDate = item.startDateObj;
                const itemEndDate = item.endDateObj;

                return filtros.selectedDates!.some(selectedDate => {
                    const normalizedSelected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                    const normalizedStart = new Date(itemStartDate.getFullYear(), itemStartDate.getMonth(), itemStartDate.getDate());
                    const normalizedEnd = new Date(itemEndDate.getFullYear(), itemEndDate.getMonth(), itemEndDate.getDate());

                    return normalizedSelected >= normalizedStart && normalizedSelected <= normalizedEnd;
                });
            });
        }

        setFilteredItems(result);
    };

    useEffect(() => {
        syncFilteredData();
    }, [tableItems, filtros]);

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
            reason: "",
            selectedDates: null,
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

    const confirmDelete = (absence: UserAbsenceTableItem) => {
        setAbsenceToDelete(absence);
        setDeleteDialogVisible(true);
    };

    const deleteAbsence = async () => {
        if (absenceToDelete && onDeleteItem) {
            await onDeleteItem(absenceToDelete.id);
            showToast("success", "Éxito", `Ausencia eliminada correctamente`);

            // Refrescar después de eliminar
            if (onReload) {
                await onReload();
            }
        }
        setDeleteDialogVisible(false);
        setAbsenceToDelete(null);
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
                onClick={deleteAbsence}
            />
        </div>
    );

    const TableMenu: React.FC<{
        rowData: UserAbsenceTableItem,
        onEdit: (id: string) => void,
        onDelete: (absence: UserAbsenceTableItem) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            console.log("Editando ausencia con ID:", rowData.id);
            onEdit(rowData.id);
        };

        const handleDelete = () => {
            console.log("Solicitando eliminar ausencia con ID:", rowData.id);
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

    const actionBodyTemplate = (rowData: UserAbsenceTableItem) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <TableMenu
                    rowData={rowData}
                    onEdit={onEditItem}
                    onDelete={confirmDelete}
                />
            </div>
        );
    };

    const formatSelectedDates = () => {
        if (!filtros.selectedDates || filtros.selectedDates.length === 0) {
            return "Seleccione fechas";
        }
        return `${filtros.selectedDates.length} fecha(s) seleccionada(s)`;
    };

    const finalTableItems = filteredItems.map(item => ({
        id: item.id,
        startDate: item.startDate,
        endDate: item.endDate,
        doctorName: item.doctorName,
        reason: item.reason,
        actions: item
    }));

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'startDate',
            header: 'Fecha Inicial',
            sortable: true
        },
        {
            field: 'endDate',
            header: 'Fecha Final',
            sortable: true
        },
        {
            field: 'doctorName',
            header: 'Usuario',
            sortable: true
        },
        {
            field: 'reason',
            header: 'Motivo',
            sortable: true,
            body: (rowData: any) => (
                <span title={rowData.reason}>
                    {rowData.reason && rowData.reason.length > 50
                        ? `${rowData.reason.substring(0, 50)}...`
                        : rowData.reason}
                </span>
            )
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: any) => actionBodyTemplate(rowData.actions),
            exportable: false,
            width: "20px"
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
                    {absenceToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar la ausencia de <b>{absenceToDelete.doctorName}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <div className="card mb-3">
                <div className="card-body">
                    <Accordion>
                        <AccordionTab header="Filtros">
                            <div className="row">

                                <div className="col-md-12 col-lg-4">
                                    <label className="form-label">
                                        Fechas de Ausencia
                                    </label>
                                    <Calendar
                                        value={filtros.selectedDates}
                                        onChange={(e) => handleFilterChange("selectedDates", e.value)}
                                        selectionMode="multiple"
                                        readOnlyInput
                                        placeholder="Seleccione fechas"
                                        className="w-100"
                                        showIcon
                                        dateFormat="dd/mm/yy"
                                        showButtonBar
                                    />
                                    <small className="text-muted">
                                        {formatSelectedDates()}
                                    </small>
                                </div>
                            </div>

                        </AccordionTab>
                    </Accordion>

                    <CustomPRTable
                        columns={columns}
                        data={finalTableItems}
                        loading={loading}
                        onSearch={handleSearchChange}
                        onReload={handleRefresh}
                    />
                </div>
            </div>
        </div>
    );
};