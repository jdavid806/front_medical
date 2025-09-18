function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { inventoryService } from "../../../services/api/index.js";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
const initialMedicine = {
  name: "",
  medication: "",
  concentration: "",
  duration: 0,
  frequency: "",
  medication_type: "",
  observations: "",
  quantity: 0,
  take_every_hours: 0,
  showQuantity: false,
  showTimeField: false
};
const medicationTypeOptions = [{
  label: "Seleccione",
  value: ""
}, {
  label: "Crema",
  value: "crema"
}, {
  label: "Jarabe",
  value: "jarabe"
}, {
  label: "Inyección",
  value: "inyeccion"
}, {
  label: "Tabletas",
  value: "tabletas"
}];
const hoursOptions = [1, 2, 3, 4, 5, 6, 7, 8, 10, 9, 12, 24].map(h => ({
  label: `${h} horas`,
  value: h
}));
const frequencyOptions = [{
  label: "Diaria",
  value: "Diaria"
}, {
  label: "Semanal",
  value: "Semanal"
}, {
  label: "Mensual",
  value: "Mensual"
}];
const PrescriptionForm = /*#__PURE__*/forwardRef(({
  formId,
  initialData
}, ref) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm();
  const [useGroup, setUseGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [formData, setFormData] = useState([{
    ...initialMedicine
  }]);
  const [addedMedications, setAddedMedications] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return addedMedications;
    },
    resetForm: () => {
      reset();
      setFormData([{
        ...initialMedicine
      }]);
      setSelectedMedicine(null);
      setManualEntry(false);
    }
  }));
  const medicationType = watch("medication_type");
  const showQuantity = !["tabletas", ""].includes(medicationType);
  const disableQuantity = ["tabletas"].includes(medicationType);
  const showTimeField = ["tabletas", "jarabe"].includes(medicationType);
  const handleGroupToggle = () => {
    setUseGroup(!useGroup);
    setSelectedGroupId("");
    setFormData([{
      ...initialMedicine
    }]);
    setManualEntry(false);
    reset();
  };
  const calculateQuantity = (duration, takeEveryHours) => {
    return Math.ceil(duration * 24 / takeEveryHours);
  };
  const handleMedicationChange = (index, field, value) => {
    const newFormData = [...formData];
    let newQuantity = formData[index].quantity;
    console.log("field", field);
    console.log("value", value);
    if (["duration", "take_every_hours", "medication_type"].includes(field) && (value == "tabletas" || formData[index].medication_type == "tabletas")) {
      const finalDuration = field == "duration" ? value : formData[index].duration;
      const finalTakeEveryHours = field == "take_every_hours" ? value : formData[index].take_every_hours;
      console.log("duration", finalDuration);
      console.log("take_every_hours", finalTakeEveryHours);
      newQuantity = calculateQuantity(finalDuration, finalTakeEveryHours);
      console.log("newQuantity", newQuantity);
    }
    newFormData[index] = {
      ...newFormData[index],
      [field]: value,
      showQuantity: field === "medication_type" ? !["tabletas", ""].includes(value) : newFormData[index].showQuantity,
      showTimeField: field === "medication_type" ? ["tabletas", "jarabe"].includes(value) : newFormData[index].showTimeField,
      quantity: newQuantity
    };
    setFormData(newFormData);
  };
  const handleMedicineSelection = e => {
    setSelectedMedicine(e.value);
    if (e.value) {
      setValue("medication", e.value.name);
      setValue("name", e.value.name); // Añadimos esta línea
      setValue("concentration", e.value.concentration);
      handleMedicationChange(0, "medication", e.value.name);
      handleMedicationChange(0, "name", e.value.name); // Añadimos esta línea
      handleMedicationChange(0, "concentration", e.value.concentration);
    }
  };
  const handleAddMedication = () => {
    const currentMedication = {
      ...formData[0],
      name: selectedMedicine?.name || formData[0].medication || formData[0].name,
      medication: selectedMedicine?.name || formData[0].medication || formData[0].name
    };
    if (editIndex !== null) {
      const updatedMedications = addedMedications.map((med, index) => index === editIndex ? currentMedication : med);
      setAddedMedications(updatedMedications);
      setEditIndex(null);
    } else {
      setAddedMedications(prev => [...prev, currentMedication]);
    }
    setFormData([{
      ...initialMedicine
    }]);
    setSelectedMedicine(null);
    setManualEntry(false);
    reset();
  };
  const handleEditMedication = index => {
    const medicationToEdit = addedMedications[index];
    if (medicationToEdit.medication_type == "tabletas") {
      const quantity = calculateQuantity(medicationToEdit.duration, medicationToEdit.take_every_hours);
      medicationToEdit.quantity = quantity;
    }
    setFormData([{
      ...medicationToEdit
    }]);
    setEditIndex(index);
    setManualEntry(true);

    // Actualizar los valores del formulario
    Object.entries(medicationToEdit).forEach(([key, value]) => {
      setValue(key, value);
    });
  };
  const handleDeleteMedication = index => {
    setAddedMedications(prev => prev.filter((_, i) => i !== index));
  };
  async function loadProducts() {
    const medications = await inventoryService.getMedications();
    setMedicines(medications);
  }
  useEffect(() => {
    if (initialData?.medicines) {
      setAddedMedications([...initialData.medicines]);
    }
  }, [initialData]);
  useEffect(() => {
    loadProducts();
  }, []);
  const renderField = (fieldName, label, index = 0) => {
    const commonProps = {
      control,
      name: `${fieldName}${index > 0 ? `-${index}` : ""}`,
      defaultValue: formData[index]?.[fieldName] || ""
    };
    switch (fieldName) {
      case "medication":
        return useGroup ? /*#__PURE__*/React.createElement("div", {
          className: "col-md-12 mb-3"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label"
        }, label), /*#__PURE__*/React.createElement(Dropdown, {
          inputId: "medicines",
          filter: true,
          options: medicines,
          optionLabel: "name",
          placeholder: "Seleccione",
          className: "w-100",
          appendTo: "self",
          value: selectedMedicine,
          onChange: handleMedicineSelection
        })) : /*#__PURE__*/React.createElement("div", {
          className: "col-md-12"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: "medication"
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(InputText, _extends({
            id: "medication"
          }, field, {
            className: "w-100",
            onChange: e => {
              field.onChange(e.target.value);
              handleMedicationChange(0, "medication", e.target.value);
              handleMedicationChange(0, "name", e.target.value); // Añadimos esta línea
            }
          }))
        })));
      case "concentration":
        return /*#__PURE__*/React.createElement("div", {
          className: "col-md-4"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: `concentration-${index}`
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(InputText, _extends({
            id: `concentration-${index}`
          }, field, {
            className: "w-100",
            onChange: e => {
              field.onChange(e.target.value);
              handleMedicationChange(index, "concentration", e.target.value);
            }
          }))
        })));
      case "frequency":
        return /*#__PURE__*/React.createElement("div", {
          className: "col-md-4"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: `frequency-${index}`
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
            id: `frequency-${index}`
          }, field, {
            options: frequencyOptions,
            optionLabel: "label",
            optionValue: "value",
            placeholder: "Seleccione",
            className: "w-100",
            appendTo: "self",
            onChange: e => {
              field.onChange(e.value);
              handleMedicationChange(index, "frequency", e.value);
            },
            value: formData[index]?.frequency
          }))
        })));
      case "duration":
        return /*#__PURE__*/React.createElement("div", {
          className: "col-md-4"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: `duration-${index}`
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(InputNumber, _extends({
            id: `duration-${index}`
          }, field, {
            min: 1,
            className: "w-100",
            onChange: e => {
              field.onChange(e.value);
              handleMedicationChange(index, "duration", e.value);
            },
            value: formData[index]?.duration
          }))
        })));
      case "medication_type":
        return /*#__PURE__*/React.createElement("div", {
          className: "col-md-6"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: `medication_type-${index}`
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
            id: `medication_type-${index}`
          }, field, {
            options: medicationTypeOptions,
            optionLabel: "label",
            optionValue: "value",
            placeholder: "Seleccione",
            className: "w-100",
            onChange: e => {
              field.onChange(e.value);
              handleMedicationChange(index, "medication_type", e.value);
            },
            appendTo: "self",
            value: formData[index]?.medication_type
          }))
        })));
      case "take_every_hours":
        return /*#__PURE__*/React.createElement("div", {
          className: "col-md-6"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: `take_every_hours-${index}`
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
            id: `take_every_hours-${index}`
          }, field, {
            options: hoursOptions,
            optionLabel: "label",
            optionValue: "value",
            placeholder: "Seleccione",
            className: "w-100",
            onChange: e => {
              field.onChange(e.value);
              handleMedicationChange(index, "take_every_hours", e.value);
            },
            value: formData[index]?.take_every_hours,
            appendTo: "self"
          }))
        })));
      case "quantity":
        return /*#__PURE__*/React.createElement("div", {
          className: "col-md-6"
        }, /*#__PURE__*/React.createElement("label", {
          className: "form-label",
          htmlFor: `quantity-${index}`
        }, label), /*#__PURE__*/React.createElement(Controller, _extends({}, commonProps, {
          render: ({
            field
          }) => /*#__PURE__*/React.createElement(InputNumber, _extends({
            id: `quantity-${index}`
          }, field, {
            min: 1,
            className: "w-100",
            onChange: e => {
              field.onChange(e.value);
              handleMedicationChange(index, "quantity", e.value);
            },
            value: formData[index]?.quantity,
            disabled: disableQuantity
          }))
        })));
      default:
        return null;
    }
  };
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
  }, "Agregar medicamentos desde inventario"))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, renderField("medication", "Medicamento"), renderField("concentration", "Concentración"), renderField("frequency", "Frecuencia"), renderField("duration", "Duración (días)"), renderField("medication_type", "Tipo Medicamento"), showTimeField && renderField("take_every_hours", "Tomar cada"), renderField("quantity", "Cantidad"), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "observations"
  }, "Indicaciones"), /*#__PURE__*/React.createElement(Controller, {
    name: "observations",
    control: control,
    defaultValue: formData[0]?.observations || "",
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("textarea", _extends({
      className: "form-control",
      id: "observations"
    }, field, {
      rows: 3,
      onChange: e => {
        field.onChange(e.target.value);
        handleMedicationChange(0, "observations", e.target.value);
      }
    }))
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "button",
    id: "addMedicineBtn",
    onClick: handleAddMedication
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " ", editIndex !== null ? "Actualizar Medicamento" : "Agregar Medicamento")), addedMedications.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Medicamentos de la receta"), addedMedications.map((med, index) => /*#__PURE__*/React.createElement("div", {
    className: "card mb-3",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-subtitle mb-2 text-muted"
  }, med.name || med.medication || "Sin nombre"), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Concentraci\xF3n: ", med.concentration || "No especificado"), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Frecuencia: ", med.frequency || "No especificado"), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Duraci\xF3n (d\xEDas): ", med.duration || "No especificado"), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Tipo Medicamento:", " ", med.medication_type || "No especificado"), med.showTimeField && /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Tomar cada: ", med.take_every_hours || "No especificado", " ", "Horas"), med.showQuantity && /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Cantidad: ", med.quantity || "No especificado"), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Indicaciones: ", med.observations || "No especificado"), /*#__PURE__*/React.createElement("button", {
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