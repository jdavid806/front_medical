import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useSpecializables } from '../specializables/hooks/useSpecializables';
import { useEffect } from 'react';
import { PatientClinicalRecordDto } from '../models/models';
import { useState } from 'react';
import { useClinicalRecordTypes } from '../clinical-record-types/hooks/useClinicalRecordTypes';
import { useClinicalRecords } from './hooks/useClinicalRecords';
import { PatientClinicalRecordsTable } from './components/PatientClinicalRecordsTable';
import UserManager from '../../services/userManager';

interface PatientClinicalRecordHistoryProps {
}

const specialtyId = new URLSearchParams(window.location.search).get('especialidad');
const patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || '';

export const PatientClinicalRecordHistory: React.FC<PatientClinicalRecordHistoryProps> = () => {

    const { specializables } = useSpecializables();
    const { clinicalRecordTypes } = useClinicalRecordTypes();
    const { clinicalRecords } = useClinicalRecords(patientId);
    const [tableClinicalRecords, setTableClinicalRecords] = useState<PatientClinicalRecordDto[]>([]);

    useEffect(() => {
        if (specializables && clinicalRecordTypes) {
            const specialtyClinicalRecordIds = specializables
                .filter(record => record.specialty_id === specialtyId && ['Historia Clínica', 'clinical_record'].includes(record.specializable_type)).map(record => record.specializable_id.toString());

            setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString())));
        }
    }, [specializables, clinicalRecordTypes, clinicalRecords]);

    useEffect(() => {
        if (specializables) {
            UserManager.onAuthChange((isAuthenticated, user, permissions, menus, role) => {
                if (role) {
                    const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && record.specializable_type === 'Historia Clínica').map(record => record.specializable_id.toString());

                    setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString()) || role.group == 'ADMIN'));
                }
            })
        }
    }, [specializables, clinicalRecords]);

    const printClinicalRecord = (id: string, title: string) => {
        //@ts-ignore
        crearDocumento(id, "Impresion", "Consulta", "Completa", title);
    };

    const downloadClinicalRecord = (id: string, title: string) => {
        //@ts-ignore
        crearDocumento(id, "Descarga", "Consulta", "Completa", title);
    };

    const shareClinicalRecord = (id: string, type: string, title: string, patient_id: string) => {
        console.log(id, type, title, patient_id);

        switch (type) {
            case 'whatsapp':
                //@ts-ignore
                enviarDocumento(id, "Descarga", "Consulta", "Completa", patient_id, UserManager.getUser().id, title)
                break;

            default:
                break;
        };
    };

    const seeDetail = (id: string, clinicalRecordType: string) => {
        window.location.href = `detalleConsulta?clinicalRecordId=${id}&patient_id=${patientId}&tipo_historia=${clinicalRecordType}&especialidad=${specialtyId}`;
    };

    const nombreEspecialidad = new URLSearchParams(window.location.search).get('especialidad');

    return (
        <PrimeReactProvider>
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-0">Historias Clínicas - {nombreEspecialidad}</h2>
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