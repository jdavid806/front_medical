import React from "react";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
export const WebCreatorPanelStyleSettings = ({
  panel,
  onStyleChange
}) => {
  const handleStyleChange = (property, value) => {
    const newStyles = {
      ...panel.styles,
      [property]: value
    };
    onStyleChange({
      ...panel,
      styles: newStyles
    });
  };
  const resetStyles = () => {
    const resetStyles = {
      ...panel.styles
    };
    onStyleChange({
      ...panel,
      styles: resetStyles
    });
  };
  const justifyContentOptions = [{
    label: 'Inicio (flex-start)',
    value: 'flex-start'
  }, {
    label: 'Centro (center)',
    value: 'center'
  }, {
    label: 'Fin (flex-end)',
    value: 'flex-end'
  }, {
    label: 'Espacio entre (space-between)',
    value: 'space-between'
  }, {
    label: 'Espacio alrededor (space-around)',
    value: 'space-around'
  }, {
    label: 'Espacio uniforme (space-evenly)',
    value: 'space-evenly'
  }];
  const alignItemsOptions = [{
    label: 'Estirar (stretch)',
    value: 'stretch'
  }, {
    label: 'Inicio (flex-start)',
    value: 'flex-start'
  }, {
    label: 'Centro (center)',
    value: 'center'
  }, {
    label: 'Fin (flex-end)',
    value: 'flex-end'
  }, {
    label: 'Línea base (baseline)',
    value: 'baseline'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Estilos del Panel"), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("h5", null, "Propiedades Flex"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "justifyContent",
    className: "form-label"
  }, "Justificar Contenido"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "justifyContent",
    value: panel.styles?.justifyContent || 'flex-start',
    options: justifyContentOptions,
    onChange: e => handleStyleChange('justifyContent', e.value),
    placeholder: "Selecciona justificaci\xF3n",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "alignItems",
    className: "form-label"
  }, "Alinear Items"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "alignItems",
    value: panel.styles?.alignItems || 'stretch',
    options: alignItemsOptions,
    onChange: e => handleStyleChange('alignItems', e.value),
    placeholder: "Selecciona alineaci\xF3n",
    className: "w-100"
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "backgroundColor",
    className: "form-label"
  }, "Color de fondo"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(ColorPicker, {
    id: "backgroundColor",
    value: panel.styles?.backgroundColor || '#ffffff',
    onChange: e => handleStyleChange('backgroundColor', '#' + e.value),
    format: "hex"
  }), /*#__PURE__*/React.createElement(InputText, {
    value: panel.styles?.backgroundColor || '#ffffff',
    onChange: e => handleStyleChange('backgroundColor', e.target.value),
    placeholder: "#ffffff",
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "borderColor",
    className: "form-label"
  }, "Color del borde"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(ColorPicker, {
    id: "borderColor",
    value: panel.styles?.borderColor || '#e5e7eb',
    onChange: e => handleStyleChange('borderColor', '#' + e.value),
    format: "hex"
  }), /*#__PURE__*/React.createElement(InputText, {
    value: panel.styles?.borderColor || '#e5e7eb',
    onChange: e => handleStyleChange('borderColor', e.target.value),
    placeholder: "#e5e7eb",
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "borderWidth",
    className: "form-label"
  }, "Ancho del borde (px)"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "borderWidth",
    value: panel.styles?.borderWidth,
    onChange: e => handleStyleChange('borderWidth', e.value),
    placeholder: "1px",
    className: "w-100",
    inputClassName: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "borderRadius",
    className: "form-label"
  }, "Radio del borde (px)"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "borderRadius",
    value: panel.styles?.borderRadius,
    onChange: e => handleStyleChange('borderRadius', e.value),
    placeholder: "6px",
    className: "w-100",
    inputClassName: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "boxShadow",
    className: "form-label"
  }, "Sombra"), /*#__PURE__*/React.createElement(InputText, {
    id: "boxShadow",
    value: panel.styles?.boxShadow,
    onChange: e => handleStyleChange('boxShadow', e.target.value),
    placeholder: "0 2px 4px rgba(0,0,0,0.1)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "padding",
    className: "form-label"
  }, "Padding (px)"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "padding",
    value: panel.styles?.padding,
    onChange: e => handleStyleChange('padding', e.value),
    placeholder: "16px",
    className: "w-100",
    inputClassName: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "margin",
    className: "form-label"
  }, "Margin (px)"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "margin",
    value: panel.styles?.margin,
    onChange: e => handleStyleChange('margin', e.value),
    placeholder: "8px",
    className: "w-100",
    inputClassName: "w-100"
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-refresh",
    label: "Restablecer estilos",
    severity: "secondary",
    onClick: resetStyles
  }));
};