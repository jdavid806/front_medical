import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import { useEffect } from 'react';
import { useState } from 'react';
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../../components/table-actions/DeleteTableAction.js";
export const UserRoleTable = ({
  userRoles,
  onEditItem,
  onDeleteItem
}) => {
  const [tableUserRoles, setTableUserRoles] = useState([]);
  useEffect(() => {
    const mappedUserRoles = userRoles.map(userRole => {
      return {
        id: userRole.id,
        name: userRole.name
      };
    });
    setTableUserRoles(mappedUserRoles);
  }, [userRoles]);
  const columns = [{
    data: 'name'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    1: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => onEditItem && onEditItem(data.id)
    }), /*#__PURE__*/React.createElement(DeleteTableAction, {
      onTrigger: () => onDeleteItem && onDeleteItem(data.id)
    })))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableUserRoles,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};