import React, { useEffect, useState } from 'react';
import { ExamTable } from './components/ExamTable';
import { ExamForm } from './components/ExamForm';
import { CustomModal } from '../components/CustomModal';
import { useExams } from './hooks/useExams';
import { ExamResultsForm } from './components/ExamResultsForm';

const ExamApp: React.FC = () => {

    const [showFormModal, setShowFormModal] = useState(false);
    const [showResultsFormModal, setShowResultsFormModal] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const { exams } = useExams(patientId)

    useEffect(() => {
        const patientId = new URLSearchParams(window.location.search).get('patient_id');
        if (patientId) {
            setPatientId(patientId);
        }
    }, []);

    const handleHideFormModal = () => {
        setShowFormModal(false);
    };

    const handleHideResultsFormModal = () => {
        setShowResultsFormModal(false);
    };

    const handleSave = (exams) => {
        console.log(exams);
        setShowFormModal(false);
    };

    const handleLoadExamResults = (examId) => {
        console.log(examId);
        setSelectedExamId(examId);
        setShowResultsFormModal(true)
    };

    return (
        <div>
            <div className="row mb-3">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-0">Exámenes</h2>
                        </div>
                        <button className="btn btn-primary" type="button" onClick={() => setShowFormModal(true)}>
                            <i className="fa-solid fa-plus me-2"></i> Nuevo examen
                        </button>
                    </div>
                </div>
            </div>

            <ExamTable
                exams={exams}
                onLoadExamResults={handleLoadExamResults}>
            </ExamTable>
            <CustomModal
                show={showFormModal}
                onHide={handleHideFormModal}
                title='Crear Exámenes'
            >
                <ExamForm onSave={handleSave} onCancel={handleHideFormModal}></ExamForm>
            </CustomModal>
            <CustomModal
                show={showResultsFormModal}
                onHide={handleHideResultsFormModal}
                title='Cargar Resultados'
            >
                <ExamResultsForm examId={selectedExamId} />
            </CustomModal>
        </div>

    );
};

export default ExamApp;

