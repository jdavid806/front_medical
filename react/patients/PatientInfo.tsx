import React from "react";
import { Patient } from "../models/models";
import { useEffect } from "react";
import {
  citiesSelect,
  countriesSelect,
  departmentsSelect,
} from "../../services/selects";
import {
  cityService,
  countryService,
  departmentService,
} from "../../services/api";

interface PatientInfoProps {
  patient: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  console.log(patient);

  useEffect(() => {
    const modalElement = document.getElementById("modalCrearPaciente");
    if (!modalElement || !patient) return;

    // @ts-ignore
    const modal = new bootstrap.Modal(modalElement);
    const fillForm = async () => {
      console.log("Rellenando el formulario...", patient);

      const form = document.getElementById(
        "formNuevoPaciente"
      ) as HTMLFormElement;

      // Datos básicos
      (form.elements.namedItem("document_type") as HTMLSelectElement).value =
        patient.document_type;
      (form.elements.namedItem("document_number") as HTMLInputElement).value =
        patient.document_number;
      (form.elements.namedItem("first_name") as HTMLInputElement).value =
        patient.first_name;
      (form.elements.namedItem("middle_name") as HTMLInputElement).value =
        patient.middle_name || "";
      (form.elements.namedItem("last_name") as HTMLInputElement).value =
        patient.last_name;
      (form.elements.namedItem("second_last_name") as HTMLInputElement).value =
        patient.second_last_name || "";
      (form.elements.namedItem("gender") as HTMLSelectElement).value =
        patient.gender;
      (form.elements.namedItem("date_of_birth") as HTMLInputElement).value =
        patient.date_of_birth;
      (form.elements.namedItem("whatsapp") as HTMLInputElement).value =
        patient.whatsapp;
      (form.elements.namedItem("email") as HTMLInputElement).value =
        patient.email || "";
      (form.elements.namedItem("civil_status") as HTMLSelectElement).value =
        patient.civil_status;
      (form.elements.namedItem("ethnicity") as HTMLSelectElement).value =
        patient.ethnicity || "";
      (form.elements.namedItem("blood_type") as HTMLSelectElement).value =
        patient.blood_type;

      // Datos de residencia

      const countrySelect: any = document.getElementById("country_id");
      const deptSelect: any = document.getElementById("department_id");
      const citySelect: any = document.getElementById("city_id");

      const countries = await countryService.getAll();
      const countryId = countries.data.find(
        (country: any) => country.name === patient.country_id
      ).id;

      const departments = await departmentService.ofParent(countryId);
      const departmentId = departments.find(
        (department: any) => department.name === patient.department_id
      ).id;

      await countriesSelect(
        countrySelect,
        (selectedCountry) => {
          const selectedCountryId = selectedCountry.customProperties.id;
          departmentsSelect(
            deptSelect,
            selectedCountryId,
            (selectedDepartment) => {
              citiesSelect(
                citySelect,
                selectedDepartment.customProperties.id,
                () => {}
              );
            }
          );
        },
        patient.country_id
      );

      await departmentsSelect(
        deptSelect,
        countryId,
        (selectedDepartment) => {
          citiesSelect(
            citySelect,
            selectedDepartment.customProperties.id,
            () => {}
          );
        },
        patient.department_id
      );

      await citiesSelect(citySelect, departmentId, () => {}, patient.city_id);

      (form.elements.namedItem("address") as HTMLInputElement).value =
        patient.address;
      (form.elements.namedItem("nationality") as HTMLSelectElement).value =
        patient.nationality;

      if (patient.social_security) {
        (form.elements.namedItem("eps") as HTMLSelectElement).value =
          patient.social_security.entity_id?.toString() || "";
        (form.elements.namedItem("arl") as HTMLSelectElement).value =
          patient.social_security.arl || "";
        (form.elements.namedItem("afp") as HTMLSelectElement).value =
          patient.social_security.afp || "";
      }
    };

    modalElement.addEventListener("show.bs.modal", fillForm);
    return () => {
      modalElement.removeEventListener("show.bs.modal", fillForm);
      modal.dispose();

      // Destruir instancias de Choices y limpiar listeners
      const cleanSelect = (id) => {
        const element: any = document.getElementById(id);
        if (element?.choicesInstance) {
          element.choicesInstance.destroy();
          delete element.choicesInstance;
        }
        if (element) {
          element.removeEventListener("change", element.handleChange);
        }
      };

      cleanSelect("country_id");
      cleanSelect("department_id");
      cleanSelect("city_id");
    };
  }, [patient]);

