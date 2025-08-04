function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { useUsers } from "./hooks/useUsers.js";
export const UserAssistantForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    users
  } = useUsers();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      assistants: []
    }
  });
  const onSubmit = data => {
    onHandleSubmit(data);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message?.toString());
  };
  useEffect(() => {
    reset(initialData || {
      assistants: []
    });
  }, [initialData, reset]);
  const selectedUserIds = useWatch({
    control,
    name: "assistants",
    defaultValue: []
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "assistants",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Asistentes *"), /*#__PURE__*/React.createElement(MultiSelect, _extends({
      inputId: field.name,
      options: users,
      optionLabel: "label",
      optionValue: "id",
      placeholder: "Seleccione uno o m\xE1s asistentes",
      filter: true,
      showClear: true,
      maxSelectedLabels: 2,
      className: classNames('w-100', {
        'p-invalid': errors.assistants
      }),
      appendTo: 'self'
    }, field)))
  }), getFormErrorMessage('assistants'))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "row g-2"
  }, selectedUserIds.map(userId => {
    const user = users.find(user => user.id === userId);
    if (!user) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "col-md-4",
      key: userId
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("p", {
      className: "card-text"
    }, `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`))));
  })));
};