import React, { useState } from 'react';
const categoriasExamenes = {
  "Exámenes de laboratorio": ["Examen de sangre", "Análisis de orina", "Prueba de colesterol", "Prueba de glucosa", "Prueba de función hepática"],
  "Imágenes médicas": ["Radiografía de tórax", "Ecografía abdominal", "Tomografía computarizada (TC)", "Resonancia magnética (RM)", "Mamografía"],
  "Cardiológicos": ["Electrocardiograma", "Prueba de estrés", "Ecocardiograma", "Holter de 24 horas"],
  "Exámenes de cáncer": ["Mamografía", "Papanicolaou", "Colonoscopia", "Biopsia de piel", "Examen de próstata (PSA)"],
  "Exámenes respiratorios": ["Prueba de función pulmonar", "Espirometría", "Prueba de esfuerzo respiratorio"],
  "Exámenes de audición y visión": ["Examen de vista", "Examen de audición", "Audiometría"]
};
const paquetesExamenes = {
  "Paquete básico de salud": ["Examen de sangre", "Análisis de orina", "Examen de vista", "Examen de audición"],
  "Paquete cardiovascular": ["Electrocardiograma", "Prueba de esfuerzo", "Ecocardiograma", "Examen de sangre"],
  "Paquete de chequeo general": ["Radiografía de tórax", "Examen de sangre", "Mamografía", "Papanicolaou", "Prueba de colesterol", "Examen de vista"],
  "Paquete de salud respiratoria": ["Prueba de función pulmonar", "Espirometría", "Radiografía de tórax", "Prueba de esfuerzo respiratorio"],
  "Paquete de diagnóstico oncológico": ["Mamografía", "Papanicolaou", "Colonoscopia", "Biopsia de piel", "Examen de próstata (PSA)"],
  "Paquete avanzado de salud": ["Tomografía computarizada (TC)", "Resonancia magnética (RM)", "Análisis de orina", "Prueba de glucosa", "Examen de sangre", "Ecografía abdominal"]
};
export const ExamForm = ({
  onSave,
  onCancel
}) => {
  const [activeCard, setActiveCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [exams, setExams] = useState([]);
  const handleShowCard = cardName => {
    setActiveCard(cardName);
    // Resetear selecciones al cambiar de card
    setSelectedCategory('');
    setSelectedExam('');
    setSelectedPackage('');
    setSelectedCategoria('');
  };
  const handleAddExam = () => {
    if (!selectedExam) {
      alert('Por favor, seleccione un examen');
      return;
    }
    if (!exams.includes(selectedExam)) {
      setExams([...exams, selectedExam]);
    }
    setSelectedExam('');
  };
  const handleAddPackage = () => {
    if (!selectedPackage) {
      alert('Por favor, seleccione un paquete');
      return;
    }
    const nuevosExamenes = paquetesExamenes[selectedPackage].filter(examen => !exams.includes(examen));
    setExams([...exams, ...nuevosExamenes]);
    setSelectedPackage('');
  };
  const handleAddCategory = () => {
    if (!selectedCategoria) {
      alert('Por favor, seleccione una categoría');
      return;
    }
    const nuevosExamenes = categoriasExamenes[selectedCategoria].filter(examen => !exams.includes(examen));
    setExams([...exams, ...nuevosExamenes]);
    setSelectedCategoria('');
  };
  const handleRemoveExam = index => {
    const newExams = exams.filter((_, i) => i !== index);
    setExams(newExams);
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
  }, "Ex\xE1men"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary me-1 mb-1",
    onClick: () => handleShowCard('paquetes')
  }, "Paquetes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary me-1 mb-1",
    onClick: () => handleShowCard('categorias')
  }, "Categor\xEDas"))), activeCard === 'examenes' && /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Seleccionar ex\xE1men"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Categoria"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: selectedCategory,
    onChange: e => setSelectedCategory(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione una categor\xEDa"), Object.keys(categoriasExamenes).map(categoria => /*#__PURE__*/React.createElement("option", {
    key: categoria,
    value: categoria
  }, categoria)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Ex\xE1menes"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: selectedExam,
    onChange: e => setSelectedExam(e.target.value),
    disabled: !selectedCategory
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione un examen"), selectedCategory && categoriasExamenes[selectedCategory].map(examen => /*#__PURE__*/React.createElement("option", {
    key: examen,
    value: examen
  }, examen)))), /*#__PURE__*/React.createElement("div", {
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
  })))))), activeCard === 'categorias' && /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Seleccionar categor\xEDa"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: selectedCategoria,
    onChange: e => setSelectedCategoria(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione una categor\xEDa"), Object.keys(categoriasExamenes).map(categoria => /*#__PURE__*/React.createElement("option", {
    key: categoria,
    value: categoria
  }, categoria)))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: handleAddCategory
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  })))))), exams.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }, "Acciones"))), /*#__PURE__*/React.createElement("tbody", null, exams.map((examen, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", null, examen), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    onClick: () => handleRemoveExam(index)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => onSave(exams)
  }, "Guardar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    onClick: onCancel
  }, "Cancelar")));
};