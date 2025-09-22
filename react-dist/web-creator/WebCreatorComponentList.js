import { Divider } from "primereact/divider";
import React from "react";
import { generateUUID } from "../../services/utilidades.js";
export const WebCreatorComponentList = ({
  onComponentClick
}) => {
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const components = [{
    uuid: "1",
    name: "Logo",
    type: "logo",
    imgSrc: "assets/img/logos/FullColor.svg"
  }, {
    uuid: "2",
    name: "Menubar",
    type: "menubar",
    imgSrc: "assets/img/logos/FullColor.svg",
    menuItems: [{
      label: 'Home',
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-home"
      })
    }, {
      label: 'About',
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-info"
      })
    }, {
      label: 'Contact',
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-phone"
      })
    }]
  }, {
    uuid: "3",
    name: "Botón agendar",
    type: "button",
    action: "OPEN_DIALOG",
    dialogComponent: "SCHEDULE_APPOINTMENT",
    label: "Agendar una cita",
    icon: "fa fa-calendar"
  }, {
    uuid: "4",
    name: "Sidebar",
    type: "sidebar",
    imgSrc: "assets/img/logos/FullColor.svg"
  }, {
    uuid: "5",
    name: "Banner",
    type: "banner",
    imgSrc: "assets/img/logos/FullColor.svg"
  }, {
    uuid: "6",
    name: "Content",
    type: "content",
    imgSrc: "assets/img/logos/FullColor.svg"
  }, {
    uuid: "7",
    name: "Footer",
    type: "footer",
    imgSrc: "assets/img/logos/FullColor.svg"
  }, {
    uuid: generateUUID(),
    name: "Campo de texto",
    type: "input",
    label: "Campo de texto",
    icon: "",
    controlType: "text"
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Componentes"), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, components.map(component => /*#__PURE__*/React.createElement("div", {
    key: component.uuid,
    onClick: () => {
      setSelectedComponent(component);
      onComponentClick(component);
    },
    className: selectedComponent?.uuid === component.uuid ? "cursor-pointer border border-1 border-primary" : "cursor-pointer"
  }, /*#__PURE__*/React.createElement("p", null, component.name)))));
};