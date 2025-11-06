import React, { useState, useEffect, useRef, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { CustomPRTable, CustomPRTableColumnProps } from "../../../components/CustomPRTable";
import FixedAssetsModal from "../modal/FixedAssetsModal";
import { Filters, FixedAsset } from "../interfaces/FixedAssetsTableTypes";
import DepreciationAppreciationModal from "../modal/DepreciationAppreciationModal";
import MaintenanceModal from "../modal/MaintenanceModal";
import { useAssets } from "../hooks/useAssets";
import { useUpdateAssetStatus } from "../hooks/useUpdateAssetStatus";
import { useDataPagination } from "../../../hooks/useDataPagination";

export const FixedAssetsTable = () => {
  const { assets, fetchAssets } = useAssets();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FixedAsset | null>(null);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [selectedAssetForMaintenance, setSelectedAssetForMaintenance] = useState<FixedAsset | null>(null);
  const [depreciationModalVisible, setDepreciationModalVisible] = useState(false);
  const [selectedAssetForAdjustment, setSelectedAssetForAdjustment] = useState<FixedAsset | null>(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

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
    first: paginatorFirst,
    perPage,
    totalRecords: paginatorTotalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: fetchAssets,
    defaultPerPage: 10,
    getCustomFilters: () => filters,
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

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    aplicarFiltros(event.page + 1, event.rows);
  };

  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      await refresh();
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
    } finally {
      setTableLoading(false);
    }
  };

  const handleMaintenanceClick = (asset: FixedAsset) => {
    setSelectedAssetForMaintenance(asset);
    setMaintenanceModalVisible(true);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      category: null,
      internal_code: "",
      status: null,
      date_range: null,
    });
    refresh();
  };

  const formatCurrency = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "RD$ 0.00";
    }

    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (value: Date) => {
    return value?.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) || "";
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

  const calculateDepreciation = (purchaseValue: number, currentValue: number) => {
    if (!purchaseValue || purchaseValue === 0) return 0;
    return ((purchaseValue - currentValue) / purchaseValue) * 100;
  };

  const changeStatus = (asset: FixedAsset) => {
    setSelectedAssetForAdjustment(asset);
    setDepreciationModalVisible(true);
  };

  const TableMenu: React.FC<{
    rowData: FixedAsset;
  }> = ({ rowData }) => {
    const menu = useRef<Menu>(null);

    const handleMaintenance = () => {
      handleMaintenanceClick(rowData);
    };

    const handleDepreciation = () => {
      changeStatus(rowData);
    };

    const menuItems = [
      {
        label: "Mantenimiento/Estado",
        icon: <i className="fas fa-book-open me-2"></i>,
        command: handleMaintenance,
      },
      {
        label: "Depreciación/Apreciación",
        icon: <i className="fas fa-exchange-alt me-2"></i>,
        command: handleDepreciation,
      }
    ];

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          id={`popup_menu_${rowData.id}`}
          appendTo={document.body}
          style={{ zIndex: 9999, minWidth: "300px", maxWidth: "300px" }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: FixedAsset) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu rowData={rowData} />
      </div>
    );
  };

  const depreciationBodyTemplate = (rowData: any) => {
    const depreciation = calculateDepreciation(
      rowData.purchaseValue,
      rowData.currentValue
    );

    return (
      <div className="flex flex-column gap-1">
        <span>{depreciation.toFixed(2)}%</span>
        <ProgressBar
          value={depreciation}
          showValue={false}
          style={{ height: "6px", borderRadius: "3px" }}
          className={classNames({
            "p-progressbar-determinate": true,
            "p-progressbar-danger": depreciation > 50,
            "p-progressbar-warning": depreciation > 30 && depreciation <= 50,
            "p-progressbar-success": depreciation <= 30,
          })}
        />
      </div>
    );
  };

  const showToast = (severity: "success" | "error" | "info" | "warn", summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleSearchChangeCustom = (searchValue: string) => {
    setGlobalFilter(searchValue);
    handleSearchChange(searchValue);
  };

  const handleRefresh = async () => {
    clearFilters();
    await refresh();
  };

  // Mapear los datos para la tabla
  const tableItems = assetsData.map((asset: any) => ({
    id: asset.id,
    internal_code: asset.internal_code,
    description: asset.description,
    category: asset.category?.name || "",
    brand: asset.brand,
    model: asset.model,
    status: asset.status,
    purchaseValue: asset.purchase_value || 0,
    currentValue: asset.current_value || 0,
    actions: asset
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "internal_code",
      header: "Código",
      sortable: true
    },
    {
      field: "description",
      header: "Nombre/Descripción",
      sortable: true
    },
    {
      field: "category",
      header: "Categoría",
      sortable: true,
      body: (rowData: any) => getCategoryLabel(rowData.category)
    },
    {
      field: "brand",
      header: "Marca",
      sortable: true
    },
    {
      field: "model",
      header: "Modelo",
      sortable: true
    },
    {
      field: "status",
      header: "Estado",
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={getStatusLabel(rowData.status)}
          severity={getStatusSeverity(rowData.status)}
        />
      )
    },
    // {
    //   field: "depreciation",
    //   header: "Depreciación",
    //   sortable: true,
    //   body: depreciationBodyTemplate
    // },
    {
      field: "actions",
      header: "Acciones",
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false,
      width: "120px"
    }
  ];

  return (
    <main className="main w-100" id="top">
      <Toast ref={toast} />

      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{
            height: "50vh",
            marginLeft: "900px",
            marginTop: "300px",
          }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <div className="w-100">
          <div className="h-100 w-100 d-flex flex-column" style={{ marginTop: "-30px" }}>
            <div className="text-end pt-3 mb-2">
              <Button
                className="p-button-primary"
                onClick={() => setModalVisible(true)}
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Activo Fijo
              </Button>
            </div>

            <Accordion>
              <AccordionTab header="Filtros de Búsqueda">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Nombre/Descripción</label>
                    <InputText
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                      placeholder="Nombre del activo"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Categoría</label>
                    <Dropdown
                      value={filters.category}
                      options={assetCategories}
                      onChange={(e) => handleFilterChange("category", e.value)}
                      optionLabel="label"
                      placeholder="Seleccione categoría"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Código Interno</label>
                    <InputText
                      value={filters.internal_code}
                      onChange={(e) => handleFilterChange("internal_code", e.target.value)}
                      placeholder="Código del activo"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Estado</label>
                    <Dropdown
                      value={filters.status}
                      options={statusOptions}
                      onChange={(e) => handleFilterChange("status", e.value)}
                      optionLabel="label"
                      placeholder="Seleccione estado"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Fecha de Adquisición</label>
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

                  <div className="col-12 d-flex justify-content-end gap-2">
                    <Button
                      label="Limpiar"
                      icon="pi pi-trash"
                      className="p-button-secondary"
                      onClick={clearFilters}
                    />
                    <Button
                      label="Aplicar Filtros"
                      icon="pi pi-filter"
                      className="p-button-primary"
                      onClick={() => aplicarFiltros()}
                      loading={tableLoading || loadingPaginator}
                    />
                  </div>
                </div>
              </AccordionTab>
            </Accordion>

            <CustomPRTable
              columns={columns}
              data={tableItems}
              loading={tableLoading || loadingPaginator}
              onSearch={handleSearchChangeCustom}
              onReload={handleRefresh}
              paginator
              rows={rows}
              first={first}
              onPage={onPageChange}
              totalRecords={paginatorTotalRecords}
              rowsPerPageOptions={[5, 10, 25, 50]}
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} activos"
              emptyMessage="No se encontraron activos fijos"
            />
          </div>
        </div>
      )}

      {/* Modal para crear/editar activos */}
      <FixedAssetsModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedAsset(null);
        }}
        onSave={(assetData) => {
          setModalVisible(false);
          setSelectedAsset(null);
          refresh();
          showToast("success", "Éxito", "Activo fijo creado correctamente");
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
            setDepreciationModalVisible(false);
            setSelectedAssetForAdjustment(null);
            refresh();
            showToast(
              "success",
              "Ajuste registrado",
              `El ajuste de valor para ${selectedAssetForAdjustment.description} ha sido registrado correctamente.`
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
              status_changed_at: maintenanceData.maintenanceDate.toLocaleDateString("es-DO"),
              maintenance_cost: maintenanceData.cost || 0,
              status_comment: maintenanceData.comments || null,
            };

            await updateAssetStatus(selectedAssetForMaintenance.id, body);
            await refresh();

            setMaintenanceModalVisible(false);
            setSelectedAssetForMaintenance(null);

            showToast(
              "success",
              "Mantenimiento registrado",
              `El estado de ${selectedAssetForMaintenance?.description} ha sido actualizado.`
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
    </main>
  );
};

export default FixedAssetsTable;