import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
const medicationGroups = [{
  id: 'grupo1',
  name: 'Grupo Analgésicos',
  medications: [{
    name: 'Paracetamol',
    concentration: '500 mg',
    defaultDuration: 5,
    price: 15.50
  }, {
    name: 'Ibuprofeno',
    concentration: '400 mg',
    defaultDuration: 7,
    price: 20.00
  }]
}, {
  id: 'grupo2',
  name: 'Grupo Analgésicos',
  medications: [{
    name: 'Acetaminofén',
    concentration: '500 mg',
    defaultDuration: 5,
    price: 15.50
  }, {
    name: 'Aspirina',
    concentration: '400 mg',
    defaultDuration: 7,
    price: 20.00
  }]
}];
const initialMedicine = {
  medication: '',
  concentration: '',
  duration: 0,
  frequency: '',
  medication_type: '',
  observations: '',
  quantity: 0,
  take_every_hours: 0,
  showQuantity: false,
  showTimeField: false
};
const PrescriptionForm = /*#__PURE__*/forwardRef(({
  formId,
  initialData
}, ref) => {
  const [useGroup, setUseGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [formData, setFormData] = useState([initialMedicine]);
  const [addedMedications, setAddedMedications] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return addedMedications;
    }
  }));
  const handleGroupToggle = () => {
    setUseGroup(!useGroup);
    setSelectedGroupId('');
    setFormData([initialMedicine]);
    setManualEntry(false);
  };
  const handleGroupChange = e => {
    const groupId = e.target.value;
    setSelectedGroupId(groupId);
    const selectedGroup = medicationGroups.find(g => g.id === groupId);
    if (selectedGroup) {
      const initialMedications = selectedGroup.medications.map(med => ({
        ...initialMedicine,
        medication: med.name,
        concentration: med.concentration,
        duration: med.defaultDuration
      }));
      setFormData(initialMedications);
    }
  };
  const handleMedicationChange = (index, e) => {
    const newFormData = formData.map((item, i) => {
      if (i === index) {
        const updatedItem = {
          ...item,
          [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
        };
        updatedItem.showQuantity = !['tabletas', ''].includes(updatedItem.medication_type);
        updatedItem.showTimeField = ['tabletas', 'jarabe'].includes(updatedItem.medication_type);
        return updatedItem;
      }
      return item;
    });
    setFormData(newFormData);
  };
  const handleAddMedication = () => {
    if (editIndex !== null) {
      const updatedMedications = addedMedications.map((med, index) => index === editIndex ? formData[0] : med);
      setAddedMedications(updatedMedications);
      setEditIndex(null);
    } else {
      setAddedMedications(prev => [...prev, ...formData]);
    }
    setFormData([initialMedicine]);
    setManualEntry(false);
  };
  const handleEditMedication = index => {
    setFormData([addedMedications[index]]);
    setEditIndex(index);
    setManualEntry(true);
  };
  const handleDeleteMedication = index => {
    setAddedMedications(prev => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    console.log('Initial data:', initialData);
    setAddedMedications(initialData?.medicines || []);
  }, [initialData]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Medicamentos"), /*#__PURE__*/React.createElement("div", {
    className: "form-check form-switch"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    type: "checkbox",
    id: "useGroup",
    checked: useGroup,
    onChange: handleGroupToggle
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label",
    htmlFor: "useGroup"
  }, "Agregar grupos de medicamentos"))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, useGroup ? /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Seleccionar grupo"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: selectedGroupId,
    onChange: handleGroupChange
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione un grupo"), medicationGroups.map(group => /*#__PURE__*/React.createElement("option", {
    key: group.id,
    value: group.id
  }, group.name, " (", group.medications.length, " medicamentos)"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "button",
    id: "addMedicineBtn",
    onClick: handleAddMedication
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Agregar Medicamentos del Grupo"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary ms-2",
    type: "button",
    onClick: () => setManualEntry(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Agregar Medicamento Manualmente"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "medication"
  }, "Medicamento"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "medication",
    type: "text",
    name: "medication",
    value: formData[0]?.medication || '',
    onChange: e => handleMedicationChange(0, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "concentration"
  }, "Concentraci\xF3n"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "concentration",
    type: "text",
    name: "concentration",
    value: formData[0]?.concentration || '',
    onChange: e => handleMedicationChange(0, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "frequency"
  }, "Frecuencia"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "frequency",
    name: "frequency",
    value: formData[0]?.frequency || '',
    onChange: e => handleMedicationChange(0, e)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione"), /*#__PURE__*/React.createElement("option", {
    value: "Diaria"
  }, "Diaria"), /*#__PURE__*/React.createElement("option", {
    value: "Semanal"
  }, "Semanal"), /*#__PURE__*/React.createElement("option", {
    value: "Mensual"
  }, "Mensual"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "duration"
  }, "Duraci\xF3n (d\xEDas)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    id: "duration",
    name: "duration",
    min: "1",
    value: formData[0]?.duration || 0,
    onChange: e => handleMedicationChange(0, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "medication_type"
  }, "Tipo Medicamento"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "medication_type",
    name: "medication_type",
    value: formData[0]?.medication_type || '',
    onChange: e => handleMedicationChange(0, e)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione"), /*#__PURE__*/React.createElement("option", {
    value: "crema"
  }, "Crema"), /*#__PURE__*/React.createElement("option", {
    value: "jarabe"
  }, "Jarabe"), /*#__PURE__*/React.createElement("option", {
    value: "inyeccion"
  }, "Inyecci\xF3n"), /*#__PURE__*/React.createElement("option", {
    value: "tabletas"
  }, "Tabletas"))), formData[0]?.showTimeField && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "take_every_hours"
  }, "Tomar cada"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "take_every_hours",
    name: "take_every_hours",
    value: formData[0]?.take_every_hours || '',
    onChange: e => handleMedicationChange(0, e)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione"), [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 24].map(h => /*#__PURE__*/React.createElement("option", {
    key: h,
    value: h
  }, h, " Horas")))), formData[0]?.showQuantity && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "quantity"
  }, "Cantidad"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    id: "quantity",
    name: "quantity",
    min: "1",
    value: formData[0]?.quantity || 0,
    onChange: e => handleMedicationChange(0, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "observations"
  }, "Indicaciones"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-control",
    id: "observations",
    name: "observations",
    rows: 3,
    value: formData[0]?.observations || '',
    onChange: e => handleMedicationChange(0, e)
  })))))), manualEntry && formData.map((medication, index) => /*#__PURE__*/React.createElement("div", {
    className: "card",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-subtitle text-muted"
  }, useGroup ? `${medication.medication}` : `Medicamento ${index + 1}`), index > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger btn-sm",
    onClick: () => setFormData(prev => prev.filter((_, i) => i !== index))
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `concentration-${index}`
  }, "Concentraci\xF3n"), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: `concentration-${index}`,
    type: "text",
    name: "concentration",
    value: medication.concentration,
    onChange: e => handleMedicationChange(index, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `frequency-${index}`
  }, "Frecuencia"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: `frequency-${index}`,
    name: "frequency",
    value: medication.frequency,
    onChange: e => handleMedicationChange(index, e)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione"), /*#__PURE__*/React.createElement("option", {
    value: "Diaria"
  }, "Diaria"), /*#__PURE__*/React.createElement("option", {
    value: "Semanal"
  }, "Semanal"), /*#__PURE__*/React.createElement("option", {
    value: "Mensual"
  }, "Mensual"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `duration-${index}`
  }, "Duraci\xF3n (d\xEDas)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    id: `duration-${index}`,
    name: "duration",
    min: "1",
    value: medication.duration,
    onChange: e => handleMedicationChange(index, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `medication_type-${index}`
  }, "Tipo Medicamento"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: `medication_type-${index}`,
    name: "medication_type",
    value: medication.medication_type,
    onChange: e => handleMedicationChange(index, e)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione"), /*#__PURE__*/React.createElement("option", {
    value: "crema"
  }, "Crema"), /*#__PURE__*/React.createElement("option", {
    value: "jarabe"
  }, "Jarabe"), /*#__PURE__*/React.createElement("option", {
    value: "inyeccion"
  }, "Inyecci\xF3n"), /*#__PURE__*/React.createElement("option", {
    value: "tabletas"
  }, "Tabletas"))), medication.showTimeField && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `take_every_hours-${index}`
  }, "Tomar cada"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: `take_every_hours-${index}`,
    name: "take_every_hours",
    value: medication.take_every_hours,
    onChange: e => handleMedicationChange(index, e)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione"), [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 24].map(h => /*#__PURE__*/React.createElement("option", {
    key: h,
    value: h
  }, h, " Horas")))), medication.showQuantity && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `quantity-${index}`
  }, "Cantidad"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    id: `quantity-${index}`,
    name: "quantity",
    min: "1",
    value: medication.quantity,
    onChange: e => handleMedicationChange(index, e)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: `observations-${index}`
  }, "Indicaciones"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-control",
    id: `observations-${index}`,
    name: "observations",
    rows: 3,
    value: medication.observations,
    onChange: e => handleMedicationChange(index, e)
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "button",
    id: "addMedicineBtn",
    onClick: handleAddMedication
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " ", editIndex !== null ? 'Actualizar Medicamento' : 'Agregar Medicamento')), addedMedications.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Medicamentos de la receta"), addedMedications.map((med, index) => /*#__PURE__*/React.createElement("div", {
    className: "card mb-3",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-subtitle mb-2 text-muted"
  }, med.medication), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Concentraci\xF3n: ", med.concentration), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Frecuencia: ", med.frequency), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Duraci\xF3n (d\xEDas): ", med.duration), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Tipo Medicamento: ", med.medication_type), med.showTimeField && /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Tomar cada: ", med.take_every_hours, " Horas"), med.showQuantity && /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Cantidad: ", med.quantity), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Indicaciones: ", med.observations), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-info btn-sm me-2",
    onClick: () => handleEditMedication(index)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-edit"
  }), " Editar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger btn-sm",
    onClick: () => handleDeleteMedication(index)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }), " Eliminar")))))));
});
export default PrescriptionForm;