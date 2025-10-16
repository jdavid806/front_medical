import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { UserRoleDto } from "../../models/models";

interface UserRoleTableItem {
    id: string;
    name: string;
}

type UserRoleTableProps = {
    userRoles: UserRoleDto[];
    onEditItem: (id: string) => void;
    onDeleteItem: (id: string) => void;
    loading?: boolean;
    onReload?: () => void;
}

export const UserRoleTable: React.FC<UserRoleTableProps> = ({
    userRoles,
    onEditItem,
    onDeleteItem,
    loading = false,
    onReload
}) => {
    const [tableUserRoles, setTableUserRoles] = useState<UserRoleTableItem[]>([]);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<UserRoleTableItem | null>(null);
    const [filteredUserRoles, setFilteredUserRoles] = useState<UserRoleTableItem[]>([]);
    const [filtros, setFiltros] = useState({
        name: "",
    });
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const mappedUserRoles: UserRoleTableItem[] = userRoles.map(userRole => {
            return {
                id: userRole.id,
                name: userRole.name
            }
        });
        setTableUserRoles(mappedUserRoles);
    }, [userRoles]);

    // Función para sincronizar los datos filtrados
    const syncFilteredData = () => {
        let result = [...tableUserRoles];

        if (filtros.name) {
            result = result.filter((role) =>
                role.name.toLowerCase().includes(filtros.name.toLowerCase())
            );
        }

        setFilteredUserRoles(result);
    };

    // Sincroniza cuando cambian los userRoles o los filtros
    useEffect(() => {
        syncFilteredData();
    }, [tableUserRoles, filtros]);

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
            name: "",
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

    const confirmDelete = (role: UserRoleTableItem) => {
        setRoleToDelete(role);
        setDeleteDialogVisible(true);
    };

    const deleteRole = async () => {
        if (roleToDelete && onDeleteItem) {
            await onDeleteItem(roleToDelete.id);
            showToast("success", "Éxito", `Rol ${roleToDelete.name} eliminado`);

            // Refrescar después de eliminar
            if (onReload) {
                await onReload();
            }
        }
        setDeleteDialogVisible(false);
        setRoleToDelete(null);
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
                onClick={deleteRole}
            />
        </div>
    );

    const TableMenu: React.FC<{
        rowData: UserRoleTableItem,
        onEdit: (id: string) => void,
        onDelete: (role: UserRoleTableItem) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            console.log("Editando rol con ID:", rowData.id);
            onEdit(rowData.id);
        };

        const handleDelete = () => {
            console.log("Solicitando eliminar rol con ID:", rowData.id);
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

    const actionBodyTemplate = (rowData: UserRoleTableItem) => {
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

    const tableItems = filteredUserRoles.map(role => ({
        id: role.id,
        name: role.name,
        actions: role
    }));

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'name',
            header: 'Nombre del Rol',
            sortable: true
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
                    {roleToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar el rol <b>{roleToDelete.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <div className="card mb-3">
                <div className="card-body">
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