function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useUsers } from "../../users/hooks/useUsers.js";
export const DisabilityForm = /*#__PURE__*/forwardRef(({
  formId,
  onHandleSubmit,
  initialData
}, ref) => {
  const {
    users
  } = useUsers();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    watch
  } = useForm({
    defaultValues: initialData || {
      user_id: 0,
      start_date: new Date(),
      end_date: new Date(),
      reason: ""
    }
  });
  const startDate = watch("start_date");
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      reset();
    },
    getFormData: () => {
      return {
        user_id: watch("user_id"),
        start_date: watch("start_date"),
        end_date: watch("end_date"),
        reason: watch("reason"),
        id: watch("id"),
        isEditing: watch("isEditing")
      };
    }
  }));

  // Preparar opciones para el dropdown de usuarios
  const userOptions = users.map(user => ({
    label: `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.second_last_name || ''}`.replace(/\s+/g, ' ').trim(),
    value: user.id,
    specialty: user.specialty?.name || 'N/A'
  }));
  React.useEffect(() => {
    reset(initialData || {
      user_id: 0,
      start_date: new Date(),
      end_date: new Date(),
      reason: ""
    });
  }, [initialData, reset]);
  const onSubmit = data => {
    onHandleSubmit?.(data);
  };
  const getFormErrorMessage = name => {
    return errors[name] ? /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message) : /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "\xA0");
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "user_id",
    className: "block mb-2"
  }, "M\xE9dico *"), /*#__PURE__*/React.createElement(Controller, {
    name: "user_id",
    control: control,
    rules: {
      required: "El médico es requerido",
      validate: value => value > 0 || "Debe seleccionar un médico"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: userOptions,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un m\xE9dico",
      filter: true,
      filterBy: "label",
      showClear: true,
      emptyMessage: "No se encontraron m\xE9dicos",
      className: classNames({
        "p-invalid": fieldState.error
      }),
      itemTemplate: option => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 'bold'
        }
      }, option.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.8em',
          color: '#666'
        }
      }, "Especialidad: ", option.specialty))
    })
  }), getFormErrorMessage("user_id")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "start_date",
    className: "block mb-2"
  }, "Fecha de inicio *"), /*#__PURE__*/React.createElement(Controller, {
    name: "start_date",
    control: control,
    rules: {
      required: "La fecha de inicio es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value ? new Date(field.value) : null,
      onChange: e => field.onChange(e.value),
      dateFormat: "yy-mm-dd",
      showIcon: true,
      className: classNames({
        "p-invalid": fieldState.error
      })
    })
  }), getFormErrorMessage("start_date")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "end_date",
    className: "block mb-2"
  }, "Fecha de fin *"), /*#__PURE__*/React.createElement(Controller, {
    name: "end_date",
    control: control,
    rules: {
      required: "La fecha de fin es requerida",
      validate: value => {
        if (startDate && value) {
          const start = new Date(startDate);
          const end = new Date(value);
          return end >= start || "La fecha de fin debe ser posterior o igual a la fecha de inicio";
        }
        return true;
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value ? new Date(field.value) : null,
      onChange: e => field.onChange(e.value),
      dateFormat: "yy-mm-dd",
      showIcon: true,
      minDate: startDate ? new Date(startDate) : undefined,
      className: classNames({
        "p-invalid": fieldState.error
      })
    })
  }), getFormErrorMessage("end_date")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "reason",
    className: "block mb-2"
  }, "Raz\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "reason",
    control: control,
    rules: {
      required: "La razón es requerida",
      minLength: {
        value: 3,
        message: "La razón debe tener al menos 3 caracteres"
      },
      maxLength: {
        value: 500,
        message: "La razón no puede exceder 500 caracteres"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name
    }, field, {
      rows: 4,
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("reason")));
});