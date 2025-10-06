import React, { useEffect, useRef, useState } from "react";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { clinicalRecordStateColors, clinicalRecordStates } from "../../../services/commons.js";
import { HtmlRenderer } from "../../components/HtmlRenderer.js";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
export const PatientClinicalRecordsTable = ({
  records,
  onSeeDetail,
  onCancelItem,
  onPrintItem,
  onDownloadItem,
  onShareItem,
  first,
  rows,
  totalRecords,
  loading,
  onPage,
  onReload,
  onSearch,
  onSort
}) => {
  const [tableRecords, setTableRecords] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState(1); // 1 for asc, -1 for desc

  useEffect(() => {
    const mappedRecords = records.map(clinicalRecord => {
      const formattedDate = new Date(clinicalRecord.created_at).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      return {
        id: clinicalRecord.id,
        clinicalRecordName: clinicalRecord.clinical_record_type.name,
        clinicalRecordType: clinicalRecord.clinical_record_type.key_ || "",
        description: clinicalRecord.description || "--",
        doctorName: `${clinicalRecord.created_by_user.first_name} ${clinicalRecord.created_by_user.middle_name} ${clinicalRecord.created_by_user.last_name} ${clinicalRecord.created_by_user.second_last_name}`,
        status: clinicalRecord.status,
        patientId: clinicalRecord.patient_id,
        patient: clinicalRecord.patient,
        createdAt: formattedDate,
        user: clinicalRecord.created_by_user,
        data: clinicalRecord.data,
        clinicalRecordTypeId: clinicalRecord.clinical_record_type.id
      };
    }).sort((a, b) => {
      // Función para convertir el string en fecha
      const parseCustomDate = dateString => {
        const [datePart, timePart] = dateString.split(", ");
        const [dayStr, monthStr, yearStr] = datePart.split(" de ");
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const day = parseInt(dayStr, 10);
        const month = months.indexOf(monthStr.toLowerCase());
        const year = parseInt(yearStr, 10);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        return new Date(year, month, day, hours, minutes, seconds);
      };
      const dateA = parseCustomDate(a.createdAt);
      const dateB = parseCustomDate(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Orden descendente
    });
    setTableRecords(mappedRecords);
  }, [records]);
  const handleSort = e => {
    const {
      sortField,
      sortOrder
    } = e;
    setSortField(sortField);
    setSortOrder(sortOrder === 1 ? 1 : -1);
    if (onSort) {
      onSort(e);
    }
  };
  const columns = [{
    field: "clinicalRecordName",
    header: "Nombre de la historia",
    sortable: true
  }, {
    field: "doctorName",
    header: "Doctor(a)",
    sortable: true
  }, {
    field: "description",
    header: "Observaciones",
    body: data => /*#__PURE__*/React.createElement(HtmlRenderer, {
      htmlContent: data.description
    })
  }, {
    field: "createdAt",
    header: "Fecha de creación",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: data => {
      const color = clinicalRecordStateColors[data.status] || "secondary";
      const text = clinicalRecordStates[data.status] || "SIN ESTADO";
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
    field: "actions",
    header: "Acciones",
    body: data => /*#__PURE__*/React.createElement(TableActionsMenu, {
      data: data,
      onSeeDetail: onSeeDetail,
      onCancelItem: onCancelItem,
      onPrintItem: onPrintItem,
      onDownloadItem: onDownloadItem,
      onShareItem: onShareItem
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableRecords,
    lazy: true,
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    loading: loading,
    sortField: sortField,
    sortOrder: sortOrder,
    onPage: onPage,
    onSearch: onSearch,
    onReload: onReload,
    onSort: handleSort
  }))));
};
const TableActionsMenu = ({
  data,
  onSeeDetail,
  onCancelItem,
  onPrintItem,
  onDownloadItem,
  onShareItem
}) => {
  const menu = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const items = [{
    label: "Ver detalle",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-eye me-2"
    }),
    command: () => onSeeDetail && onSeeDetail(data.id, data.clinicalRecordType)
  }, {
    label: "Realizar revisión",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit me-2"
    }),
    visible: data.status === "pending_review",
    command: () => {
      console.log("Realizar revisión");
    }
  }, {
    label: "Solicitar cancelación",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    command: () => onCancelItem && onCancelItem(data.id)
  }, {
    label: "Imprimir",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-print me-2"
    }),
    command: () => onPrintItem && onPrintItem(data, data.id, data.clinicalRecordName)
  }, {
    label: "Descargar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-download me-2"
    }),
    command: () => onDownloadItem && onDownloadItem(data.id, data.clinicalRecordName)
  }, {
    separator: true
  }, {
    label: "Compartir",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-share-alt me-2"
    }),
    items: [{
      label: "WhatsApp",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-whatsapp me-2"
      }),
      command: () => onShareItem && onShareItem(data, "whatsapp")
    }, {
      label: "Email",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-envelope me-2"
      }),
      command: () => onShareItem && onShareItem(data, "email")
    }]
  }];
  const handleMenuHide = () => {
    setOpenMenuId(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "table-actions-menu"
  }, /*#__PURE__*/React.createElement(Button, {
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