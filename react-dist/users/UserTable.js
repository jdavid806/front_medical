import React from 'react';
import CustomDataTable from '../components/CustomDataTable.js';
import { useAllTableUsers } from './hooks/useAllTableUsers.js';
import { UserTableActions } from './UserTableActions.js';
const UserTable = () => {
  const {
    users
  } = useAllTableUsers();
  const columns = [{
    data: 'fullName'
  }, {
    data: 'specialty'
  }, {
    data: 'gender'
  }, {
    data: 'phone'
  }, {
    data: 'email'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    5: (cell, data) => /*#__PURE__*/React.createElement(UserTableActions, null)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: users,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Especialidad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "G\xE9nero"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "N\xFAmero de contacto"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Correo"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};
export default UserTable;