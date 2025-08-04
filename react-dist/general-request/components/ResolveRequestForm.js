import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useResolveRequest } from "../hooks/useResolveRequest.js";
export const ResolveRequestForm = ({
  requestId,
  onSave
}) => {
  const {
    resolveRequest
  } = useResolveRequest();
  const {
    control,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm();
  const onSubmit = data => onHandleSubmit(data);
  const onHandleSubmit = async data => {
    try {
      const response = await resolveRequest(requestId, {
        status: data.status,
        notes: data.notes || null
      });
      onSave(response);
    } catch (error) {
      console.error(error);
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    type: "submit",
    onClick: () => setValue('status', 'rejected')
  }, "Rechazar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    type: "submit",
    onClick: () => setValue('status', 'approved')
  }, "Aceptar"))));
};