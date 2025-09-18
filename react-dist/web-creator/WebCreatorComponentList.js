import { Divider } from "primereact/divider";
import React from "react";
export const WebCreatorComponentList = ({
  onComponentClick
}) => {
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const components = [{
    uuid: "1",
    name: "Logo",
    type: "logo",
    imgSrc: "https://via.placeholder.com/150"
  }, {
    uuid: "2",
    name: "Menubar",
    type: "menubar",
    imgSrc: "https://via.placeholder.com/150"
  }, {
    uuid: "3",
    name: "Botón agendar",
    type: "button",
    imgSrc: "https://via.placeholder.com/150"
  }, {
    uuid: "4",
    name: "Sidebar",
    type: "sidebar",
    imgSrc: "https://via.placeholder.com/150"
  }, {
    uuid: "5",
    name: "Banner",
    type: "banner",
    imgSrc: "https://via.placeholder.com/150"
  }, {
    uuid: "6",
    name: "Content",
    type: "content",
    imgSrc: "https://via.placeholder.com/150"
  }, {
    uuid: "7",
    name: "Footer",
    type: "footer",
    imgSrc: "https://via.placeholder.com/150"
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