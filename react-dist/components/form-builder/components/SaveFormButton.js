// components/SaveFormButton.tsx
import React from 'react';
export const SaveFormButton = ({
  getFormConfiguration
}) => /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "btn btn-primary ms-2",
  onClick: () => console.log(getFormConfiguration())
}, "Guardar formulario");