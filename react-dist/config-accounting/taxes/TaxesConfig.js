import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import TaxConfigModal from "./modal/TaxesConfigModal.js";
import { TaxesConfigTable } from "./table/TaxesConfigTable.js";
import { useTaxesConfigTable } from "./hooks/useTaxesConfigTable.js";
import { useTaxesCreateTable } from "./hooks/useTaxesCreateTable.js";
import { useTaxesByIdConfigTable } from "./hooks/useTaxesByIdConfigTable.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useTaxesDeleteTable } from "./hooks/useTaxesDeleteTable.js";
import { useTaxesUpdateTable } from "./hooks/useTaxesUpdteTable.js";
import { TaxesMapperCreate, TaxesMapperUpdate } from "./mapper/mappedTaxes.js";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts.js";
export const TaxesConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    taxes,
    loading,
    error,
    refreshTaxes
  } = useTaxesConfigTable();
  const {
    createTax,
    loading: createLoading
  } = useTaxesCreateTable();
  const {
    updateTax,
    loading: updateLoading
  } = useTaxesUpdateTable();
  const {
    fetchTaxById,
    tax,
    setTax
  } = useTaxesByIdConfigTable();
  const {
    deleteTax,
    loading: deleteLoading
  } = useTaxesDeleteTable();
  const onCreate = () => {
    setInitialData(undefined);
    setTax(null);
    setShowFormModal(true);
  };
  const {
    accounts,
    isLoading: isLoadingAccounts
  } = useAccountingAccounts();
  const handleSubmit = async data => {
    try {
      if (tax) {
        const updateData = TaxesMapperUpdate(data);
        await updateTax(tax.id, updateData);
        SwalManager.success('Impuesto actualizado correctamente');
      } else {
        const createData = TaxesMapperCreate(data);
        await createTax(createData);
        SwalManager.success('Impuesto creado correctamente');
      }
      await refreshTaxes();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error al guardar impuesto:", error);
      SwalManager.error(error.message || 'Error al guardar el impuesto');
    }
  };
  const handleTableEdit = async id => {
    try {
      await fetchTaxById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error al cargar impuesto:", error);
    }
  };
  const handleDeleteTax = async id => {
    try {
      await deleteTax(id);
      await refreshTaxes();
    } catch (error) {
      console.error("Error al eliminar impuesto:", error);
    }
  };
  useEffect(() => {
    if (tax && accounts) {
      const data = {
        name: tax.name,
        percentage: tax.percentage,
        accounting_account_id: tax.accounting_account_id,
        accounting_account_reverse_id: tax.accounting_account_reverse_id,
        sell_accounting_account_id: tax.sell_accounting_account_id,
        sell_reverse_accounting_account_id: tax.sell_reverse_accounting_account_id,
        description: tax.description || ''
      };
      setInitialData(data);
    }
  }, [tax, accounts]);
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
  }, "Configuraci\xF3n de Impuestos"), /*#__PURE__*/React.createElement("div", {
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
  }), createLoading || updateLoading ? 'Procesando...' : 'Nuevo Impuesto'))), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(TaxesConfigTable, {
    taxes: taxes,
    onEditItem: handleTableEdit,
    onDeleteItem: handleDeleteTax,
    loading: loading
  }), /*#__PURE__*/React.createElement(TaxConfigModal, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setTax(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    accounts: accounts,
    loading: createLoading || updateLoading || deleteLoading
  }));
};