import React from 'react';
import { useAllPrescriptions } from '../hooks/useAllPrescriptions.js';
import { UserTableActions } from '../../users/UserTableActions.js';
import CustomDataTable from '../../components/CustomDataTable.js';
const PrescriptionTable = () => {
  const {
    prescriptions
  } = useAllPrescriptions();
  const columns = [{
    data: 'doctor'
  }, {
    data: 'patient'
  },
  // Este campo ahora debería ser una cadena con el nombre completo
  {
    data: 'created_at'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    3: (cell, data) => /*#__PURE__*/React.createElement(UserTableActions, null)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: prescriptions,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Doctor"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};
export default PrescriptionTable;