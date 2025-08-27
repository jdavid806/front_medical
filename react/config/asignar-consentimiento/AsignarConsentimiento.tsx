import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from "primereact/api";
import { usePatientDocuments } from "./hooks/usePatientDocuments";
import { getDocumentColumns } from "./enums/columns";
import { DocumentoConsentimiento } from "./types/DocumentData";
import PatientBreadcrumb from "./components/PatientBreadcrumb";
import DocumentTable from "./components/DocumentTable";
import DocumentFormModal from "./components/DocumentFormModal";
import { useGetData } from '../consentimiento/hooks/ConsentimientoGetData';

const AsignarConsentimiento: React.FC = () => {
  // Obtener patient_id de la URL
  const [patientId, setPatientId] = useState('');
  const {
    documents,
    patient,
    loading,
    error,
    reload,
    setPatientId: updatePatientId
  } = usePatientDocuments(patientId);
  const [showDocumentFormModal, setShowDocumentFormModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentoConsentimiento | null>(null);
  const { data: templates } = useGetData();
  // Extraer patient_id de la URL al cargar el componente
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('patient_id');
    if (id) {
      setPatientId(id);
      updatePatientId(id);
    }
  }, []);

  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setShowDocumentFormModal(true);
  };

  const handleViewDocument = (id: string) => {
    console.log('Ver documento:', id);
    // TODO: Implementar visualización de documento
  };

  const handleEditDocument = (id: string) => {
    const documentToEdit = documents.find(doc => doc.id === id);
    if (documentToEdit) {
      setCurrentDocument(documentToEdit);
      setShowDocumentFormModal(true);
    }
  };

  const handleDeleteDocument = (id: string) => {
    console.log('Eliminar documento:', id);
    // TODO: Implementar confirmación y eliminación
  };

  const handleSubmitDocument = async (formData: any) => {
    try {
      console.log('Guardar documento:', formData);
      // TODO: Implementar creación/actualización de documento
      setShowDocumentFormModal(false);
      setCurrentDocument(null);
      reload();
    } catch (error) {
      console.error('Error al guardar documento:', error);
    }
  };

  const handleHideDocumentFormModal = () => {
    setShowDocumentFormModal(false);
    setCurrentDocument(null);
  };

  const columns = getDocumentColumns({
    onView: handleViewDocument,
    onEdit: handleEditDocument,
    onDelete: handleDeleteDocument
  });

  if (error) {
    return (
      <div className="content">
        <div className="container-small">
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-2" 
              onClick={reload}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrimeReactProvider
      value={{
        appendTo: "self",
        zIndex: {
          overlay: 100000,
        },
      }}
    >
      <div className="content">
        <div className="container-small">
          <PatientBreadcrumb 
            patient={patient} 
            loading={loading && !patient} 
          />
          
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">Consentimientos Informados</h2>
                  <small className="text-muted">
                    {loading && !patient ? 'Cargando...' : 
                     patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente'}
                  </small>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleCreateDocument}
                  disabled={!patient}
                >
                  <span className="fa-solid fa-plus me-2 fs-9"></span>
                  Nuevo Consentimiento
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <DocumentTable
                data={documents}
                columns={columns}
                loading={loading}
                onReload={reload}
                globalFilterFields={['titulo', 'motivo', 'fecha']}
              />
            </div>
          </div>
        </div>

        <DocumentFormModal
          title={currentDocument ? "Editar Consentimiento" : "Crear Consentimiento"}
          show={showDocumentFormModal}
          onSubmit={handleSubmitDocument}
          onHide={handleHideDocumentFormModal}
          initialData={currentDocument}
          templates={templates}
          patient={patient!}
        />
      </div>
    </PrimeReactProvider>
  );
};

export default AsignarConsentimiento;
