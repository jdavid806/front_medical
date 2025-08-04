function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
const relationOptions = [{
  label: "Padre",
  value: "Padre"
}, {
  label: "Madre",
  value: "Madre"
}, {
  label: "Hermano (a)",
  value: "Hermano (a)"
}, {
  label: "Tio (a)",
  value: "Tio (a)"
}, {
  label: "Abuelo (a)",
  value: "Abuelo (a)"
}, {
  label: "Primo (a)",
  value: "Primo (a)"
}, {
  label: "Amigo (a)",
  value: "Amigo (a)"
}, {
  label: "Esposo (a)",
  value: "Esposo (a)"
}, {
  label: "Otro",
  value: "Otro"
}];
const CompanionModal = ({
  visible,
  onHide,
  onSave
}) => {
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      relationship: '',
      document_number: '',
      mobile: '',
      email: ''
    }
  });
  const onSubmit = data => {
    onSave(data);
    reset();
    onHide();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo acompa\xF1ante",
    visible: visible,
    onHide: onHide,
    style: {
      width: '50vw'
    },
    appendTo: "self",
    breakpoints: {
      '960px': '75vw',
      '640px': '90vw'
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "first_name",
    control: control,
    rules: {
      required: 'Primer nombre es requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "block mb-2"
    }, "Primer Nombre *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      })
    }, field)), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "last_name",
    control: control,
    rules: {
      required: 'Primer apellido es requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "block mb-2"
    }, "Primer Apellido *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      })
    }, field)), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "relationship",
    control: control,
    rules: {
      required: 'Parentesco es requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "block mb-2"
    }, "Parentesco *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: relationOptions,
      placeholder: "Seleccione parentesco",
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value)
    }), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: 'Número de documento es requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "block mb-2"
    }, "N\xFAmero de identificaci\xF3n *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      })
    }, field)), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "mobile",
    control: control,
    rules: {
      required: 'WhatsApp es requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "block mb-2"
    }, "WhatsApp *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      })
    }, field)), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "block mb-2"
    }, "Correo electr\xF3nico"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: "w-full"
    }, field)))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-text",
    onClick: onHide
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    type: "submit"
  }))));
};
export default CompanionModal;