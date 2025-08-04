function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useRef } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
const MedicationForm = ({
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
    trigger,
    reset
  } = useForm({
    defaultValues: initialData || {
      name: '',
      presentation: '',
      concentration: '',
      minimum_stock: 0,
      maximum_stock: 0,
      expiration_date: null,
      lot_number: '',
      description: '',
      weight: 0,
      capacity: 0,
      sale_price: 0,
      purchase_price: 0
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const stepperRef = useRef(null);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef
  }, /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Informaci\xF3n b\xE1sica"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre del medicamento *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-100', {
        'p-invalid': errors.name
      })
    }, field)))
  }), getFormErrorMessage('name')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "presentation",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Presentaci\xF3n *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-100', {
        'p-invalid': errors.presentation
      })
    }, field)))
  }), getFormErrorMessage('presentation')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "concentration",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Referencia + Unidad *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-100', {
        'p-invalid': errors.concentration
      })
    }, field)))
  }), getFormErrorMessage('concentration')), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "minimum_stock",
    control: control,
    rules: {
      required: 'Este campo es requerido',
      min: {
        value: 0,
        message: 'El valor mínimo es 0'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Stock m\xEDnimo *"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      className: classNames('w-100', {
        'p-invalid': errors.minimum_stock
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('minimum_stock')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "maximum_stock",
    control: control,
    rules: {
      required: 'Este campo es requerido',
      min: {
        value: 0,
        message: 'El valor mínimo es 0'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Stock m\xE1ximo *"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      className: classNames('w-100', {
        'p-invalid': errors.maximum_stock
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('maximum_stock'))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "expiration_date",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha de caducidad *"), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames('w-100', {
        'p-invalid': errors.expiration_date
      }),
      value: field.value,
      onChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('expiration_date')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "lot_number",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "N\xFAmero de lote *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-100', {
        'p-invalid': errors.lot_number
      })
    }, field)))
  }), getFormErrorMessage('lot_number'))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: "w-100"
    }, field)))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary btn-sm",
    type: "button",
    label: "Siguiente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-right me-1"
    }),
    iconPos: "right",
    onClick: async e => {
      const isValid = await trigger(['name', 'presentation', 'concentration', 'minimum_stock', 'maximum_stock', 'expiration_date', 'lot_number']);
      if (!isValid) {
        e.preventDefault();
        return;
      }
      stepperRef.current.nextCallback();
    }
  }))), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Detalles adicionales"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "weight",
    control: control,
    rules: {
      min: {
        value: 0,
        message: 'El valor mínimo es 0'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Peso del medicamento (g)"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      suffix: " g",
      className: classNames('w-100', {
        'p-invalid': errors.weight
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('weight')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "capacity",
    control: control,
    rules: {
      min: {
        value: 0,
        message: 'El valor mínimo es 0'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Capacidad del medicamento (ml)"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      suffix: " ml",
      className: classNames('w-100', {
        'p-invalid': errors.capacity
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('capacity'))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "purchase_price",
    control: control,
    rules: {
      min: {
        value: 0,
        message: 'El valor mínimo es 0'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Precio de compra"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      mode: "currency",
      currency: "USD",
      locale: "en-US",
      className: classNames('w-100', {
        'p-invalid': errors.purchase_price
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('purchase_price')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "sale_price",
    control: control,
    rules: {
      min: {
        value: 0,
        message: 'El valor mínimo es 0'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Precio de venta"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      mode: "currency",
      currency: "USD",
      locale: "en-US",
      className: classNames('w-100', {
        'p-invalid': errors.sale_price
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('sale_price'))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-secondary btn-sm",
    type: "button",
    label: "Atr\xE1s",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-left me-1"
    }),
    onClick: () => {
      stepperRef.current.prevCallback();
    }
  }), /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary btn-sm",
    label: "Guardar",
    type: "submit",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save me-1"
    }),
    iconPos: "right"
  }))))));
};
export default MedicationForm;