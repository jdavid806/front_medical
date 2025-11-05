import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
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
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
export const RetentionConfig = ({
  onConfigurationComplete
}) => {
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
        SwalManager.success("Retención actualizada correctamente");
      } else {
        const createData = RetentionMapperCreate(data);
        await createRetention(createData);
        SwalManager.success("Retención creada correctamente");
      }
      await refreshRetentions();
      setShowFormModal(false);
    } catch (error) {
      SwalManager.error(error.message || "Error al guardar la retención");
    }
  };
  const handleTableEdit = async id => {
    try {
      const retentionData = await fetchRetentionById(id);
      if (retentionData) {
        setShowFormModal(true);
      } else {
        SwalManager.error("No se pudo cargar la retención para editar");
      }
    } catch (error) {
      SwalManager.error("Error al cargar la retención");
    }
  };
  const handleDeleteRetention = async id => {
    try {
      const success = await deleteRetention(id);
      if (success) {
        await refreshRetentions();
        SwalManager.success("Retention eliminado correctamente");
      } else {
        SwalManager.error("No se pudo eliminar Retention");
      }
    } catch (error) {
      console.error("Error en eliminación:", error);
      SwalManager.error("Error al eliminar el Retention");
    }
  };
  useEffect(() => {
    const hasRetentions = retentions && retentions.length > 0;
    onConfigurationComplete?.(hasRetentions);
  }, [retentions, onConfigurationComplete]);
  useEffect(() => {
    if (retention && accounts) {
      const data = {
        name: retention.name,
        percentage: retention.percentage,
        accounting_account_id: retention.accounting_account_id,
        accounting_account_reverse_id: retention.accounting_account_reverse_id,
        sell_accounting_account_id: retention.sell_accounting_account_id,
        sell_reverse_accounting_account_id: retention.sell_reverse_accounting_account_id,
        description: retention.description || ""
      };
      setInitialData(data);
    }
  }, [retention, accounts]);
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
  const enrichedRetentions = retentions.map(retentionItem => {
    const account = accounts.find(acc => acc.id === retentionItem.accounting_account_id);
    const returnAccount = accounts.find(acc => acc.id === retentionItem.accounting_account_reverse_id);
    const accountData = retentionItem.account || (account ? {
      id: account.id.toString(),
      name: account.account_name || account.account || `Cuenta ${account.account_code}`
    } : null);
    const returnAccountData = retentionItem.returnAccount || (returnAccount ? {
      id: returnAccount.id.toString(),
      name: returnAccount.account_name || returnAccount.account || `Cuenta ${returnAccount.account_code}`
    } : null);
    return {
      id: retentionItem.id,
      name: retentionItem.name,
      percentage: retentionItem.percentage,
      account: accountData,
      returnAccount: returnAccountData,
      description: retentionItem.description
    };
  });
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
  }, error), /*#__PURE__*/React.createElement(RetentionConfigTable, {
    retentions: enrichedRetentions,
    onEditItem: handleTableEdit,
    onDeleteItem: handleDeleteRetention,
    loading: loading || isLoadingAccounts,
    onReload: refreshRetentions,
    onCreate: onCreate,
    createLoading: createLoading,
    updateLoading: updateLoading,
    deleteLoading: deleteLoading
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