import React, { useState, useEffect } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Editor } from "primereact/editor";
import { clinicalRecordTypeService, clinicalRecordService } from "../../services/api/index.js";
const CAMPOS = [
// Paso 1 - Heredofamiliares
{
  id: "diabetes",
  label: "¿Tiene antecedentes de diabetes en su familia?",
  placeholder: "Ejemplo: Padre y abuela materna",
  step: 1
}, {
  id: "hipertension",
  label: "¿Quién en su familia ha tenido hipertensión?",
  placeholder: "Ejemplo: Madre y abuelo paterno",
  step: 1
}, {
  id: "cancer",
  label: "¿Algún familiar ha tenido cáncer?",
  placeholder: "Ejemplo: Tía materna (de mama)",
  step: 1
}, {
  id: "cardiovasculares",
  label: "¿Existen antecedentes de enfermedades cardiovasculares?",
  placeholder: "Ejemplo: Ninguna reportada",
  step: 1
},
// Paso 2 - Personales Patológicos
{
  id: "enfermedades_previas",
  label: "¿Ha tenido enfermedades previas?",
  placeholder: "Ejemplo: Hepatitis A (infancia)",
  step: 2
}, {
  id: "cirugias",
  label: "¿Se ha sometido a alguna cirugía?",
  placeholder: "Ejemplo: Apendicectomía (2015)",
  step: 2
}, {
  id: "hospitalizaciones",
  label: "¿Ha sido hospitalizado anteriormente?",
  placeholder: "Ejemplo: Ninguna adicional",
  step: 2
}, {
  id: "alergias",
  label: "¿Tiene alguna alergia?",
  placeholder: "Ejemplo: Penicilina",
  step: 2
}, {
  id: "medicamentos",
  label: "¿Está en algún tratamiento con medicamentos?",
  placeholder: "Ejemplo: Metformina (tratamiento actual)",
  step: 2
},
// Paso 3 - Personales No Patológicos
{
  id: "habitos",
  label: "¿Cuáles son sus hábitos?",
  placeholder: "Ejemplo: No fuma, consume alcohol ocasionalmente",
  step: 3
}, {
  id: "actividad_fisica",
  label: "¿Con qué frecuencia realiza actividad física?",
  placeholder: "Ejemplo: Realiza ejercicio 3 veces por semana",
  step: 3
}, {
  id: "vacunacion",
  label: "¿Está al día con su esquema de vacunación?",
  placeholder: "Ejemplo: Esquema completo hasta la última revisión",
  step: 3
}, {
  id: "dieta",
  label: "¿Sigue alguna dieta?",
  placeholder: "Ejemplo: Controlada en carbohidratos",
  step: 3
},
// Paso 4 - Gineco-Obstétrica
{
  id: "menarquia",
  label: "¿A qué edad tuvo su primera menstruación?",
  placeholder: "Ejemplo: 12 años",
  step: 4
}, {
  id: "ciclos_menstruales",
  label: "¿Cómo son sus ciclos menstruales?",
  placeholder: "Ejemplo: Regulares",
  step: 4
}, {
  id: "gestaciones",
  label: "¿Cuántas gestaciones ha tenido?",
  placeholder: "Ejemplo: 2 (1 parto vaginal, 1 cesárea)",
  step: 4
}, {
  id: "metodos_anticonceptivos",
  label: "¿Usa algún método anticonceptivo?",
  placeholder: "Ejemplo: DIU",
  step: 4
}];
export const PastMedicalHistoryForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedFields, setCheckedFields] = useState({});
  const [textValues, setTextValues] = useState({});
  const [selectedRecordType, setSelectedRecordType] = useState();
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState();
  const [patientId, setPatientId] = useState();
  const stepsContainerRef = React.useRef(null);
  const totalSteps = false ? 4 : 3;
  const steps = [{
    number: 1,
    label: "Heredofamiliares"
  }, {
    number: 2,
    label: "Personales Patológicos"
  }, {
    number: 3,
    label: "Personales No Patológicos"
  }, {
    number: 4,
    label: "Historia Gineco-Obstétrica",
    hidden: true
  }];
  useEffect(() => {
    scrollToCurrentStep();
    fetchClinicalRecordTypes();
    fetchClinicalRecord();
  }, []);
  useEffect(() => {
    if (selectedClinicalRecord?.data) {
      const initialChecked = {};
      const initialTexts = {};
      CAMPOS.forEach(campo => {
        const apiValue = selectedClinicalRecord.data[campo.id];
        const hasValue = apiValue !== null && apiValue !== "";
        initialChecked[campo.id] = hasValue;
        initialTexts[campo.id] = hasValue ? apiValue : "";
      });
      setCheckedFields(initialChecked);
      setTextValues(initialTexts);
    }
  }, [selectedClinicalRecord]);
  const handleCheckboxChange = fieldId => {
    setCheckedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));

    // Limpiar contenido si se desmarca
    if (checkedFields[fieldId]) {
      setTextValues(prev => ({
        ...prev,
        [fieldId]: ""
      }));
    }
  };
  const handleTextChange = (fieldId, content) => {
    setTextValues(prev => ({
      ...prev,
      [fieldId]: content
    }));
  };
  const scrollToCurrentStep = () => {
    if (stepsContainerRef.current) {
      const stepElement = stepsContainerRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (stepElement) {
        stepElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  };
  const groupByStep = fields => fields.reduce((acc, campo) => {
    if (!acc[campo.step]) acc[campo.step] = [];
    acc[campo.step].push(campo);
    return acc;
  }, {});
  const handleSubmit = e => {
    e.preventDefault();
    const formData = getFormData();
    const requestData = {
      clinical_record_type_id: selectedRecordType.id,
      created_by_user_id: 1,
      branch_id: 1,
      data: formData["data"]
    };
    if (selectedClinicalRecord) {
      clinicalRecordService.updateForParent(selectedClinicalRecord.id, requestData).then(response => {
        window.location.href = "/verPaciente?id=" + patientId;
      }).catch(error => {
        console.error("Error:", error);
      });
    } else {
      clinicalRecordService.createForParent(patientId, requestData).then(response => {
        window.location.href = "/verPaciente?id=" + patientId;
      }).catch(error => {
        console.error("Error:", error);
      });
    }
  };
  const getFormData = () => {
    const formData = {};
    CAMPOS.forEach(campo => {
      formData[campo.id] = checkedFields[campo.id] ? textValues[campo.id] || "" : "";
    });
    return {
      data: formData
    };
  };
  const handleNavigation = direction => {
    setCurrentStep(prev => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalSteps) return prev + 1;
      return prev;
    });
  };
  const renderNavigationButtons = () => /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 justify-content-end mt-3"
  }, currentStep > 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => handleNavigation("prev")
  }, "Anterior"), currentStep < totalSteps && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => handleNavigation("next")
  }, "Siguiente"), currentStep === totalSteps && /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Finalizar"));
  const fetchClinicalRecordTypes = async () => {
    let data = await clinicalRecordTypeService.getAll();
    if (data.length) {
      data = data.filter(item => item.key_ === "PAST_MEDICAL_HISTORY");
    }
    setSelectedRecordType(data[0]);
  };
  const fetchClinicalRecord = async () => {
    const id = new URLSearchParams(window.location.search).get("patient_id");
    setPatientId(id);
    try {
      const data = await clinicalRecordService.ofParentByType("PAST_MEDICAL_HISTORY", id);
      if (data.length > 0) {
        setSelectedClinicalRecord(data[0]);
      }
    } catch (error) {
      console.error("Error fetching clinical record:", error);
    }
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "steps-container mb-4",
    ref: stepsContainerRef
  }, /*#__PURE__*/React.createElement("ul", {
    className: "steps"
  }, steps.map(step => /*#__PURE__*/React.createElement("li", {
    key: step.number,
    className: `step cursor-pointer ${currentStep === step.number ? "active" : ""} ${step.hidden ? "d-none" : ""}`,
    "data-step": step.number,
    onClick: () => setCurrentStep(step.number)
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-number"
  }, step.number), /*#__PURE__*/React.createElement("span", {
    className: "step-label"
  }, step.label))))), /*#__PURE__*/React.createElement("form", {
    id: "antecedentesForm",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "wizard-content"
  }, Object.entries(groupByStep(CAMPOS)).map(([stepNumber, campos]) => /*#__PURE__*/React.createElement("div", {
    key: stepNumber,
    className: `p-3 wizard-step ${currentStep === Number(stepNumber) ? "active" : ""}`,
    "data-step": stepNumber
  }, campos.map(campo => /*#__PURE__*/React.createElement("div", {
    key: campo.id,
    className: "form-check form-switch mt-2"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    type: "checkbox",
    id: `chk_${campo.id}`,
    checked: !!checkedFields[campo.id],
    onChange: () => handleCheckboxChange(campo.id)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `chk_${campo.id}`
  }, campo.label), checkedFields[campo.id] && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Editor, {
    value: textValues[campo.id] || "",
    onTextChange: e => handleTextChange(campo.id, e.htmlValue),
    style: {
      height: "220px"
    },
    className: "form-control rich-text",
    placeholder: campo.placeholder
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end py-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-decoration-none open-template-modal",
    "data-bs-toggle": "modal",
    "data-textarea-id": campo.id
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-prescription"
  })))))), renderNavigationButtons())))));
};