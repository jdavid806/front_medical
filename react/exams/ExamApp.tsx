import React, { useEffect, useState } from 'react';
import { ExamTable } from './components/ExamTable';
import { ExamForm } from './components/ExamForm';
import { CustomModal } from '../components/CustomModal';
import { CustomFormModal } from '../components/CustomFormModal';
import { useExams } from './hooks/useExams';
import { ExamResultsForm } from './components/ExamResultsForm';
import { SwalManager } from '../../services/alertManagerImported';

const ExamApp: React.FC = () => {

    const [showFormModal, setShowFormModal] = useState(false);
    const [showResultsFormModal, setShowResultsFormModal] = useState(false);
    const [patientId, setPatientId] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
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

    const handleHideResultsFormModal = () => {
        setShowResultsFormModal(false);
    };

    const handleSave = (exams) => {
        console.log(exams);
        setShowFormModal(false);
    };

    const handleLoadExamResults = (examId: string) => {
        console.log(examId);
        setSelectedExamId(examId);
        setShowResultsFormModal(true)
    };

    const handleViewExamResults = async (minioId?: string) => {
        if (minioId) {
            //@ts-ignore
            const url = await getFileUrl(minioId);
            console.log('Archivo URL: ', url);

            window.open(url, '_blank');
        } else {
            SwalManager.error({ text: 'No se pudo obtener la URL del archivo' });
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
                        {/* <button className="btn btn-primary" type="button" onClick={() => setShowFormModal(true)}>
                            <i className="fa-solid fa-plus me-2"></i> Nuevo examen
                        </button> */}
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

