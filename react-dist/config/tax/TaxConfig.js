import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import TaxConfigModal from "./modal/TaxConfigModal.js";
import { TaxConfigTable } from "./table/TaxConfigTable.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useTaxConfigById } from "./hooks/useTaxConfigById.js";
import { useTaxConfigCreate } from "./hooks/useTaxConfigCreate.js";
import { useTaxConfigDelete } from "./hooks/useTaxConfigDelete.js";
import { useTaxConfigUpdate } from "./hooks/useTaxConfigUpdate.js";
import { useTaxConfigTable } from "./hooks/useTaxConfigTable.js";
export const TaxConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    taxes,
    loading,
    error,
    refreshTaxes
  } = useTaxConfigTable();
  console.log(taxes, 'taxeeeesss');
  const {
    createTax,
    loading: createLoading
  } = useTaxConfigCreate();
  const {
    updateTax,
    loading: updateLoading
  } = useTaxConfigUpdate();
  const {
    fetchTaxById,
    taxById,
    setTaxById
  } = useTaxConfigById();
  const {
    deleteTax,
    loading: deleteLoading
  } = useTaxConfigDelete();
  const onCreate = () => {
    setInitialData(undefined);
    setTaxById(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      const taxData = {
        name: data.name,
        document_type: data.document_type,
        document_number: data.document_number,
        email: data.email,
        address: data.address,
        phone: data.phone,
        city_id: data.city_id,
        tax_charge_id: data.tax_charge_id || null,
        withholding_tax_id: data.withholding_tax_id || null,
        koneksi_sponsor_slug: data.koneksi_sponsor_slug || null
      };
      if (taxById) {
        await updateTax(taxById.id.toString(), taxData);
        SwalManager.success('Impuesto actualizado correctamente');
      } else {
        await createTax(taxData);
        SwalManager.success('Impuesto creado correctamente');
      }
      await refreshTaxes();
      setShowFormModal(false);
    } catch (error) {}
  };
  const handleTableEdit = async id => {
    try {
      await fetchTaxById(id);
      setShowFormModal(true);
    } catch (error) {
      console.error("Error fetching tax:", error);
    }
  };
  const handleDeleteTax = async id => {
    try {
      const success = await deleteTax(id);
      if (success) {
        await refreshTaxes();
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
    }
  };
  useEffect(() => {
    if (taxById) {
      const data = {
        name: taxById.name,
        document_type: taxById.document_type,
        document_number: taxById.document_number,
        email: taxById.email,
        address: taxById.address,
        phone: taxById.phone,
        city_id: taxById.city_id,
        tax_charge_id: taxById.tax_charge_id || '' || null,
        withholding_tax_id: taxById.withholding_tax_id || '' || null,
        koneksi_sponsor_slug: taxById.koneksi_sponsor_slug || '' || null
      };
      setInitialData(data);
    }
  }, [taxById]);
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
  }, error), /*#__PURE__*/React.createElement(TaxConfigTable, {
    onEditItem: handleTableEdit,
    taxes: taxes,
    onDeleteItem: handleDeleteTax,
    loading: loading
  }), /*#__PURE__*/React.createElement(TaxConfigModal, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setTaxById(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    loading: createLoading || updateLoading || deleteLoading
  }));
};