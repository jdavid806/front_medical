import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import { examOrderStateColors, examOrderStates } from "../../../services/commons.js";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction.js";
import { formatDate, ordenarPorFecha } from "../../../services/utilidades.js";
import { CustomModal } from "../../components/CustomModal.js";
import { examOrderService, userService } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const ExamGeneralTable = ({
  exams,
  onLoadExamResults,
  onViewExamResults,
  onReload
}) => {
  const [tableExams, setTableExams] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  useEffect(() => {
    const mappedExams = exams.map(exam => {
      return {
        id: exam.id,
        examName: (exam.items.length > 0 ? exam.items.map(item => item.exam.name).join(', ') : exam.exam_type?.name) || '--',
        status: examOrderStates[exam.exam_order_state?.name.toLowerCase()] ?? '--',
        statusColor: examOrderStateColors[exam.exam_order_state?.name.toLowerCase()] ?? '--',
        minioId: exam.minio_id,
        patientId: exam.patient_id,
        patientName: `${exam.patient.first_name || ''} ${exam.patient.middle_name || ''} ${exam.patient?.last_name || ''} ${exam.patient?.second_last_name || ''}`.trim(),
        appointmentId: exam.appointment_id,
        state: exam.exam_order_state?.name || 'pending',
        created_at: exam.created_at,
        dateTime: formatDate(exam.created_at)
      };
    });
    ordenarPorFecha(mappedExams, 'created_at');
    console.log('Mapped exams', mappedExams);
    setTableExams(mappedExams);
  }, [exams]);
  const onUploadExamsFile = examOrderId => {
    setSelectedOrderId(examOrderId);
    setShowPdfModal(true);
  };
  const handleUploadExamsFile = async () => {
    try {
      // Llamar a la función guardarArchivoExamen
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", selectedOrderId);

      // Acceder a la PromiseResult
      if (enviarPDf !== undefined) {
        console.log("PDF de prueba:", enviarPDf);
        console.log("Resultado de la promesa:", enviarPDf);
        await examOrderService.updateMinioFile(selectedOrderId, enviarPDf);
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      // Limpiar el estado después de la operación
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
      onReload();
    }
  };
  const columns = [{
    data: 'patientName'
  }, {
    data: 'examName'
  }, {
    data: 'status'
  }, {
    data: 'dateTime'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    2: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${data.statusColor}`
    }, data.status),
    4: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dropdown"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary dropdown-toggle",
      type: "button",
      "data-bs-toggle": "dropdown",
      "aria-expanded": "false"
    }, /*#__PURE__*/React.createElement("i", {
      "data-feather": "settings"
    }), " Acciones"), /*#__PURE__*/React.createElement("ul", {
      className: "dropdown-menu"
    }, data.state === 'generated' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      id: "cargarResultadosBtn",
      onClick: () => onLoadExamResults(data)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar examen")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      id: "cargarResultadosBtn",
      onClick: () => onUploadExamsFile(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Subir examen"))))), data.state === 'uploaded' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      id: "cargarResultadosBtn",
      onClick: () => onViewExamResults(data, data.minioId)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-eye",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Visualizar resultados")))), /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: async () => {
        console.log(data);
        if (data.minioId) {
          //@ts-ignore
          const url = await getFileUrl(data.minioId);
          window.open(url, '_blank');
        } else {
          //@ts-ignore
          crearDocumento(data.id, "Impresion", "Examen", "Completa", "Orden de examen");
        }
      }
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: async () => {
        if (data.minioId) {
          try {
            //@ts-ignore
            const url = await getFileUrl(data.minioId);
            var link = document.createElement('a');
            link.href = url.replace('http', 'https');
            link.download = 'file.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (error) {
            console.error('Error al descargar:', error);
          }
        } else {
          //@ts-ignore
          crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
        }
      }
    }), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("hr", {
      className: "dropdown-divider"
    })), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Compartir"), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: async () => {
        const user = await userService.getLoggedUser();
        //@ts-ignore
        enviarDocumento(data.id, "Descarga", "Examen", "Completa", data.patientId, user.id, "Orden de examen");
      }
    })))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableExams,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Ex\xE1menes ordenados"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha y hora de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))), /*#__PURE__*/React.createElement(CustomModal, {
    title: "Subir examen",
    show: showPdfModal,
    onHide: () => setShowPdfModal(false),
    footerTemplate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: ".pdf",
      id: "inputPdf",
      onChange: e => {
        const file = e.target.files?.[0] || null;
        if (file) {
          setPdfFile(file);
          setPdfPreviewUrl(URL.createObjectURL(file));
        }
      }
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-secondary",
      onClick: () => {
        setShowPdfModal(false);
        setPdfFile(null);
        setPdfPreviewUrl(null);
      }
    }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: () => {
        handleUploadExamsFile();
        setShowPdfModal(false);
        setPdfFile(null);
        setPdfPreviewUrl(null);
      }
    }, "Confirmar"))
  }, pdfPreviewUrl ? /*#__PURE__*/React.createElement("embed", {
    src: pdfPreviewUrl,
    width: "100%",
    height: "500px",
    type: "application/pdf"
  }) : /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")));
};