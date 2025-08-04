import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { Badge } from "primereact/badge";

interface DepreciationRecord {
  id: string;
  assetId: string;
  assetName: string;
  internalCode: string;
  date: Date;
  previousValue: number;
  newValue: number;
  changeAmount: number;
  changeType: "depreciation" | "appreciation";
  changePercentage: number;
  notes?: string;
}

interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  internalCode: string;
  maintenanceDate: Date;
  maintenanceType: string;
  maintenanceCost: number;
  statusBefore: string;
  statusAfter: string;
  assignedToBefore?: string;
  assignedToAfter?: string;
  nextMaintenanceDate?: Date;
  comments: string;
}

export const DepreciationHistoryTable = () => {
  const [records, setRecords] = useState<DepreciationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DepreciationRecord[]>(
    []
  );

  const [maintenanceRecords, setMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);
  const [filteredMaintenanceRecords, setFilteredMaintenanceRecords] = useState<
    MaintenanceRecord[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [maintenanceDateRange, setMaintenanceDateRange] = useState<
    Date[] | null
  >(null);
  const [changeTypeFilter, setChangeTypeFilter] = useState<string | null>(null);
  const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState<
    string | null
  >(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const statusOptions = [
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" },
    { label: "En Mantenimiento", value: "maintenance" },
    { label: "Dado de Baja", value: "disposed" },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulando carga de datos
    setTimeout(() => {
      // Datos de ejemplo para mantenimiento
      const mockMaintenanceData: MaintenanceRecord[] = [
        {
          id: "m1",
          assetId: "1",
          assetName: "Laptop Ejecutiva",
          internalCode: "ACT-IT-001",
          maintenanceDate: new Date(2023, 3, 10),
          maintenanceType: "preventive",
          maintenanceCost: 5000,
          statusBefore: "active",
          statusAfter: "active",
          assignedToBefore: "Juan Pérez",
          assignedToAfter: "Juan Pérez",
          nextMaintenanceDate: new Date(2023, 9, 10),
          comments:
            "Mantenimiento preventivo estándar, limpieza interna y actualización de software",
        },
        {
          id: "m2",
          assetId: "2",
          assetName: "Camioneta de Reparto",
          internalCode: "ACT-VH-001",
          maintenanceDate: new Date(2023, 4, 15),
          maintenanceType: "corrective",
          maintenanceCost: 25000,
          statusBefore: "active",
          statusAfter: "maintenance",
          assignedToBefore: "Logística",
          assignedToAfter: "",
          comments: "Reparación del sistema de frenos y cambio de aceite",
        },
        {
          id: "m3",
          assetId: "4",
          assetName: "Impresora Multifuncional",
          internalCode: "ACT-IT-002",
          maintenanceDate: new Date(2023, 2, 5),
          maintenanceType: "calibration",
          maintenanceCost: 3500,
          statusBefore: "maintenance",
          statusAfter: "active",
          assignedToBefore: "",
          assignedToAfter: "Departamento Contable",
          nextMaintenanceDate: new Date(2023, 8, 5),
          comments:
            "Calibración de colores y alineación de cabezales de impresión",
        },
        {
          id: "m4",
          assetId: "1",
          assetName: "Laptop Ejecutiva",
          internalCode: "ACT-IT-001",
          maintenanceDate: new Date(2024, 1, 20),
          maintenanceType: "corrective",
          maintenanceCost: 12000,
          statusBefore: "active",
          statusAfter: "maintenance",
          assignedToBefore: "Juan Pérez",
          assignedToAfter: "",
          comments:
            "Reemplazo de pantalla dañada y actualización de memoria RAM",
        },
      ];

      setMaintenanceRecords(mockMaintenanceData);
      setFilteredMaintenanceRecords(mockMaintenanceData);

      const mockData: DepreciationRecord[] = [
        {
          id: "1",
          assetId: "1",
          assetName: "Laptop Ejecutiva",
          internalCode: "ACT-IT-001",
          date: new Date(2023, 0, 15),
          previousValue: 120000,
          newValue: 110000,
          changeAmount: -10000,
          changeType: "depreciation",
          changePercentage: -8.33,
          notes: "Depreciación anual normal",
        },
        {
          id: "2",
          assetId: "1",
          assetName: "Laptop Ejecutiva",
          internalCode: "ACT-IT-001",
          date: new Date(2024, 0, 15),
          previousValue: 110000,
          newValue: 95000,
          changeAmount: -15000,
          changeType: "depreciation",
          changePercentage: -13.64,
          notes: "Depreciación acelerada por daños menores",
        },
        {
          id: "3",
          assetId: "2",
          assetName: "Camioneta de Reparto",
          internalCode: "ACT-VH-001",
          date: new Date(2023, 5, 20),
          previousValue: 1800000,
          newValue: 1700000,
          changeAmount: -100000,
          changeType: "depreciation",
          changePercentage: -5.56,
          notes: "Depreciación normal por uso",
        },
        {
          id: "4",
          assetId: "2",
          assetName: "Camioneta de Reparto",
          internalCode: "ACT-VH-001",
          date: new Date(2024, 5, 20),
          previousValue: 1700000,
          newValue: 1750000,
          changeAmount: 50000,
          changeType: "appreciation",
          changePercentage: 2.94,
          notes: "Revalorización por mejoras realizadas",
        },
        {
          id: "5",
          assetId: "3",
          assetName: "Mesa de Conferencia",
          internalCode: "ACT-MB-001",
          date: new Date(2023, 2, 10),
          previousValue: 75000,
          newValue: 70000,
          changeAmount: -5000,
          changeType: "depreciation",
          changePercentage: -6.67,
        },
      ];
      setRecords(mockData);
      setFilteredRecords(mockData);
      setLoading(false);
    }, 800);
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getChangeTypeSeverity = (type: string) => {
    return type === "depreciation" ? "danger" : "success";
  };

  const getChangeTypeLabel = (type: string) => {
    return type === "depreciation" ? "Depreciación" : "Apreciación";
  };

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...records];
      let filteredMaintenance = [...maintenanceRecords];

      // Filtros para depreciación
      if (dateRange && dateRange.length === 2) {
        const [start, end] = dateRange;
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.date);
          return recordDate >= start && recordDate <= end;
        });
      }

      if (changeTypeFilter) {
        filtered = filtered.filter(
          (record) => record.changeType === changeTypeFilter
        );
      }

      // Filtros para mantenimiento
      if (maintenanceDateRange && maintenanceDateRange.length === 2) {
        const [start, end] = maintenanceDateRange;
        filteredMaintenance = filteredMaintenance.filter((record) => {
          const recordDate = new Date(record.maintenanceDate);
          return recordDate >= start && recordDate <= end;
        });
      }

      if (maintenanceTypeFilter) {
        filteredMaintenance = filteredMaintenance.filter(
          (record) => record.maintenanceType === maintenanceTypeFilter
        );
      }

      setFilteredRecords(filtered);
      setFilteredMaintenanceRecords(filteredMaintenance);
      setLoading(false);
    }, 300);
  };

  const clearFilters = () => {
    setDateRange(null);
    setMaintenanceDateRange(null);
    setChangeTypeFilter(null);
    setMaintenanceTypeFilter(null);
    setFilteredRecords(records);
    setFilteredMaintenanceRecords(maintenanceRecords);
  };

  const changeTypeOptions = [
    { label: "Depreciación", value: "depreciation" },
    { label: "Apreciación", value: "appreciation" },
  ];

  const maintenanceTypeOptions = [
    { label: "Preventivo", value: "preventive" },
    { label: "Correctivo", value: "corrective" },
    { label: "Calibración", value: "calibration" },
    { label: "Predictivo", value: "predictive" },
  ];

  const renderChangeAmount = (rowData: DepreciationRecord) => {
    const isDepreciation = rowData.changeType === "depreciation";
    const icon = isDepreciation ? "arrow-down" : "arrow-up";
    const color = isDepreciation ? "text-red-500" : "text-green-500";

    return (
      <div className="flex align-items-center gap-2">
        <i className={`pi pi-${icon} ${color}`} />
        <span className={color}>
          {formatCurrency(Math.abs(rowData.changeAmount))}
        </span>
        <Badge
          value={`${rowData.changePercentage.toFixed(2)}%`}
          severity={isDepreciation ? "danger" : "success"}
          className="ml-2"
        />
      </div>
    );
  };

  const getMaintenanceTypeLabel = (type: string) => {
    switch (type) {
      case "preventive":
        return "Preventivo";
      case "corrective":
        return "Correctivo";
      case "predictive":
        return "Predictivo";
      case "calibration":
        return "Calibración";
      default:
        return type;
    }
  };

  const getMaintenanceTypeSeverity = (type: string) => {
    switch (type) {
      case "preventive":
        return "info";
      case "corrective":
        return "warning";
      case "predictive":
        return "success";
      case "calibration":
        return "secondary";
      default:
        return null;
    }
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "maintenance":
        return "info";
      case "disposed":
        return "danger";
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusOptions = [
      { label: "Activo", value: "active" },
      { label: "Inactivo", value: "inactive" },
      { label: "En Mantenimiento", value: "maintenance" },
      { label: "Dado de Baja", value: "disposed" },
    ];

    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const renderStatusChange = (rowData: MaintenanceRecord) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className="pi pi-arrow-right text-500" />
        <Tag
          value={getStatusLabel(rowData.statusAfter)}
          severity={getStatusSeverity(rowData.statusAfter)}
          className="text-xs"
        />
      </div>
    );
  };

  const renderAssignmentChange = (rowData: MaintenanceRecord) => {
    return (
      <div className="flex flex-column">
        {rowData.assignedToBefore && (
          <small className="text-500">{rowData.assignedToBefore}</small>
        )}
      </div>
    );
  };

  const renderAssetCard = (assetId: string) => {
    const assetRecords = records.filter((r) => r.assetId === assetId);
    if (assetRecords.length === 0) return null;

    const asset = assetRecords[0];
    const totalDepreciation = assetRecords
      .filter((r) => r.changeType === "depreciation")
      .reduce((sum, r) => sum + r.changeAmount, 0);
    const totalAppreciation = assetRecords
      .filter((r) => r.changeType === "appreciation")
      .reduce((sum, r) => sum + r.changeAmount, 0);
    const netChange = totalDepreciation + totalAppreciation;
    const netPercentage =
      (netChange / assetRecords[assetRecords.length - 1].previousValue) * 100;

    return (
      <Card
        key={assetId}
        className="mb-4 shadow-2"
        title={
          <div className="flex justify-content-between align-items-center">
            <span>{asset.assetName}</span>
            <Tag value={asset.internalCode} severity="info" className="ml-2" />
          </div>
        }
      >
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-3 border-round bg-blue-50">
              <p className="text-sm font-medium text-600 mb-1">Valor Inicial</p>
              <p className="text-xl font-bold text-900">
                {formatCurrency(
                  assetRecords[assetRecords.length - 1].previousValue
                )}
              </p>
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-3 border-round bg-green-50">
              <p className="text-sm font-medium text-600 mb-1">Valor Actual</p>
              <p className="text-xl font-bold text-900">
                {formatCurrency(assetRecords[0].newValue)}
              </p>
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-3 border-round bg-red-50">
              <p className="text-sm font-medium text-600 mb-1">
                Depreciación Total
              </p>
              <p className="text-xl font-bold text-red-500">
                -{formatCurrency(Math.abs(totalDepreciation))}
              </p>
            </div>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <div className="p-3 border-round bg-teal-50">
              <p className="text-sm font-medium text-600 mb-1">
                Apreciación Total
              </p>
              <p className="text-xl font-bold text-green-500">
                +{formatCurrency(totalAppreciation)}
              </p>
            </div>
          </div>

          <div className="col-12 mt-3">
            <Divider />
            <div className="flex flex-column">
              <div className="flex justify-content-between mb-2">
                <span className="font-medium">Cambio Neto</span>
                <span
                  className={classNames("font-bold", {
                    "text-green-500": netChange > 0,
                    "text-red-500": netChange < 0,
                  })}
                >
                  {netChange > 0 ? "+" : ""}
                  {formatCurrency(netChange)} ({netPercentage.toFixed(2)}%)
                </span>
              </div>
              <ProgressBar
                value={Math.abs(netPercentage)}
                showValue={false}
                color={netChange > 0 ? "#22C55E" : "#EF4444"}
                style={{ height: "6px" }}
              />
            </div>
          </div>

          <div className="col-12 mt-3">
            <small className="text-500">
              Última actualización: {formatDate(assetRecords[0].date)}
            </small>
          </div>
        </div>
      </Card>
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
    rangeCalendar: {
      width: "100%",
    },
    depreciationBar: {
      height: "6px",
      borderRadius: "3px",
    },
  };

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <h2 className="m-0">Historial</h2>

      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Registro"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={() => setShowNewDialog(true)}
        />
      </div>

      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Historial Detallado" leftIcon="pi pi-history mr-2">
          <Card title="Filtros de Búsqueda" style={styles.card}>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <div className="field">
                  <label style={styles.formLabel}>Rango de Fechas</label>
                  <Calendar
                    id="dateRange"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.value as Date[])}
                    selectionMode="range"
                    readOnlyInput
                    dateFormat="dd/mm/yy"
                    placeholder="Seleccione rango"
                    className="w-100"
                    showIcon
                  />
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <label style={styles.formLabel}>Tipo de Cambio</label>
                <Dropdown
                  id="changeType"
                  value={changeTypeFilter}
                  options={changeTypeOptions}
                  onChange={(e) => setChangeTypeFilter(e.value)}
                  optionLabel="label"
                  placeholder="Todos los tipos"
                  className="w-100"
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <Button
                  label="Limpiar"
                  icon="pi pi-filter-slash"
                  className="btn btn-phoenix-secondary"
                  onClick={clearFilters}
                />
                <Button
                  label="Aplicar Filtros"
                  icon="pi pi-filter"
                  className="btn btn-primary"
                  onClick={applyFilters}
                  loading={loading}
                />
              </div>
            </div>
          </Card>

          <Card>
            <DataTable
              value={filteredRecords}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              loading={loading}
              className="p-datatable-striped p-datatable-gridlines"
              emptyMessage="No se encontraron registros"
              responsiveLayout="scroll"
              removableSort
            >
              <Column
                field="date"
                header="Fecha"
                body={(rowData) => formatDate(rowData.date)}
                sortable
                style={{ minWidth: "120px" }}
              />
              <Column
                field="assetName"
                header="Activo"
                body={(rowData) => (
                  <div>
                    <div className="font-bold">{rowData.assetName}</div>
                    <div className="text-sm text-500">
                      {rowData.internalCode}
                    </div>
                  </div>
                )}
                sortable
                style={{ minWidth: "200px" }}
              />
              <Column
                field="previousValue"
                header="Valor Anterior"
                body={(rowData) => formatCurrency(rowData.previousValue)}
                sortable
                style={{ minWidth: "150px" }}
              />
              <Column
                field="newValue"
                header="Nuevo Valor"
                body={(rowData) => formatCurrency(rowData.newValue)}
                sortable
                style={{ minWidth: "150px" }}
              />
              <Column
                field="changeType"
                header="Tipo"
                body={(rowData) => (
                  <Tag
                    value={getChangeTypeLabel(rowData.changeType)}
                    severity={getChangeTypeSeverity(rowData.changeType)}
                    icon={
                      rowData.changeType === "depreciation"
                        ? "pi pi-arrow-down"
                        : "pi pi-arrow-up"
                    }
                  />
                )}
                sortable
                style={{ minWidth: "140px" }}
              />
              <Column
                header="Variación"
                body={renderChangeAmount}
                sortable
                sortField="changeAmount"
                style={{ minWidth: "180px" }}
              />
              <Column
                field="notes"
                header="Notas"
                style={{ minWidth: "200px" }}
              />
            </DataTable>
          </Card>
        </TabPanel>

        <TabPanel header="Resumen por Activo" leftIcon="pi pi-chart-bar mr-2">
          <div className="grid">
            {Array.from(new Set(records.map((r) => r.assetId))).map(
              renderAssetCard
            )}
          </div>
        </TabPanel>

        <TabPanel header="Historial Mantenimiento" leftIcon="pi pi-wrench mr-2">
          <Card title="Filtros de Mantenimiento" style={styles.card}>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <div className="field">
                  <label style={styles.formLabel}>Rango de Fechas</label>
                  <Calendar
                    id="maintenanceDateRange"
                    value={maintenanceDateRange}
                    onChange={(e) => setMaintenanceDateRange(e.value as Date[])}
                    selectionMode="range"
                    readOnlyInput
                    dateFormat="dd/mm/yy"
                    placeholder="Seleccione rango"
                    className="w-100"
                    showIcon
                  />
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <label style={styles.formLabel}>Tipo de Mantenimiento</label>
                <Dropdown
                  id="maintenanceType"
                  value={maintenanceTypeFilter}
                  options={maintenanceTypeOptions}
                  onChange={(e) => setMaintenanceTypeFilter(e.value)}
                  optionLabel="label"
                  placeholder="Todos los tipos"
                  className="w-100"
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <Button
                  label="Limpiar"
                  icon="pi pi-filter-slash"
                  className="btn btn-phoenix-secondary"
                  onClick={clearFilters}
                />
                <Button
                  label="Aplicar Filtros"
                  icon="pi pi-filter"
                  className="btn btn-primary"
                  onClick={applyFilters}
                  loading={loading}
                />
              </div>
            </div>
          </Card>

          <Card>
            <DataTable
              value={filteredMaintenanceRecords}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              loading={loading}
              className="p-datatable-striped p-datatable-gridlines"
              emptyMessage="No se encontraron registros de mantenimiento"
              responsiveLayout="scroll"
              removableSort
            >
              <Column
                field="maintenanceDate"
                header="Fecha"
                body={(rowData) => formatDate(rowData.maintenanceDate)}
                sortable
                style={{ minWidth: "120px" }}
              />
              <Column
                field="assetName"
                header="Activo"
                body={(rowData) => (
                  <div>
                    <div className="font-bold">{rowData.assetName}</div>
                    <div className="text-sm text-500">
                      {rowData.internalCode}
                    </div>
                  </div>
                )}
                sortable
                style={{ minWidth: "200px" }}
              />
              <Column
                field="maintenanceType"
                header="Tipo"
                body={(rowData) => (
                  <Tag
                    value={getMaintenanceTypeLabel(rowData.maintenanceType)}
                    severity={getMaintenanceTypeSeverity(
                      rowData.maintenanceType
                    )}
                  />
                )}
                sortable
                style={{ minWidth: "120px" }}
              />

              <Column
                header="Estado"
                body={renderStatusChange}
                style={{ minWidth: "180px" }}
              />
              <Column
                header="Asignación"
                body={renderAssignmentChange}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="nextMaintenanceDate"
                header="Próximo"
                body={(rowData) =>
                  rowData.nextMaintenanceDate
                    ? formatDate(rowData.nextMaintenanceDate)
                    : "N/A"
                }
                sortable
                style={{ minWidth: "120px" }}
              />
              <Column
                field="comments"
                header="Detalles"
                style={{ minWidth: "250px" }}
              />
            </DataTable>
          </Card>
        </TabPanel>
      </TabView>

      <Dialog
        header="Nuevo Registro de Depreciación/Apreciación"
        visible={showNewDialog}
        style={{ width: "50vw" }}
        onHide={() => setShowNewDialog(false)}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="asset" className="block mb-2 font-medium">
              Activo
            </label>
            <Dropdown
              id="asset"
              options={Array.from(
                new Set(
                  records.map((r) => ({
                    label: `${r.assetName} (${r.internalCode})`,
                    value: r.assetId,
                  }))
                )
              )}
              optionLabel="label"
              className="w-full"
            />
          </div>

          <div className="grid">
            <div className="col-12 md:col-6 field">
              <label htmlFor="date" className="block mb-2 font-medium">
                Fecha
              </label>
              <Calendar
                id="date"
                dateFormat="dd/mm/yy"
                className="w-full"
                showIcon
              />
            </div>

            <div className="col-12 md:col-6 field">
              <label htmlFor="type" className="block mb-2 font-medium">
                Tipo
              </label>
              <Dropdown
                id="type"
                options={changeTypeOptions}
                placeholder="Seleccione tipo"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid">
            <div className="col-12 md:col-6 field">
              <label htmlFor="previousValue" className="block mb-2 font-medium">
                Valor Anterior
              </label>
              <InputNumber
                id="previousValue"
                mode="currency"
                currency="DOP"
                locale="es-DO"
                className="w-full"
              />
            </div>

            <div className="col-12 md:col-6 field">
              <label htmlFor="newValue" className="block mb-2 font-medium">
                Nuevo Valor
              </label>
              <InputNumber
                id="newValue"
                mode="currency"
                currency="DOP"
                locale="es-DO"
                className="w-full"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes" className="block mb-2 font-medium">
              Notas
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full p-2 border-1 surface-border border-round"
            />
          </div>

          <div className="flex justify-content-end gap-2 mt-4">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-outlined p-button-secondary"
              onClick={() => setShowNewDialog(false)}
            />
            <Button
              label="Guardar"
              icon="pi pi-check"
              className="p-button-success"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DepreciationHistoryTable;
