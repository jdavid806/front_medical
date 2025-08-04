import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { genders, maritalStatus } from "../../../../services/commons.js";
export const PatientViewModal = ({
  visible,
  onHide,
  patientData: patient
}) => {
  const footer = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: "pi pi-times",
    onClick: onHide,
    className: "p-button-text"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: `Información de ${patient.first_name} ${patient.last_name}`,
    visible: visible,
    style: {
      width: '50vw'
    },
    onHide: onHide,
    footer: footer,
    breakpoints: {
      '960px': '75vw',
      '641px': '90vw'
    },
    modal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-users mr-2"
  }), " Datos Generales")), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Tipo documento: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.document_type)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Nombres: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.first_name, " ", patient.middle_name)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "G\xE9nero: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, genders[patient.gender]))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "N\xFAmero de documento: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.document_number)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Apellidos: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.last_name, " ", patient.second_last_name)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Fecha Nacimiento: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.date_of_birth))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Estado Civil: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, maritalStatus[patient.civil_status]))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Etnia: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.ethnicity))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Whatsapp: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.validated_data?.whatsapp))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Correo: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.validated_data?.email))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-map-marker mr-2"
  }), " Informaci\xF3n de residencia")), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Pa\xEDs: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.country_id)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Ciudad: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.city_id))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Departamento: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.department_id)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Nacionalidad: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.nationality))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Direcci\xF3n: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.address))), /*#__PURE__*/React.createElement(Divider, null), patient.companions?.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-users mr-2"
  }), " Acompa\xF1antes")), patient.companions.map((companion, index) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: `companion-${index}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Nombre: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, companion.first_name, " ", companion.last_name)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Parentesco: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, companion.pivot?.relationship))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Whatsapp: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, companion.mobile)), /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Correo: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, companion.email))), index < patient.companions.length - 1 && /*#__PURE__*/React.createElement(Divider, null)))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shield mr-2"
  }), " Seguridad Social")), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold"
  }, "Entidad Aseguradora: ", /*#__PURE__*/React.createElement("span", {
    className: "font-normal"
  }, patient.social_security?.eps || 'No especificado')))));
};