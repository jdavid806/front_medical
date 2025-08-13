import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { genderOptions } from "../utils/constants.js";
import { validatePatientStep } from "../utils/helpers.js";
const PatientStep = ({
  formData,
  updateFormData,
  nextStep,
  toast
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    trigger
  } = useForm({
    defaultValues: formData
  });
  const handlePatientChange = (field, value) => {
    updateFormData("patient", {
      [field]: value
    });
  };
  const handleBillingChange = (field, value) => {
    updateFormData("billing", {
      [field]: value
    });
  };
  const toggleBillingType = type => {
    if (type === "entity") {
      updateFormData("patient", {
        facturacionEntidad: !formData.patient.facturacionEntidad,
        facturacionConsumidor: false
      });
    } else {
      updateFormData("patient", {
        facturacionConsumidor: !formData.patient.facturacionConsumidor,
        facturacionEntidad: false
      });
    }
  };
  const toggleCompanion = value => {
    handlePatientChange("hasCompanion", value);
  };
  const handleNext = async () => {
    const isValid = await trigger(["patient.documentNumber", "patient.nameComplet", "patient.gender", "patient.whatsapp", "patient.email", "patient.address", "patient.city", "patient.affiliateType", "patient.insurance"]);
    if (isValid && validatePatientStep(formData.patient, toast)) {
      nextStep();
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
  return /*#__PURE__*/React.createElement("div", {
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
    name: "patient.nameComplet",
    control: control,
    rules: {
      required: "Nombre completo es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Nombre Paciente *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("nameComplet", e.target.value);
      }
    }), getFormErrorMessage("patient.nameComplet"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "patient.documentNumber",
    control: control,
    rules: {
      required: "Número de documento es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "N\xFAmero de documento *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("documentNumber", e.target.value);
      }
    }), getFormErrorMessage("patient.documentNumber"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient.gender",
    control: control,
    rules: {
      required: "Género es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "G\xE9nero *"), /*#__PURE__*/React.createElement(Dropdown, {
      options: genderOptions,
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        handlePatientChange("gender", e.value);
      },
      appendTo: "self"
    }), getFormErrorMessage("patient.gender"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "patient.address",
    control: control,
    rules: {
      required: "Dirección es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Direcci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("address", e.target.value);
      }
    }), getFormErrorMessage("patient.address"))
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n Adicional",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient.whatsapp",
    control: control,
    rules: {
      required: "WhatsApp es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "WhatsApp *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("whatsapp", e.target.value);
      }
    }), getFormErrorMessage("patient.whatsapp"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "patient.email",
    control: control,
    rules: {
      required: "Correo electrónico es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Correo electrónico no válido"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Correo electr\xF3nico *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value,
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("email", e.target.value);
      }
    }), getFormErrorMessage("patient.email"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "patient.insurance",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Aseguradora"), /*#__PURE__*/React.createElement(InputText, {
      className: "w-100",
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("insurance", e.target.value);
      }
    }), getFormErrorMessage("patient.insurance"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient.city",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Ciudad"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("city", e.target.value);
      }
    }), getFormErrorMessage("patient.city"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "patient.affiliateType",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Tipo de afiliado"), /*#__PURE__*/React.createElement(InputText, {
      className: "w-100",
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handlePatientChange("affiliateType", e.target.value);
      }
    }), getFormErrorMessage("patient.affiliateType"))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 col-md-10 col-12 mb-4 w-40"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n Consumidor",
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: formData.patient.facturacionConsumidor,
    onChange: () => toggleBillingType("consumer"),
    disabled: formData.patient.facturacionEntidad,
    className: "me-3 bg-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-muted small"
  }, "facturaci\xF3n consumidor")))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 col-md-10 col-12 mb-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n por Entidad",
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: formData.patient.facturacionEntidad,
    onChange: () => toggleBillingType("entity"),
    disabled: formData.patient.facturacionConsumidor,
    className: "me-3 bg-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-muted small"
  }, "Activar facturaci\xF3n por entidad")), formData.patient.facturacionEntidad && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Controller, {
    name: "billing.entity",
    control: control,
    rules: {
      required: "Entidad es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Entidad *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("entity", e.target.value);
      }
    }), getFormErrorMessage("billing.entity"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Fecha de autorizaci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
      className: "w-100",
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        handleBillingChange("authorizationDate", e.value);
      },
      dateFormat: "dd/mm/yy",
      showIcon: true,
      appendTo: "self"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizationNumber",
    control: control,
    rules: {
      required: "Número de autorización es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "N\xB0 Autorizaci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100", {
        "p-invalid": fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("authorizationNumber", e.target.value);
      }
    }), getFormErrorMessage("billing.authorizationNumber"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizedAmount",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Monto Autorizado"), /*#__PURE__*/React.createElement(InputText, {
      className: "w-100",
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("authorizedAmount", e.target.value);
      }
    }))
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end pt-4 col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-right me-2"
    }),
    iconPos: "right",
    onClick: handleNext,
    className: "btn btn-primary btn-sm"
  })));
};
export default PatientStep;