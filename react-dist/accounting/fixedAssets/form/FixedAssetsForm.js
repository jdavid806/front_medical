function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAssetCategories } from "../hooks/useAssetCategories.js";
// Opciones para tipo de activo (físico/no físico)
const assetTypeOptions = [{
  label: "Físico",
  value: "physical"
}, {
  label: "No Físico",
  value: "non-physical"
}];
const FixedAssetsForm = /*#__PURE__*/React.memo(({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    getValues
  } = useForm({
    defaultValues: initialData || {
      assetType: "physical",
      assetName: "",
      asset_category_id: "",
      brand: "",
      model: "",
      serial_number: "",
      internal_code: "",
      description: ""
    }
  });

  // Obtener categorías desde el API
  const {
    categories,
    loading: loadingCategories,
    error: categoriesError
  } = useAssetCategories();

  // Estado local para opciones de categoría
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Observar cambios en el tipo de activo
  const assetType = useWatch({
    control,
    name: "assetType",
    defaultValue: "physical"
  });

  // Sincronizar categorías y mantener selección actual
  useEffect(() => {
    if (categories) {
      const currentValue = getValues("asset_category_id");
      const options = [...categories];
      if (currentValue && !categories.some(c => c.value === currentValue)) {
        options.push({
          value: currentValue,
          label: currentValue
        });
      }
      setCategoryOptions(options);
    }
  }, [categories, getValues]);

  // Resetear el formulario solo cuando initialData cambie realmente
  useEffect(() => {
    if (initialData && JSON.stringify(initialData) !== JSON.stringify(getValues())) {
      reset(initialData);
    }
  }, [initialData, reset, getValues]);
  const onFormSubmit = data => {
    onSubmit(data);
  };
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
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "assetType",
    control: control,
    rules: {
      required: "El tipo de activo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de Activo *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: assetTypeOptions,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un tipo",
      className: classNames("w-100", {
        "p-invalid": errors.assetType
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage("assetType"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "assetName",
    control: control,
    rules: {
      required: "El nombre/descripción del activo es requerido",
      minLength: {
        value: 3,
        message: "Mínimo 3 caracteres"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre/Descripci\xF3n del Activo *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.assetName
      })
    }, field)), getFormErrorMessage("assetName"))
  })), assetType === "physical" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "asset_category_id",
    control: control,
    rules: {
      required: "La categoría del activo es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Categor\xEDa/Tipo de Activo *"), loadingCategories ? /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement(ProgressSpinner, {
      style: {
        width: "20px",
        height: "20px"
      },
      strokeWidth: "8"
    }), /*#__PURE__*/React.createElement("span", {
      className: "ms-2"
    }, "Cargando categor\xEDas...")) : categoriesError ? /*#__PURE__*/React.createElement("div", {
      className: "p-error"
    }, "Error: ", categoriesError.message) : /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: categoryOptions,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione una categor\xEDa",
      className: classNames("w-100", {
        "p-invalid": errors.asset_category_id
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    }), getFormErrorMessage("asset_category_id"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "brand",
    control: control,
    rules: {
      required: "La marca es requerida",
      minLength: {
        value: 2,
        message: "Mínimo 2 caracteres"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Marca *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.brand
      })
    }, field)), getFormErrorMessage("brand"))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, assetType === "physical" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "model",
    control: control,
    rules: {
      minLength: {
        value: 2,
        message: "Mínimo 2 caracteres"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Modelo"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: "w-100"
    }, field)))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "serial_number",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "N\xFAmero de Serie"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: "w-100"
    }, field)))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "internal_code",
    control: control,
    rules: {
      required: "El código interno es requerido",
      pattern: {
        value: /^[A-Za-z0-9-]+$/,
        message: "Solo letras, números y guiones"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "C\xF3digo Interno de Activo *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.internal_code
      })
    }, field)), getFormErrorMessage("internal_code"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Descripci\xF3n Adicional"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: "w-100"
    }, field)))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: onCancel,
    disabled: loading
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Guardar",
    icon: "pi pi-check",
    className: "ms-2",
    loading: loading,
    onClick: handleSubmit(onFormSubmit)
  })));
}, (prevProps, nextProps) => JSON.stringify(prevProps.initialData) === JSON.stringify(nextProps.initialData));
export default FixedAssetsForm;