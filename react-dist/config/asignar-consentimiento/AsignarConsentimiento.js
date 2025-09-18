import React, { useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { usePatientDocuments } from "./hooks/usePatientDocuments.js";
import { getDocumentColumns } from "./enums/columns.js";
import PatientBreadcrumb from "./components/PatientBreadcrumb.js";
import DocumentTable from "./components/DocumentTable.js";
import DocumentFormModal from "./components/DocumentFormModal.js";
import { useGetData } from "../consentimiento/hooks/ConsentimientoGetData.js";
import SignatureModal from "./components/SignatureModal.js";
const AsignarConsentimiento = () => {
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

  // Crear
  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setShowDocumentFormModal(true);
  };

  // Ver
  const handleViewDocument = id => {
    const documentToView = documents.find(doc => doc.id === id);
    if (!documentToView) {
      toast.current?.show({
        severity: "warn",
        summary: "No encontrado",
        detail: "No se encontró el documento",
        life: 3000
      });
      return;
    }
    const printWindow = window.open("", "_blank", "width=800,height=1000,top=100,left=200,resizable=yes,scrollbars=yes");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentToView.titulo ?? "Documento"}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                line-height: 1.6;
                font-size: 14px;
              }
              h1, h2, h3 {
                margin-top: 0;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
            </style>
          </head>
          <body>
            ${documentToView.contenido ?? "<p>Sin contenido</p>"}
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  const handleSignatureDocument = id => {
    console.log("documents", documents);
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
    doc.title = doc.titulo;
    doc.description = doc.contenido || "No hay descripcion";
    console.log("doc", doc);
    setDocumentToView(doc);
    setShowViewModal(true);
  };

  // Editar
  const handleEditDocument = id => {
    const documentToEdit = documents.find(doc => doc.id === id);
    if (documentToEdit) {
      setCurrentDocument(documentToEdit);
      setShowDocumentFormModal(true);
    }
  };

  // Función para el nuevo proceso de descarga y subida
  const handleDownloadAndUpload = async documento => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", documento);
        formData.append("model_type", "App\\Models\\ExamRecipes");
        formData.append("model_id", documento.size.toString());

        // Aquí usamos then/catch como querías
        guardarArchivo(formData, true).then(async response => {
          //@ts-ignore
          const fileUrl = await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true);
          resolve({
            file_url: fileUrl,
            model_type: response.file.model_type,
            model_id: response.file.model_id,
            id: response.file.id
          });
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Documento generado y subido correctamente.",
            life: 3000
          });
        }).catch(error => {
          console.error("Error al generar o subir el documento:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo completar la operación.",
            life: 3000
          });
          reject(error);
        });
      } catch (error) {
        console.error("Error inesperado:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo completar la operación.",
          life: 3000
        });
        reject(error);
      }
    });
  };

  // Eliminar
  const handleDeleteDocument = async id => {
    if (confirm("¿Seguro que deseas eliminar este documento?")) {
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
    }
  };

  // Guardar (crear/editar)
  const handleSubmitDocument = async (formData, template) => {
    try {
      const doctor = JSON.parse(localStorage.getItem("userData"));
      const tenant_id = window.location.hostname.split(".")[0];
      const payload = {
        documentId: template.id,
        title: formData.title && formData.title.trim() !== "" ? formData.title : template.title,
        description: template.description || "No hay descripcion",
        data: formData.contenido,
        tenantId: tenant_id,
        doctorId: doctor.id,
        statusSignature: formData.statusSignature ?? 0
      };
      if (currentDocument) {
        await updateTemplate(currentDocument?.id, payload);
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
      console.error("Error al guardar documento:", error);
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
  const columns = getDocumentColumns({
    onView: handleViewDocument,
    onEdit: handleEditDocument,
    onDelete: handleDeleteDocument,
    onSign: handleSignatureDocument
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
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
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
  }, loading && !patient ? "Cargando..." : patient ? `${patient.first_name} ${patient.last_name}` : "Paciente")), /*#__PURE__*/React.createElement("button", {
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
    globalFilterFields: ["titulo", "motivo", "fecha", "firmado"]
  })))), /*#__PURE__*/React.createElement(DocumentFormModal, {
    title: currentDocument ? "Editar Consentimiento" : "Crear Consentimiento",
    show: showDocumentFormModal,
    onSubmit: handleSubmitDocument,
    onHide: handleHideDocumentFormModal,
    initialData: currentDocument,
    templates: templates,
    patient: patient
  }), /*#__PURE__*/React.createElement(SignatureModal, {
    visible: showSignatureModal,
    onClose: () => setShowSignatureModal(false),
    onSave: async file => {
      if (!currentDocumentId) return;
      try {
        const response = await handleDownloadAndUpload(file);
        console.log("URL del archivo subido:", response.file_url);
        const reader = new FileReader();
        reader.onload = function (e) {
          const base64 = e.target?.result;
          const slot = document.getElementById("signature-slot");
          if (slot) {
            slot.innerHTML = `<img src="${base64}" style="max-width:250px; height:auto;" />`;
          }
          setDocumentToView(prev => prev ? {
            ...prev,
            image_signature: base64
          } : prev);
        };
        reader.readAsDataURL(file);
        const doc = documents.find(d => d.id === currentDocumentId);
        if (!doc) return;
        await updateTemplate(currentDocumentId, {
          documentId: doc.id,
          title: doc.titulo,
          description: doc.motivo,
          data: doc.contenido,
          tenantId: window.location.hostname.split(".")[0],
          patientId: doc.patient_id || patientId,
          doctorId: JSON.parse(localStorage.getItem("userData")).id,
          statusSignature: 1,
          imageSignature: response.file_url
        });
        setDocumentToView(prev => prev ? {
          ...prev,
          status_signature: 1,
          image_signature: response.file_url
        } : prev);
        setShowSignatureModal(false);
        setShowViewModal(false);
        setCurrentDocumentId(null);
        toast.current?.show({
          severity: "success",
          summary: "Firma guardada",
          detail: "El consentimiento ha sido firmado correctamente",
          life: 3000
        });
      } catch (error) {
        console.error("Error al subir la firma:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo guardar la firma",
          life: 3000
        });
      }
    }
  }), showViewModal && documentToView && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show d-block",
    style: {
      background: "rgba(0,0,0,0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, documentToView.titulo ?? "Consentimiento Informado"), /*#__PURE__*/React.createElement("button", {
    className: "btn-close",
    onClick: () => setShowViewModal(false)
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    id: "doc-content",
    dangerouslySetInnerHTML: {
      __html: documentToView.contenido + `<br/><p><b>Firma del paciente:</b></p>
                          <div id="signature-slot" style="border:1px dashed #aaa; height:80px; width:300px;">
                            ${documentToView.firma ? `<img src="${documentToView.firma}" style="max-width:250px; height:auto;" />` : ""}
                          </div>`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    onClick: () => {
      setShowSignatureModal(true);
      setCurrentDocumentId(documentToView.id);
      setShowViewModal(false);
    }
  }, "Firmar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: async () => {
      // Tomar contenido del modal
      const doc = document.getElementById("doc-content")?.innerHTML || "";
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      document.body.appendChild(iframe);
      const docIframe = iframe.contentWindow?.document;
      if (docIframe) {
        docIframe.open();
        docIframe.write(`
                        <html>
                          <head>
                            <title>${documentToView.titulo || "Documento"}</title>
                            <style>
                              body { font-family: Arial; padding: 40px; font-size: 14px; }
                              @page { size: A4; margin: 15mm; }
                            </style>
                          </head>
                          <body>${doc}</body>
                        </html>
                      `);
        docIframe.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }
    }
  }, "Descargar PDF")))))));
};
export default AsignarConsentimiento;