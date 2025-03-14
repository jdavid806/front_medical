import React, { useEffect } from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { appointmentService } from "../../services/api/index.js";
import { appointmentStates, appointmentStatesColors } from "../../services/commons.js";
import UserManager from "../../services/userManager.js";
import { useBranchesForSelect } from "../branches/hooks/useBranchesForSelect.js";
export const AppointmentsTable = () => {
  const {
    appointments
  } = useFetchAppointments(appointmentService.active());
  const {
    branches
  } = useBranchesForSelect();
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
  useEffect(() => {
    let filtered = [...appointments];

    // Filtro por sucursal
    if (selectedBranch) {
      filtered = filtered.filter(appointment => appointment.branchId === selectedBranch);
    }

    // Filtro por rango de fechas
    if (selectedDate?.length === 2 && selectedDate[0] && selectedDate[1]) {
      const startDate = new Date(selectedDate[0]);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate[1]);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }

    // Ordenar por fecha de consulta
    filtered.sort((a, b) => {
      return b.date.localeCompare(a.date);
    });
    setFilteredAppointments(filtered);
  }, [appointments, selectedBranch, selectedDate]);
  const handleMakeClinicalRecord = patientId => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}`;
      }
    });
  };
  const handleCancelAppointment = appointmentId => {
    console.log("cancel appointment", appointmentId);
  };
  const slots = {
    6: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${appointmentStatesColors[data.stateId]}`
    }, appointmentStates[data.stateId]),
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
    }, data.stateId === "2" && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleMakeClinicalRecord(data.patientId);
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar consulta")))), data.stateId === "1" && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleCancelAppointment(data.id);
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ban",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Cancelar cita")))))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: filteredAppointments,
    slots: slots,
    customOptions: {
      order: [[2, "desc"]],
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
  })))))));
};