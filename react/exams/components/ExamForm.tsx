import React, { useState, useEffect } from 'react';

const categoriasExamenes = {
    "Exámenes de laboratorio": [
        "Examen de sangre",
        "Análisis de orina",
        "Prueba de colesterol",
        "Prueba de glucosa",
        "Prueba de función hepática"
    ],
    "Imágenes médicas": [
        "Radiografía de tórax",
        "Ecografía abdominal",
        "Tomografía computarizada (TC)",
        "Resonancia magnética (RM)",
        "Mamografía"
    ],
    "Cardiológicos": [
        "Electrocardiograma",
        "Prueba de estrés",
        "Ecocardiograma",
        "Holter de 24 horas"
    ],
    "Exámenes de cáncer": [
        "Mamografía",
        "Papanicolaou",
        "Colonoscopia",
        "Biopsia de piel",
        "Examen de próstata (PSA)"
    ],
    "Exámenes respiratorios": [
        "Prueba de función pulmonar",
        "Espirometría",
        "Prueba de esfuerzo respiratorio"
    ],
    "Exámenes de audición y visión": [
        "Examen de vista",
        "Examen de audición",
        "Audiometría"
    ]
};

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

export const ExamForm = ({ onSave, onCancel }) => {
    const [activeCard, setActiveCard] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [exams, setExams] = useState<string[]>([]);

    const handleShowCard = (cardName) => {
        setActiveCard(cardName);
        // Resetear selecciones al cambiar de card
        setSelectedCategory('');
        setSelectedExam('');
        setSelectedPackage('');
        setSelectedCategoria('');
    };

    const handleAddExam = () => {
        if (!selectedExam) {
            alert('Por favor, seleccione un examen');
            return;
        }

        if (!exams.includes(selectedExam)) {
            setExams([...exams, selectedExam]);
        }
        setSelectedExam('');
    };

    const handleAddPackage = () => {
        if (!selectedPackage) {
            alert('Por favor, seleccione un paquete');
            return;
        }

        const nuevosExamenes = paquetesExamenes[selectedPackage]
            .filter(examen => !exams.includes(examen));

        setExams([...exams, ...nuevosExamenes]);
        setSelectedPackage('');
    };

    const handleAddCategory = () => {
        if (!selectedCategoria) {
            alert('Por favor, seleccione una categoría');
            return;
        }

        const nuevosExamenes = categoriasExamenes[selectedCategoria]
            .filter(examen => !exams.includes(examen));

        setExams([...exams, ...nuevosExamenes]);
        setSelectedCategoria('');
    };

    const handleRemoveExam = (index) => {
        const newExams = exams.filter((_, i) => i !== index);
        setExams(newExams);
    };

    return (
        <div>
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Seleccionar por:</h5>
                    <button className="btn btn-outline-secondary me-1 mb-1"
                        onClick={() => handleShowCard('examenes')}>Exámen</button>
                    <button className="btn btn-outline-secondary me-1 mb-1"
                        onClick={() => handleShowCard('paquetes')}>Paquetes</button>
                    <button className="btn btn-outline-secondary me-1 mb-1"
                        onClick={() => handleShowCard('categorias')}>Categorías</button>
                </div>
            </div>

            {activeCard === 'examenes' && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Seleccionar exámen</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Categoria</label>
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {Object.keys(categoriasExamenes).map(categoria => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Exámenes</label>
                                <select
                                    className="form-select"
                                    value={selectedExam}
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Seleccione un examen</option>
                                    {selectedCategory && categoriasExamenes[selectedCategory].map(examen => (
                                        <option key={examen} value={examen}>{examen}</option>
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

            {activeCard === 'categorias' && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Seleccionar categoría</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Categoría</label>
                                <select
                                    className="form-select"
                                    value={selectedCategoria}
                                    onChange={(e) => setSelectedCategoria(e.target.value)}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {Object.keys(categoriasExamenes).map(categoria => (
                                        <option key={categoria} value={categoria}>{categoria}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 text-end">
                                <button className="btn btn-primary" onClick={handleAddCategory}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {exams.length > 0 && (
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
                                {exams.map((examen, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{examen}</td>
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

            <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => onSave(exams)}>
                    Guardar
                </button>
                <button className="btn btn-outline-primary" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};