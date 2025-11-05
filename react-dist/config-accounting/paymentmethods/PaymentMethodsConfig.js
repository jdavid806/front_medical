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
export const PaymentMethodsConfig = ({
  onConfigurationComplete
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
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
    console.log("Creando nuevo método de pago");
    setInitialData(undefined);
    setPaymentMethod(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      console.log("Enviando datos del formulario:", data);
      const paymentMethodData = {
        method: data.name,
        payment_type: data.payment_type || '',
        description: data.additionalDetails || '',
        accounting_account_id: data.accounting_account_id || null,
        category: data.category,
        is_cash: data.is_cash
      };
      if (paymentMethod) {
        console.log("Actualizando método existente:", paymentMethod.id);
        await updatePaymentMethod(paymentMethod.id.toString(), paymentMethodData);
        SwalManager.success('Método actualizado correctamente');
      } else {
        console.log("Creando nuevo método");
        await createPaymentMethod(paymentMethodData);
        SwalManager.success('Método creado correctamente');
      }
      await refreshPaymentMethods();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      // El error ya se maneja en el hook
    }
  };
  const handleTableEdit = async id => {
    try {
      console.log("Editando método con ID:", id);
      const paymentMethodData = await fetchPaymentMethodById(id);
      console.log("paymentMethod encontrado:", paymentMethodData);
      if (paymentMethodData) {
        setShowFormModal(true);
      } else {
        console.error("No se encontró el método de pago con ID:", id);
        SwalManager.error('No se pudo cargar el método de pago para editar');
      }
    } catch (error) {
      console.error("Error al cargar método para editar:", error);
      SwalManager.error('Error al cargar el método de pago');
    }
  };
  const handleDeleteMethod = async id => {
    try {
      const success = await deletePaymentMethod(id);
      if (success) {
        await refreshPaymentMethods();
        SwalManager.success('Método eliminado correctamente');
      } else {
        SwalManager.error('No se pudo eliminar el método de pago');
      }
    } catch (error) {
      console.error("Error en eliminación:", error);
      SwalManager.error('Error al eliminar el método de pago');
    }
  };
  useEffect(() => {
    if (paymentMethod) {
      console.log("Setting initialData from paymentMethod:", paymentMethod);
      const data = {
        name: paymentMethod.method,
        payment_type: paymentMethod.payment_type,
        category: paymentMethod.category || 'other',
        is_cash: paymentMethod.is_cash,
        accounting_account_id: paymentMethod.accounting_account_id || null,
        additionalDetails: paymentMethod.description
      };
      setInitialData(data);
    }
  }, [paymentMethod]);
  useEffect(() => {
    const hasPaymentMethod = paymentMethods && paymentMethods.length > 0;
    onConfigurationComplete?.(hasPaymentMethod);
  }, [paymentMethods, onConfigurationComplete]);
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
  }, error), /*#__PURE__*/React.createElement(PaymentMethodsConfigTable, {
    onEditItem: handleTableEdit,
    paymentMethods: enrichedPaymentMethods,
    onDeleteItem: handleDeleteMethod,
    loading: loading,
    onReload: refreshPaymentMethods,
    onCreate: onCreate,
    createLoading: createLoading,
    updateLoading: updateLoading,
    deleteLoading: deleteLoading
  }), /*#__PURE__*/React.createElement(PaymentMethodModalConfig, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => {
      console.log("Cerrando modal");
      setShowFormModal(false);
      setPaymentMethod(null);
      setInitialData(undefined);
    },
    initialData: initialData,
    accounts: accounts,
    loading: createLoading || updateLoading || deleteLoading
  }));
};