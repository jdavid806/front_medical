import { useEffect, useRef, useState } from "react";
import { usePatientDocuments } from "./usePatientDocuments.js";
import { useGetData } from "../../consentimiento/hooks/ConsentimientoGetData.js";
// Placeholder: reemplaza con tus funciones de API
async function guardarArchivo(formData, flag) {/*...*/}
async function getUrlImage(path, flag) {/*...*/}
export const useAsignarConsentimiento = () => {
  const [patientId, setPatientId] = useState("");
  const toast = useRef(null);
  const {
    documents,
    patient,
    loading,
    error,
    reload,
    setPatientId: updatePatientId,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = usePatientDocuments(patientId);
  const [showDocumentFormModal, setShowDocumentFormModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [documentToView, setDocumentToView] = useState(null);
  const {
    data: templates
  } = useGetData();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("patient_id");
    if (id) {
      setPatientId(id);
      updatePatientId(id);
    }
  }, []);
  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setShowDocumentFormModal(true);
  };
  const handleEditDocument = id => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setCurrentDocument(doc);
      setShowDocumentFormModal(true);
    }
  };
  const handleDeleteDocument = async id => {
    if (!confirm("¿Seguro que deseas eliminar este documento?")) return;
    try {
      await deleteTemplate(id);
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Documento eliminado correctamente",
        life: 3000
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el documento",
        life: 3000
      });
    }
  };
  const handleViewDocument = id => {
    const doc = documents.find(d => d.id === id);
    if (!doc) {
      toast.current?.show({
        severity: "warn",
        summary: "No encontrado",
        detail: "No se encontró el documento",
        life: 3000
      });
      return;
    }
    setDocumentToView(doc);
    setShowViewModal(true);
  };
  const handleSignatureDocument = id => {
    const doc = documents.find(d => d.id === id);
    if (!doc) {
      toast.current?.show({
        severity: "warn",
        summary: "No encontrado",
        detail: "No se encontró el documento",
        life: 3000
      });
      return;
    }
    doc.patient_id = patientId;
    setDocumentToView(doc);
    setShowViewModal(true);
  };
  const handleSubmitDocument = async (formData, template) => {
    try {
      const doctor = JSON.parse(localStorage.getItem("userData"));
      const tenant_id = window.location.hostname.split(".")[0];
      const payload = {
        documentId: template.id,
        title: formData.title || template.title,
        description: template.description || "No hay descripcion",
        data: formData.contenido,
        tenantId: tenant_id,
        doctorId: doctor.id,
        statusSignature: formData.statusSignature ?? 0
      };
      if (currentDocument) {
        await updateTemplate(currentDocument.id, payload);
        toast.current?.show({
          severity: "info",
          summary: "Actualizado",
          detail: "Documento actualizado con éxito",
          life: 3000
        });
      } else {
        await createTemplate(payload);
        toast.current?.show({
          severity: "success",
          summary: "Creado",
          detail: "Documento creado con éxito",
          life: 3000
        });
      }
      setShowDocumentFormModal(false);
      setCurrentDocument(null);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el documento",
        life: 3000
      });
    }
  };
  const handleHideDocumentFormModal = () => {
    setShowDocumentFormModal(false);
    setCurrentDocument(null);
  };
  const handleDownloadAndUpload = async documento => {
    console.log("documento upload", documento);
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", documento);
        formData.append("model_type", "App\\Models\\ExamRecipes");
        formData.append("model_id", documento.size.toString());
        console.log("formData", formData);
        // Mostrar contenido real
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        guardarArchivo(formData, true).then(response => {
          console.log("response upload", response);
          // const fileUrl = await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true);
          // resolve({
          //   file_url: fileUrl,
          //   model_type: response.file.model_type,
          //   model_id: response.file.model_id,
          //   id: response.file.id,
          // });
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Documento generado y subido correctamente.",
            life: 3000
          });
        }).catch(err => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo completar la operación.",
            life: 3000
          });
          reject(err);
        });
      } catch (err) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo completar la operación.",
          life: 3000
        });
        reject(err);
      }
    });
  };
  return {
    toast,
    patient,
    loading,
    error,
    documents,
    templates,
    currentDocument,
    documentToView,
    showDocumentFormModal,
    showSignatureModal,
    showViewModal,
    currentDocumentId,
    setDocumentToView,
    setCurrentDocumentId,
    setShowSignatureModal,
    setShowViewModal,
    handleCreateDocument,
    handleEditDocument,
    handleDeleteDocument,
    handleViewDocument,
    handleSignatureDocument,
    handleSubmitDocument,
    handleHideDocumentFormModal,
    handleDownloadAndUpload,
    reload,
    updateTemplate
  };
};