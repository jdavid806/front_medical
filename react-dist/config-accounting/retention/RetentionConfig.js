import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { RetentionConfigTable } from "./table/RetentionConfigTable.js";
import RetentionModalConfig from "./modal/RetentionModalConfig.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useRetentionsConfigTable } from "./hooks/useRetentionConfigTable.js";
import { useRetentionCreateTable } from "./hooks/useRetentionCreateTable.js";
import { useRetentionConfigByTable } from "./hooks/useRetentionConfigByTable.js";
import { useRetentionDeleteTable } from "./hooks/useRetentionDeleteTable.js";
import { useRetentionUpdateTable } from "./hooks/useRetentionUpdateTable.js";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts.js";
import { RetentionMapperCreate, RetentionMapperUpdate } from "./mapper/mappedRetention.js";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
export const RetentionConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const [retentionToDelete, setRetentionToDelete] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  // Hooks para las operaciones CRUD
  const {
    retentions,
    loading,
    error,
    refreshRetentions
  } = useRetentionsConfigTable();
  const {
    createRetention,
    loading: createLoading
  } = useRetentionCreateTable();
  const {
    updateRetention,
    loading: updateLoading
  } = useRetentionUpdateTable();
  const {
    retention,
    fetchRetentionById,
    setRetention
  } = useRetentionConfigByTable();
  const {
    deleteRetention,
    loading: deleteLoading
  } = useRetentionDeleteTable();
  const {
    accounts,
    isLoading: isLoadingAccounts
  } = useAccountingAccounts();
  const onCreate = () => {
    setInitialData(undefined);
    setRetention(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (retention) {
        const updateData = RetentionMapperUpdate(data);
        await updateRetention(retention.id, updateData);
        SwalManager.success('Retención actualizada correctamente');
      } else {
        const createData = RetentionMapperCreate(data);
        await createRetention(createData);
        SwalManager.success('Retención creada correctamente');
      }
      await refreshRetentions();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error al guardar retención:", error);
      SwalManager.error(error.message || 'Error al guardar la retención');
    }
  };
  const handleTableEdit = async id => {
    try {
      await fetchRetentionById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error al cargar retención:", error);
      SwalManager.error('Error al cargar los datos de la retención');
    }
  };
  const handleDeleteRetention = async id => {
    try {
      await deleteRetention(id);
      await refreshRetentions();
      SwalManager.success('Retención eliminada correctamente');
    } catch (error) {
      console.error("Error al eliminar retención:", error);
      SwalManager.error('Error al eliminar la retención');
    } finally {
      setDeleteDialogVisible(false);
      setRetentionToDelete(null);
    }
  };
  const confirmDelete = id => {
    setRetentionToDelete(id);
    setDeleteDialogVisible(true);
  };
  useEffect(() => {
    if (retention && accounts) {
      // Encontrar la cuenta principal por account_code
      const mainAccount = accounts.find(acc => acc.account_code === retention.accounting_account || acc.id.toString() === retention.accounting_account);

      // Encontrar la cuenta de reversa por id o account_code
      const reverseAccount = accounts.find(acc => acc.id === retention.accounting_account_reverse_id || acc.account_code === retention.accounting_account_reverse_id?.toString());
      const data = {
        name: retention.name,
        percentage: retention.percentage,
        accounting_account: mainAccount?.id || null,
        accounting_account_reverse_id: reverseAccount?.id || null,
        description: retention.description || ''
      };
      console.log('Setting initial data:', {
        retentionData: retention,
        mainAccountFound: mainAccount,
        reverseAccountFound: reverseAccount,
        formData: data
      });
      setInitialData(data);
    }
  }, [retention, accounts]);
  useEffect(() => {
    if (showFormModal && initialData) {
      console.log('Initial data when modal opens:', initialData);
    }
  }, [showFormModal, initialData]);
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: () => retentionToDelete && handleDeleteRetention(retentionToDelete),
    loading: deleteLoading
  }));
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
  }, "Configuraci\xF3n de Retenciones"), /*#__PURE__*/React.createElement("div", {
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
  }), createLoading || updateLoading ? 'Procesando...' : 'Nueva Retención'))), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(RetentionConfigTable, {
    retentions: retentions,
    onEditItem: handleTableEdit,
    onDeleteItem: confirmDelete,
    loading: loading
  }), /*#__PURE__*/React.createElement(RetentionModalConfig, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setRetention(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    accounts: accounts,
    loading: createLoading || updateLoading || deleteLoading
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar Eliminaci\xF3n",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#f8bb86"
    }
  }), retentionToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar esta retenci\xF3n? Esta acci\xF3n no se puede deshacer."))));
};