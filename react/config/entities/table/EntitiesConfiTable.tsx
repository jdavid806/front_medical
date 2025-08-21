import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { EntitiesDTO } from "../interfaces/entitiesDTO";
import { EntitiesConfigTableProps } from "../interfaces/entitiesTable";

export const EntitiesConfiTable: React.FC<EntitiesConfigTableProps> = ({
    onEditItem,
    entities = [],
    loading = false,
    onDeleteItem,
}) => {
    const toast = useRef<Toast>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<EntitiesDTO | null>(null);
    const [filteredEntities, setFilteredEntities] = useState<EntitiesDTO[]>([]);
    const [filtros, setFiltros] = useState({
        name: "",
        document_type: null,
        city_id: ""
    });

    const documentTypes = [
        { label: "Cédula de Ciudadanía", value: "CC" },
        { label: "NIT", value: "NIT" },
        { label: "Cédula de Extranjería", value: "CE" },
        { label: "Pasaporte", value: "PASSPORT" },
        { label: "Tarjeta de Identidad", value: "TI" },
        { label: "RNC", value: "RNC" }
    ];

    useEffect(() => {
        setFilteredEntities(entities);
    }, [entities]);

    const handleFilterChange = (field: string, value: any) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const aplicarFiltros = () => {
        let result = [...entities];

        if (filtros.name) {
            result = result.filter((entity) =>
                entity.name.toLowerCase().includes(filtros.name.toLowerCase())
            );
        }

        if (filtros.document_type) {
            result = result.filter((entity) => entity.document_type === filtros.document_type);
        }

        setFilteredEntities(result);
    };

    const limpiarFiltros = () => {
        setFiltros({
            name: "",
            document_type: null,
            city_id: ""
        });
        setFilteredEntities(entities);
    };

    const actionBodyTemplate = (rowData: EntitiesDTO) => {
        return (
            <div className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}>
                <Button
                    icon={<i className="fa-solid fa-pen"></i>}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => onEditItem && onEditItem(rowData.id.toString())}
                />
                <Button
                    icon={<i className="fa-solid fa-trash"></i>}
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    onClick={() => confirmDelete(rowData)}
                />
            </div>
        );
    };

    const documentTypeBodyTemplate = (rowData: EntitiesDTO) => {
        const type = documentTypes.find(doc => doc.value === rowData.document_type);
        return type ? type.label : rowData.document_type;
    };

    const confirmDelete = (entity: EntitiesDTO) => {
        setEntityToDelete(entity);
        setDeleteDialogVisible(true);
    };

    const deleteEntity = () => {
        if (entityToDelete && onDeleteItem) {
            onDeleteItem(entityToDelete.id.toString());
            showToast("success", "Éxito", `Entidad ${entityToDelete.name} eliminada`);
        }
        setDeleteDialogVisible(false);
    };

    const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
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
                onClick={deleteEntity}
            />
        </div>
    );

    const styles = {
        card: {
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
        },
        cardTitle: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#333",
        },
        tableHeader: {
            backgroundColor: "#f8f9fa",
            color: "#495057",
            fontWeight: 600,
        },
        tableCell: {
            padding: "0.75rem 1rem",
        },
        formLabel: {
            fontWeight: 500,
            marginBottom: "0.5rem",
            display: "block",
        },
    };

    return (
        <div className="container-fluid mt-4" style={{ width: "100%", padding: "0 15px" }}>
            <Toast ref={toast} />

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
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem", color: "#f8bb86" }}
                    />
                    {entityToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar la entidad <b>{entityToDelete.name}</b>?
                            Esta acción no se puede deshacer.
                        </span>
                    )}
                </div>
            </Dialog>

            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Nombre</label>
                        <InputText
                            value={filtros.name}
                            onChange={(e) => handleFilterChange("name", e.target.value)}
                            placeholder="Buscar por nombre"
                            className={classNames("w-100")}
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Tipo de Documento</label>
                        <Dropdown
                            value={filtros.document_type}
                            options={documentTypes}
                            onChange={(e) => handleFilterChange("document_type", e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
                            className={classNames("w-100")}
                            showClear
                        />
                    </div>

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
                            className="btn btn-primary"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            <Card title="Configuración de Entidades" style={styles.card}>
                <DataTable
                    value={filteredEntities}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron entidades"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "50rem" }}
                >
                    <Column
                        field="name"
                        header="Nombre"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="document_type"
                        header="Tipo Documento"
                        sortable
                        body={documentTypeBodyTemplate}
                        style={styles.tableCell}
                    />
                    <Column
                        field="document_number"
                        header="Número Documento"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="email"
                        header="Email"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="phone"
                        header="Teléfono"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        body={actionBodyTemplate}
                        header="Acciones"
                        style={{ width: "120px" }}
                        exportable={false}
                    />
                </DataTable>
            </Card>
        </div>
    );
};