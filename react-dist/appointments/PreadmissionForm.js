import React, { useEffect } from "react";
import { historyPreadmission } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
export const PreadmissionForm = ({
  initialValues,
  formId
}) => {
  useEffect(() => {
    fetchLastHistory();
  }, []);
  const [values, setValues] = React.useState(initialValues);
  const handleChange = key => event => {
    const newValue = +event.target.value;
    const newValues = {
      ...values,
      [key]: newValue
    };
    if (key === "weight" || key === "height") {
      const weight = key === "weight" ? newValue : newValues.weight;
      const height = key === "height" ? newValue : newValues.height;
      if (weight > 0 && height > 0) {
        newValues.imc = weight / (height / 100) ** 2;
      }
    }
    setValues(newValues);
  };
  const handleSubmit = event => {
    event.preventDefault();
    const requestData = {
      weight: values.weight,
      size: values.height,
      glycemia: values.glucose,
      patient_id: initialValues.patientId,
      appointment_id: initialValues.id
    };
    historyPreadmission.createHistoryPreadmission(requestData).then(response => {
      console.log(response);
      SwalManager.success();
      window.location.href = "citasControl";
    }).catch(error => {
      console.error("Error:", error);
    });
  };
  const fetchLastHistory = async () => {
    let data = {};
    try {
      data = await historyPreadmission.getHistoryPatient(initialValues.patientId);
      setValues({
        weight: data.weight,
        height: data.size,
        glucose: data.glycemia,
        imc: data.weight / (data.size / 100) ** 2
      });
    } catch (error) {
      console.error("Error fetching last history:", error);
    }
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Peso (lb)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control m-1",
    value: values.weight,
    onChange: handleChange("weight")
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Talla (cm)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control m-1",
    value: values.height,
    onChange: handleChange("height")
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "IMC(kg/m2)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control m-1",
    value: values.imc?.toFixed(2),
    onChange: handleChange("imc"),
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Glucemia (mg/dL)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control m-1",
    value: values.glucose,
    onChange: handleChange("glucose")
  })));
};