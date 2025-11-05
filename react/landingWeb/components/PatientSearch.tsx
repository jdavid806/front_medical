import React, { useState, useEffect } from "react";
import { useGenericFilter } from "../hooks/userSearchModel";
import { AppointmentForm } from "../components/AppointmentForm";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Alert, Spinner } from "react-bootstrap";

export const PatientSearch: React.FC = () => {
    const { data: patients, loading, error, search } = useGenericFilter("Patient");

    const [searchType, setSearchType] = useState("document_number");
    const [searchValue, setSearchValue] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const searchTypeOptions = [
        { label: "Cédula", value: "document_number" },
        { label: "Correo", value: "email" },
        { label: "Teléfono", value: "phone" },
    ];

    const getSearchTypeLabel = (value: string) => {
        const option = searchTypeOptions.find((option) => option.value === value);
        return option ? option.label : value;
    };

    const handleSearch = () => {
        if (!searchValue.trim()) return;

        setHasSearched(true);
        search(
            { [`${searchType}__like`]: searchValue },
            { field: "created_at", direction: "desc" },
            10,
            10
        );
        setSelectedPatient(null);
        setShowAppointmentForm(false);
    };

    // Auto-seleccionar el primer paciente cuando hay resultados
    useEffect(() => {
        if (patients.length > 0 && !selectedPatient && hasSearched) {
            const firstPatient = patients[0];
            setSelectedPatient(firstPatient);
            setShowAppointmentForm(true);
        }
    }, [patients, selectedPatient, hasSearched]);

    useEffect(() => {
        setSearchValue("02581898");
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchValue]);

    // Manejar Enter en el input
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Columna izquierda: búsqueda e info */}
                <div className="col-md-5">
                    {/* Tarjeta de búsqueda */}
                    <Card className="shadow-sm mb-4">
                        <h3 className="text-center text-primary mb-4">
                            <i className="fas fa-user me-2"></i> Búsqueda de Pacientes
                        </h3>

                        <div className="row g-2 align-items-end">
                            <div className="col-md-4">
                                <div className="d-flex flex-column gap-2">
                                    <label className="form-label fw-bold">Buscar por:</label>
                                    <Dropdown
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.value)}
                                        options={searchTypeOptions}
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Selecciona un tipo"
                                        className="w-100"
                                    />
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="d-flex flex-column gap-2">
                                    <label className="form-label fw-bold">Valor:</label>
                                    <InputText
                                        type="text"
                                        placeholder={`Ingrese ${getSearchTypeLabel(searchType)}...`}
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-100"
                                    />
                                </div>
                            </div>

                            <div className="col-md-3">
                                <Button
                                    label="Buscar"
                                    icon={<i className="fas fa-search"></i>}
                                    loadingIcon={<i className="fas fa-spinner"></i>}
                                    className="w-100"
                                    onClick={handleSearch}
                                    disabled={loading || !searchValue.trim()}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        {/* Resultados */}
                        <div className="mt-3">
                            {error && (
                                <Alert variant="danger" className="d-flex align-items-center">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </Alert>
                            )}

                            {loading && (
                                <div className="text-center py-3">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="text-muted mt-2">Buscando pacientes...</p>
                                </div>
                            )}

                            {!loading && hasSearched && patients.length === 0 && (
                                <div className="text-center py-4">
                                    <i className="fas fa-inbox text-muted" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted fw-bold mt-2">No se encontraron pacientes</p>
                                    <p className="text-muted small">
                                        Verifique los datos ingresados e intente nuevamente
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Info paciente seleccionado */}
                    {selectedPatient && (
                        <Card
                            className="shadow-sm mb-4"
                            header={<>
                                <h4 className="fw-bold text-secondary pt-3 px-3">
                                    <i className="fas fa-user me-2"></i>
                                    Información del Paciente
                                </h4>
                            </>}
                        >
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="fw-bold text-secondary mb-1">
                                        Nombre completo
                                    </label>
                                    <p className="mb-0">
                                        {selectedPatient.first_name || ''} {selectedPatient.last_name || ''} {selectedPatient.middle_name || ''} {selectedPatient.second_last_name || ''}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <label className="fw-bold text-secondary mb-1">
                                        Cédula
                                    </label>
                                    <p className="mb-0">
                                        {selectedPatient.document_number}
                                    </p>
                                </div>
                                {selectedPatient.email && (
                                    <div className="col-md-6">
                                        <label className="fw-bold text-secondary mb-1">
                                            Correo
                                        </label>
                                        <p className="mb-0">{selectedPatient.email}</p>
                                    </div>
                                )}
                                {selectedPatient.whatsapp && (
                                    <div className="col-md-6">
                                        <label className="fw-bold text-secondary mb-1">
                                            Teléfono
                                        </label>
                                        <p className="mb-0">{selectedPatient.whatsapp}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Columna derecha: formulario de cita */}
                <div className="col-md-7">
                    {showAppointmentForm && selectedPatient ? (
                        <Card className="shadow-sm">
                            <div className="d-flex align-items-center mb-3 gap-3">
                                <i className="fas fa-calendar-alt text-primary me-2"></i>
                                <h3 className="text-primary mb-0">Agendar Nueva Cita</h3>
                            </div>
                            <AppointmentForm
                                patient={selectedPatient}
                                onSave={() => {
                                    setShowAppointmentForm(false);
                                    setSelectedPatient(null);
                                    setSearchValue("");
                                    setHasSearched(false);
                                }}
                            />
                        </Card>
                    ) : (
                        <Card className="shadow-sm">
                            <div className="text-center text-muted py-5">
                                <i className="fas fa-calendar-alt" style={{ fontSize: '3rem' }}></i>
                                <h5 className="mt-3">Formulario de Cita</h5>
                                <p className="mb-0">
                                    {hasSearched
                                        ? "Seleccione un paciente para agendar una cita"
                                        : "Realice una búsqueda para agendar una cita"
                                    }
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};