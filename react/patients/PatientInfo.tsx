import React from 'react';
import { Patient } from '../models/models';

interface PatientInfoProps {
    patient: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
    console.log(patient);

    return (
        <>
            <h3 className="fw-bold mb-3"><i className="fa-solid fa-users fa-lg"></i> Datos Generales</h3>
            <div className="row">
                <div className="col-md-6">
                    <p><span className="fw-bold">Tipo documento:</span> {patient.document_type}</p>
                    <p><span className="fw-bold">Nombres:</span> {patient.first_name} {patient.middle_name}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Número de documento:</span> {patient.document_number}</p>
                    <p><span className="fw-bold">Apellidos:</span> {patient.last_name} {patient.second_last_name}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Genero:</span> {patient.gender}</p>
                    <p><span className="fw-bold">Fecha Nacimiento:</span> {patient.date_of_birth}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Whatsapp:</span> {patient.whatsapp}</p>
                    <p><span className="fw-bold">Correo:</span> {patient.email}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Estado Civil:</span> {patient.civil_status}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Etnia:</span> {patient.ethnicity}</p>
                </div>
            </div>

            <hr className="my-4"></hr>

            <h3 className="fw-bold mb-3"><i className="fa-solid fa-map-marker-alt fa-lg"></i> Información de residencia</h3>
            <div className="row">
                <div className="col-md-6">
                    <p><span className="fw-bold">Pais:</span> {patient.country_id}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Departamento o provincia:</span> {patient.department_id}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Ciudad:</span> {patient.city_id}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Dirección:</span> {patient.address}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Nacionalidad:</span> {patient.nationality}</p>
                </div>
            </div>

            <hr className="my-4"></hr>

            <h3 className="fw-bold mb-3"><i className="fa-solid fa-handshake fa-lg"></i> Acompañantes</h3>
            {patient.companions.map(({ first_name, last_name, mobile, email, pivot }) => (
                <div className="row" key={`${first_name}-${last_name}`}>
                    <div className="col-md-6 mb-4">
                        <p><span className="fw-bold">Nombre:</span> {first_name} {last_name}</p>
                        <p><span className="fw-bold">Parentesco:</span> {pivot.relationship}</p>
                    </div>
                    <div className="col-md-6 mb-4">
                        <p><span className="fw-bold">Whatsapp:</span> {mobile}</p>
                        <p><span className="fw-bold">Correo:</span> {email}</p>
                    </div>
                </div>
            ))}

            <hr className="my-4"></hr>

            <h3 className="fw-bold mb-3"><i className="fa-solid fa-book-medical fa-lg"></i> Seguridad Social y Afiliación</h3>
            <div className="row">
                <div className="col-md-6">
                    <p><span className="fw-bold">Tipo de regimen:</span> {patient.social_security.type_scheme}</p>
                    <p><span className="fw-bold">Categoria:</span> {patient.social_security.category}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Tipo de afiliado:</span> {patient.social_security.affiliate_type}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Entidad prestadora de salud (EPS):</span> {patient.social_security.eps}</p>
                    <p><span className="fw-bold">Administradora de riesgos laborales (ARL):</span> {patient.social_security.arl}</p>
                </div>
                <div className="col-md-6">
                    <p><span className="fw-bold">Administradora de fondos de pensiones (AFP):</span> {patient.social_security.afp}</p>
                    <p><span className="fw-bold">Sucursal:</span> Medellin</p>
                </div>
            </div>
        </>
    );
};
