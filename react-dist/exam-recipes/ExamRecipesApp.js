import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { useExamRecipes } from "./hooks/useExamRecipes.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { examRecipeService, userService } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { examRecipeStatus, examRecipeStatusColors } from "../../services/commons.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { Menu } from "primereact/menu";
const patientId = new URLSearchParams(window.location.search).get("patient_id");
export const ExamRecipesApp = () => {
  const {
    examRecipes,
    fetchExamRecipes
  } = useExamRecipes(patientId);
  const [tableExamRecipes, setTableExamRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  useEffect(() => {
    const mappedExamRecipes = examRecipes.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).map(prescription => ({
      id: prescription.id,
      doctor: `${prescription.user.first_name || ""} ${prescription.user.middle_name || ""} ${prescription.user.last_name || ""} ${prescription.user.second_last_name || ""}`,
      exams: prescription.details.map(detail => detail.exam_type.name).join(", "),
      patientId: prescription.patient_id,
      created_at: new Intl.DateTimeFormat("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(prescription.created_at)),
      status: prescription.status,
      resultMinioUrl: prescription.result?.result_minio_url,
      user: prescription.user,
      details: prescription.details
    }));
    setTableExamRecipes(mappedExamRecipes);
    setTotalRecords(mappedExamRecipes.length);
  }, [examRecipes]);
  const cancelPrescription = async id => {
    SwalManager.confirmCancel(async () => {
      try {
        await examRecipeService.cancel(id);
        SwalManager.success({
          title: "Receta anulada",
          text: "La receta ha sido anulada correctamente."
        });
        fetchExamRecipes(patientId);
      } catch (error) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo anular la receta."
        });
      }
    });
  };
  const seeExamRecipeResults = async minioUrl => {
    if (minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(minioUrl);
      window.open(url, '_blank');
    }
  };
  const handlePageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const handleSearchChange = value => {
    setGlobalFilter(value);
  };
  const handleReload = () => {
    fetchExamRecipes(patientId);
  };
  const columns = [{
    field: "doctor",
    header: "Doctor",
    sortable: true
  }, {
    field: "exams",
    header: "Exámenes recetados",
    sortable: true
  }, {
    field: "created_at",
    header: "Fecha de creación",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: rowData => {
      const color = examRecipeStatusColors[rowData.status];
      const text = examRecipeStatus[rowData.status] || "SIN ESTADO";

      // Mapear colores de Phoenix a PrimeReact
      const severityMap = {
        'success': 'success',
        'warning': 'warning',
        'danger': 'danger',
        'info': 'info',
        'primary': null,
        // No hay equivalente directo, usar secondary
        'secondary': null
      };
      const severity = severityMap[color] || 'secondary';
      return /*#__PURE__*/React.createElement(Badge, {
        value: text,
        severity: severity,
        className: "p-badge-lg"
      });
    }
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(TableActionsMenu, {
      rowData: rowData,
      onPrint: () => {
        generarFormato("RecetaExamen", rowData, "Impresion");
      },
      onDownload: () => {
        generarFormato("RecetaExamen", rowData, "Descarga");
      },
      onViewResults: () => seeExamRecipeResults(rowData.resultMinioUrl),
      onCancel: () => cancelPrescription(rowData.id),
      onShare: async () => {
        const user = await userService.getLoggedUser();
        //@ts-ignore
        enviarDocumento(rowData.id, "Descarga", "RecetaExamen", "Completa", rowData.patientId, user.id, "Receta_de_examenes");
      }
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableExamRecipes,
    lazy: false,
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: handleReload
  }))));
};
const TableActionsMenu = ({
  rowData,
  onPrint,
  onDownload,
  onViewResults,
  onCancel,
  onShare
}) => {
  const menu = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const items = [{
    label: "Imprimir",
    icon: "pi pi-print",
    command: () => {
      onPrint();
      menu.current?.hide(); // Cerrar el menú después de la acción
    }
  }, {
    label: "Descargar",
    icon: "pi pi-download",
    command: () => {
      onDownload();
      menu.current?.hide(); // Cerrar el menú después de la acción
    }
  }, ...(rowData.status === "uploaded" ? [{
    label: "Visualizar resultados",
    icon: "pi pi-eye",
    command: () => {
      onViewResults();
      menu.current?.hide(); // Cerrar el menú después de la acción
    }
  }] : []), ...(rowData.status === "pending" ? [{
    label: "Anular receta",
    icon: "pi pi-times",
    command: () => {
      onCancel();
      menu.current?.hide(); // Cerrar el menú después de la acción
    }
  }] : []), {
    separator: true
  }, {
    label: "Compartir",
    icon: "pi pi-share-alt",
    items: [{
      label: "WhatsApp",
      icon: "pi pi-whatsapp",
      command: () => {
        onShare();
        menu.current?.hide(); // Cerrar el menú después de la acción
      }
    }]
  }];
  const handleMenuHide = () => {
    setOpenMenuId(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "table-actions-menu"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-ellipsis-v",
    className: "p-button-rounded btn-primary",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${rowData.id}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: items,
    popup: true,
    ref: menu,
    id: `popup_menu_${rowData.id}`,
    onHide: handleMenuHide,
    appendTo: typeof document !== 'undefined' ? document.body : undefined
  }));
};