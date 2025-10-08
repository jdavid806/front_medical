import React, { useEffect, useRef, useState } from "react";
import { examOrderStateColors, examOrderStates } from "../../../services/commons.js";
import { formatDate } from "../../../services/utilidades.js";
import { examOrderService, userService } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js"; // PrimeReact imports
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { CustomModal } from "../../components/CustomModal.js";
export const ExamGeneralTable = ({
  exams,
  onLoadExamResults,
  onViewExamResults,
  onReload
}) => {
  const [tableExams, setTableExams] = useState([]);
  const [uploadedExams, setUploadedExams] = useState([]);
  const [pendingExams, setPendingExams] = useState([]);
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
        dateTime: formatDate(exam.created_at),
        original: exam,
        updated_at: exam.updated_at_formatted || undefined
      };
    });
    const sortedExams = [...mappedExams].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setTableExams(sortedExams);
    setUploadedExams(sortedExams.filter(exam => exam.state === "uploaded"));
    setPendingExams(sortedExams.filter(exam => exam.state === "generated" || exam.state === "pending"));
  }, [exams]);
  const onUploadExamsFile = examOrderId => {
    setSelectedOrderId(examOrderId);
    setShowPdfModal(true);
  };
  const handleUploadExamsFile = async () => {
    try {
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", selectedOrderId);
      if (enviarPDf !== undefined) {
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
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
      onReload();
    }
  };

  // Columnas para la tabla
  const columnsUploadExams = [{
    field: "id",
    header: "ID",
    sortable: true
  }, {
    field: "patientName",
    header: "Paciente",
    sortable: true
  }, {
    field: "examName",
    header: "Exámenes ordenados",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: data => {
      const color = examOrderStateColors[data.state] || "secondary";
      const text = examOrderStates[data.state] || "SIN ESTADO";
      const severityMap = {
        'success': 'success',
        'warning': 'warning',
        'danger': 'danger',
        'info': 'info',
        'primary': 'secondary',
        'secondary': 'secondary'
      };
      const severity = severityMap[color] || 'secondary';
      return /*#__PURE__*/React.createElement(Badge, {
        value: text,
        severity: severity,
        className: "p-badge-lg"
      });
    }
  }, {
    field: "dateTime",
    header: "Fecha y hora de creación",
    sortable: true
  }, {
    field: "updated_at",
    header: "Fecha y hora de subida",
    sortable: true
  }, {
    field: "actions",
    header: "Acciones",
    body: data => /*#__PURE__*/React.createElement(TableActionsMenu, {
      data: data,
      onLoadExamResults: onLoadExamResults,
      onViewExamResults: onViewExamResults,
      onUploadExamsFile: onUploadExamsFile,
      onPrint: async () => {
        if (data.minioId) {
          //@ts-ignore
          const url = await getFileUrl(data.minioId);
          window.open(url, "_blank");
        } else {
          //@ts-ignore
          generarFormato("Examen", data.original, "Impresion");
        }
      },
      onDownload: async () => {
        if (data.minioId) {
          try {
            //@ts-ignore
            const url = await getFileUrl(data.minioId);
            var link = document.createElement("a");
            link.href = url.replace("http", "https");
            link.download = "file.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (error) {
            console.error("Error al descargar:", error);
          }
        } else {
          //@ts-ignore
          crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
        }
      },
      onShare: async () => {
        const user = await userService.getLoggedUser();
        //@ts-ignore
        enviarDocumento(data.id, "Descarga", "Examen", "Completa", data.patientId, user.id, "Orden de examen");
      }
    })
  }];
  const columnsPendingExams = [{
    field: "patientName",
    header: "Paciente",
    sortable: true
  }, {
    field: "examName",
    header: "Exámenes ordenados",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: data => {
      const color = examOrderStateColors[data.state] || "secondary";
      const text = examOrderStates[data.state] || "SIN ESTADO";
      const severityMap = {
        'success': 'success',
        'warning': 'warning',
        'danger': 'danger',
        'info': 'info',
        'primary': 'secondary',
        'secondary': 'secondary'
      };
      const severity = severityMap[color] || 'secondary';
      return /*#__PURE__*/React.createElement(Badge, {
        value: text,
        severity: severity,
        className: "p-badge-lg"
      });
    }
  }, {
    field: "dateTime",
    header: "Fecha y hora de creación",
    sortable: true
  }, {
    field: "actions",
    header: "Acciones",
    body: data => /*#__PURE__*/React.createElement(TableActionsMenu, {
      data: data,
      onLoadExamResults: onLoadExamResults,
      onViewExamResults: onViewExamResults,
      onUploadExamsFile: onUploadExamsFile,
      onPrint: async () => {
        if (data.minioId) {
          //@ts-ignore
          const url = await getFileUrl(data.minioId);
          window.open(url, "_blank");
        } else {
          //@ts-ignore
          generarFormato("Examen", data.original, "Impresion");
        }
      },
      onDownload: async () => {
        if (data.minioId) {
          try {
            //@ts-ignore
            const url = await getFileUrl(data.minioId);
            var link = document.createElement("a");
            link.href = url.replace("http", "https");
            link.download = "file.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (error) {
            console.error("Error al descargar:", error);
          }
        } else {
          //@ts-ignore
          crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
        }
      },
      onShare: async () => {
        const user = await userService.getLoggedUser();
        //@ts-ignore
        enviarDocumento(data.id, "Descarga", "Examen", "Completa", data.patientId, user.id, "Orden de examen");
      }
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Resultados Cargados"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columnsUploadExams,
    data: uploadedExams,
    lazy: false,
    onReload: onReload
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Pendientes por cargar"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columnsPendingExams,
    data: pendingExams,
    lazy: false,
    onReload: onReload
  }))))), /*#__PURE__*/React.createElement(CustomModal, {
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
      }
    }, "Confirmar"))
  }, pdfPreviewUrl ? /*#__PURE__*/React.createElement("embed", {
    src: pdfPreviewUrl,
    width: "100%",
    height: "500px",
    type: "application/pdf"
  }) : /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")));
};
const TableActionsMenu = ({
  data,
  onLoadExamResults,
  onViewExamResults,
  onUploadExamsFile,
  onPrint,
  onDownload,
  onShare
}) => {
  const menu = useRef(null);
  const items = [...(data.state === "generated" ? [{
    label: "Realizar examen",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-check ml-4"
    }),
    command: () => {
      onLoadExamResults(data);
      menu.current?.hide();
    }
  }, {
    separator: true
  }, {
    label: "Subir examen",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-up ml-4"
    }),
    command: () => {
      onUploadExamsFile(data.id);
      menu.current?.hide();
    }
  }] : []), ...(data.state === "uploaded" ? [{
    label: "Visualizar resultados",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-eye"
    }),
    command: () => {
      onViewExamResults(data, data.minioId);
      menu.current?.hide();
    }
  }, {
    separator: true
  }, {
    label: "Imprimir",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-print"
    }),
    command: () => {
      onPrint();
      menu.current?.hide();
    }
  }, {
    separator: true
  }, {
    label: "Descargar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-download "
    }),
    command: () => {
      onDownload();
      menu.current?.hide();
    }
  }, {
    separator: true
  }, {
    label: "WhatsApp",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-share"
    }),
    command: () => {
      onShare();
      menu.current?.hide();
    }
  }] : [])];
  const handleMenuHide = () => {};
  return /*#__PURE__*/React.createElement("div", {
    className: "table-actions-menu"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-ellipsis-v",
    className: "p-button-rounded btn-primary",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${data.id}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: items,
    popup: true,
    ref: menu,
    id: `popup_menu_${data.id}`,
    onHide: handleMenuHide,
    appendTo: typeof document !== 'undefined' ? document.body : undefined
  }));
};