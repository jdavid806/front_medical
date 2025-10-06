function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { useEffect } from "react";
import { cityService, countryService } from "../../../../../services/api/index.js";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
export const BranchForm = ({
  onHandleSubmit,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
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
          loadCities(foundCountry.id).then(response => {
            const foundCity = response.find(city => city.name === initialData.city);
            if (foundCity) {
              setSelectedCity(foundCity);
            }
          });
        }
      }
    });
  }, [initialData, reset]);
  async function loadCities(countryId) {
    const dataCities = await cityService.getByCountry(countryId);
    setCities(dataCities);
    return dataCities;
  }
  async function loadCountries() {
    const dataCountries = await countryService.getAll();
    setCountries(dataCountries.data);
    return dataCountries.data;
  }
  const onSubmit = data => {
    const dataFormatted = {
      name: data.name,
      email: data.email,
      phone: data?.phone?.toString(),
      address: data.address,
      country: selectedCountry.name,
      city: selectedCity.name
    };
    onHandleSubmit(dataFormatted);
  };
  const getFormErrorMessage = name => {
    return errors[name] ? /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message) : /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "\xA0");
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "block mb-2"
  }, "Nombre *"), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "block mb-2"
  }, "Correo"), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("email")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone",
    className: "block mb-2"
  }, "Telefono"), /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, _extends({
      id: field.name
    }, field, {
      value: field.value ?? null,
      onChange: e => field.onChange(e.value),
      useGrouping: false,
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("phone"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "address",
    className: "block mb-2"
  }, "Direcci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("address")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "country",
    className: "block mb-2"
  }, "Pa\xEDs"), /*#__PURE__*/React.createElement(Controller, {
    name: "country",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      value: selectedCountry,
      onChange: async e => {
        setSelectedCountry(e.value);
        await loadCities(e.value.id);
      },
      options: countries,
      optionLabel: "name",
      placeholder: "Seleccione Pa\xEDs",
      filter: true,
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("country")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "city",
    className: "block mb-2"
  }, "Ciudad"), /*#__PURE__*/React.createElement(Controller, {
    name: "city",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name
    }, field, {
      value: selectedCity,
      onChange: e => {
        setSelectedCity(e.value);
      },
      options: cities,
      optionLabel: "name",
      placeholder: "Seleccione Ciudad",
      filter: true,
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("city")))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    type: "button",
    className: "p-button-text w-30",
    onClick: () => reset()
  }), /*#__PURE__*/React.createElement(Button, {
    label: initialData?.isEditing ? "Actualizar" : "Guardar",
    icon: "pi pi-check",
    type: "submit",
    className: "w-30 ml-2"
  })))));
};