  return (
    <>
      <div className="d-flex gap-3 justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">
          <i className="fa-solid fa-users fa-lg"></i> Datos Generales
        </h3>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalCrearPaciente"
        >
          <i className="fa-solid fa-pen-to-square me-2"></i> Editar
        </button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Tipo documento:</span>{" "}
            {patient.document_type}
          </p>
          <p>
            <span className="fw-bold">Nombres:</span> {patient.first_name}{" "}
            {patient.middle_name}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Número de documento:</span>{" "}
            {patient.document_number}
          </p>
          <p>
            <span className="fw-bold">Apellidos:</span> {patient.last_name}{" "}
            {patient.second_last_name}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Genero:</span> {patient.gender}
          </p>
          <p>
            <span className="fw-bold">Fecha Nacimiento:</span>{" "}
            {patient.date_of_birth}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Whatsapp:</span> {patient.whatsapp}
          </p>
          <p>
            <span className="fw-bold">Correo:</span> {patient.email}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Estado Civil:</span>{" "}
            {patient.civil_status}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Etnia:</span> {patient.ethnicity}
          </p>
        </div>
      </div>

      <hr className="my-4"></hr>

      <h3 className="fw-bold mb-3">
        <i className="fa-solid fa-map-marker-alt fa-lg"></i> Información de
        residencia
      </h3>
      <div className="row">
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Pais:</span> {patient.country_id}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Departamento o provincia:</span>{" "}
            {patient.department_id}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Ciudad:</span> {patient.city_id}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Dirección:</span> {patient.address}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Nacionalidad:</span> {patient.nationality}
          </p>
        </div>
      </div>

      <hr className="my-4"></hr>

      <h3 className="fw-bold mb-3">
        <i className="fa-solid fa-handshake fa-lg"></i> Acompañantes
      </h3>
      {patient.companions.map(
        ({ first_name, last_name, mobile, email, pivot }) => (
          <div className="row" key={`${first_name}-${last_name}`}>
            <div className="col-md-6 mb-4">
              <p>
                <span className="fw-bold">Nombre:</span> {first_name}{" "}
                {last_name}
              </p>
              <p>
                <span className="fw-bold">Parentesco:</span>{" "}
                {pivot.relationship}
              </p>
            </div>
            <div className="col-md-6 mb-4">
              <p>
                <span className="fw-bold">Whatsapp:</span> {mobile}
              </p>
              <p>
                <span className="fw-bold">Correo:</span> {email}
              </p>
            </div>
          </div>
        )
      )}

      <hr className="my-4"></hr>

      <h3 className="fw-bold mb-3">
        <i className="fa-solid fa-book-medical fa-lg"></i> Seguridad Social y
        Afiliación
      </h3>
      <div className="row">
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Tipo de regimen:</span>{" "}
            {patient.social_security.type_scheme}
          </p>
          <p>
            <span className="fw-bold">Categoria:</span>{" "}
            {patient.social_security.category}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Tipo de afiliado:</span>{" "}
            {patient.social_security.affiliate_type}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Entidad prestadora de salud (EPS):</span>{" "}
            {patient.social_security.eps}
          </p>
          <p>
            <span className="fw-bold">
              Administradora de riesgos laborales (ARL):
            </span>{" "}
            {patient.social_security.arl}
          </p>
        </div>
        <div className="col-md-6">
          <p>
            <span className="fw-bold">
              Administradora de fondos de pensiones (AFP):
            </span>{" "}
            {patient.social_security.afp}
          </p>
          <p>
            <span className="fw-bold">Sucursal:</span> Medellin
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <p>
            <span className="fw-bold">Aseguradora</span>{" "}
            {patient.social_security["entity"].name || "No tiene aseguradora"}
          </p>
        </div>
      </div>
    </>
  );
};
