import React from 'react';
import CustomDataTable from '../components/CustomDataTable.js';
import TableActionsWrapper from '../components/table-actions/TableActionsWrapper.js';
import { EditTableAction } from '../components/table-actions/EditTableAction.js';
import { DeleteTableAction } from '../components/table-actions/DeleteTableAction.js';
const UserTable = ({
  users,
  onEditItem,
  onDeleteItem,
  onAddSignature
}) => {
  const columns = [{
    data: 'fullName'
  }, {
    data: 'role'
  }, {
    data: 'city'
  }, {
    data: 'phone'
  }, {
    data: 'email'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    5: (cell, data) => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => onEditItem && onEditItem(data.id)
    }), /*#__PURE__*/React.createElement(DeleteTableAction, {
      onTrigger: () => onDeleteItem && onDeleteItem(data.id)
    }), data.roleGroup === 'DOCTOR' && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => onAddSignature && onAddSignature(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-signature",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "A\xF1adir firma")))))
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
  }, "Rol"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Ciudad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "N\xFAmero de contacto"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Correo"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};
export default UserTable;