import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { usePatientsByFilters } from "./hooks/usePatientsByFilters.js";
import { getAge } from "../../services/utilidades.js";
import PatientFormModal from "./modals/form/PatientFormModal.js";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
export const PatientAsyncTable = () => {
  const [tableItems, setTableItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    patients,
    fetchPatientsByFilters,
    loading,
    totalRecords
  } = usePatientsByFilters();
  useEffect(() => {
    fetchPatientsByFilters({});
  }, []);
  const handlePageChange = page => {
    console.log(page);
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchPatientsByFilters({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? ""
    });
  };
  const handlePatientCreated = () => {
    setShowPatientModal(false);
    refresh(); // Refrescar la tabla después de crear un paciente
  };
  const handlePatientUpdated = () => {
    setShowEditModal(false);
    setEditingPatient(null);
    refresh(); // Refrescar la tabla después de editar un paciente
  };
  const handleSearchChange = _search => {
    console.log(_search);
    setSearch(_search);
    fetchPatientsByFilters({
      per_page: perPage,
      page: currentPage,
      search: _search
    });
  };
  const refresh = () => fetchPatientsByFilters({
    per_page: perPage,
    page: currentPage,
    search: search ?? ""
  });

  // Función para editar paciente
  const handleEditarPaciente = patientId => {
    // Encuentra el paciente completo en la lista de pacientes
    const patientToEdit = patients.find(p => p.id.toString() === patientId);
    if (patientToEdit) {
      setEditingPatient(patientToEdit);
      setShowEditModal(true);
    }
  };
  const handleActualizarPermisos = patientId => {
    console.log("Actualizar permisos de notificaciones para paciente ID:", patientId);
    // Aquí puedes implementar la lógica para actualizar permisos
  };
  useEffect(() => {
    const mappedPatients = patients.map(item => {
      const lastAppointment = item.appointments.sort((a, b) => {
        const dateComparison = new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
        if (dateComparison !== 0) return dateComparison;
        const timeComparison = a.appointment_time.localeCompare(b.appointment_time);
        return timeComparison;
      })[0] || null;
      const age = getAge(item.date_of_birth);
      return {
        id: item.id.toString(),
        patientName: `${item.first_name || ""} ${item.middle_name || ""} ${item.last_name || ""} ${item.second_last_name || ""}`.trim() || "--",
        documentNumber: item.document_number,
        phone: item.whatsapp || "--",
        age: age > 0 ? `${getAge(item.date_of_birth).toString()} años` : "--",
        dateLastAppointment: lastAppointment?.appointment_date || "--"
      };
    });
    setTableItems(mappedPatients);
  }, [patients]);
  const columns = [{
    field: "patientName",
    header: "Nombre del paciente",
    body: rowData => {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
        href: `verPaciente?id=${rowData.id}`
      }, rowData.patientName));
    }
  }, {
    field: "documentNumber",
    header: "Nro. de documento"
  }, {
    field: "phone",
    header: "Teléfono"
  }, {
    field: "age",
    header: "Edad"
  }, {
    field: "dateLastAppointment",
    header: "Fecha de última consulta"
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TableMenu, {
        patientId: rowData.id,
        onEditarPaciente: handleEditarPaciente,
        onActualizarPermisos: handleActualizarPermisos
      }));
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Paciente ",
    className: "btn btn-primary",
    onClick: () => setShowPatientModal(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    sortField: "createdAt",
    sortOrder: -1,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    loading: loading,
    totalRecords: totalRecords,
    rows: perPage,
    first: first,
    onReload: refresh,
    lazy: true
  }))), /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showPatientModal,
    onHide: () => setShowPatientModal(false),
    onSuccess: handlePatientCreated
  }), editingPatient && /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showEditModal,
    onHide: () => setShowEditModal(false),
    onSuccess: handlePatientUpdated,
    patientData: editingPatient
  }));
};

// Componente del menú de acciones para cada fila
const TableMenu = ({
  patientId,
  onEditarPaciente,
  onActualizarPermisos
}) => {
  const menu = useRef(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    className: "btn-primary flex items-center gap-2",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${patientId}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: [{
      label: "Editar paciente",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-pencil-alt me-2"
      }),
      command: () => onEditarPaciente(patientId)
    }, {
      label: "Actualizar permisos de notificaciones",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-bell me-2"
      }),
      command: () => onActualizarPermisos(patientId)
    }],
    popup: true,
    ref: menu,
    id: `popup_menu_${patientId}`,
    style: {
      zIndex: 9999
    }
  }));
};