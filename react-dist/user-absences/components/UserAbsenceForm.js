function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useUsers } from "../../users/hooks/useUsers.js";
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
export const UserAbsenceForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      user_id: '',
      reason: '',
      dateRange: [new Date(), new Date()]
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const {
    users
  } = useUsers();
  const [usersForSelect, setUsersForSelect] = useState([]);
  useEffect(() => {
    setUsersForSelect(users.map(user => {
      return {
        value: user.id.toString(),
        label: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`
      };
    }));
  }, [users]);
  useEffect(() => {
    reset(initialData || {
      user_id: '',
      reason: '',
      dateRange: [new Date(), new Date()]
    });
  }, [initialData, reset]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Usuario *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: usersForSelect,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      placeholder: "Seleccione un usuario",
      className: classNames('w-100', {
        'p-invalid': errors.user_id
      })
    }, field)))
  }), getFormErrorMessage('user_id')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "reason",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Motivo"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name,
      placeholder: "Ingrese un motivo",
      className: classNames('w-100', {
        'p-invalid': errors.reason
      })
    }, field)))
  }), getFormErrorMessage('reason')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "dateRange",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha de la ausencia *"), /*#__PURE__*/React.createElement(Calendar, {
      inputId: field.name,
      className: classNames('w-100', {
        'p-invalid': errors.dateRange
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      placeholder: "Seleccione la fecha de la ausencia",
      selectionMode: "range"
    }))
  }), getFormErrorMessage('dateRange'))));
};