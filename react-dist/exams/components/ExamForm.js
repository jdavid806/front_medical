import React, { useState } from 'react';
import { useExamTypes } from "../../exams-config/hooks/useExamTypes.js";
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
const paquetesExamenes = {
  "Paquete básico de salud": ["Examen de sangre", "Análisis de orina", "Examen de vista", "Examen de audición"],
  "Paquete cardiovascular": ["Electrocardiograma", "Prueba de esfuerzo", "Ecocardiograma", "Examen de sangre"],
  "Paquete de chequeo general": ["Radiografía de tórax", "Examen de sangre", "Mamografía", "Papanicolaou", "Prueba de colesterol", "Examen de vista"],
  "Paquete de salud respiratoria": ["Prueba de función pulmonar", "Espirometría", "Radiografía de tórax", "Prueba de esfuerzo respiratorio"],
  "Paquete de diagnóstico oncológico": ["Mamografía", "Papanicolaou", "Colonoscopia", "Biopsia de piel", "Examen de próstata (PSA)"],
  "Paquete avanzado de salud": ["Tomografía computarizada (TC)", "Resonancia magnética (RM)", "Análisis de orina", "Prueba de glucosa", "Examen de sangre", "Ecografía abdominal"]
};
export const ExamForm = /*#__PURE__*/forwardRef(({}, ref) => {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedExamTypes, setSelectedExamTypes] = useState([]);
  const {
    examTypes
  } = useExamTypes();
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return selectedExamTypes;
    }
  }));
  const handleShowCard = cardName => {
    setActiveCard(cardName);
    setSelectedExamType('');
    setSelectedPackage('');
  };
  const handleAddExam = () => {
    if (!selectedExamType) {
      alert('Por favor, seleccione un examen');
      return;
    }
    const selectedExamObject = examTypes.find(exam => exam.id == selectedExamType);
    console.log(examTypes, selectedExamType, selectedExamObject);
    if (selectedExamObject) {
      console.log(selectedExamObject, [...selectedExamTypes, selectedExamObject]);
      setSelectedExamTypes([...selectedExamTypes, selectedExamObject]);
    }
    setSelectedExamType('');
  };
  const handleAddPackage = () => {
    if (!selectedPackage) {
      alert('Por favor, seleccione un paquete');
      return;
    }
    const nuevosExamenes = paquetesExamenes[selectedPackage].filter(examen => !selectedExamTypes.includes(examen));
    setSelectedExamTypes([...selectedExamTypes, ...nuevosExamenes]);
    setSelectedPackage('');
  };
  const handleRemoveExam = index => {
    const newExams = selectedExamTypes.filter((_, i) => i !== index);
    setSelectedExamTypes(newExams);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Seleccionar por:"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary me-1 mb-1",
    onClick: () => handleShowCard('examenes')
  }, "Ex\xE1men"))), activeCard === 'examenes' && /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Seleccionar ex\xE1men"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Ex\xE1menes"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: selectedExamType,
    onChange: e => setSelectedExamType(e.target.value)
    // disabled={selectedExamTypes.length >= 1}
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione un examen"), examTypes.map(examType => /*#__PURE__*/React.createElement("option", {
    key: examType.id,
    value: examType.id
  }, examType.name)))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleAddExam
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  })))))), activeCard === 'paquetes' && /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Seleccionar paquete"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Paquetes"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: selectedPackage,
    onChange: e => setSelectedPackage(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione un paquete"), Object.keys(paquetesExamenes).map(paquete => /*#__PURE__*/React.createElement("option", {
    key: paquete,
    value: paquete
  }, paquete)))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleAddPackage
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  })))))), selectedExamTypes.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }))))))))));
});