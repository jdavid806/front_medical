function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { categoryProductsService, brandService } from "../../../services/api/index.js";
const SupplyForm = ({
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
      name: "",
      category: "",
      presentation: "",
      minimum_stock: 0,
      maximum_stock: 0,
      description: "",
      weight: 0,
      brand: "",
      sale_price: 0
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const stepperRef = useRef(null);
  const [categories, setCategories] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  useEffect(() => {
    getCategories();
    getBrands();
  }, []);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  async function getCategories() {
    const categories = await categoryProductsService.getAll();
    setCategories(categories);
  }
  async function getBrands() {
    const brandsData = await brandService.getAll();
    setBrands(brandsData?.data);
  }
  const presentationOptions = [{
    label: "Crema",
    value: "Crema"
  }, {
    label: "Tabletas",
    value: "Tabletas"
  }, {
    label: "Jarabe",
    value: "Jarabe"
  }, {
    label: "Inyección",
    value: "Inyección"
  }];
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
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre del insumo *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.name
      })
    }, field)))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "category",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Categor\xEDa *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: categories,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione una categor\xEDa",
      className: classNames("w-100", {
        "p-invalid": errors.category
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }))
  }), getFormErrorMessage("category")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "brand",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Marca"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: brands,
      optionLabel: "attributes.name",
      optionValue: "id",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.brand
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "presentation",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Presentac\xF3n *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: presentationOptions,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.presentation
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }))
  }), getFormErrorMessage("presentation"))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "minimum_stock",
    control: control,
    rules: {
      required: "Este campo es requerido",
      min: {
        value: 0,
        message: "El valor mínimo es 0"
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
      className: classNames("w-100", {
        "p-invalid": errors.minimum_stock
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("minimum_stock")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "maximum_stock",
    control: control,
    rules: {
      required: "Este campo es requerido",
      min: {
        value: 0,
        message: "El valor mínimo es 0"
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
      className: classNames("w-100", {
        "p-invalid": errors.maximum_stock
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("maximum_stock"))), /*#__PURE__*/React.createElement("div", {
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
      const isValid = await trigger(["name", "category", "minimum_stock", "maximum_stock"]);
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
        message: "El valor mínimo es 0"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Peso del insumo (g)"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 0,
      suffix: " g",
      className: classNames("w-100", {
        "p-invalid": errors.weight
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("weight")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "sale_price",
    control: control,
    rules: {
      min: {
        value: 0,
        message: "El valor mínimo es 0"
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
      className: classNames("w-100", {
        "p-invalid": errors.sale_price
      }),
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("sale_price"))), /*#__PURE__*/React.createElement("div", {
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
export default SupplyForm;