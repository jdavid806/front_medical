import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import { MenuItem } from "primereact/menuitem";
import FixedAssetsModal from "../modal/FixedAssetsModal";
import { Filters, FixedAsset } from "../interfaces/FixedAssetsTableTypes";
import DepreciationAppreciationModal from "../modal/DepreciationAppreciationModal";
import MaintenanceModal from "../modal/MaintenanceModal";
import { useAssets } from "../hooks/useAssets";
import { stringToDate } from "../../../../services/utilidades";
import { useUpdateAssetStatus } from "../hooks/useUpdateAssetStatus";
import { useDataPagination } from "../../../hooks/useDataPagination";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../../../components/CustomPRTable";

export const FixedAssetsTable = () => {
  const { assets, fetchAssets } = useAssets();
  const [filteredAssets, setFilteredAssets] = useState<FixedAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [selectedAssetForMaintenance, setSelectedAssetForMaintenance] =
    useState<FixedAsset | null>(null);
  const [depreciationModalVisible, setDepreciationModalVisible] =
    useState(false);
  const [selectedAssetForAdjustment, setSelectedAssetForAdjustment] =
    useState<FixedAsset | null>(null);
  const toast = useRef<Toast>(null);
  const { updateAssetStatus } = useUpdateAssetStatus();

  const [filters, setFilters] = useState<Filters>({
    name: "",
    category: null,
    internal_code: "",
    status: null,
    date_range: null,
  });

  const {
    data: assetsData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: fetchAssets,
    defaultPerPage: 10,
  });

  useEffect(() => {
    fetchAssets(filters);
  }, []);

  const assetCategories = [
    { label: "Computador", value: "computer" },
    { label: "Vehículo", value: "vehicle" },
    { label: "Mobiliario", value: "furniture" },
    { label: "Maquinaria", value: "machinery" },
    { label: "Equipo Electrónico", value: "electronic" },
    { label: "Otro", value: "other" },
  ];

  // En tu FixedAssetsTable.tsx, agrega estas constantes junto a las otras opciones
  const maintenanceTypeOptions = [
    { label: "Preventivo", value: "preventive" },
    { label: "Correctivo", value: "corrective" },
    { label: "Predictivo", value: "predictive" },
    { label: "Calibración", value: "calibration" },
  ];

  const userOptions = [
    { label: "Juan Pérez", value: "Juan Pérez" },
    { label: "María García", value: "María García" },
    { label: "Carlos López", value: "Carlos López" },
    { label: "Ana Rodríguez", value: "Ana Rodríguez" },
    { label: "Logística", value: "Logística" },
    { label: "Departamento Contable", value: "Departamento Contable" },
  ];

  const statusOptions = [
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" },
    { label: "En Mantenimiento", value: "maintenance" },
    { label: "Dado de Baja", value: "disposed" },
  ];

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMaintenanceClick = (asset: FixedAsset) => {
    setSelectedAssetForMaintenance(asset);
    setMaintenanceModalVisible(true);
  };

  const applyFilters = () => {
    fetchAssets(filters);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: null,
      internal_code: "",
      status: null,
      date_range: null,
    });
    setFilteredAssets(assets);
  };

  useEffect(() => {
    setFilteredAssets(assets);
    applyFilters();
  }, [assets]);

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
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return (option ? option.label : status) || "Sin Estado";
  };

  const getCategoryLabel = (category: string) => {
    const option = assetCategories.find((opt) => opt.value === category);
    return option ? option.label : category;
  };

  const calculateDepreciation = (
    purchaseValue: number,
    currentValue: number
  ) => {
    return ((purchaseValue - currentValue) / purchaseValue) * 100;
  };

  const changeStatus = (asset: FixedAsset) => {
    setSelectedAssetForAdjustment(asset);
    setDepreciationModalVisible(true);
  };

  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }}
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  // Acciones para cada fila
  const actionBodyTemplate = (rowData: FixedAsset) => {
    const items: MenuItem[] = [
      {
        label: "Mantenimiento/Estado",
        template: createActionTemplate(
          "book-open",
          "Mantenimiento/Estado",
          "text-purple-500"
        ),
        command: () => handleMaintenanceClick(rowData),
      },
      {
        label: "depreciacion o  apreciacion",
        template: createActionTemplate(
          "exchange-alt",
          "Depreciación/Apreciación",
          "text-purple-500"
        ),
        command: () => changeStatus(rowData),
      },
    ];

    return (
      <SplitButton
        label="Acciones"
        icon="pi pi-cog"
        model={items}
        severity="contrast"
        className="p-button-sm point"
        buttonClassName="p-button-sm"
        menuButtonClassName="p-button-sm point"
        style={{ width: "100%" }}
        menuStyle={{ minWidth: "300px", maxWidth: "300px", cursor: "pointer" }}
      />
    );
  };

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "internal_code",
      header: "Codigo",
    },
    {
      field: "description",
      header: "Nombre/Descripción",
    },
    {
      field: "category.name",
      header: "Categoría",
    },
    {
      field: "brand",
      header: "Marca",
    },
    {
      field: "model",
      header: "Modelo",
    },
    {
      field: "status",
      header: "Estado",
      body: (rowData) => (
        <Tag
          value={getStatusLabel(rowData.status)}
          severity={getStatusSeverity(rowData.status)}
        />
      ),
    },
    // {
    //   field: "depreciation",
    //   header: "Depreciación",
    //   body: (rowData) => (
    //     <div className="flex flex-column gap-1">
    //       <span>
    //         {calculateDepreciation(
    //           rowData.purchaseValue,
    //           rowData.currentValue
    //         ).toFixed(2)}
    //         %
    //       </span>
    //       <ProgressBar
    //         value={calculateDepreciation(
    //           rowData.purchaseValue,
    //           rowData.currentValue
    //         )}
    //         showValue={false}
    //         style={styles.depreciationBar}
    //         className={classNames({
    //           "p-progressbar-determinate": true,
    //           "p-progressbar-danger":
    //             calculateDepreciation(
    //               rowData.purchaseValue,
    //               rowData.currentValue
    //             ) > 50,
    //           "p-progressbar-warning":
    //             calculateDepreciation(
    //               rowData.purchaseValue,
    //               rowData.currentValue
    //             ) > 30 &&
    //             calculateDepreciation(
    //               rowData.purchaseValue,
    //               rowData.currentValue
    //             ) <= 50,
    //           "p-progressbar-success":
    //             calculateDepreciation(
    //               rowData.purchaseValue,
    //               rowData.currentValue
    //             ) <= 30,
    //         })}
    //       />
    //     </div>
    //   ),
    // },
    {
      field: "actions",
      header: "Acciones",
      body: actionBodyTemplate,
    },
  ];

  const showToast = (severity: string, summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
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
      <Toast ref={toast} />
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Activo Fijo"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={() => setModalVisible(true)}
        />
      </div>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          {/* Filtro: Nombre del Activo */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Nombre/Descripción</label>
            <InputText
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Nombre del activo"
              className="w-100"
            />
          </div>

          {/* Filtro: Categoría */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Categoría</label>
            <Dropdown
              value={filters.category}
              options={assetCategories}
              onChange={(e) => handleFilterChange("category", e.value)}
              optionLabel="label"
              placeholder="Seleccione categoría"
              className="w-100"
              appendTo={"self"}
            />
          </div>

          {/* Filtro: Código Interno */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Código Interno</label>
            <InputText
              value={filters.internal_code}
              onChange={(e) =>
                handleFilterChange("internal_code", e.target.value)
              }
              placeholder="Código del activo"
              className="w-100"
            />
          </div>

          {/* Filtro: Estado */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Estado</label>
            <Dropdown
              value={filters.status}
              options={statusOptions}
              onChange={(e) => handleFilterChange("status", e.value)}
              optionLabel="label"
              placeholder="Seleccione estado"
              className="w-100"
            />
          </div>

          {/* Filtro: Rango de fechas */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Fecha de Adquisición</label>
            <Calendar
              value={filters.date_range}
              onChange={(e) => handleFilterChange("date_range", e.value)}
              selectionMode="range"
              readOnlyInput
              dateFormat="dd/mm/yy"
              placeholder="Seleccione rango"
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
              onClick={clearFilters}
            />
            <Button
              label="Aplicar Filtros"
              icon="pi pi-filter"
              className="btn btn-primary"
              onClick={refresh}
              loading={loadingPaginator}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card title="Activos fijos" className="shadow-2">
        <CustomPRTable
          columns={columns}
          data={assetsData}
          lazy
          first={first}
          rows={perPage}
          totalRecords={totalRecords}
          loading={loadingPaginator}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={refresh}
        />
      </Card>

      {/* Modal para crear/editar activos */}
      <FixedAssetsModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedAsset(null);
        }}
        onSave={(assetData) => {
          setFilteredAssets([...assets]);
          setModalVisible(false);
          setSelectedAsset(null);
        }}
      />
      {selectedAssetForAdjustment && (
        <DepreciationAppreciationModal
          isVisible={depreciationModalVisible}
          onClose={() => {
            setDepreciationModalVisible(false);
            setSelectedAssetForAdjustment(null);
          }}
          onSave={async (adjustmentData) => {
            // Aquí implementas la lógica para guardar el ajuste
            console.log("Ajuste guardado:", adjustmentData);

            // Actualiza el estado de los activos si es necesario
            setDepreciationModalVisible(false);
            setSelectedAssetForAdjustment(null);

            // Muestra notificación de éxito
            showToast(
              "success",
              "Ajuste registrado",
              `El ajuste de valor para ${selectedAssetForAdjustment.attributes.description} ha sido registrado correctamente.`
            );
          }}
          asset={selectedAssetForAdjustment}
        />
      )}

      {selectedAssetForMaintenance && (
        <MaintenanceModal
          isVisible={maintenanceModalVisible}
          onSave={async (maintenanceData) => {
            const body = {
              status: maintenanceData.assetStatus,
              status_type: maintenanceData.maintenanceType,
              status_changed_at:
                maintenanceData.maintenanceDate.toLocaleDateString("es-DO"),
              maintenance_cost: maintenanceData.cost || 0,
              status_comment: maintenanceData.comments || null,
            };

            await updateAssetStatus(selectedAssetForMaintenance.id, body);

            await fetchAssets(filters);

            setMaintenanceModalVisible(false);
            setSelectedAssetForMaintenance(null);

            showToast(
              "success",
              "Mantenimiento registrado",
              `El estado de ${selectedAssetForMaintenance?.attributes?.description} ha sido actualizado.`
            );
          }}
          onClose={() => {
            setMaintenanceModalVisible(false);
            setSelectedAssetForMaintenance(null);
          }}
          asset={selectedAssetForMaintenance}
          statusOptions={statusOptions}
          maintenanceTypeOptions={maintenanceTypeOptions}
          userOptions={userOptions}
        />
      )}
    </div>
  );
};

export default FixedAssetsTable;
