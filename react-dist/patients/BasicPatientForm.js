function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { patientService } from "../../services/api/index.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { documentTypeOptions, genderOptions, civilStatusOptions, ethnicityOptions, bloodTypeOptions } from "./consts/index.js";
export const BasicPatientForm = props => {
  const {
    visible,
    onHide,
    onSuccess
  } = props;
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      document_type: "",
      document_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      gender: "",
      date_of_birth: null,
      whatsapp: "",
      email: "",
      civil_status: "",
      ethnicity: "",
      blood_type: ""
    }
  });
  const onSubmit = async data => {
    try {
      const finalData = {
        patient: {
          first_name: data.first_name.toUpperCase(),
          last_name: data.last_name.toUpperCase(),
          middle_name: data.middle_name?.toUpperCase() || "",
          second_last_name: data.second_last_name?.toUpperCase() || "",
          document_type: data.document_type,
          document_number: data.document_number,
          gender: data.gender,
          date_of_birth: data.date_of_birth?.toISOString() || "",
          whatsapp: data.whatsapp,
          email: data.email,
          civil_status: data.civil_status,
          ethnicity: data.ethnicity,
          blood_type: data.blood_type
        }
      };
      await patientService.storePatient(finalData);
      showSuccessToast({
        title: "Éxito",
        message: "Paciente creado correctamente"
      });
      onSuccess?.();
      onHide();
    } catch (error) {
      console.error("Error completo:", error);
      showServerErrorsToast(error);
    }
  };
  const getFormErrorMessage = name => {
    const nameParts = name.split(".");
    let errorObj = errors;
    for (const part of nameParts) {
      errorObj = errorObj?.[part];
      if (!errorObj) break;
    }
    return errorObj && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errorObj.message);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: onHide,
    header: "Nuevo Paciente",
    style: {
      width: "90vw",
      maxWidth: "1200px",
      height: "100vh",
      maxHeight: "900px"
    },
    appendTo: "self",
    maximizable: true
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Datos Personales",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: "Tipo de documento es requerido"
    },
    render: ({
      field,
      fieldState
    }) => {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
        className: "form-label"
      }, "Tipo de documento *"), /*#__PURE__*/React.createElement(Dropdown, {
        appendTo: "self",
        options: documentTypeOptions,
        optionLabel: "label",
        optionValue: "value",
        placeholder: "Seleccione",
        className: classNames("w-100", {
          "is-invalid": fieldState.error
        }),
        value: field.value || "",
        onChange: e => {
          field.onChange(e.value);
        }
      }), getFormErrorMessage(field.name));
    }
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "first_name",
    control: control,
    rules: {
      required: "Primer nombre es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Primer nombre *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      })
    }, field)), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "last_name",
    control: control,
    rules: {
      required: "Primer apellido es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Primer apellido *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      })
    }, field)), getFormErrorMessage(field.name))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: "Número de documento es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "N\xFAmero de documento *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      })
    }, field)), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "middle_name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Segundo Nombre *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100")
    }, field)))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "second_last_name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Segundo apellido *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100")
    }, field)))
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n Adicional"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "gender",
    control: control,
    rules: {
      required: "Género es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "G\xE9nero *"), /*#__PURE__*/React.createElement(Dropdown, {
      options: genderOptions,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "whatsapp",
    control: control,
    rules: {
      required: "WhatsApp es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "WhatsApp *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      })
    }, field)), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "civil_status",
    control: control,
    rules: {
      required: "Estado civil es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Estado Civil *"), /*#__PURE__*/React.createElement(Dropdown, {
      options: civilStatusOptions,
      placeholder: "Seleccione",
      className: classNames("w-100 h-20", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "ethnicity",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Etnia"), /*#__PURE__*/React.createElement(Dropdown, {
      options: ethnicityOptions,
      placeholder: "Seleccione",
      className: "w-100 h-50",
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self",
      scrollHeight: "140px"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "date_of_birth",
    control: control,
    rules: {
      required: "Fecha de nacimiento es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Fecha de nacimiento *"), /*#__PURE__*/React.createElement(Calendar, {
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      maxDate: new Date(),
      appendTo: "self"
    }), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-1"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Correo electr\xF3nico *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      })
    }, field)), getFormErrorMessage(field.name))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "blood_type",
    control: control,
    rules: {
      required: "Tipo de sangre es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Tipo de sangre *"), /*#__PURE__*/React.createElement(Dropdown, {
      options: bloodTypeOptions,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "is-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage(field.name))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end pt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    type: "button",
    className: "p-button-primary",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save me-2"
    }),
    iconPos: "right",
    onClick: handleSubmit(onSubmit)
  })))));
};