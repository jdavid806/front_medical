import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AppointmentFormModal } from "../../appointments/AppointmentFormModal.js";
export const WebCreatorButton = ({
  component
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleClick = () => {
    console.log(component);
    switch (component.action) {
      case "OPEN_DIALOG":
        setOpenDialog(true);
        break;
      default:
        break;
    }
  };
  const renderDialogComponent = () => {
    switch (component.dialogComponent) {
      default:
        return /*#__PURE__*/React.createElement(React.Fragment, null, "Dialog");
    }
  };
  const renderDialog = () => {
    switch (component.dialogComponent) {
      case "SCHEDULE_APPOINTMENT":
        return /*#__PURE__*/React.createElement(AppointmentFormModal, {
          isOpen: openDialog,
          onClose: () => setOpenDialog(false)
        });
      default:
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
          visible: openDialog,
          onHide: () => setOpenDialog(false),
          header: "Dialog",
          position: "center"
        }, renderDialogComponent()));
    }
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: component.label,
    icon: /*#__PURE__*/React.createElement("i", {
      className: component.icon
    }),
    onClick: handleClick
  }), renderDialog());
};