import React, { useState, useEffect } from 'react';
import { useExamTypes } from "../../exams-config/hooks/useExamTypes.js";
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useExamTypeCreate } from "../../exams-config/hooks/useExamTypeCreate.js";
import { ClinicalHistoryExamConfigForm } from "../../exams-config/components/ClinicalHistoryExamConfigForm.js";
export const ExamForm = /*#__PURE__*/forwardRef(({
  initialSelectedExamTypes
}, ref) => {
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedExamTypes, setSelectedExamTypes] = useState([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const {
    createExamType
  } = useExamTypeCreate();
  const {
    examTypes,
    fetchExamTypes,
    loading
  } = useExamTypes();
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return selectedExamTypes;
    },
    resetForm: () => {
      setSelectedExamTypes([]);
      setSelectedExamType('');
      setShowExamForm(false);
    }
  }));
  useEffect(() => {
    if (initialSelectedExamTypes && examTypes.length > 0) {
      setSelectedExamTypes(initialSelectedExamTypes.map(id => examTypes.find(exam => exam.id == id)).filter(exam => exam !== undefined));
    }
  }, [initialSelectedExamTypes, examTypes]);
  const handleAddExam = () => {
    if (!selectedExamType) {
      alert('Por favor, seleccione un examen');
      return;
    }
    const selectedExamObject = examTypes.find(exam => exam.id == selectedExamType);
    if (selectedExamObject) {
      addExam(selectedExamObject);
    }
    setSelectedExamType('');
  };
  const addExam = newExam => {
    setSelectedExamTypes([...selectedExamTypes, newExam]);
  };
  const handleRemoveExam = index => {
    const newExams = selectedExamTypes.filter((_, i) => i !== index);
    setSelectedExamTypes(newExams);
  };
  const toggleExamForm = () => {
    setShowExamForm(!showExamForm);
  };
  const handleSubmit = async data => {
    try {
      const newExam = await createExamType(data);
      if (newExam) {
        addExam(newExam);
      }
      fetchExamTypes();
      setShowExamForm(false);
    } catch (error) {
      console.error("Error al crear el examen:", error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, showExamForm && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Crear ex\xE1men"), /*#__PURE__*/React.createElement(ClinicalHistoryExamConfigForm, {
    onHandleSubmit: handleSubmit,
    formId: "createExamType"
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: toggleExamForm
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }), " Cancelar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary ms-2",
    form: "createExamType"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check"
  }), " Guardar"))), !showExamForm && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Seleccionar ex\xE1men"), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("label", {
    id: "exam_type_id",
    className: "form-label"
  }, "Ex\xE1menes"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "exam_type_id",
    options: examTypes,
    loading: loading,
    optionLabel: "name",
    optionValue: "id",
    filter: true,
    placeholder: "Seleccione un examen",
    className: 'w-100',
    value: selectedExamType,
    onChange: e => setSelectedExamType(e.target.value),
    appendTo: 'self'
  })), /*#__PURE__*/React.createElement("button", {
    className: `btn btn-primary align-self-end`,
    onClick: toggleExamForm
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Crear examen"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "button",
    onClick: handleAddExam
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " A\xF1adir examen")))))), selectedExamTypes.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "card mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Ex\xE1menes a realizar"), /*#__PURE__*/React.createElement("table", {
    className: "table mt-3"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col",
    style: {
      width: '50px'
    }
  }, "#"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Ex\xE1men"), /*#__PURE__*/React.createElement("th", {
    scope: "col",
    style: {
      width: '100px'
    },
    className: "text-end"
  }, "Acciones"))), /*#__PURE__*/React.createElement("tbody", null, selectedExamTypes.map((examType, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", null, examType.name), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    onClick: () => handleRemoveExam(index)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  })))))))))));
});