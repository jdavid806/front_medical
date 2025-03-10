import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PrescriptionFormProps } from '../interfaces/PrescriptionInterfaces';
import { Medicine } from '../../models/models';

export interface PrescriptionFormInputs {
    patient_id: number;
    user_id: number;
    is_active: boolean;
    medicines: Medicine[];
}

const medicationGroups = [
    {
        id: 'grupo1',
        name: 'Grupo Analgésicos',
        medications: [
            {
                name: 'Paracetamol',
                concentration: '500 mg',
                defaultDuration: 5,
                price: 15.50
            },
            {
                name: 'Ibuprofeno',
                concentration: '400 mg',
                defaultDuration: 7,
                price: 20.00
            }
        ]
    },
    {
        id: 'grupo2',
        name: 'Grupo Analgésicos',
        medications: [
            {
                name: 'Acetaminofén',
                concentration: '500 mg',
                defaultDuration: 5,
                price: 15.50
            },
            {
                name: 'Aspirina',
                concentration: '400 mg',
                defaultDuration: 7,
                price: 20.00
            }
        ]
    }
];

const initialMedicine: Medicine = {
    medication: '',
    concentration: '',
    duration: 0,
    frequency: '',
    medication_type: '',
    observations: '',
    quantity: 0,
    take_every_hours: 0,
    showQuantity: false,
    showTimeField: false
};

