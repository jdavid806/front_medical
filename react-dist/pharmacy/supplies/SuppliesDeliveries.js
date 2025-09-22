import React, { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { SuppliesDeliveryFormModal } from "./SuppliesDeliveryFormModal.js";
import { SuppliesDeliveriesTable } from "./SuppliesDeliveriesTable.js";
export const SuppliesDeliveries = () => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const requestSupplyMenu = useRef(null);
  const tableRef = useRef(null);
  const requestSupplyMenuItems = [{
    label: 'Administrativo',
    command: () => {
      setShowRequestDialog(true);
    }
  }];
  const handleSave = () => {
    tableRef.current?.refresh();
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Menu, {
    model: requestSupplyMenuItems,
    popup: true,
    ref: requestSupplyMenu,
    id: "popup_menu_left"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Solicitar Insumos",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    }),
    onClick: event => requestSupplyMenu.current?.toggle(event),
    className: "btn btn-primary",
    "aria-controls": "popup_menu_left",
    "aria-haspopup": true
  })), /*#__PURE__*/React.createElement(SuppliesDeliveriesTable, {
    ref: tableRef
  })), /*#__PURE__*/React.createElement(SuppliesDeliveryFormModal, {
    visible: showRequestDialog,
    onHide: () => setShowRequestDialog(false),
    onSave: handleSave
  }));
};