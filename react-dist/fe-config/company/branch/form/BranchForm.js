function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { cityService, countryService } from "../../../../../services/api/index.js";
export const BranchForm = ({
  onHandleSubmit,
  initialData,
  onCancel,
  loading = false,
  onFormChange
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isDirty
    },
    reset,
    setValue
  } = useForm({
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: null,
      address: "",
      city: "",
      country: ""
    }
  });
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Notificar cambios en el formulario
  useEffect(() => {
    onFormChange?.(isDirty);
  }, [isDirty, onFormChange]);
  useEffect(() => {
    reset(initialData || {
      name: "",
      email: "",
      phone: null,
      address: "",
      city: "",
      country: ""
    });
    loadCountries().then(response => {
      if (initialData) {
        const foundCountry = response.find(country => country.name === initialData.country);
        if (foundCountry) {
          setSelectedCountry(foundCountry);
          setValue("country", foundCountry.name, {
            shouldDirty: true
          });
          loadCities(foundCountry.id).then(response => {
            const foundCity = response.find(city => city.name === initialData.city);
            if (foundCity) {
              setSelectedCity(foundCity);
              setValue("city", foundCity.name, {
                shouldDirty: true
              });
            }
          });
        }
      }
    });
  }, [initialData, reset, setValue]);
  async function loadCities(countryId) {
    try {
      setIsLoadingCities(true);
      const dataCities = await cityService.getByCountry(countryId);
      setCities(dataCities);
      return dataCities;
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    } finally {
      setIsLoadingCities(false);
    }
  }
  async function loadCountries() {
    try {
      const dataCountries = await countryService.getAll();
      setCountries(dataCountries.data);
      return dataCountries.data;
    } catch (error) {
      console.error("Error loading countries:", error);
      return [];
    }
  }
  const onSubmit = data => {
    const dataFormatted = {
      name: data.name,
      email: data.email,
      phone: data?.phone?.toString(),
      address: data.address,
      country: selectedCountry?.name || "",
      city: selectedCity?.name || ""
    };
    onHandleSubmit(dataFormatted);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error",
      style: {
        display: 'block',
        height: '20px',
        lineHeight: '20px'
      }
    }, errors[name]?.message);
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "font-medium block mb-2"
  }, "Nombre de la Sucursal *"), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido",
      maxLength: {
        value: 100,
        message: "El nombre no puede exceder 100 caracteres"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      }),
      placeholder: "Ingrese el nombre de la sucursal"
    })), getFormErrorMessage("name"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "font-medium block mb-2"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Correo electrónico inválido"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      }),
      placeholder: "ejemplo@empresa.com"
    })), getFormErrorMessage("email"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone",
    className: "font-medium block mb-2"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value ?? null,
      onChange: e => field.onChange(e.value),
      useGrouping: false,
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      placeholder: "Ingrese el n\xFAmero de tel\xE9fono"
    }), getFormErrorMessage("phone"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "country",
    className: "font-medium block mb-2"
  }, "Pa\xEDs *"), /*#__PURE__*/React.createElement(Controller, {
    name: "country",
    control: control,
    rules: {
      required: "El país es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: selectedCountry,
      onChange: async e => {
        setSelectedCountry(e.value);
        setSelectedCity(null);
        setValue("city", "", {
          shouldDirty: true
        });
        if (e.value) {
          setValue("country", e.value.name, {
            shouldDirty: true
          });
          await loadCities(e.value.id);
        } else {
          setValue("country", "", {
            shouldDirty: true
          });
          setCities([]);
        }
      },
      options: countries,
      optionLabel: "name",
      placeholder: "Seleccione Pa\xEDs",
      filter: true,
      className: classNames("w-full", {
        "p-invalid": fieldState.error && !selectedCountry
      }),
      showClear: true
    }), !selectedCountry && errors.country && /*#__PURE__*/React.createElement("small", {
      className: "p-error",
      style: {
        display: 'block',
        height: '20px',
        lineHeight: '20px'
      }
    }, errors.country.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "city",
    className: "font-medium block mb-2"
  }, "Ciudad *"), /*#__PURE__*/React.createElement(Controller, {
    name: "city",
    control: control,
    rules: {
      required: "La ciudad es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: selectedCity,
      onChange: e => {
        setSelectedCity(e.value);
        if (e.value) {
          setValue("city", e.value.name, {
            shouldDirty: true
          });
        } else {
          setValue("city", "", {
            shouldDirty: true
          });
        }
      },
      options: cities,
      optionLabel: "name",
      placeholder: "Seleccione Ciudad",
      filter: true,
      className: classNames("w-full", {
        "p-invalid": fieldState.error && !selectedCity
      }),
      loading: isLoadingCities,
      disabled: !selectedCountry,
      showClear: true
    }), !selectedCity && errors.city && /*#__PURE__*/React.createElement("small", {
      className: "p-error",
      style: {
        display: 'block',
        height: '20px',
        lineHeight: '20px'
      }
    }, errors.city.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "address",
    className: "font-medium block mb-2"
  }, "Direcci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      }),
      placeholder: "Ingrese la direcci\xF3n completa"
    })), getFormErrorMessage("address"))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4 gap-6"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-phoenix-secondary",
    onClick: onCancel,
    disabled: loading,
    type: "button",
    style: {
      padding: "0 20px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })), /*#__PURE__*/React.createElement(Button, {
    label: initialData?.isEditing ? "Actualizar" : "Guardar",
    className: "p-button-sm",
    loading: loading,
    style: {
      padding: "0 40px",
      width: "200px",
      height: "50px"
    },
    disabled: loading || !isDirty,
    type: "submit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }))))));
};