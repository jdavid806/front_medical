import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { useSpecializables } from "../specializables/hooks/useSpecializables";
import { useEffect } from "react";
import {
  ClinicalRecordTypeDto,
  PatientClinicalRecordDto,
} from "../models/models";
import { useState } from "react";
import { useClinicalRecordTypes } from "../clinical-record-types/hooks/useClinicalRecordTypes";
import { useClinicalRecords } from "./hooks/useClinicalRecords";
import { PatientClinicalRecordsTable } from "./components/PatientClinicalRecordsTable";
import UserManager from "../../services/userManager";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF";
import { SeePatientInfoButton } from "../patients/SeePatientInfoButton";

interface PatientClinicalRecordAppProps { }

const specialtyId = new URLSearchParams(window.location.search).get(
  "especialidad"
);
const patientId =
  new URLSearchParams(window.location.search).get("patient_id") ||
  new URLSearchParams(window.location.search).get("id") ||
  "";
const appointmentId =
  new URLSearchParams(window.location.search).get("appointment_id") || "";

export const PatientClinicalRecordApp: React.FC<
  PatientClinicalRecordAppProps
> = () => {
  const { specializables } = useSpecializables();
  const { clinicalRecordTypes } = useClinicalRecordTypes();
  const { clinicalRecords } = useClinicalRecords(patientId);
  const [tableClinicalRecords, setTableClinicalRecords] = useState<
    PatientClinicalRecordDto[]
  >([]);
  const [specialtyClinicalRecords, setSpecialtyClinicalRecords] = useState<
    ClinicalRecordTypeDto[]
  >([]);

  useEffect(() => {
    if (specializables && clinicalRecordTypes) {

      const specialtyClinicalRecordIds = specializables
        .filter(
          (record) =>
            record.specialty_id === specialtyId &&
            ["Historia Clínica", "clinical_record"].includes(
              record.specializable_type
            )
        )
        .map((record) => record.specializable_id.toString());

      const filteredClinicalRecords = clinicalRecordTypes.filter((record) =>
        specialtyClinicalRecordIds.includes(record.id.toString())
      );

      console.log('specialtyClinicalRecordIds', specialtyClinicalRecordIds);
      console.log('clinicalRecords', clinicalRecords);
      console.log('filteredClinicalRecords', filteredClinicalRecords);
      console.log('tableClinicalRecords', clinicalRecords.filter((record) =>
        specialtyClinicalRecordIds.includes(
          record.clinical_record_type_id.toString()
        )
      ));



      setSpecialtyClinicalRecords(filteredClinicalRecords);
      setTableClinicalRecords(
        clinicalRecords.filter((record) =>
          specialtyClinicalRecordIds.includes(
            record.clinical_record_type_id.toString()
          )
        )
      );
    }
  }, [specializables, clinicalRecordTypes, clinicalRecords]);

  useEffect(() => {

    if (specializables) {
      const specialtyClinicalRecordIds = specializables
        .filter(
          (record) =>
            record.specialty_id === specialtyId &&
            record.specializable_type === "Historia Clínica"
        )
        .map((record) => record.specializable_id.toString());

      setTableClinicalRecords(
        clinicalRecords.filter((record) =>
          specialtyClinicalRecordIds.includes(
            record.clinical_record_type_id.toString()
          )
        )
      );
    }
  }, [specializables, clinicalRecords]);

  const printClinicalRecord = (id: string, title: string) => {
    //@ts-ignore
    generarFormato("Consulta", id, "Impresion");
    // crearDocumento(id, "Impresion", "Consulta", "Completa", title);
  };

  const downloadClinicalRecord = (id: string, title: string) => {
    //@ts-ignore
    generarFormato("Consulta", id, "Descarga");
    // crearDocumento(id, "Descarga", "Consulta", "Completa", title);
  };

  const shareClinicalRecord = (
    id: string,
    type: string,
    title: string,
    patient_id: string
  ) => {
    switch (type) {
      case "whatsapp":
        //@ts-ignore
        enviarDocumento(
          id,
          "Descarga",
          "Consulta",
          "Completa",
          patient_id,
          UserManager.getUser().id,
          title
        );
        break;

      default:
        break;
    }
  };

  const seeDetail = (id: string, clinicalRecordType: string) => {
    window.location.href = `detalleConsulta?clinicalRecordId=${id}&patient_id=${patientId}&tipo_historia=${clinicalRecordType}&especialidad=${specialtyId}`;
  };

  const nombreEspecialidad = new URLSearchParams(window.location.search).get(
    "especialidad"
  );

  return (
    <PrimeReactProvider>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">
                Historias Clínicas - {nombreEspecialidad}
              </h2>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-end">
              <SeePatientInfoButton patientId={patientId} />

              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Crear Historia Clínica
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {specialtyClinicalRecords.map((record) => (
                    <li key={record.id}>
                      <a
                        className="dropdown-item"
                        href={`consultas?patient_id=${patientId}&especialidad=${specialtyId}&tipo_historia=${record.key_}&appointment_id=${appointmentId}`}
                      >
                        Crear {record.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <PatientClinicalRecordsTable
          records={tableClinicalRecords}
          onSeeDetail={seeDetail}
          onPrintItem={printClinicalRecord}
          onDownloadItem={downloadClinicalRecord}
          onShareItem={shareClinicalRecord}
        />
      </div>
    </PrimeReactProvider>
  );
};
