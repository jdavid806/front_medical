import React, { useState, useEffect } from 'react';
import { useExamTypes } from '../../exams-config/hooks/useExamTypes';
import { ExamTypeDto } from '../../models/models';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ExamTypeInputs } from '../../exams-config/components/ExamConfigForm';
import { useExamTypeCreate } from '../../exams-config/hooks/useExamTypeCreate';
import { ClinicalHistoryExamConfigForm } from '../../exams-config/components/ClinicalHistoryExamConfigForm';


interface ExamFormProps {
    initialSelectedExamTypes?: string[];
}

export const ExamForm = forwardRef(({ initialSelectedExamTypes }: ExamFormProps, ref) => {
    const [selectedExamType, setSelectedExamType] = useState('');
    const [selectedExamTypes, setSelectedExamTypes] = useState<ExamTypeDto[]>([]);

    const [showExamForm, setShowExamForm] = useState(false);

    const { createExamType } = useExamTypeCreate();
    const { examTypes, fetchExamTypes, loading } = useExamTypes()

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return selectedExamTypes
        },
        resetForm: () => {
            setSelectedExamTypes([])
            setSelectedExamType('')
            setShowExamForm(false)
        }
    }));

    useEffect(() => {
        if (initialSelectedExamTypes && examTypes.length > 0) {
            setSelectedExamTypes(
                initialSelectedExamTypes.map(id => examTypes.find(exam => exam.id == id)).filter(exam => exam !== undefined)
            );
        }
    }, [initialSelectedExamTypes, examTypes]);

    const handleAddExam = () => {
        if (!selectedExamType) {
            alert('Por favor, seleccione un examen');
            return;
        }

        const selectedExamObject = examTypes.find(exam => exam.id == selectedExamType);

        if (selectedExamObject) {
            addExam(selectedExamObject);
        }

        setSelectedExamType('');
    };

    const addExam = (newExam: ExamTypeDto) => {
        setSelectedExamTypes([...selectedExamTypes, newExam]);
    }

    const handleRemoveExam = (index) => {
        const newExams = selectedExamTypes.filter((_, i) => i !== index);
        setSelectedExamTypes(newExams);
    };

    const toggleExamForm = () => {
        setShowExamForm(!showExamForm);
    };

    const handleSubmit = async (data: ExamTypeInputs) => {
        try {
            const newExam = await createExamType(data)
            if (newExam) {
                addExam(newExam)
            }
            fetchExamTypes()
            setShowExamForm(false)
        } catch (error) {
            console.error("Error al crear el examen:", error);
        }
    };

    return (
        <>
            <div>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-3">
                            {showExamForm && (
                                <>
                                    <h5 className="card-title">Crear exámen</h5>
                                    <ClinicalHistoryExamConfigForm onHandleSubmit={handleSubmit} formId='createExamType' />
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-secondary" onClick={toggleExamForm}>
                                            <i className="fa-solid fa-xmark"></i> Cancelar
                                        </button>
                                        <button className="btn btn-primary ms-2" form='createExamType'>
                                            <i className="fa-solid fa-check"></i> Guardar
                                        </button>
                                    </div>
                                </>
                            )}
                            {!showExamForm && (
                                <>
                                    <h5 className="card-title">Seleccionar exámen</h5>
                                    <div className="col-12">
                                        <div className="d-flex gap-2">
                                            <div className="flex-grow-1">
                                                <label id='exam_type_id' className="form-label">Exámenes</label>
                                                <Dropdown
                                                    inputId={"exam_type_id"}
                                                    options={examTypes}
                                                    loading={loading}
                                                    optionLabel='name'
                                                    optionValue='id'
                                                    filter
                                                    placeholder="Seleccione un examen"
                                                    className={'w-100'}
                                                    value={selectedExamType}
                                                    onChange={(e) => setSelectedExamType(e.target.value)}
                                                    appendTo={'self'}
                                                >
                                                </Dropdown>
                                            </div>
                                            <button
                                                className={`btn btn-primary align-self-end`}
                                                onClick={toggleExamForm}
                                            >
                                                <i className="fa-solid fa-plus"></i> Crear examen
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12 text-end">
                                        <button className="btn btn-primary" type='button' onClick={handleAddExam}>
                                            <i className="fa-solid fa-plus"></i> Añadir examen
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {selectedExamTypes.length > 0 && (
                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Exámenes a realizar</h5>
                            <table className="table mt-3">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: '50px' }}>#</th>
                                        <th scope="col">Exámen</th>
                                        <th scope="col" style={{ width: '100px' }} className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedExamTypes.map((examType, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{examType.name}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveExam(index)}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
});