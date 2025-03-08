import { PrimeReactProvider } from "primereact/api";
import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { userService, evolutionNotesService } from "../../services/api/index.js";
export const EvolutionsContent = () => {
  const [dates, setDates] = useState([new Date("2025-01-01"), new Date()]);
  const [mappedServiceDoctors, setMappedServiceDoctors] = useState([]);
  const [selectedService, setSelectedService] = useState(1);
  const [dataRemissions, SetdataRemissions] = useState([]);
  useEffect(() => {
    fetchDoctors();
    handeFilter();
  }, []);
  const fetchDoctors = async () => {
    const data = await userService.getAll();
    const mappedData = data.map(item => {
      return {
        value: item.id,
        label: item.first_name + " " + item.last_name
      };
    });
    setMappedServiceDoctors(mappedData);
  };
  const handeFilter = async () => {
    const patientId = new URLSearchParams(window.location.search).get("patient_id");
    const startDate = formatDateRange(dates)[0];
    const endDate = formatDateRange(dates)[1];
    const data = await evolutionNotesService.getEvolutionsByParams(startDate, endDate, selectedService, patientId);
    SetdataRemissions(data);
  };
  const formatDateRange = dateRange => {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) return "";
    const formatDate = date => date.toISOString().split("T")[0];
    const [fromDate, toDate] = dateRange;
    return [formatDate(fromDate), formatDate(toDate)];
  };
  const formatDate = isoDate => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion",
    id: "accordionExample"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "headingThree"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#collapseThree",
    "aria-expanded": "false",
    "aria-controls": "collapseThree"
  }, "Filtros")), /*#__PURE__*/React.createElement("div", {
    className: "accordion-collapse collapse",
    id: "collapseThree",
    "aria-labelledby": "headingThree",
    "data-bs-parent": "#accordionExample"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body pt-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "doctors",
    className: "form-label"
  }, "Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dates,
    onChange: e => setDates(e.value),
    selectionMode: "range",
    appendTo: "self",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "doctors",
    className: "form-label"
  }, "Doctores"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "doctors",
    value: selectedService,
    onChange: e => setSelectedService(e.value),
    options: mappedServiceDoctors,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    appendTo: "self"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handeFilter,
    className: "btn btn-primary"
  }, "Filtrar")))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, dataRemissions.length === 0 ? /*#__PURE__*/React.createElement("p", null, "No hay datos disponibles") : dataRemissions.map((note, index) => /*#__PURE__*/React.createElement("div", {
    className: "card my-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "10px",
      height: "10px",
      backgroundColor: note.is_active ? "green" : "red",
      borderRadius: "50%",
      display: "inline-block",
      marginLeft: "8px"
    }
  }), /*#__PURE__*/React.createElement("strong", null, note.clinical_record.clinical_record_type.name)), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, note.note), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("strong", null, note.created_by_user.first_name + " " + note.created_by_user.last_name), /*#__PURE__*/React.createElement("span", {
    className: "card-text"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, formatDate(note.created_at))))))))));
};