const PrescriptionForm: React.FC<PrescriptionFormProps> = forwardRef(({ formId, initialData }, ref) => {
    const [useGroup, setUseGroup] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [formData, setFormData] = useState<Medicine[]>([initialMedicine]);
    const [addedMedications, setAddedMedications] = useState<Medicine[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [manualEntry, setManualEntry] = useState(false);

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return addedMedications
        }
    }));

    const handleGroupToggle = () => {
        setUseGroup(!useGroup);
        setSelectedGroupId('');
        setFormData([initialMedicine]);
        setManualEntry(false);
    };

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const groupId = e.target.value;
        setSelectedGroupId(groupId);

        const selectedGroup = medicationGroups.find(g => g.id === groupId);
        if (selectedGroup) {
            const initialMedications = selectedGroup.medications.map(med => ({
                ...initialMedicine,
                medication: med.name,
                concentration: med.concentration,
                duration: med.defaultDuration
            }));
            setFormData(initialMedications);
        }
    };

    const handleMedicationChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
        const newFormData = formData.map((item, i) => {
            if (i === index) {
                const updatedItem = {
                    ...item,
                    [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
                };

                updatedItem.showQuantity = !['tabletas', ''].includes(updatedItem.medication_type);
                updatedItem.showTimeField = ['tabletas', 'jarabe'].includes(updatedItem.medication_type);

                return updatedItem;
            }
            return item;
        });

        setFormData(newFormData);
    };

    const handleAddMedication = () => {
        if (editIndex !== null) {
            const updatedMedications = addedMedications.map((med, index) => index === editIndex ? formData[0] : med);
            setAddedMedications(updatedMedications);
            setEditIndex(null);
        } else {
            setAddedMedications(prev => [...prev, ...formData]);
        }
        setFormData([initialMedicine]);
        setManualEntry(false);
    };

    const handleEditMedication = (index: number) => {
        setFormData([addedMedications[index]]);
        setEditIndex(index);
        setManualEntry(true);
    };

    const handleDeleteMedication = (index: number) => {
        setAddedMedications(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        console.log('Initial data:', initialData);
        setAddedMedications(initialData?.medicines || []);
    }, [initialData]);

    return (
        <>
            <form id={formId} className="row g-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title">Medicamentos</h5>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="useGroup"
                                    checked={useGroup}
                                    onChange={handleGroupToggle}
                                />
                                <label className="form-check-label" htmlFor="useGroup">
                                    Agregar grupos de medicamentos
                                </label>
                            </div>
                        </div>

                        <div className="row">
                            {useGroup ? (
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Seleccionar grupo</label>
                                    <select
                                        className="form-select"
                                        value={selectedGroupId}
                                        onChange={handleGroupChange}
                                    >
                                        <option value="">Seleccione un grupo</option>
                                        {medicationGroups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name} ({group.medications.length} medicamentos)
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-3 text-end">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            id="addMedicineBtn"
                                            onClick={handleAddMedication}
                                        >
                                            <i className="fa-solid fa-plus"></i> Agregar Medicamentos del Grupo
                                        </button>
                                        <button
                                            className="btn btn-secondary ms-2"
                                            type="button"
                                            onClick={() => setManualEntry(true)}
                                        >
                                            <i className="fa-solid fa-plus"></i> Agregar Medicamento Manualmente
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="col-md-12">
                                        <label className="form-label" htmlFor="medication">Medicamento</label>
                                        <input
                                            className="form-control"
                                            id="medication"
                                            type="text"
                                            name="medication"
                                            value={formData[0]?.medication || ''}
                                            onChange={(e) => handleMedicationChange(0, e)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="concentration">Concentración</label>
                                        <input
                                            className="form-control"
                                            id="concentration"
                                            type="text"
                                            name="concentration"
                                            value={formData[0]?.concentration || ''}
                                            onChange={(e) => handleMedicationChange(0, e)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="frequency">Frecuencia</label>
                                        <select
                                            className="form-control"
                                            id="frequency"
                                            name="frequency"
                                            value={formData[0]?.frequency || ''}
                                            onChange={(e) => handleMedicationChange(0, e)}
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="Diaria">Diaria</option>
                                            <option value="Semanal">Semanal</option>
                                            <option value="Mensual">Mensual</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="duration">Duración (días)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="duration"
                                            name="duration"
                                            min="1"
                                            value={formData[0]?.duration || 0}
                                            onChange={(e) => handleMedicationChange(0, e)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="medication_type">Tipo Medicamento</label>
                                        <select
                                            className="form-control"
                                            id="medication_type"
                                            name="medication_type"
                                            value={formData[0]?.medication_type || ''}
                                            onChange={(e) => handleMedicationChange(0, e)}
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="crema">Crema</option>
                                            <option value="jarabe">Jarabe</option>
                                            <option value="inyeccion">Inyección</option>
                                            <option value="tabletas">Tabletas</option>
                                        </select>
                                    </div>
                                    {formData[0]?.showTimeField && (
                                        <div className="col-md-6">
                                            <label className="form-label" htmlFor="take_every_hours">Tomar cada</label>
                                            <select
                                                className="form-control"
                                                id="take_every_hours"
                                                name="take_every_hours"
                                                value={formData[0]?.take_every_hours || ''}
                                                onChange={(e) => handleMedicationChange(0, e)}
                                            >
                                                <option value="">Seleccione</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 24].map(h => (
                                                    <option key={h} value={h}>{h} Horas</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {formData[0]?.showQuantity && (
                                        <div className="col-md-6">
                                            <label className="form-label" htmlFor="quantity">Cantidad</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="quantity"
                                                name="quantity"
                                                min="1"
                                                value={formData[0]?.quantity || 0}
                                                onChange={(e) => handleMedicationChange(0, e)}
                                            />
                                        </div>
                                    )}
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="observations">Indicaciones</label>
                                        <textarea
                                            className="form-control"
                                            id="observations"
                                            name="observations"
                                            rows={3}
                                            value={formData[0]?.observations || ''}
                                            onChange={(e) => handleMedicationChange(0, e)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {manualEntry && formData.map((medication, index) => (
                    <div className="card" key={index}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="card-subtitle text-muted">
                                    {useGroup ? `${medication.medication}` : `Medicamento ${index + 1}`}
                                </h6>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setFormData(prev => prev.filter((_, i) => i !== index))}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                )}
                            </div>

                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label" htmlFor={`concentration-${index}`}>Concentración</label>
                                    <input
                                        className="form-control"
                                        id={`concentration-${index}`}
                                        type="text"
                                        name="concentration"
                                        value={medication.concentration}
                                        onChange={(e) => handleMedicationChange(index, e)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor={`frequency-${index}`}>Frecuencia</label>
                                    <select
                                        className="form-control"
                                        id={`frequency-${index}`}
                                        name="frequency"
                                        value={medication.frequency}
                                        onChange={(e) => handleMedicationChange(index, e)}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="Diaria">Diaria</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Mensual">Mensual</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label" htmlFor={`duration-${index}`}>Duración (días)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`duration-${index}`}
                                        name="duration"
                                        min="1"
                                        value={medication.duration}
                                        onChange={(e) => handleMedicationChange(index, e)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label" htmlFor={`medication_type-${index}`}>Tipo Medicamento</label>
                                    <select
                                        className="form-control"
                                        id={`medication_type-${index}`}
                                        name="medication_type"
                                        value={medication.medication_type}
                                        onChange={(e) => handleMedicationChange(index, e)}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="crema">Crema</option>
                                        <option value="jarabe">Jarabe</option>
                                        <option value="inyeccion">Inyección</option>
                                        <option value="tabletas">Tabletas</option>
                                    </select>
                                </div>

                                {medication.showTimeField && (
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor={`take_every_hours-${index}`}>Tomar cada</label>
                                        <select
                                            className="form-control"
                                            id={`take_every_hours-${index}`}
                                            name="take_every_hours"
                                            value={medication.take_every_hours}
                                            onChange={(e) => handleMedicationChange(index, e)}
                                        >
                                            <option value="">Seleccione</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 24].map(h => (
                                                <option key={h} value={h}>{h} Horas</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {medication.showQuantity && (
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor={`quantity-${index}`}>Cantidad</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id={`quantity-${index}`}
                                            name="quantity"
                                            min="1"
                                            value={medication.quantity}
                                            onChange={(e) => handleMedicationChange(index, e)}
                                        />
                                    </div>
                                )}

                                <div className="col-12">
                                    <label className="form-label" htmlFor={`observations-${index}`}>Indicaciones</label>
                                    <textarea
                                        className="form-control"
                                        id={`observations-${index}`}
                                        name="observations"
                                        rows={3}
                                        value={medication.observations}
                                        onChange={(e) => handleMedicationChange(index, e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="mt-3 text-end">
                    <button
                        className="btn btn-primary"
                        type="button"
                        id="addMedicineBtn"
                        onClick={handleAddMedication}
                    >
                        <i className="fa-solid fa-plus"></i> {editIndex !== null ? 'Actualizar Medicamento' : 'Agregar Medicamento'}
                    </button>
                </div>

                {addedMedications.length > 0 && (
                    <div className="mt-4">
                        <h5>Medicamentos de la receta</h5>
                        {addedMedications.map((med, index) => (
                            <div className="card mb-3" key={index}>
                                <div className="card-body">
                                    <h6 className="card-subtitle mb-2 text-muted">{med.medication}</h6>
                                    <p className="card-text">Concentración: {med.concentration}</p>
                                    <p className="card-text">Frecuencia: {med.frequency}</p>
                                    <p className="card-text">Duración (días): {med.duration}</p>
                                    <p className="card-text">Tipo Medicamento: {med.medication_type}</p>
                                    {med.showTimeField && <p className="card-text">Tomar cada: {med.take_every_hours} Horas</p>}
                                    {med.showQuantity && <p className="card-text">Cantidad: {med.quantity}</p>}
                                    <p className="card-text">Indicaciones: {med.observations}</p>
                                    <button
                                        type="button"
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => handleEditMedication(index)}
                                    >
                                        <i className="fa-solid fa-edit"></i> Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteMedication(index)}
                                    >
                                        <i className="fa-solid fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </>
    );
});

export default PrescriptionForm;