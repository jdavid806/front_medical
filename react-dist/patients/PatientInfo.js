import React from 'react';
import { useEffect } from 'react';
import { citiesSelect, countriesSelect, departmentsSelect } from "../../services/selects.js";
import { countryService, departmentService } from "../../services/api/index.js";
export const PatientInfo = ({
  patient
}) => {
  console.log(patient);
  useEffect(() => {
    const modalElement = document.getElementById('modalCrearPaciente');
    if (!modalElement || !patient) return;

    // @ts-ignore
    const modal = new bootstrap.Modal(modalElement);
    const fillForm = async () => {
      console.log("Rellenando el formulario...", patient);
      const form = document.getElementById('formNuevoPaciente');

      // Datos básicos
      form.elements.namedItem('document_type').value = patient.document_type;
      form.elements.namedItem('document_number').value = patient.document_number;
      form.elements.namedItem('first_name').value = patient.first_name;
      form.elements.namedItem('middle_name').value = patient.middle_name || '';
      form.elements.namedItem('last_name').value = patient.last_name;
      form.elements.namedItem('second_last_name').value = patient.second_last_name || '';
      form.elements.namedItem('gender').value = patient.gender;
      form.elements.namedItem('date_of_birth').value = patient.date_of_birth;
      form.elements.namedItem('whatsapp').value = patient.whatsapp;
      form.elements.namedItem('email').value = patient.email || '';
      form.elements.namedItem('civil_status').value = patient.civil_status;
      form.elements.namedItem('ethnicity').value = patient.ethnicity || '';
      form.elements.namedItem('blood_type').value = patient.blood_type;

      // Datos de residencia

      const countrySelect = document.getElementById('country_id');
      const deptSelect = document.getElementById('department_id');
      const citySelect = document.getElementById('city_id');
      const countries = await countryService.getAll();
      const countryId = countries.data.find(country => country.name === patient.country_id).id;
      const departments = await departmentService.ofParent(countryId);
      const departmentId = departments.find(department => department.name === patient.department_id).id;
      await countriesSelect(countrySelect, async () => {
        await departmentsSelect(deptSelect, countryId, async () => {
          await citiesSelect(citySelect, departmentId, () => {}, patient.city_id);
        }, patient.department_id);
      }, patient.country_id);
      form.elements.namedItem('address').value = patient.address;
      form.elements.namedItem('nationality').value = patient.nationality;
      if (patient.social_security) {
        form.elements.namedItem('eps').value = patient.social_security.entity_id?.toString() || '';
        form.elements.namedItem('arl').value = patient.social_security.arl || '';
        form.elements.namedItem('afp').value = patient.social_security.afp || '';
      }
    };
    modalElement.addEventListener('show.bs.modal', fillForm);
    return () => {
      modalElement.removeEventListener('show.bs.modal', fillForm);
      modal.dispose();
    };
  }, [patient]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3 justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "fw-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users fa-lg"
  }), " Datos Generales"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalCrearPaciente"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pen-to-square me-2"
  }), " Editar")), /*#__PURE__*/React.createElement("div", {
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
  }, "Pais:"), " ", patient.country_id)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Departamento o provincia:"), " ", patient.department_id)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Ciudad:"), " ", patient.city_id)), /*#__PURE__*/React.createElement("div", {
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