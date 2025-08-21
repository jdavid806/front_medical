function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { documentTypes } from "../interfaces/constant.js";
import useLocationDropdowns from "../../../cities/hooks/useLocationDropdowns.js";
const EntitiesConfigForm = ({
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
      errors,
      isDirty
    },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: initialData || {
      name: "",
      document_type: "CC",
      document_number: "",
      email: "",
      address: "",
      phone: "",
      country_id: "",
      department_id: "",
      city_id: "",
      tax_charge_id: null,
      withholding_tax_id: null,
      koneksi_sponsor_slug: null
    }
  });
  const watchCountry = watch("country_id");
  const watchDepartment = watch("department_id");

  // Usar el hook de ubicaciones
  const {
    countryOptions,
    departmentOptions,
    cityOptions,
    selectedCountry,
    selectedDepartment,
    selectedCity,
    handleCountryChange,
    handleDepartmentChange,
    handleCityChange,
    loading: locationLoading,
    setInitialValuesFromIds
  } = useLocationDropdowns();
  const onFormSubmit = data => {
    const countryId = countryOptions.find(c => c.value === data.country_id)?.customProperties?.id;
    const departmentId = departmentOptions.find(d => d.value === data.department_id)?.customProperties?.id;
    const cityId = cityOptions.find(c => c.value === data.city_id)?.customProperties?.id;
    onSubmit({
      ...data,
      country_id: countryId ? Number(countryId) : null,
      department_id: departmentId ? Number(departmentId) : null,
      city_id: cityId ? String(cityId) : null
    });
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      if (initialData.country_id && initialData.department_id && initialData.city_id) {
        setInitialValuesFromIds(Number(initialData.country_id), Number(initialData.department_id), Number(initialData.city_id));
      }
    }
  }, [initialData, reset, setInitialValuesFromIds]);
  useEffect(() => {
    if (selectedCountry) {
      setValue("country_id", selectedCountry, {
        shouldValidate: true
      });
    }
  }, [selectedCountry, setValue]);
  useEffect(() => {
    if (selectedDepartment) {
      setValue("department_id", selectedDepartment, {
        shouldValidate: true
      });
    }
  }, [selectedDepartment, setValue]);
  useEffect(() => {
    if (selectedCity) {
      setValue("city_id", selectedCity, {
        shouldValidate: true
      });
    }
  }, [selectedCity, setValue]);
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.name
      })
    }, field)))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: "El tipo de documento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de Documento *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: documentTypes,
      optionLabel: "label",
      optionValue: "value",
      className: classNames("w-100", {
        "p-invalid": errors.document_type
      })
    }, field)))
  }), getFormErrorMessage("document_type")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: "El número de documento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "N\xFAmero de Documento *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.document_number
      })
    }, field)))
  }), getFormErrorMessage("document_number")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: "El email es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Email inválido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Email *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.email
      })
    }, field)))
  }), getFormErrorMessage("email")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    rules: {
      required: "La dirección es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Direcci\xF3n *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.address
      })
    }, field)))
  }), getFormErrorMessage("address")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: "El teléfono es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tel\xE9fono *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.phone
      })
    }, field)))
  }), getFormErrorMessage("phone")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "country_id",
    control: control,
    rules: {
      required: "El país es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "country_id",
      className: "form-label"
    }, "Pa\xEDs *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "country_id",
      value: selectedCountry,
      options: countryOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => handleCountryChange(e.value),
      className: classNames("w-100", {
        "p-invalid": errors.country_id
      }),
      placeholder: "Selecciona un pa\xEDs",
      loading: locationLoading,
      filter: true,
      filterBy: "label",
      showClear: true
    }))
  }), getFormErrorMessage("country_id")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "department_id",
    control: control,
    rules: {
      required: "El departamento es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "department_id",
      className: "form-label"
    }, "Departamento *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "department_id",
      value: selectedDepartment,
      options: departmentOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => handleDepartmentChange(e.value),
      className: classNames("w-100", {
        "p-invalid": errors.department_id
      }),
      placeholder: "Selecciona un departamento",
      loading: locationLoading,
      disabled: !watchCountry,
      filter: true,
      filterBy: "label",
      showClear: true
    }))
  }), getFormErrorMessage("department_id")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "city_id",
    control: control,
    rules: {
      required: "La ciudad es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "city_id",
      className: "form-label"
    }, "Ciudad *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: "city_id",
      value: selectedCity,
      options: cityOptions,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => handleCityChange(e.value),
      className: classNames("w-100", {
        "p-invalid": errors.city_id
      }),
      placeholder: "Selecciona una ciudad",
      loading: locationLoading,
      disabled: !watchDepartment,
      filter: true,
      filterBy: "label",
      showClear: true
    }))
  }), getFormErrorMessage("city_id")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4 gap-6"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-phoenix-secondary",
    onClick: onCancel,
    style: {
      padding: "0 20px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    },
    type: "button",
    disabled: loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    className: "p-button-sm",
    disabled: loading || !isDirty,
    style: {
      padding: "0 40px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }))));
};
export default EntitiesConfigForm;