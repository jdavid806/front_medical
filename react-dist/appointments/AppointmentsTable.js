import React, { useEffect, useState } from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { PreadmissionForm } from "./PreadmissionForm.js";
import { PrintTableAction } from "../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../components/table-actions/ShareTableAction.js";
import { appointmentService } from "../../services/api/index.js";
import UserManager from "../../services/userManager.js";
import { appointmentStatesColors, appointmentStateColorsByKey, appointmentStateFilters, appointmentStatesByKeyTwo } from "../../services/commons.js";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm.js";
export const AppointmentsTable = () => {
  const {
    appointments
  } = useFetchAppointments(appointmentService.active());
  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [filteredAppointments, setFilteredAppointments] = React.useState([]);
  const columns = [{
    data: "patientName",
    className: "text-start",
    orderable: true
  }, {
    data: "patientDNI",
    className: "text-start",
    orderable: true
  }, {
    data: "date",
    className: "text-start",
    orderable: true,
    type: "date"
  }, {
    data: "time",
    orderable: true
  }, {
    data: "doctorName",
    orderable: true
  }, {
    data: "entity",
    orderable: true
  }, {
    data: "status",
    orderable: true
  }];
  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {}
  });
  useEffect(() => {
    let filtered = [...appointments];
    if (selectedBranch) {
      filtered = filtered.filter(appointment => `${appointment.stateKey}` === selectedBranch);
    }
    if (selectedDate?.length === 2 && selectedDate[0] && selectedDate[1]) {
      const startDate = new Date(Date.UTC(selectedDate[0].getFullYear(), selectedDate[0].getMonth(), selectedDate[0].getDate()));
      const endDate = new Date(Date.UTC(selectedDate[1].getFullYear(), selectedDate[1].getMonth(), selectedDate[1].getDate(), 23, 59, 59, 999));
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }
    setFilteredAppointments(filtered);
  }, [appointments, selectedBranch, selectedDate]);
  const handleMakeClinicalRecord = (patientId, appointmentId) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
      }
    });
  };

  //filtrar objecto en el select
  const getAppointmentStates = () => {
    return Object.entries(appointmentStateFilters).map(([key, label]) => ({
      value: key,
      label: label
    }));
  };
  const handleCancelAppointment = appointmentId => {};
  const handleHideFormModal = () => {
    setShowFormModal({
      isShow: false,
      data: {}
    });
  };
  const handleLoadExamResults = (appointmentId, patientId, productId) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
  };
  const handleLoadExamResultsFile = () => {
    setShowLoadExamResultsFileModal(true);
  };
  const slots = {
    6: (cell, data) => {
      const color = appointmentStateColorsByKey[data.stateKey] || appointmentStatesColors[data.stateId];
      const text = appointmentStatesByKeyTwo[data.stateKey]?.[data.attentionType] || appointmentStatesByKeyTwo[data.stateKey] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text);
    },
    7: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "text-end align-middle"
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
      className: "dropdown-menu",
      style: {
        zIndex: 10000
      }
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: () => setShowFormModal({
        isShow: true,
        data: data
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid far fa-hospital",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Generar preadmision")))), (data.stateId === "2" || data.stateKey === "pending_consultation" || data.stateKey === "in_consultation") && data.attentionType === "CONSULTATION" && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleMakeClinicalRecord(data.patientId, data.id);
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar consulta")))), (data.stateId === "2" || data.stateKey === "pending_consultation" || data.stateKey === "in_consultation") && data.attentionType === "PROCEDURE" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleLoadExamResults(data.id, data.patientId, data.productId);
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar examen")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleLoadExamResultsFile();
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Subir resultados"))))), data.stateId === "1" || data.stateKey === "pending" && /*#__PURE__*/React.createElement(React.Fragment, null)
    // <li>
    //   <a
    //     className="dropdown-item"
    //     href="#"
    //     onClick={(e) => {
    //       e.preventDefault();
    //       handleCancelAppointment(data.id);
    //     }}
    //     data-column="realizar-consulta"
    //   >
    //     <div className="d-flex gap-2 align-items-center">
    //       <i
    //         className="fa-solid fa-ban"
    //         style={{ width: "20px" }}
    //       ></i>
    //       <span>Cancelar cita</span>
    //     </div>
    //   </a>
    // </li>
    , /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Cita"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => {
        // @ts-ignore
        shareAppointmentMessage(data.id, data.patientId);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-whatsapp",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Compartir cita")))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Factura"), /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generateInvoice(data.id, false);
      }
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generateInvoice(data.id, true);
      }
    }), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: () => {
        //@ts-ignore
        sendInvoice(data.id, data.patientId);
      }
    }), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "email",
      onTrigger: () => {
        //@ts-ignore
        sendInvoice(data.id, data.patientId);
      }
    }))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar citas")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "branch_id",
    className: "form-label"
  }, "Estados"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "branch_id",
    options: getAppointmentStates(),
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    placeholder: "Filtrar por estado",
    className: "w-100",
    value: selectedBranch,
    onChange: e => setSelectedBranch(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: filteredAppointments,
    slots: slots,
    customOptions: {
      order: [[1, 'asc'], [2, "asc"]],
      ordering: true,
      columnDefs: [{
        orderable: false,
        targets: [7]
      }]
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "N\xFAmero de documento"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Fecha Consulta"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Hora Consulta"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Profesional asignado"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "createPreadmission",
    show: showFormModal.isShow,
    onHide: handleHideFormModal,
    title: "Crear Preadmision" + " - " + showFormModal.data["patientName"]
  }, /*#__PURE__*/React.createElement(PreadmissionForm, {
    initialValues: showFormModal.data,
    formId: "createPreadmission"
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "loadExamResultsFile",
    show: showLoadExamResultsFileModal,
    onHide: () => setShowLoadExamResultsFileModal(false),
    title: "Subir resultados de examen"
  }, /*#__PURE__*/React.createElement(ExamResultsFileForm, null)));
};