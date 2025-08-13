import React from "react";
export const getColumns = ({
  editDisability,
  deleteDisability
}) => [{
  field: "patient.document_type",
  header: "Tipo de documento"
}, {
  field: "patient.document_number",
  header: "Número de documento"
}, {
  field: "patient.first_name",
  header: "Nombre"
}, {
  field: "patient.middle_name",
  header: "Apellido"
}, {
  field: "patient.last_name",
  header: "Segundo apellido"
}, {
  field: "patient.gender",
  header: "Género"
}, {
  field: "patient.date_of_birth",
  header: "Fecha de nacimiento"
}, {
  field: "patient.address",
  header: "Dirección"
}, {
  field: "patient.nationality",
  header: "Nacionalidad"
}, {
  field: "created_at",
  header: "Fecha de creación"
}, {
  field: "updated_at",
  header: "Fecha de actualización"
}, {
  field: "patient.country_id",
  header: "País"
}, {
  field: "patient.department_id",
  header: "Departamento"
}, {
  field: "patient.city_id",
  header: "Ciudad"
}, {
  field: "patient.whatsapp",
  header: "Whatsapp"
}, {
  field: "user.email",
  header: "Email"
}, {
  field: "",
  header: "",
  body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-link",
    onClick: () => editDisability(rowData.id.toString())
  }, /*#__PURE__*/React.createElement("i", {
    className: "fs-7 fa-solid fa-eye cursor-pointer",
    title: "Editar"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-link",
    onClick: () => deleteDisability(rowData.id.toString())
  }, /*#__PURE__*/React.createElement("i", {
    className: "fs-7 fa-solid fa-file-signature cursor-pointer",
    title: "Eliminar"
  })))
}];