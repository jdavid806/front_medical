import React, { useState } from 'react';
import { ExamTableItem } from './components/ExamTable';
import { ExamForm } from './components/ExamForm';
import { CustomFormModal } from '../components/CustomFormModal';
import { useExamsGeneral } from './hooks/useExamsGeneral';
import { ExamGeneralTable } from './components/ExamGeneralTable';

const ExamGeneralApp: React.FC = () => {

    const [showFormModal, setShowFormModal] = useState(false);
    const { exams, fetchExams } = useExamsGeneral()

    const handleHideFormModal = () => {
        setShowFormModal(false);
    };

    const handleLoadExamResults = (examTableItem: ExamTableItem) => {
        window.location.href = `cargarResultadosExamen?patient_id=${examTableItem.patientId}&exam_id=${examTableItem.id}&appointment_id=${examTableItem.appointmentId}`;
    };

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
        fetchExams();
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

            <ExamGeneralTable
                exams={exams}
                onLoadExamResults={handleLoadExamResults}
                onViewExamResults={handleViewExamResults}
                onReload={handleReload}
            >
            </ExamGeneralTable>
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

export default ExamGeneralApp;

