import React from 'react';
import { useEffect } from 'react';
import { citiesSelect, countriesSelect, departmentsSelect } from "../../services/selects.js";
import { countryService, departmentService } from "../../services/api/index.js";
import { genders, maritalStatus } from "../../services/commons.js";
export const PatientInfo = ({
  patient
}) => {
  useEffect(() => {
    const modalElement = document.getElementById('modalCrearPaciente');
    if (!modalElement || !patient) return;

    // @ts-ignore
    const modal = new bootstrap.Modal(modalElement);
    const fillForm = async () => {
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
      const nationalitySelect = document.getElementById('nationality');
      const countries = await countryService.getAll();
      const countryId = countries.data.find(country => country.name === patient.country_id).id;
      const departments = await departmentService.getByCountry(countryId);
      const departmentId = departments.find(department => department.name === patient.department_id).id;
      await countriesSelect(countrySelect, selectedCountry => {
        const selectedCountryId = selectedCountry.customProperties.id;
        departmentsSelect(deptSelect, selectedCountryId, selectedDepartment => {
          citiesSelect(citySelect, selectedDepartment.customProperties.id, () => {});
        });
      }, patient.country_id);
      await departmentsSelect(deptSelect, countryId, selectedDepartment => {
        citiesSelect(citySelect, selectedDepartment.customProperties.id, () => {});
      }, patient.department_id);
      await citiesSelect(citySelect, departmentId, () => {}, patient.city_id);
      await countriesSelect(nationalitySelect, () => {}, patient.nationality);
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

      // Destruir instancias de Choices y limpiar listeners
      const cleanSelect = id => {
        const element = document.getElementById(id);
        if (element?.choicesInstance) {
          element.choicesInstance.destroy();
          delete element.choicesInstance;
        }
        if (element) {
          element.removeEventListener('change', element.handleChange);
        }
      };
      cleanSelect('country_id');
      cleanSelect('department_id');
      cleanSelect('city_id');
      cleanSelect('nationality');
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
  }, "Genero:"), " ", genders[patient.gender]), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Fecha Nacimiento:"), " ", patient.date_of_birth)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Whatsapp:"), " ", patient.validated_data.whatsapp), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Correo:"), " ", patient.validated_data.email)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Estado Civil:"), " ", maritalStatus[patient.civil_status])), /*#__PURE__*/React.createElement("div", {
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
  }), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Entidad Aseguradora (ARS):"), " ", patient.social_security.eps)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  })));
};