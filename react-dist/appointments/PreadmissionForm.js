import React from "react";
export const PreadmissionForm = ({
  initialValues
}) => {
  console.log(initialValues);
  const [values, setValues] = React.useState(initialValues);
  const handleChange = key => event => {
    setValues({
      ...values,
      [key]: +event.target.value
    });
  };
  const handleSubmit = event => {
    event.preventDefault();
  };
  return /*#__PURE__*/React.createElement("form", {
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
  }, /*#__PURE__*/React.createElement("label", null, "IMC"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control m-1",
    value: values.height,
    onChange: handleChange("height")
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Glucemia (mg/dL)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control m-1",
    value: values.glucose,
    onChange: handleChange("glucose")
  })));
};