import React, { useState, useEffect } from 'react';
import { useExamTypes } from '../../exams-config/hooks/useExamTypes';
import { ExamTypeDto } from '../../models/models';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';

const paquetesExamenes = {
    "Paquete básico de salud": [
        "Examen de sangre",
        "Análisis de orina",
        "Examen de vista",
        "Examen de audición"
    ],
    "Paquete cardiovascular": [
        "Electrocardiograma",
        "Prueba de esfuerzo",
        "Ecocardiograma",
        "Examen de sangre"
    ],
    "Paquete de chequeo general": [
        "Radiografía de tórax",
        "Examen de sangre",
        "Mamografía",
        "Papanicolaou",
        "Prueba de colesterol",
        "Examen de vista"
    ],
    "Paquete de salud respiratoria": [
        "Prueba de función pulmonar",
        "Espirometría",
        "Radiografía de tórax",
        "Prueba de esfuerzo respiratorio"
    ],
    "Paquete de diagnóstico oncológico": [
        "Mamografía",
        "Papanicolaou",
        "Colonoscopia",
        "Biopsia de piel",
        "Examen de próstata (PSA)"
    ],
    "Paquete avanzado de salud": [
        "Tomografía computarizada (TC)",
        "Resonancia magnética (RM)",
        "Análisis de orina",
        "Prueba de glucosa",
        "Examen de sangre",
        "Ecografía abdominal"
    ]
};

export const ExamForm = forwardRef(({ }, ref) => {
    const [activeCard, setActiveCard] = useState(null);
    const [selectedExamType, setSelectedExamType] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedExamTypes, setSelectedExamTypes] = useState<ExamTypeDto[]>([]);

    const { examTypes } = useExamTypes()

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return selectedExamTypes
        }
    }));

    const handleShowCard = (cardName) => {
        setActiveCard(cardName);
        setSelectedExamType('');
        setSelectedPackage('');
    };

    const handleAddExam = () => {
        if (!selectedExamType) {
            alert('Por favor, seleccione un examen');
            return;
        }

        const selectedExamObject = examTypes.find(exam => exam.id == selectedExamType);
        console.log(examTypes, selectedExamType, selectedExamObject);

        if (selectedExamObject) {
            console.log(selectedExamObject, [...selectedExamTypes, selectedExamObject]);

            setSelectedExamTypes([...selectedExamTypes, selectedExamObject]);
        }

        setSelectedExamType('');
    };

    const handleAddPackage = () => {
        if (!selectedPackage) {
            alert('Por favor, seleccione un paquete');
            return;
        }

        const nuevosExamenes = paquetesExamenes[selectedPackage]
            .filter(examen => !selectedExamTypes.includes(examen));

        setSelectedExamTypes([...selectedExamTypes, ...nuevosExamenes]);
        setSelectedPackage('');
    };

    const handleRemoveExam = (index) => {
        const newExams = selectedExamTypes.filter((_, i) => i !== index);
        setSelectedExamTypes(newExams);
    };

    return (
        <div>
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Seleccionar por:</h5>
                    <button className="btn btn-outline-secondary me-1 mb-1"
                        onClick={() => handleShowCard('examenes')}>Exámen</button>
                    {/* <button className="btn btn-outline-secondary me-1 mb-1"
                        onClick={() => handleShowCard('paquetes')}>Paquetes</button> */}
                </div>
            </div>

            {activeCard === 'examenes' && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Seleccionar exámen</h5>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Exámenes</label>
                                <select
                                    className="form-select"
                                    value={selectedExamType}
                                    onChange={(e) => setSelectedExamType(e.target.value)}
                                // disabled={selectedExamTypes.length >= 1}
                                >
                                    <option value="">Seleccione un examen</option>
                                    {examTypes.map(examType => (
                                        <option key={examType.id} value={examType.id}>{examType.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 text-end">
                                <button className="btn btn-primary" onClick={handleAddExam}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeCard === 'paquetes' && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Seleccionar paquete</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Paquetes</label>
                                <select
                                    className="form-select"
                                    value={selectedPackage}
                                    onChange={(e) => setSelectedPackage(e.target.value)}
                                >
                                    <option value="">Seleccione un paquete</option>
                                    {Object.keys(paquetesExamenes).map(paquete => (
                                        <option key={paquete} value={paquete}>{paquete}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 text-end">
                                <button className="btn btn-primary" onClick={handleAddPackage}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
    );
});