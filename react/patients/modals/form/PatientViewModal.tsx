import React from "react";
import { Dialog } from "primereact/dialog";
import { Patient } from "../../../models/models";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { genders, maritalStatus } from "../../../../services/commons";

interface PatientViewModalProps {
  visible: boolean;
  onHide: () => void;
  patientData: Patient;
}

export const PatientViewModal: React.FC<PatientViewModalProps> = ({
  visible,
  onHide,
  patientData: patient,
}) => {
  const footer = (
    <div>
      <Button 
        label="Cerrar" 
        icon="pi pi-times" 
        onClick={onHide} 
        className="p-button-text" 
      />
    </div>
  );

  return (
    <Dialog
      header={`Información de ${patient.first_name} ${patient.last_name}`}
      visible={visible}
      style={{ width: '50vw' }}
      onHide={onHide}
      footer={footer}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
      modal
    >
      <div className="grid">
        {/* Datos Generales */}
        <div className="col-12">
          <h3 className="text-lg font-bold mb-3">
            <i className="pi pi-users mr-2"></i> Datos Generales
          </h3>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Tipo documento: <span className="font-normal">{patient.document_type}</span></p>
          <p className="font-semibold">Nombres: <span className="font-normal">{patient.first_name} {patient.middle_name}</span></p>
          <p className="font-semibold">Género: <span className="font-normal">{genders[patient.gender]}</span></p>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Número de documento: <span className="font-normal">{patient.document_number}</span></p>
          <p className="font-semibold">Apellidos: <span className="font-normal">{patient.last_name} {patient.second_last_name}</span></p>
          <p className="font-semibold">Fecha Nacimiento: <span className="font-normal">{patient.date_of_birth}</span></p>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Estado Civil: <span className="font-normal">{maritalStatus[patient.civil_status]}</span></p>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Etnia: <span className="font-normal">{patient.ethnicity}</span></p>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Whatsapp: <span className="font-normal">{patient.validated_data?.whatsapp}</span></p>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Correo: <span className="font-normal">{patient.validated_data?.email}</span></p>
        </div>

        <Divider />

        {/* Información de residencia */}
        <div className="col-12">
          <h3 className="text-lg font-bold mb-3">
            <i className="pi pi-map-marker mr-2"></i> Información de residencia
          </h3>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">País: <span className="font-normal">{patient.country_id}</span></p>
          <p className="font-semibold">Ciudad: <span className="font-normal">{patient.city_id}</span></p>
        </div>

        <div className="col-12 md:col-6">
          <p className="font-semibold">Departamento: <span className="font-normal">{patient.department_id}</span></p>
          <p className="font-semibold">Nacionalidad: <span className="font-normal">{patient.nationality}</span></p>
        </div>

        <div className="col-12">
          <p className="font-semibold">Dirección: <span className="font-normal">{patient.address}</span></p>
        </div>

        <Divider />

        {/* Acompañantes */}
        {patient.companions?.length > 0 && (
          <>
            <div className="col-12">
              <h3 className="text-lg font-bold mb-3">
                <i className="pi pi-users mr-2"></i> Acompañantes
              </h3>
            </div>

            {patient.companions.map((companion, index) => (
              <React.Fragment key={`companion-${index}`}>
                <div className="col-12 md:col-6">
                  <p className="font-semibold">Nombre: <span className="font-normal">{companion.first_name} {companion.last_name}</span></p>
                  <p className="font-semibold">Parentesco: <span className="font-normal">{companion.pivot?.relationship}</span></p>
                </div>
                <div className="col-12 md:col-6">
                  <p className="font-semibold">Whatsapp: <span className="font-normal">{companion.mobile}</span></p>
                  <p className="font-semibold">Correo: <span className="font-normal">{companion.email}</span></p>
                </div>
                {index < patient.companions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </>
        )}

        <Divider />

        {/* Seguridad Social */}
        <div className="col-12">
          <h3 className="text-lg font-bold mb-3">
            <i className="pi pi-shield mr-2"></i> Seguridad Social
          </h3>
        </div>

        <div className="col-12">
          <p className="font-semibold">Entidad Aseguradora: <span className="font-normal">{patient.social_security?.eps || 'No especificado'}</span></p>
        </div>
      </div>
    </Dialog>
  );
};