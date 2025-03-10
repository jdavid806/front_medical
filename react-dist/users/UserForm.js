import React, { useState } from 'react';
import { CustomSelectContainer } from "../components/CustomSelectContainer.js";
import { userFormCountriesSelect } from "../countries/consts/countryConsts.js";
import { userFormSpecialtiesSelect } from "../user-specialties/consts/userSpecialtiesConsts.js";
import { userFormCitiesSelect } from "../cities/consts/cityConsts.js";
import { userFormGendersSelect } from "../consts/genderConsts.js";
import { userFormRolesSelect } from "../user-roles/consts/userRolesConsts.js";
import { InputText } from 'primereact/inputtext';
const UserForm = ({
  formId,
  handleSubmit
}) => {
  const [user, setUser] = useState({});
  const handleCountriesChange = countries => {
    setUser({
      ...user,
      country_id: countries[0]
    });
  };
  const handleCitiesChange = cities => {
    setUser({
      ...user,
      city_id: cities[0]
    });
  };
  const handleSpecialtyChange = specialties => {
    setUser({
      ...user,
      user_specialty_id: +specialties[0]
    });
  };
  const handleRoleChange = roles => {
    setUser({
      ...user,
      user_role_id: +roles[0]
    });
  };
  const handleGenderChange = genders => {
    setUser({
      ...user,
      gender: genders[0]
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement(InputText, {
    id: "username",
    name: "username",
    placeholder: "Nombre",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Apellido ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement(InputText, {
    id: "lastName",
    name: "last_name",
    placeholder: "Apellido",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(CustomSelectContainer, {
    config: userFormCountriesSelect,
    onChange: handleCountriesChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(CustomSelectContainer, {
    config: userFormCitiesSelect,
    onChange: handleCitiesChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Lugar o direcci\xF3n de atenci\xF3n ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "text",
    id: "direccionAtencion",
    name: "address",
    placeholder: "Lugar o direcci\xF3n de atenci\xF3n",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(CustomSelectContainer, {
    config: userFormGendersSelect,
    onChange: handleGenderChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de Contacto ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "text",
    id: "numeroContacto",
    name: "phone",
    placeholder: "N\xFAmero de Contacto",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Correo ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "email",
    id: "correoContacto",
    name: "email",
    placeholder: "Correo",
    required: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 mb-1"
  }, /*#__PURE__*/React.createElement(CustomSelectContainer, {
    config: userFormRolesSelect,
    onChange: handleRoleChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: user.user_role_id === 3 ? 'd-block' : 'd-none'
  }, /*#__PURE__*/React.createElement(CustomSelectContainer, {
    config: userFormSpecialtiesSelect,
    onChange: handleSpecialtyChange
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Username ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "text",
    required: true,
    id: "username",
    name: "username",
    placeholder: "Username"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Contrase\xF1a ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "password",
    required: true,
    id: "password",
    name: "password",
    placeholder: "Contrase\xF1a"
  })))))));
};
export default UserForm;