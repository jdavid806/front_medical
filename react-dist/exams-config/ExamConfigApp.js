import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { ExamConfigTable } from "./components/ExamConfigTable.js";
import { useExamTypes } from "./hooks/useExamTypes.js";
import { useExamTypeCreate } from "./hooks/useExamTypeCreate.js";
import { useExamTypeUpdate } from "./hooks/useExamTypeUpdate.js";
import { useExamTypeDelete } from "./hooks/useExamTypeDelete.js";
import { useExamType } from "./hooks/useExamType.js";
import { ExamConfigFormModal } from "./components/ExamConfigFormModal.js";
export const ExamConfigApp = () => {
  const [showExamTypeFormModal, setShowExamTypeFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    examTypes,
    fetchExamTypes
  } = useExamTypes();
  const {
    createExamType
  } = useExamTypeCreate();
  const {
    updateExamType
  } = useExamTypeUpdate();
  const {
    deleteExamType
  } = useExamTypeDelete();
  const {
    examType,
    setExamType,
    fetchExamType
  } = useExamType();
  const onCreate = () => {
    setInitialData(undefined);
    setExamType(null);
    setShowExamTypeFormModal(true);
  };
  const handleSubmit = async data => {
    console.log(data);
    const mappedData = {
      ...data,
      form_config: data.form_config || {}
    };
    if (examType) {
      await updateExamType(examType.id, mappedData);
    } else {
      await createExamType(mappedData);
    }
    fetchExamTypes();
    setShowExamTypeFormModal(false);
  };
  const handleTableEdit = id => {
    fetchExamType(id);
    setShowExamTypeFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteExamType(id);
    if (confirmed) fetchExamTypes();
  };
  useEffect(() => {
    setInitialData({
      name: examType?.name ?? '',
      description: examType?.description ?? '',
      type: examType?.type ?? '',
      form_config: examType?.form_config ?? null
    });
  }, [examType]);
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
  }, "Ex\xE1menes"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Nuevo"))), /*#__PURE__*/React.createElement(ExamConfigTable, {
    exams: examTypes,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(ExamConfigFormModal, {
    title: examType ? 'Editar exámen' : 'Crear exámen',
    show: showExamTypeFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowExamTypeFormModal(false);
    },
    initialData: initialData
  })));
};