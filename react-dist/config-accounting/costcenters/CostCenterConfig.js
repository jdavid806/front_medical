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
import { Button } from "primereact/button";
export const CostCenterConfig = ({
  onConfigurationComplete
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
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
      if (!data.code || !data.name) {
        throw new Error('Código y nombre son requeridos');
      }
      if (costCenter) {
        const updateData = CostCentersMapperUpdate(data);
        await updateCostCenter(costCenter.id, updateData);
        SwalManager.success('Centro de costo actualizado correctamente');
      } else {
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
      SwalManager.error('Error al cargar el centro de costo');
    }
  };
  const handleDeleteCostCenter = async id => {
    try {
      const success = await deleteCostCenter(id);
      if (success) {
        await refreshCostCenters();
        SwalManager.success('Retention eliminado correctamente');
      } else {
        SwalManager.error('No se pudo eliminar Retention');
      }
    } catch (error) {
      console.error("Error en eliminación:", error);
      SwalManager.error('Error al eliminar el Retention');
    }
  };
  useEffect(() => {
    const hasCostCenters = costCenters && costCenters.length > 0;
    onConfigurationComplete?.(hasCostCenters);
  }, [costCenters, onConfigurationComplete]);
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
  }, error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary d-flex align-items-center",
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), createLoading || updateLoading ? 'Procesando...' : 'Nuevo Centro de Costo'))), /*#__PURE__*/React.createElement(CostCenterConfigTable, {
    costCenters: costCenters,
    onEditItem: handleTableEdit,
    onDeleteItem: handleDeleteCostCenter,
    loading: loading,
    onReload: refreshCostCenters
  }))), /*#__PURE__*/React.createElement(CostCenterModalConfig, {
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