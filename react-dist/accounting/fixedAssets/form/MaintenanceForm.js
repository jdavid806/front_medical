function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// components/MaintenanceForm.tsx
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
const MaintenanceForm = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
  statusOptions,
  maintenanceTypeOptions,
  userOptions,
  currentStatus,
  asset
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: initialData || {
      assetStatus: currentStatus,
      maintenanceDate: new Date(),
      maintenanceType: "",
      comments: "",
      cost: undefined,
      nextMaintenanceDate: undefined,
      disposedDate: new Date()
    }
  });
  const assetStatus = watch("assetStatus");
  console.log("Asset Status:", assetStatus);
  const maintenanceType = watch("maintenanceType");
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "assetStatus",
    className: "font-medium text-900 block mb-2"
  }, "Estado del Activo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "assetStatus",
    control: control,
    rules: {
      required: "El estado del activo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: "assetStatus",
      options: statusOptions,
      optionLabel: "label",
      placeholder: "Seleccione estado",
      className: classNames("w-full", {
        "p-invalid": errors.assetStatus
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    })
  }), getFormErrorMessage("assetStatus")), (assetStatus === "active" || assetStatus === "assigned") && /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "assignedTo",
    className: "font-medium text-900 block mb-2"
  }, assetStatus === "active" ? "Asignar a" : "Reasignar a", " *"), /*#__PURE__*/React.createElement(Controller, {
    name: "assignedTo",
    control: control,
    rules: {
      required: "El asignado es requerido para activos en uso"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: "assignedTo",
      options: userOptions,
      optionLabel: "label",
      placeholder: "Seleccione usuario",
      className: classNames("w-full", {
        "p-invalid": errors.assignedTo
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    })
  }), getFormErrorMessage("assignedTo")), assetStatus === "maintenance" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "maintenanceType",
    className: "font-medium text-900 block mb-2"
  }, "Tipo de Mantenimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "maintenanceType",
    control: control,
    rules: {
      required: "El tipo de mantenimiento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: "maintenanceType",
      options: maintenanceTypeOptions,
      optionLabel: "label",
      placeholder: "Seleccione tipo",
      className: classNames("w-full", {
        "p-invalid": errors.maintenanceType
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    })
  }), getFormErrorMessage("maintenanceType")), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "maintenanceDate",
    className: "font-medium text-900 block mb-2"
  }, "Fecha de Mantenimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "maintenanceDate",
    control: control,
    rules: {
      required: "La fecha es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: "maintenanceDate",
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-full", {
        "p-invalid": errors.maintenanceDate
      })
    })
  }), getFormErrorMessage("maintenanceDate"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cost",
    className: "font-medium text-900 block mb-2"
  }, "Costo (opcional)"), /*#__PURE__*/React.createElement(Controller, {
    name: "cost",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: "cost",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0,
      className: "w-full"
    })
  })))), maintenanceType === "preventive" && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "nextMaintenanceDate",
    className: "font-medium text-900 block mb-2"
  }, "Pr\xF3ximo Mantenimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "nextMaintenanceDate",
    control: control,
    rules: {
      required: "La fecha del próximo mantenimiento es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: "nextMaintenanceDate",
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-full", {
        "p-invalid": errors.nextMaintenanceDate
      })
    })
  }), getFormErrorMessage("nextMaintenanceDate"))), (assetStatus === "disposed" || assetStatus === "inactive") && /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "disposedDate",
    className: "font-medium text-900 block mb-2"
  }, assetStatus === "inactive" ? "Fecha de Inactividad *" : "Fecha de Baja *"), /*#__PURE__*/React.createElement(Controller, {
    name: "disposedDate",
    control: control,
    rules: {
      required: "La fecha de baja es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: "disposedDate",
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-full", {
        "p-invalid": errors.disposedDate
      })
    })
  }), getFormErrorMessage("disposedDate")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "comments",
    className: "font-medium text-900 block mb-2"
  }, "Comentarios *"), /*#__PURE__*/React.createElement(Controller, {
    name: "comments",
    control: control,
    rules: {
      required: "Los comentarios son requeridos"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "comments",
      className: classNames("w-full", {
        "p-invalid": errors.comments
      }),
      placeholder: "Describa los detalles del cambio de estado o mantenimiento",
      rows: 4
    }, field))
  }), getFormErrorMessage("comments")), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-4"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text p-button-sm",
    onClick: onCancel,
    disabled: loading
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar Cambios",
    icon: "pi pi-check",
    className: "p-button-sm",
    loading: loading
  })));
};
export default MaintenanceForm;