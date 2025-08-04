import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { UserAbsenceTable } from "./components/UserAbsenceTable.js";
import { useUserAbsences } from "./hooks/useUserAbsences.js";
import { useUserAbsence } from "./hooks/useUserAbsence.js";
import { useUserAbsenceCreate } from "./hooks/useUserAbsenceCreate.js";
import { useUserAbsenceUpdate } from "./hooks/useUserAbsenceUpdate.js";
import { useUserAbsenceDelete } from "./hooks/useUserAbsenceDelete.js";
import { UserAbsenceFormModal } from "./components/UserAbsenceFormModal.js";
import { stringToDate } from "../../services/utilidades.js";
export const UserAbsenceApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    userAbsences,
    fetchUserAbsences
  } = useUserAbsences();
  const {
    createUserAbsence
  } = useUserAbsenceCreate();
  const {
    updateUserAbsence
  } = useUserAbsenceUpdate();
  const {
    deleteUserAbsence
  } = useUserAbsenceDelete();
  const {
    userAbsence,
    setUserAbsence,
    fetchUserAbsence
  } = useUserAbsence();
  const onCreate = () => {
    setInitialData(undefined);
    setUserAbsence(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    const finalData = {
      ...data,
      start_date: data.dateRange?.[0]?.toISOString().split('T')[0] ?? '',
      end_date: data.dateRange?.[1]?.toISOString().split('T')[0] ?? ''
    };
    if (userAbsence) {
      await updateUserAbsence(userAbsence.id, finalData);
    } else {
      await createUserAbsence(finalData, finalData.user_id);
    }
    fetchUserAbsences();
    setShowFormModal(false);
  };
  const handleTableEdit = id => {
    fetchUserAbsence(id);
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteUserAbsence(id);
    if (confirmed) fetchUserAbsences();
  };
  useEffect(() => {
    setInitialData({
      user_id: userAbsence?.user_id.toString() || '',
      reason: userAbsence?.reason || '',
      dateRange: [stringToDate(userAbsence?.start_date), stringToDate(userAbsence?.end_date)]
    });
  }, [userAbsence]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Ausencias Programadas"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Nuevo"))), /*#__PURE__*/React.createElement(UserAbsenceTable, {
    items: userAbsences,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(UserAbsenceFormModal, {
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowFormModal(false);
    },
    initialData: initialData
  })));
};