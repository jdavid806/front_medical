function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useCountries } from "../countries/hooks/useCountries.js";
import { useCities } from "../cities/hooks/useCities.js";
import { genders } from "../../services/commons.js";
import { useRoles } from "../user-roles/hooks/useUserRoles.js";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties.js";
const UserForm = ({
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
    reset
  } = useForm({
    defaultValues: initialData || {
      username: '',
      email: '',
      password: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      second_last_name: '',
      user_role_id: 0,
      user_specialty_id: 0,
      country_id: 0,
      city_id: 0,
      gender: '',
      address: '',
      phone: ''
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  useEffect(() => {
    reset(initialData || {
      username: '',
      email: '',
      password: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      second_last_name: '',
      user_role_id: 0,
      user_specialty_id: 0,
      country_id: 0,
      city_id: 0,
      gender: '',
      address: '',
      phone: ''
    });
  }, [initialData, reset]);
  const {
    countries
  } = useCountries();
  const {
    cities
  } = useCities();
  const {
    userRoles
  } = useRoles();
  const {
    userSpecialties
  } = useUserSpecialties();
  const gendersForSelect = Object.entries(genders).map(([value, label]) => ({
    value,
    label
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "first_name",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Primer nombre ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Primer nombre",
      className: classNames('w-100', {
        'p-invalid': errors.first_name
      })
    }, field)))
  }), getFormErrorMessage('first_name')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "middle_name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Segundo nombre"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Segundo nombre",
      className: "w-100"
    }, field)))
  }), getFormErrorMessage('middle_name')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "last_name",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Primer apellido ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Primer apellido",
      className: classNames('w-100', {
        'p-invalid': errors.last_name
      })
    }, field)))
  }), getFormErrorMessage('last_name')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "second_last_name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Segundo apellido"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Segundo apellido",
      className: "w-100"
    }, field)))
  }), getFormErrorMessage('second_last_name')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "country_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Pa\xEDs ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: countries,
      optionLabel: "name",
      optionValue: "name",
      placeholder: "Seleccione un pa\xEDs",
      className: classNames('w-100', {
        'p-invalid': errors.country_id
      })
    }, field)))
  }), getFormErrorMessage('country_id')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "city_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Ciudad ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: cities,
      optionLabel: "name",
      optionValue: "name",
      placeholder: "Seleccione una ciudad",
      className: classNames('w-100', {
        'p-invalid': errors.city_id
      })
    }, field)))
  }), getFormErrorMessage('city_id')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "gender",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "G\xE9nero ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: gendersForSelect,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un g\xE9nero",
      className: classNames('w-100', {
        'p-invalid': errors.gender
      })
    }, field)))
  }), getFormErrorMessage('gender')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "address",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Direcci\xF3n ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Direcci\xF3n",
      className: classNames('w-100', {
        'p-invalid': errors.address
      })
    }, field)))
  }), getFormErrorMessage('address')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tel\xE9fono ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Tel\xE9fono",
      className: classNames('w-100', {
        'p-invalid': errors.phone
      })
    }, field)))
  }), getFormErrorMessage('phone')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: 'Este campo es requerido',
      pattern: {
        value: /^\S+@\S+$/i,
        message: 'Correo inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Correo ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Correo",
      className: classNames('w-100', {
        'p-invalid': errors.email
      })
    }, field)))
  }), getFormErrorMessage('email'))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_role_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Rol ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: userRoles,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione un rol",
      className: classNames('w-100', {
        'p-invalid': errors.user_role_id
      })
    }, field)))
  }), getFormErrorMessage('user_role_id')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_specialty_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Especialidad ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: userSpecialties,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione una especialidad",
      className: classNames('w-100', {
        'p-invalid': errors.user_specialty_id
      })
    }, field)))
  }), getFormErrorMessage('user_specialty_id'))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "username",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Username ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      placeholder: "Username",
      className: classNames('w-100', {
        'p-invalid': errors.username
      })
    }, field)))
  }), getFormErrorMessage('username')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "password",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Contrase\xF1a ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      type: "password",
      placeholder: "Contrase\xF1a",
      className: classNames('w-100', {
        'p-invalid': errors.password
      })
    }, field)))
  }), getFormErrorMessage('password')))))));
};
export default UserForm;