import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { AccountingClosing, UseAccountingClosingsResponse } from "../hooks/useAccountingClosings";
import { formatDate } from "../../../../services/utilidades";

export interface AccountingClosingsTableProps {
    closings: UseAccountingClosingsResponse;
    onEditItem: (id: string) => void;
    onDeleteItem: (id: string) => void;
    loading?: boolean;
}

export const AccountingClosingsTable: React.FC<AccountingClosingsTableProps> = ({
    closings,
    onEditItem,
    onDeleteItem,
    loading = false
}) => {
    const [filters, setFilters] = useState({
        year: null as number | null,
        status: null as string | null,
    });

    const statusOptions = [
        { label: 'Abierto', value: 'open' },
        { label: 'Cerrado', value: 'closed' }
    ];

    const applyFilters = () => {
        let filtered = [...closings.data];

        if (filters.year) {
            filtered = filtered.filter(c => c.age === filters.year);
        }

        if (filters.status) {
            filtered = filtered.filter(c => c.status === filters.status);
        }

        return filtered;
    };

    const clearFilters = () => {
        setFilters({
            year: null,
            status: null,
        });
    };

    const actionBodyTemplate = (rowData: AccountingClosing) => {
        return (
            <div className="flex align-items-center justify-content-center" style={{ gap: "0.5rem", minWidth: "120px" }}>
                <Button
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => onEditItem(rowData.id.toString())}
                    tooltip="Editar"
                    tooltipOptions={{ position: 'top' }}
                ><i className="fas fa-pencil-alt"></i></Button>
                <Button
                    className="p-button-rounded p-button-text p-button-danger p-button-sm"
                    onClick={() => onDeleteItem(rowData.id.toString())}
                    tooltip="Eliminar"
                    tooltipOptions={{ position: 'top' }}
                ><i className="fa-solid fa-trash"></i></Button>
            </div>
        );
    };

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
            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Año</label>
                        <InputText
                            type="number"
                            value={filters.year?.toString() || ''}
                            onChange={(e) => setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
                            placeholder="Filtrar por año"
                            className={classNames("w-100")}
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Estado</label>
                        <Dropdown
                            value={filters.status}
                            options={statusOptions}
                            onChange={(e) => setFilters({ ...filters, status: e.value })}
                            placeholder="Seleccione estado"
                            className={classNames("w-100")}
                            showClear
                        />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2">
                        <Button
                            label="Limpiar"
                            icon="pi pi-filter-slash"
                            className="p-button-outlined"
                            onClick={clearFilters}
                        />
                        <Button
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className="p-button-primary"
                            onClick={() => { }} // Esto activará el filtrado automático
                        />
                    </div>
                </div>
            </Card>

            <Card title="Períodos Contables" style={styles.card}>
                <DataTable
                    value={applyFilters()}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron períodos contables"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "50rem" }}
                >
                    {/*<Column
                        field="age"
                        header="Año"
                        sortable
                        style={styles.tableCell}
                    />*/}
                    <Column
                        body={(rowData: AccountingClosing) => rowData.status === "open" ? "Abierto" : "Cerrado"}
                        header="Estado"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        header="Fecha Inicio"
                        body={(rowData: AccountingClosing) => formatDate(rowData.start_month)}
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        header="Fecha Fin"
                        body={(rowData: AccountingClosing) => formatDate(rowData.end_month)}
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="warning_days"
                        header="Días Advertencia"
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