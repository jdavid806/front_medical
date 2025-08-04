import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import PaymentMethodModalConfig from "./modal/PaymentMethodModalConfig.js";
import { PaymentMethodsConfigTable } from "./table/PaymentMethodsConfigTable.js";
import { usePaymentMethodsConfigTable } from "./hooks/usePaymentMethodsConfigTable.js";
import { usePaymentMethodCreate } from "./hooks/usePaymentMethodCreateTable.js";
import { usePaymentMethodUpdate } from "./hooks/usePaymentMethodUpadteTable.js";
import { usePaymentMethodById } from "./hooks/usePaymentMethodConfigByIdTable.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { usePaymentMethodDelete } from "./hooks/usePaymentMethodDeleteTable.js";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts.js";
export const PaymentMethodsConfig = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);

  // Hooks para las operaciones CRUD
  const {
    paymentMethods,
    loading,
    error,
    refreshPaymentMethods
  } = usePaymentMethodsConfigTable();
  const {
    createPaymentMethod,
    loading: createLoading
  } = usePaymentMethodCreate();
  const {
    updatePaymentMethod,
    loading: updateLoading
  } = usePaymentMethodUpdate();
  const {
    fetchPaymentMethodById,
    paymentMethod,
    setPaymentMethod
  } = usePaymentMethodById();
  const {
    deletePaymentMethod,
    loading: deleteLoading
  } = usePaymentMethodDelete();
  const {
    accounts
  } = useAccountingAccounts();
  const enrichedPaymentMethods = paymentMethods.map(method => {
    const account = accounts.find(acc => acc.id === method.accounting_account_id);
    return {
      id: method.id,
      name: method.method,
      category: method.category || 'other',
      account: account ? {
        id: account.id,
        name: account.account_name || account.account || 'Cuenta contable'
      } : null,
      additionalDetails: method.description
    };
  });
  const onCreate = () => {
    setInitialData(undefined);
    setPaymentMethod(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      const paymentMethodData = {
        method: data.name,
        description: data.additionalDetails || '',
        accounting_account_id: data.account?.id || 0,
        category: data.category
      };
      if (paymentMethod) {
        await updatePaymentMethod(paymentMethod.id.toString(), paymentMethodData);
        SwalManager.success('Método actualizado correctamente');
      } else {
        await createPaymentMethod(paymentMethodData);
        SwalManager.success('Método creado correctamente');
      }
      await refreshPaymentMethods();
      setShowFormModal(false);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };
  const handleTableEdit = async id => {
    try {
      const paymentMethod = await fetchPaymentMethodById(id);
      console.log("paymentMethod", paymentMethod);
      setShowFormModal(true);
    } catch (error) {}
  };
  const handleDeleteMethod = async id => {
    try {
      const success = await deletePaymentMethod(id);
      if (success) {
        await refreshPaymentMethods();
      }
    } catch (error) {
      console.error("Error en eliminación:", error);
    }
  };
  useEffect(() => {
    if (paymentMethod) {
      const data = {
        name: paymentMethod.method,
        category: paymentMethod.category || 'other',
        account: paymentMethod.accounting_account_id ? {
          id: paymentMethod.accounting_account_id,
          name: 'Cuenta contable'
        } : null,
        additionalDetails: paymentMethod.description
      };
      setInitialData(data);
    }
  }, [paymentMethod]);
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
  }, "Configuraci\xF3n de M\xE9todos de Pago"), /*#__PURE__*/React.createElement("div", {
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
  }), createLoading || updateLoading ? 'Procesando...' : 'Nuevo Método'))), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, error), /*#__PURE__*/React.createElement(PaymentMethodsConfigTable, {
    onEditItem: handleTableEdit,
    paymentMethods: enrichedPaymentMethods,
    onDeleteItem: handleDeleteMethod,
    loading: loading
  }), /*#__PURE__*/React.createElement(PaymentMethodModalConfig, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      setShowFormModal(false);
      setPaymentMethod(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    accounts: [],
    loading: createLoading || updateLoading || deleteLoading
  }));
};