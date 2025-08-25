import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { AccountingClosingsTable } from "./table/AccountingClosingsTable.js";
import AccountingClosingModal from "./modal/AccountingClosingModal.js";
import { useAccountingClosings } from "./hooks/useAccountingClosings.js";
import { useAccountingClosingsCreate } from "./hooks/useAccountingClosingsCreate.js";
import { useAccountingClosing } from "./hooks/useAccountingClosing.js";
import { useAccountingClosingsUpdate } from "./hooks/useAccountingClosingsUpdate.js";
import { useAccountingClosingDelete } from "./hooks/useAccountingClosingDelete.js";
import { stringToDate } from "../../../services/utilidades.js";
export const accountingClosings = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    accountingClosings,
    fetchAccountingClosings
  } = useAccountingClosings();
  const {
    createAccountingClosing
  } = useAccountingClosingsCreate();
  const {
    accountingClosing,
    fetchAccountingClosing,
    setAccountingClosing
  } = useAccountingClosing();
  const {
    updateAccountingClosing
  } = useAccountingClosingsUpdate();
  const {
    deleteAccountingClosing
  } = useAccountingClosingDelete();
  const handleCreate = () => {
    setInitialData(undefined);
    setAccountingClosing(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (accountingClosing) {
        await updateAccountingClosing(accountingClosing.data.id.toString(), data);
      } else {
        await createAccountingClosing(data);
      }
      fetchAccountingClosings();
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleTableEdit = id => {
    fetchAccountingClosing(id);
    setShowFormModal(true);
  };
  useEffect(() => {
    if (accountingClosing) {
      setInitialData({
        age: accountingClosing.data.age,
        status: accountingClosing.data.status,
        start_month: stringToDate(accountingClosing.data.start_month.split("T")[0]),
        end_month: stringToDate(accountingClosing.data.end_month.split("T")[0]),
        warning_days: accountingClosing.data.warning_days
      });
    }
  }, [accountingClosing]);
  const handleTableDelete = async id => {
    const confirmed = await deleteAccountingClosing(id);
    if (confirmed) fetchAccountingClosings();
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Cierres Contables"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "-2px 20px -20px"
    },
    className: "text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: handleCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo Per\xEDodo"))), /*#__PURE__*/React.createElement(AccountingClosingsTable, {
    closings: accountingClosings,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(AccountingClosingModal, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => setShowFormModal(false),
    initialData: initialData
  }));
};