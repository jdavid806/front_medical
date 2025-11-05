import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
export const ResolveClinicalRecordReviewRequestForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    control,
    formState: {
      errors
    },
    getValues
  } = useForm();
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      return {
        notes: getValues('notes')
      };
    }
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    className: "needs-validation",
    noValidate: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "notes",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Observaciones (opcional)"), /*#__PURE__*/React.createElement(InputTextarea, {
      placeholder: "Ingrese un nombre",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onChange: field.onChange,
      className: classNames('w-100', {
        'p-invalid': errors.notes
      })
    }))
  }))));
});