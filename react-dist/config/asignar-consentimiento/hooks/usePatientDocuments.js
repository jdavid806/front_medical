import { useState, useEffect, useCallback } from "react";
import { patientService, templateService } from "../../../../services/api/index.js";
export const usePatientDocuments = initialPatientId => {
  const [state, setState] = useState({
    documents: [],
    patient: null,
    loading: false,
    error: null
  });
  const [patientId, setPatientId] = useState(initialPatientId);
  const mapTemplate = doc => ({
    id: String(doc.id),
    titulo: doc.title,
    motivo: doc.description,
    fecha: doc.created_at,
    firmado: doc.status_signature === 1,
    firma: doc.image_signature,
    contenido: typeof doc.data === "string" ? doc.data : doc.data?.contenido || "",
    patient_id: doc.patient_id,
    created_at: doc.created_at,
    updated_at: doc.updated_at ?? doc.created_at
  });
  const fetchPatientData = async id => {
    try {
      const patient = await patientService.get(id);
      setState(prev => ({
        ...prev,
        patient
      }));
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setState(prev => ({
        ...prev,
        error: "Error al cargar los datos del paciente"
      }));
    }
  };
  const fetchDocuments = async id => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    try {
      const response = await templateService.getByPatientId(id);
      console.log("response documents", response);
      const mappedDocs = response.data.map(mapTemplate);
      setState(prev => ({
        ...prev,
        documents: mappedDocs,
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
      setState(prev => ({
        ...prev,
        documents: [],
        loading: false,
        error: "Error al cargar los documentos"
      }));
    }
  };
  const createTemplate = async formData => {
    const payload = {
      template_document_id: formData.documentId,
      title: formData.title,
      description: formData.description,
      data: formData.data,
      tenant_id: formData.tenantId,
      patient_id: patientId,
      doctor_id: formData.doctorId,
      status_signature: formData.statusSignature ?? 0
    };
    const res = await templateService.storeTemplateDocument(payload);
    const newDoc = mapTemplate(res.data);
    setState(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));
    await fetchDocuments(patientId);
    return newDoc;
  };
  const updateTemplate = async (id, formData) => {
    const payload = {
      template_document_id: formData.documentId,
      title: formData.title,
      description: formData.description,
      data: formData.data,
      tenant_id: formData.tenantId,
      patient_id: patientId,
      doctor_id: formData.doctorId,
      status_signature: formData.statusSignature ?? 0,
      image_signature: formData.imageSignature ?? null
    };
    const res = await templateService.updateTemplate(id, payload);
    const updatedDoc = mapTemplate(res.data);
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(doc => doc.id === id ? updatedDoc : doc)
    }));
    await fetchDocuments(patientId);
    return updatedDoc;
  };
  const deleteTemplate = async id => {
    await templateService.deleteTemplate(id);
    setState(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
    await fetchDocuments(patientId);
  };
  const fetchData = useCallback(async () => {
    if (!patientId) return;
    await Promise.all([fetchPatientData(patientId), fetchDocuments(patientId)]);
  }, [patientId]);
  useEffect(() => {
    if (patientId) fetchData();
  }, [fetchData]);
  return {
    ...state,
    reload: fetchData,
    setPatientId: id => {
      setPatientId(id);
      setState(prev => ({
        ...prev,
        documents: [],
        patient: null,
        error: null
      }));
    },
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};
export default usePatientDocuments;