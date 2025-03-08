import React from 'react';
export const PatientInfo = ({
  patient
}) => {
  console.log(patient);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users fa-lg"
  }), " Datos Generales"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Tipo documento:"), " ", patient.document_type), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Nombres:"), " ", patient.first_name, " ", patient.middle_name)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "N\xFAmero de documento:"), " ", patient.document_number), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Apellidos:"), " ", patient.last_name, " ", patient.second_last_name)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Genero:"), " ", patient.gender), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Fecha Nacimiento:"), " ", patient.date_of_birth)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Whatsapp:"), " ", patient.whatsapp), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Correo:"), " ", patient.email)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Estado Civil:"), " ", patient.civil_status)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Etnia:"), " ", patient.ethnicity))), /*#__PURE__*/React.createElement("hr", {
    className: "my-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-map-marker-alt fa-lg"
  }), " Informaci\xF3n de residencia"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Pais:"), " ", patient.country.name)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Departamento o provincia:"), " ", patient.department_id)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Ciudad:"), " ", patient.city.name)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Direcci\xF3n:"), " ", patient.address)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Nacionalidad:"), " ", patient.nationality))), /*#__PURE__*/React.createElement("hr", {
    className: "my-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-handshake fa-lg"
  }), " Acompa\xF1antes"), patient.companions.map(({
    first_name,
    last_name,
    mobile,
    email,
    pivot
  }) => /*#__PURE__*/React.createElement("div", {
    className: "row",
    key: `${first_name}-${last_name}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Nombre:"), " ", first_name, " ", last_name), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Parentesco:"), " ", pivot.relationship)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Whatsapp:"), " ", mobile), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Correo:"), " ", email)))), /*#__PURE__*/React.createElement("hr", {
    className: "my-4"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-book-medical fa-lg"
  }), " Seguridad Social y Afiliaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Tipo de regimen:"), " ", patient.social_security.type_scheme), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Categoria:"), " ", patient.social_security.category)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Tipo de afiliado:"), " ", patient.social_security.affiliate_type)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Entidad prestadora de salud (EPS):"), " ", patient.social_security.eps), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Administradora de riesgos laborales (ARL):"), " ", patient.social_security.arl)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Administradora de fondos de pensiones (AFP):"), " ", patient.social_security.afp), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Sucursal:"), " Medellin"))));
};