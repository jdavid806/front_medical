import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getAge } from "../../services/utilidades.js";
import CustomDataTable from "../components/CustomDataTable.js";
export const PatientTable = ({
  items
}) => {
  const [tableItems, setTableItems] = useState([]);
  useEffect(() => {
    const mappedItems = items.map(item => {
      const lastAppointment = item.appointments.sort((a, b) => {
        const dateComparison = new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
        if (dateComparison !== 0) return dateComparison;
        const timeComparison = a.appointment_time.localeCompare(b.appointment_time);
        return timeComparison;
      })[0] || null;
      const age = getAge(item.date_of_birth);
      return {
        id: item.id.toString(),
        patientName: `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''} ${item.second_last_name || ''}`.trim() || '--',
        documentNumber: item.document_number,
        phone: item.whatsapp || '--',
        age: age > 0 ? `${getAge(item.date_of_birth).toString()} años` : '--',
        dateLastAppointment: lastAppointment?.appointment_date || '--'
      };
    });
    setTableItems(mappedItems);
  }, [items]);
  const columns = [{
    data: 'patientName'
  }, {
    data: 'documentNumber'
  }, {
    data: 'phone'
  }, {
    data: 'age'
  }, {
    data: 'dateLastAppointment'
  }];
  const slots = {
    0: (cell, data) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: `verPaciente?id=${data.id}`
    }, data.patientName))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableItems,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th",
    style: {
      width: '250px'
    }
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Edad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha \xFAltima cita")))))));
};