// components/FormTabContent.tsx
import React from 'react';
import { FormCard } from "./FormCard.js";
export const FormTabContent = ({
  tab,
  tabIndex,
  formValues,
  onAddField,
  onEditorChange,
  onInputChange,
  onAddCard
}) => /*#__PURE__*/React.createElement("div", {
  className: `tab-pane fade ${tabIndex}`
}, /*#__PURE__*/React.createElement("div", {
  className: "row"
}, tab.cards?.map((card, cardIndex) => /*#__PURE__*/React.createElement(FormCard, {
  key: cardIndex,
  card: card,
  formValues: formValues,
  onAddField: onAddField,
  onEditorChange: onEditorChange,
  onInputChange: onInputChange
}))), /*#__PURE__*/React.createElement("div", {
  className: "text-center mt-3"
}, /*#__PURE__*/React.createElement("button", {
  className: "btn btn-primary",
  onClick: () => onAddCard(tabIndex)
}, "Agregar Tarjeta")));