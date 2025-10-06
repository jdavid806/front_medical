import React, { useState } from "react";
import { Card, Button, Spinner, Alert, Form, ListGroup } from "react-bootstrap";
import { useGenericFilter } from "../hooks/userSearchModel";
import { AppointmentForm } from "../components/AppointmentForm";

export const PatientSearch: React.FC = () => {
  const { data: patients, loading, error, search } = useGenericFilter("Patient");

  const [searchType, setSearchType] = useState("document_number");
  const [searchValue, setSearchValue] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const handleSearch = () => {
    if (!searchValue) return;

    search(
      { [`${searchType}__like`]: searchValue },
      { field: "created_at", direction: "desc" },
      10,
      10
    );
    setSelectedPatient(null);
    setShowAppointmentForm(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Columna izquierda: búsqueda e info */}
        <div className="col-md-6">
          {/* Tarjeta de búsqueda */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="text-center text-primary mb-4">
                <i className="fas fa-user-injured"></i> Búsqueda de Pacientes
              </h2>

              <div className="row g-2 align-items-end">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Buscar por:</Form.Label>
                    <Form.Select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="document_number">Cédula</option>
                      <option value="email">Correo</option>
                      <option value="phone">Teléfono</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-5">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Valor:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Escribe ${searchType}...`}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleSearch}
                    disabled={loading || !searchValue}
                  >
                    {loading ? <Spinner size="sm" animation="border" /> : "Buscar"}
                  </Button>
                </div>
              </div>

              {/* Resultados */}
              <div className="mt-3">
                {error && <Alert variant="danger">{error}</Alert>}

                {patients.length > 0 && (
                  <ListGroup>
                    {patients.map((patient: any) => (
                      <ListGroup.Item
                        key={patient.id}
                        action
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowAppointmentForm(false);
                        }}
                      >
                        {patient.first_name} {patient.last_name} (Cédula:{" "}
                        {patient.document_number})
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {patients.length === 0 && !loading && searchValue && (
                  <p className="text-center text-muted">
                    No se encontraron pacientes.
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Info paciente (debajo del search, misma columna izquierda) */}
          {selectedPatient && (
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="fw-bold text-secondary mb-3">
                  Información del Paciente
                </h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <strong className="text-primary">Nombre:</strong> <br />
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <strong className="text-primary">Cédula:</strong> <br />
                      {selectedPatient.document_number}
                    </div>
                  </div>            
                </div>

                <div className="text-center mt-4">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={() => setShowAppointmentForm(true)}
                  >
                    Agendar Cita
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Columna derecha: formulario */}
        <div className="col-md-6">
          {showAppointmentForm && selectedPatient && (
            <Card className="shadow-sm">
              <Card.Body>
                <AppointmentForm
                  patient={selectedPatient}
                  onSave={(data) => {
                    console.log("Cita guardada:", data);
                    setShowAppointmentForm(false);
                  }}
                  onCancel={() => setShowAppointmentForm(false)}
                />
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
