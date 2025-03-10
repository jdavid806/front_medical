import React, { useEffect } from 'react';
import CustomDataTable from '../../components/CustomDataTable.js';
import { TableBasicActions } from '../../components/TableBasicActions.js';
const PrescriptionTable = ({
  prescriptions,
  onEditItem,
  onDeleteItem
}) => {
  const [tablePrescriotions, setTablePrescriptions] = React.useState([]);
  useEffect(() => {
    const mappedPrescriptions = prescriptions.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).map(prescription => ({
      id: prescription.id,
      doctor: `${prescription.prescriber.first_name} ${prescription.prescriber.last_name}`,
      patient: `${prescription.patient.first_name} ${prescription.patient.last_name}`,
      created_at: new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(prescription.created_at))
    }));
    setTablePrescriptions(mappedPrescriptions);
  }, [prescriptions]);
  const columns = [{
    data: 'doctor'
  }, {
    data: 'created_at'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    2: (cell, data) => /*#__PURE__*/React.createElement(TableBasicActions, {
      onEdit: () => onEditItem(data.id),
      onDelete: () => onDeleteItem(data.id)
    })
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tablePrescriotions,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Doctor"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};
export default PrescriptionTable;