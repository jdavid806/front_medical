import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { ExamCategoryTable } from "./components/ExamCategoryTable.js";
import { useExamCategories } from "./hooks/useExamCategories.js";
import { useExamCategoryCreate } from "./hooks/useExamCategoryCreate.js";
import { useExamCategoryUpdate } from "./hooks/useExamCategoryUpdate.js";
import { useExamCategoryDelete } from "./hooks/useExamCategoryDelete.js";
import { useExamCategory } from "./hooks/useExamCategory.js";
import { ExamCategoryFormModal } from "./components/ExamCategoryFormModal.js";
export const ExamCategoryApp = () => {
  const [showExamCategoryFormModal, setShowExamCategoryFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    examCategories,
    fetchExamCategories
  } = useExamCategories();
  const {
    createExamCategory
  } = useExamCategoryCreate();
  const {
    updateExamCategory
  } = useExamCategoryUpdate();
  const {
    deleteExamCategory
  } = useExamCategoryDelete();
  const {
    examCategory,
    setExamCategory,
    fetchExamCategory
  } = useExamCategory();
  const onCreate = () => {
    setInitialData(undefined);
    setExamCategory(null);
    setShowExamCategoryFormModal(true);
  };
  const handleSubmit = async data => {
    if (examCategory) {
      await updateExamCategory(examCategory.id, data);
    } else {
      await createExamCategory(data);
    }
    fetchExamCategories();
    setShowExamCategoryFormModal(false);
  };
  const handleTableEdit = id => {
    fetchExamCategory(id);
    setShowExamCategoryFormModal(true);
  };
  const handleTableDelete = async id => {
    const confirmed = await deleteExamCategory(id);
    if (confirmed) fetchExamCategories();
  };
  useEffect(() => {
    setInitialData({
      name: examCategory?.name ?? ''
    });
  }, [examCategory]);
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
  }, "Categor\xEDas de ex\xE1menes"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Nueva"))), /*#__PURE__*/React.createElement(ExamCategoryTable, {
    examCategories: examCategories,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(ExamCategoryFormModal, {
    title: examCategory ? 'Editar categoría de exámen' : 'Crear categoría de exámen',
    show: showExamCategoryFormModal,
    handleSubmit: handleSubmit,
    onHide: () => {
      setShowExamCategoryFormModal(false);
    },
    initialData: initialData
  })));
};