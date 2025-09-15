function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { admissionService } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
export const UpdateAdmissionAuthorizationForm = ({
  formId,
  admissionId
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: {
      authorization_number: '',
      entity_authorized_amount: 0
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const onHandleSubmit = async data => {
    try {
      const response = await admissionService.update(admissionId, data);
      SwalManager.success({
        title: 'Actualización exitosa',
        text: 'La autorización fue actualizada correctamente.'
      });
    } catch (error) {
      console.error(error);
      SwalManager.error({
        title: 'Error',
        text: 'No se pudo actualizar la autorización.'
      });
    }
  };
  useEffect(() => {
    const asyncScope = async () => {
      const admission = await admissionService.get(admissionId);
      reset({
        authorization_number: admission.authorization_number,
        entity_authorized_amount: admission.entity_authorized_amount
      });
    };
    asyncScope();
  }, [admissionId, reset]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "authorizationNumber",
    className: "form-label"
  }, "N\xFAmero de autorizaci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "authorization_number",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("input", _extends({
      type: "text",
      className: classNames('form-control', {
        'p-invalid': errors.authorization_number
      }),
      id: "authorizationNumber",
      placeholder: "N\xFAmero de autorizaci\xF3n"
    }, field))
  }), getFormErrorMessage('authorization_number')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "entityAuthorizedAmount",
    className: "form-label"
  }, "Monto autorizado"), /*#__PURE__*/React.createElement(Controller, {
    name: "entity_authorized_amount",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("input", _extends({
      type: "number",
      className: classNames('form-control', {
        'p-invalid': errors.entity_authorized_amount
      }),
      id: "entityAuthorizedAmount",
      placeholder: "Monto autorizado"
    }, field))
  }), getFormErrorMessage('entity_authorized_amount'))));
};