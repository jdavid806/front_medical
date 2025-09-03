import React, { useEffect, useState } from 'react';
import { ExamTable, ExamTableItem } from './components/ExamTable';
import { ExamForm } from './components/ExamForm';
import { CustomFormModal } from '../components/CustomFormModal';
import { useExams } from './hooks/useExams';

const ExamApp: React.FC = () => {

    const [showFormModal, setShowFormModal] = useState(false);
    const [patientId, setPatientId] = useState('');
    const { exams, fetchExams } = useExams(patientId)

    useEffect(() => {
        const patientId = new URLSearchParams(window.location.search).get('patient_id');
        if (patientId) {
            setPatientId(patientId);
        }
    }, []);

    const handleHideFormModal = () => {
        setShowFormModal(false);
    };

    const handleLoadExamResults = (examTableItem: ExamTableItem) => {
        window.location.href = `cargarResultadosExamen?patient_id=${examTableItem.patientId}&exam_id=${examTableItem.id}&appointment_id=${examTableItem.appointmentId}`;
    };

    let sum = 0;

    const handleViewExamResults = async (examTableItem: ExamTableItem, minioUrl?: string) => {
        if (minioUrl) {
            //@ts-ignore
            const url = await getUrlImage(minioUrl);
            window.open(url, '_blank');
        } else {
            window.location.href = `verResultadosExamen?patient_id=${examTableItem.patientId}&exam_id=${examTableItem.id}`;
        }
    };

    const handleReload = () => {
        fetchExams(patientId);
    }

    return (
        <div>
            <div className="row mb-3">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-0">Exámenes</h2>
                        </div>
                    </div>
                </div>
            </div>

            <ExamTable
                exams={exams}
                onLoadExamResults={handleLoadExamResults}
                onViewExamResults={handleViewExamResults}
                onReload={handleReload}
            >
            </ExamTable>
            <CustomFormModal
                formId={'createExam'}
                show={showFormModal}
                onHide={handleHideFormModal}
                title='Crear Exámenes'
            >
                <ExamForm></ExamForm>
            </CustomFormModal>
        </div>

    );
};

export default ExamApp;

