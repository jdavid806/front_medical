import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { ModuleDto } from "../../models/models";
import { ticketService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";

interface ModuleTableProps {
    modules: ModuleDto[];
    onEditItem?: (id: string) => void;
    onDeleteItem?: (id: string) => void;
    loading?: boolean;
    onReload?: () => void;
}

interface ModuleTableItem {
    id: string;
    moduleName: string;
    branchName: string;
    allowedReasons: string;
    actions: any;
}

export const ModuleTable: React.FC<ModuleTableProps> = ({
    modules,
    onEditItem,
    onDeleteItem,
    loading = false,
    onReload
}) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState<ModuleTableItem | null>(null);
    const [reasonMap, setReasonMap] = useState<{ [key: string]: string }>({});
    const [filteredModules, setFilteredModules] = useState<ModuleTableItem[]>([]);
    const [filtros, setFiltros] = useState({
        moduleName: "",
        branchName: "",
        allowedReasons: "",
    });
    const toast = useRef<Toast>(null);

    // Cargar las razones de tickets
    useEffect(() => {
        const fetchReasons = async () => {
            try {
                const response = await ticketService.getAllTicketReasons();
                const map: { [key: string]: string } = {};
                response.reasons.forEach((r: any) => {
                    map[r.key] = r.label;
                });
                setReasonMap(map);
            } catch (error) {
                console.error("Error cargando razones:", error);
            }
        };

        fetchReasons();
    }, []);

    // Mapear y filtrar los módulos cuando cambian los datos o los filtros
    useEffect(() => {
        if (Object.keys(reasonMap).length === 0) return;

        const mappedModules: ModuleTableItem[] = modules.map(module_ => {
            const allowedReasonsText = module_.allowed_reasons
                .map(reason => reasonMap[reason] || reason)
                .join(', ');

            return {
                id: module_.id,
                moduleName: module_.name,
                branchName: module_.branch.address,
                allowedReasons: allowedReasonsText,
                actions: { id: module_.id, moduleName: module_.name }
            };
        });

        // Aplicar filtros
        let result = [...mappedModules];

        if (filtros.moduleName) {
            result = result.filter(module =>
                module.moduleName.toLowerCase().includes(filtros.moduleName.toLowerCase())
            );
        }

        if (filtros.branchName) {
            result = result.filter(module =>
                module.branchName.toLowerCase().includes(filtros.branchName.toLowerCase())
            );
        }

        if (filtros.allowedReasons) {
            result = result.filter(module =>
                module.allowedReasons.toLowerCase().includes(filtros.allowedReasons.toLowerCase())
            );
        }

        setFilteredModules(result);
    }, [modules, reasonMap, filtros]);

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
            moduleName: "",
            branchName: "",
            allowedReasons: "",
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

    const confirmDelete = (module: ModuleTableItem) => {
        setModuleToDelete(module);
        setDeleteDialogVisible(true);
    };

    const deleteModule = async () => {
        if (moduleToDelete && onDeleteItem) {
            try {
                onDeleteItem(moduleToDelete.id);

                SwalManager.success({
                    title: "Módulo Eliminado",
                });

                // Refrescar después de eliminar
                if (onReload) {
                    await onReload();
                }
            } catch (error) {
                console.error("Error al eliminar módulo:", error);
                SwalManager.error({
                    title: "Error",
                    text: "No se pudo eliminar el módulo",
                });
            }
        }
        setDeleteDialogVisible(false);
        setModuleToDelete(null);
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
                onClick={deleteModule}
            />
        </div>
    );

    const TableMenu: React.FC<{
        rowData: ModuleTableItem,
        onEdit: (id: string) => void,
        onDelete: (module: ModuleTableItem) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            console.log("Editando módulo con ID:", rowData.id);
            onEdit(rowData.id);
        };

        const handleDelete = () => {
            console.log("Solicitando eliminar módulo con ID:", rowData.id);
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

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <TableMenu
                    rowData={rowData.actions}
                    onEdit={onEditItem ? onEditItem : () => { }}
                    onDelete={confirmDelete}
                />
            </div>
        );
    };

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'moduleName',
            header: 'Nombre',
            sortable: true
        },
        {
            field: 'branchName',
            header: 'Sucursal',
            sortable: true
        },
        {
            field: 'allowedReasons',
            header: 'Motivos de visita a atender',
            sortable: true
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: actionBodyTemplate,
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
                    {moduleToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar el módulo <b>{moduleToDelete.moduleName}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <div className="card mb-3">
                <div className="card-body">
                    <CustomPRTable
                        columns={columns}
                        data={filteredModules}
                        loading={loading}
                        onSearch={handleSearchChange}
                        onReload={handleRefresh}
                    />
                </div>
            </div>
        </div>
    );
};