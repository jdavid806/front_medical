import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import { examOrderStateColors, examOrderStates } from "../../../services/commons.js";
export const ExamTable = ({
  exams,
  onLoadExamResults
}) => {
  const [tableExams, setTableExams] = useState([]);
  useEffect(() => {
    const mappedExams = exams.map(exam => {
      return {
        id: exam.id,
        examName: exam.exam_type?.name ?? '--',
        status: examOrderStates[exam.exam_order_state?.name] ?? '--',
        statusColor: examOrderStateColors[exam.exam_order_state?.name] ?? '--'
      };
    });
    console.log('Mapped exams', mappedExams);
    setTableExams(mappedExams);
  }, [exams]);
  const columns = [{
    data: 'examName'
  }, {
    data: 'status'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    1: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${data.statusColor}`
    }, data.status),
    2: (cell, data) => /*#__PURE__*/React.createElement("div", {
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
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      id: "cargarResultadosBtn",
      onClick: () => onLoadExamResults(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-upload",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Cargar resultados")))))))
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
  }, "Tipo de Examen"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};