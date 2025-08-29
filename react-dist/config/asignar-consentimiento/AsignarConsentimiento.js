import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from "primereact/api";
import { usePatientDocuments } from "./hooks/usePatientDocuments.js";
import { getDocumentColumns } from "./enums/columns.js";
import PatientBreadcrumb from "./components/PatientBreadcrumb.js";
import DocumentTable from "./components/DocumentTable.js";
import DocumentFormModal from "./components/DocumentFormModal.js";
import { useGetData } from "../consentimiento/hooks/ConsentimientoGetData.js";
const AsignarConsentimiento = () => {
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
  const [currentDocument, setCurrentDocument] = useState(null);
  const {
    data: templates
  } = useGetData();
  console.log('wooo', templates);
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
  const handleViewDocument = id => {
    console.log('Ver documento:', id);
    // TODO: Implementar visualización de documento
  };
  const handleEditDocument = id => {
    const documentToEdit = documents.find(doc => doc.id === id);
    if (documentToEdit) {
      setCurrentDocument(documentToEdit);
      setShowDocumentFormModal(true);
    }
  };
  const handleDeleteDocument = id => {
    console.log('Eliminar documento:', id);
    // TODO: Implementar confirmación y eliminación
  };
  const handleSubmitDocument = async (formData, template) => {
    try {
      const doctor = JSON.parse(localStorage.getItem('userData'));
      const tenant_id = window.location.hostname.split('.')[0];
      console.log('tenant_id', tenant_id);
      const newData = {
        ...formData,
        patient_id: parseInt(patientId),
        doctor_id: doctor.id,
        consentimiento_id: parseInt(template.id),
        description: template.description,
        tenant_id: tenant_id
      };
      console.log('Guardar documento:', newData);
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
    return /*#__PURE__*/React.createElement("div", {
      className: "content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", error, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger ms-2",
      onClick: reload
    }, "Reintentar"))));
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-small"
  }, /*#__PURE__*/React.createElement(PatientBreadcrumb, {
    patient: patient,
    loading: loading && !patient
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Consentimientos Informados"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, loading && !patient ? 'Cargando...' : patient ? `${patient.first_name} ${patient.last_name}` : 'Paciente')), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    type: "button",
    onClick: handleCreateDocument,
    disabled: !patient
  }, /*#__PURE__*/React.createElement("span", {
    className: "fa-solid fa-plus me-2 fs-9"
  }), "Nuevo Consentimiento")))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(DocumentTable, {
    data: documents,
    columns: columns,
    loading: loading,
    onReload: reload,
    globalFilterFields: ['titulo', 'motivo', 'fecha']
  })))), /*#__PURE__*/React.createElement(DocumentFormModal, {
    title: currentDocument ? "Editar Consentimiento" : "Crear Consentimiento",
    show: showDocumentFormModal,
    onSubmit: handleSubmitDocument,
    onHide: handleHideDocumentFormModal,
    initialData: currentDocument,
    templates: templates,
    patient: patient
  })));
};
export default AsignarConsentimiento;