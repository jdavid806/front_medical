import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { CostCenterConfigTable } from "./table/CostCenterConfigTable.js";
import CostCenterModalConfig from "./modal/CostCenterModalConfig.js";
import { useCostCentersConfigTable } from "./hooks/useCostCentersConfigTable.js";
import { useCostCentersCreateTable } from "./hooks/useCostCentersCreateTable.js";
import { useCostCentersUpdate } from "./hooks/useCostCentersUpdate.js";
import { useCostCentersDelete } from "./hooks/useCostCentersDelete.js";
import { CostCentersMapperCreate, CostCentersMapperUpdate } from "./mapper/mappedCostCenters.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useCostCentersByIdConfigTable } from "./hooks/useCostCentersByConfigTable.js";
export const CostCenterConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);

  // Hooks para las operaciones CRUD
  const {
    costCenters,
    loading,
    error,
    refreshCostCenters
  } = useCostCentersConfigTable();
  const {
    createCostCenter,
    loading: createLoading
  } = useCostCentersCreateTable();
  const {
    updateCostCenter,
    loading: updateLoading
  } = useCostCentersUpdate();
  const {
    costCenter,
    fetchCostCenterById,
    setCostCenter
  } = useCostCentersByIdConfigTable();
  const {
    deleteCostCenter,
    loading: deleteLoading
  } = useCostCentersDelete();
  const onCreate = () => {
    setInitialData(undefined);
    setCostCenter(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      // Validación básica
      if (!data.code || !data.name) {
        throw new Error('Código y nombre son requeridos');
      }
      if (costCenter) {
        // Para actualización
        const updateData = CostCentersMapperUpdate(data);
        await updateCostCenter(costCenter.id, updateData);
        SwalManager.success('Centro de costo actualizado correctamente');
      } else {
        // Para creación
        const createData = CostCentersMapperCreate(data);
        await createCostCenter(createData);
        SwalManager.success('Centro de costo creado correctamente');
      }
      await refreshCostCenters();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error al guardar centro de costo:", error);
      SwalManager.error(error.message || 'Error al guardar el centro de costo');
    }
  };
  const handleTableEdit = async id => {
    try {
      await fetchCostCenterById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error al cargar centro de costo:", error);
    }
  };
  const handleDeleteCostCenter = async id => {
    try {
      await deleteCostCenter(id);
      await refreshCostCenters();
    } catch (error) {
      console.error("Error al eliminar centro de costo:", error);
    }
  };
  useEffect(() => {
    if (costCenter) {
      const data = {
        id: Number(costCenter.id),
        code: costCenter.code,
        name: costCenter.name,
        description: costCenter.description || ''
      };
      setInitialData(data);
    }
  }, [costCenter]);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Configuraci\xF3n de Centros de Costo"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "-2px 20px -20px"
    },
    className: "text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), createLoading || updateLoading ? 'Procesando...' : 'Nuevo Centro de Costo'))), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(CostCenterConfigTable, {
    costCenters: costCenters,
    onEditItem: handleTableEdit,
    onDeleteItem: handleDeleteCostCenter,
    loading: loading
  }), /*#__PURE__*/React.createElement(CostCenterModalConfig, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setCostCenter(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    loading: createLoading || updateLoading || deleteLoading
  }));
};